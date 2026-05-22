"use server";

import { setSetting, setSettings } from "@/lib/settings";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPartner, deletePartner, updatePartnerSortOrder } from "@/lib/partners";
import { createTalent, deleteTalent, getCategories, updateTalent } from "@/lib/talents";
import type { TalentInsert, TalentUpdate } from "@/types";

export async function saveSettingAction(key: string, value: string) {
  await setSetting(key, value);
}

export async function saveSettingsAction(settings: Record<string, string>) {
  await setSettings(settings);
}

export async function createPartnerAction(logoUrl: string) {
  return createPartner(logoUrl);
}

export async function deletePartnerAction(id: string) {
  await deletePartner(id);
}

export async function updatePartnerSortOrderAction(
  id: string,
  sortOrder: number | null,
) {
  await updatePartnerSortOrder(id, sortOrder);
}

export async function createTalentAction(data: TalentInsert) {
  return createTalent(data);
}

export async function updateTalentAction(id: string, data: TalentUpdate) {
  return updateTalent(id, data);
}

export async function deleteTalentAction(id: string) {
  await deleteTalent(id);
}

export async function inviteUserAction(email: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.inviteUserByEmail(email);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteUserAction(userId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function importTalentPhoto(photoUrl: string, talentName: string) {
  try {
    const response = await fetch(photoUrl);

    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    const contentType = blob.type || "image/jpeg";
    const extension = contentType.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
    const safeName = talentName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .toLowerCase();
    const path = `${safeName || "talent"}-${crypto.randomUUID()}.${extension}`;
    const supabase = createAdminClient();
    const { error } = await supabase.storage
      .from("talent-photos")
      .upload(path, blob, {
        contentType,
        cacheControl: "31536000",
        upsert: false,
      });

    if (error) {
      return null;
    }

    const { data } = supabase.storage.from("talent-photos").getPublicUrl(path);
    return data.publicUrl;
  } catch {
    return null;
  }
}

export async function getCategoriesAction(): Promise<string[]> {
  return getCategories();
}
