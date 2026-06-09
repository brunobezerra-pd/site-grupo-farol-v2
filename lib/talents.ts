import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  ensureTalentCategories,
  getTalentCategories,
  normalizeCategoryNames,
} from "@/lib/talent-categories";
import type { Talent, TalentCategory, TalentInsert, TalentUpdate } from "@/types";

function getTalentCategoryRank(
  talent: Pick<Talent, "categories" | "name">,
  categories: TalentCategory[],
) {
  const categoryOrder = new Map(
    categories.map((category, index) => [category.name.toLowerCase(), index]),
  );

  return Math.min(
    ...normalizeCategoryNames(talent.categories)
      .map((name) => categoryOrder.get(name.toLowerCase()) ?? Number.POSITIVE_INFINITY),
    Number.POSITIVE_INFINITY,
  );
}

function sortTalentsByCategoryOrder(
  talents: Talent[],
  categories: TalentCategory[],
) {
  return [...talents].sort((a, b) => {
    const categoryComparison =
      getTalentCategoryRank(a, categories) - getTalentCategoryRank(b, categories);

    if (categoryComparison !== 0) {
      return categoryComparison;
    }

    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}

async function normalizeTalentPayload<T extends TalentInsert | TalentUpdate>(
  data: T,
) {
  if (!("categories" in data)) return data;

  const categories = normalizeCategoryNames(data.categories);
  await ensureTalentCategories(categories);

  return {
    ...data,
    categories,
  };
}

export async function getTalentsForMarquee(
  count: number,
): Promise<Talent[]> {
  const supabase = await createClient();
  const categories = await getTalentCategories();
  const { data: featuredTalents, error: featuredError } = await supabase
    .from("talents")
    .select("*")
    .eq("featured", true)
    .order("name", { ascending: true });

  if (featuredError) {
    throw new Error(featuredError.message);
  }

  if (featuredTalents.length > 0) {
    return sortTalentsByCategoryOrder(featuredTalents, categories).slice(0, count);
  }

  const { data, error } = await supabase
    .from("talents")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return sortTalentsByCategoryOrder(data, categories).slice(0, count);
}

export async function getTalentsPaginated(
  page: number,
  category?: string,
  pageSize = 20,
): Promise<{ data: Talent[]; total: number; totalPages: number }> {
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;
  const supabase = await createClient();

  let query = supabase
    .from("talents")
    .select("*", { count: "exact" })
    .order("featured", { ascending: false, nullsFirst: false })
    .order("name", { ascending: true })
    .range(from, to);

  if (category) {
    query = query.contains("categories", [category]);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const total = count ?? 0;

  return {
    data,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getCategories(): Promise<string[]> {
  const categories = await getTalentCategories();
  return categories.map((category) => category.name);
}

export async function getTalents(): Promise<Talent[]> {
  const supabase = await createClient();
  const categories = await getTalentCategories();
  const { data, error } = await supabase
    .from("talents")
    .select("*")
    .order("featured", { ascending: false, nullsFirst: false })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return sortTalentsByCategoryOrder(data, categories);
}

export async function getTalent(id: string): Promise<Talent | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("talents")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createTalent(data: TalentInsert): Promise<Talent> {
  const supabase = createAdminClient();
  const payload = await normalizeTalentPayload(data);
  const { data: talent, error } = await supabase
    .from("talents")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return talent;
}

export async function updateTalent(
  id: string,
  data: TalentUpdate,
): Promise<Talent> {
  const supabase = createAdminClient();
  const payload = await normalizeTalentPayload(data);
  const { data: talent, error } = await supabase
    .from("talents")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return talent;
}

export async function deleteTalent(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("talents").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
