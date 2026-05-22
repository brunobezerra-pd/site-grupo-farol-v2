import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type {
  HeroMediaItem,
  HeroMediaItemInsert,
  HeroMediaItemUpdate,
} from "@/types";

function normalizeHeroMediaPayload<T extends HeroMediaItemInsert | HeroMediaItemUpdate>(
  data: T,
): T {
  if (data.media_type === "embed") {
    return {
      ...data,
      source_url: null,
      embed_code: data.embed_code?.trim() || null,
    };
  }

  return {
    ...data,
    source_url: data.source_url?.trim() || null,
    embed_code: null,
  };
}

export async function getHeroMediaItems(): Promise<HeroMediaItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_media_items")
    .select("*")
    .order("placement", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createHeroMediaItem(
  data: HeroMediaItemInsert,
): Promise<HeroMediaItem> {
  const supabase = createAdminClient();
  const payload = normalizeHeroMediaPayload(data);
  const { data: created, error } = await supabase
    .from("hero_media_items")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return created;
}

export async function updateHeroMediaItem(
  id: string,
  data: HeroMediaItemUpdate,
): Promise<HeroMediaItem> {
  const supabase = createAdminClient();
  const payload = normalizeHeroMediaPayload(data);
  const { data: updated, error } = await supabase
    .from("hero_media_items")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return updated;
}

export async function deleteHeroMediaItem(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("hero_media_items")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateHeroMediaSortOrder(
  items: Array<Pick<HeroMediaItem, "id" | "sort_order">>,
): Promise<void> {
  const supabase = createAdminClient();

  await Promise.all(
    items.map(async (item) => {
      const { error } = await supabase
        .from("hero_media_items")
        .update({ sort_order: item.sort_order })
        .eq("id", item.id);

      if (error) {
        throw new Error(error.message);
      }
    }),
  );
}
