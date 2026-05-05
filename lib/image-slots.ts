import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ImageSlot } from "@/types";

export async function getImageSlots(): Promise<ImageSlot[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("image_slots")
    .select("*")
    .order("slot_key", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateSlot(
  id: string,
  data: Partial<ImageSlot>,
): Promise<void> {
  const supabase = createAdminClient();
  const updateData = {
    slot_key: data.slot_key,
    image_url: data.image_url,
    enabled: data.enabled,
    label: data.label,
  };
  const { error } = await supabase
    .from("image_slots")
    .update(updateData)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
