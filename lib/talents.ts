import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Talent, TalentInsert, TalentUpdate } from "@/types";

export async function getTalentsForMarquee(
  count: number,
): Promise<Talent[]> {
  const supabase = await createClient();
  const { data: featuredTalents, error: featuredError } = await supabase
    .from("talents")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: true })
    .limit(count);

  if (featuredError) {
    throw new Error(featuredError.message);
  }

  if (featuredTalents.length > 0) {
    return featuredTalents;
  }

  const { data, error } = await supabase
    .from("talents")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(count);

  if (error) {
    throw new Error(error.message);
  }

  return data;
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
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("talents")
    .select("categories")
    .not("categories", "is", null);

  if (error) {
    throw new Error(error.message);
  }

  return Array.from(
    new Set(data.flatMap((talent) => talent.categories ?? [])),
  ).sort((a, b) => a.localeCompare(b));
}

export async function getTalents(): Promise<Talent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("talents")
    .select("*")
    .order("featured", { ascending: false, nullsFirst: false })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
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
  const { data: talent, error } = await supabase
    .from("talents")
    .insert(data)
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
  const { data: talent, error } = await supabase
    .from("talents")
    .update(data)
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
