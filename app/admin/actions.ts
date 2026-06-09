"use server";

import { revalidatePath } from "next/cache";

import { setSetting, setSettings } from "@/lib/settings";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createTalentCategory,
  deleteTalentCategory,
  getTalentCategories,
  updateTalentCategory,
  updateTalentCategorySortOrders,
} from "@/lib/talent-categories";
import {
  createHeroMediaItem,
  deleteHeroMediaItem,
  updateHeroMediaItem,
  updateHeroMediaSortOrder,
} from "@/lib/hero-media";
import {
  createPartner,
  deletePartner,
  updatePartnerSortOrder,
  updatePartnerSortOrders,
} from "@/lib/partners";
import { createTalent, deleteTalent, getCategories, updateTalent } from "@/lib/talents";
import type {
  HeroMediaItem,
  HeroMediaItemInsert,
  HeroMediaItemUpdate,
  TalentCategoryInsert,
  TalentCategoryUpdate,
  TalentInsert,
  TalentUpdate,
} from "@/types";

export async function saveSettingAction(key: string, value: string) {
  await setSetting(key, value);
}

export async function saveSettingsAction(settings: Record<string, string>) {
  await setSettings(settings);
}

export async function createHeroMediaItemAction(data: HeroMediaItemInsert) {
  const item = await createHeroMediaItem(data);
  revalidatePath("/");
  return item;
}

export async function updateHeroMediaItemAction(
  id: string,
  data: HeroMediaItemUpdate,
) {
  const item = await updateHeroMediaItem(id, data);
  revalidatePath("/");
  return item;
}

export async function deleteHeroMediaItemAction(id: string) {
  await deleteHeroMediaItem(id);
  revalidatePath("/");
}

export async function updateHeroMediaSortOrderAction(
  items: Array<Pick<HeroMediaItem, "id" | "sort_order">>,
) {
  await updateHeroMediaSortOrder(items);
  revalidatePath("/");
}

export async function createPartnerAction(
  logoUrl: string,
  sortOrder?: number | null,
) {
  const partner = await createPartner(logoUrl, sortOrder);
  revalidatePath("/");
  return partner;
}

export async function deletePartnerAction(id: string) {
  await deletePartner(id);
  revalidatePath("/");
}

export async function updatePartnerSortOrderAction(
  id: string,
  sortOrder: number | null,
) {
  await updatePartnerSortOrder(id, sortOrder);
  revalidatePath("/");
}

export async function updatePartnerSortOrdersAction(
  items: Array<{ id: string; sort_order: number | null }>,
) {
  await updatePartnerSortOrders(items);
  revalidatePath("/");
}

export async function createTalentAction(data: TalentInsert) {
  const talent = await createTalent(data);
  revalidatePath("/");
  revalidatePath("/casting");
  return talent;
}

export async function updateTalentAction(id: string, data: TalentUpdate) {
  const talent = await updateTalent(id, data);
  revalidatePath("/");
  revalidatePath("/casting");
  return talent;
}

export async function deleteTalentAction(id: string) {
  await deleteTalent(id);
  revalidatePath("/");
  revalidatePath("/casting");
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

export async function getTalentCategoriesAction() {
  return getTalentCategories();
}

export async function createTalentCategoryAction(data: TalentCategoryInsert) {
  const category = await createTalentCategory(data);
  revalidatePath("/");
  revalidatePath("/casting");
  revalidatePath("/admin/talents/categories");
  return category;
}

export async function updateTalentCategoryAction(
  id: string,
  data: TalentCategoryUpdate,
) {
  const category = await updateTalentCategory(id, data);
  revalidatePath("/");
  revalidatePath("/casting");
  revalidatePath("/admin/talents/categories");
  return category;
}

export async function updateTalentCategorySortOrdersAction(
  items: Array<{ id: string; sort_order: number }>,
) {
  await updateTalentCategorySortOrders(items);
  revalidatePath("/");
  revalidatePath("/casting");
  revalidatePath("/admin/talents/categories");
}

export async function updateTalentCategoriesAction(
  items: Array<{
    color: string;
    id: string;
    name: string;
    sort_order: number;
  }>,
) {
  for (const item of items) {
    await updateTalentCategory(item.id, {
      color: item.color,
      name: item.name,
      sort_order: item.sort_order,
    });
  }

  revalidatePath("/");
  revalidatePath("/casting");
  revalidatePath("/admin/talents/categories");
}

export async function deleteTalentCategoryAction(id: string) {
  await deleteTalentCategory(id);
  revalidatePath("/");
  revalidatePath("/casting");
  revalidatePath("/admin/talents/categories");
}
