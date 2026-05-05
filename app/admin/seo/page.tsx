import { SeoSettingsForm } from "@/components/admin/SeoSettingsForm";
import { getSettings } from "@/lib/settings";

export default async function AdminSeoPage() {
  const settings = await getSettings([
    "seo_title",
    "seo_description",
    "og_title",
    "og_description",
    "og_image_url",
  ]);

  return <SeoSettingsForm initialSettings={settings} />;
}
