import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function getRevalidateUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return `${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/revalidate`;
  }

  return "http://localhost:3000/api/revalidate";
}

async function revalidatePublicPages() {
  await fetch(getRevalidateUrl(), {
    method: "POST",
    cache: "no-store",
  });
}

export async function getSettings(
  keys: string[],
): Promise<Record<string, string>> {
  const settings = Object.fromEntries(keys.map((key) => [key, ""]));

  if (keys.length === 0) {
    return settings;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key,value")
    .in("key", keys);

  if (error) {
    throw new Error(error.message);
  }

  data.forEach((setting) => {
    settings[setting.key] = setting.value ?? "";
  });

  return settings;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await setSettings({ [key]: value });
}

export async function setSettings(
  settings: Record<string, string>,
): Promise<void> {
  const rows = Object.entries(settings).map(([key, value]) => ({
    key,
    value,
  }));

  if (rows.length === 0) {
    return;
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("site_settings").upsert(rows, {
    onConflict: "key",
  });

  if (error) {
    throw new Error(error.message);
  }

  await revalidatePublicPages();
}
