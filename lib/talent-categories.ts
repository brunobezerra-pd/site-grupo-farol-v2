import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type {
  TalentCategory,
  TalentCategoryInsert,
  TalentCategoryUpdate,
} from "@/types";

const DEFAULT_CATEGORY_COLOR = "#d1d362";

export function normalizeCategoryName(name: string) {
  return name.normalize("NFKC").trim().replace(/\s+/g, " ");
}

export function normalizeCategoryNames(names: string[] | null | undefined) {
  return Array.from(
    new Set(
      (names ?? [])
        .map((name) => normalizeCategoryName(name))
        .filter(Boolean),
    ),
  );
}

export async function getTalentCategories(): Promise<TalentCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("talent_categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createTalentCategory(
  data: TalentCategoryInsert,
): Promise<TalentCategory> {
  const supabase = createAdminClient();
  const { data: category, error } = await supabase
    .from("talent_categories")
    .insert({
      name: normalizeCategoryName(data.name),
      color: data.color || DEFAULT_CATEGORY_COLOR,
      sort_order: data.sort_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return category;
}

export async function updateTalentCategory(
  id: string,
  data: TalentCategoryUpdate,
): Promise<TalentCategory> {
  const supabase = createAdminClient();
  const { data: existingCategory, error: findError } = await supabase
    .from("talent_categories")
    .select("name")
    .eq("id", id)
    .single();

  if (findError) {
    throw new Error(findError.message);
  }

  const payload = {
    ...data,
    name: data.name ? normalizeCategoryName(data.name) : undefined,
  };
  const { data: category, error } = await supabase
    .from("talent_categories")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (payload.name && payload.name !== existingCategory.name) {
    await renameCategoryAssignments(existingCategory.name, payload.name);
  }

  return category;
}

export async function updateTalentCategorySortOrders(
  items: Array<Pick<TalentCategory, "id" | "sort_order">>,
) {
  const supabase = createAdminClient();

  for (const item of items) {
    const { error } = await supabase
      .from("talent_categories")
      .update({ sort_order: item.sort_order })
      .eq("id", item.id);

    if (error) {
      throw new Error(error.message);
    }
  }
}

export async function deleteTalentCategory(id: string) {
  const supabase = createAdminClient();
  const { data: category, error: findError } = await supabase
    .from("talent_categories")
    .select("name")
    .eq("id", id)
    .single();

  if (findError) {
    throw new Error(findError.message);
  }

  const { error: deleteError } = await supabase
    .from("talent_categories")
    .delete()
    .eq("id", id);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const { data: talents, error: talentsError } = await supabase
    .from("talents")
    .select("id,categories")
    .contains("categories", [category.name]);

  if (talentsError) {
    throw new Error(talentsError.message);
  }

  for (const talent of talents ?? []) {
    const categories = normalizeCategoryNames(talent.categories).filter(
      (name) => name !== category.name,
    );
    const { error } = await supabase
      .from("talents")
      .update({ categories })
      .eq("id", talent.id);

    if (error) {
      throw new Error(error.message);
    }
  }
}

async function renameCategoryAssignments(fromName: string, toName: string) {
  const supabase = createAdminClient();
  const { data: talents, error } = await supabase
    .from("talents")
    .select("id,categories")
    .contains("categories", [fromName]);

  if (error) {
    throw new Error(error.message);
  }

  for (const talent of talents ?? []) {
    const categories = normalizeCategoryNames(talent.categories).map((name) =>
      name === fromName ? toName : name,
    );
    const { error: updateError } = await supabase
      .from("talents")
      .update({ categories })
      .eq("id", talent.id);

    if (updateError) {
      throw new Error(updateError.message);
    }
  }
}

export async function ensureTalentCategories(names: string[]) {
  const normalizedNames = normalizeCategoryNames(names);
  if (normalizedNames.length === 0) return;

  const supabase = createAdminClient();
  const { data: existingCategories, error } = await supabase
    .from("talent_categories")
    .select("name");

  if (error) {
    throw new Error(error.message);
  }

  const existingNames = new Set(
    (existingCategories ?? []).map((category) => category.name.toLowerCase()),
  );
  const missingNames = normalizedNames.filter(
    (name) => !existingNames.has(name.toLowerCase()),
  );

  if (missingNames.length === 0) return;

  const { error: insertError } = await supabase
    .from("talent_categories")
    .insert(
      missingNames.map((name, index) => ({
        name,
        color: DEFAULT_CATEGORY_COLOR,
        sort_order: existingNames.size + index,
      })),
    );

  if (insertError) {
    throw new Error(insertError.message);
  }
}
