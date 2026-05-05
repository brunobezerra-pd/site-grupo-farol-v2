import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Partner } from "@/types";

function getPartnerLogoPath(logoUrl: string) {
  const marker = "/storage/v1/object/public/partner-logos/";
  const markerIndex = logoUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(logoUrl.slice(markerIndex + marker.length));
}

export async function getPartners(): Promise<Partner[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .order("sort_order", { ascending: true, nullsFirst: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createPartner(logoUrl: string): Promise<Partner> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("partners")
    .insert({ logo_url: logoUrl })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deletePartner(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { data, error: fetchError } = await supabase
    .from("partners")
    .select("logo_url")
    .eq("id", id)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const { error } = await supabase.from("partners").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  const logoPath = getPartnerLogoPath(data.logo_url);

  if (logoPath) {
    await supabase.storage.from("partner-logos").remove([logoPath]);
  }
}

export async function updatePartnerSortOrder(
  id: string,
  sortOrder: number | null,
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("partners")
    .update({ sort_order: sortOrder })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
