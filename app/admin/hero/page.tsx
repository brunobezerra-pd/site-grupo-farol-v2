import { HeroSettingsForm } from "@/components/admin/HeroSettingsForm";
import { getSettings } from "@/lib/settings";

export default async function AdminHeroPage() {
  const settings = await getSettings([
    "hero_button_enabled",
    "hero_button_label",
    "hero_button_url",
  ]);

  return <HeroSettingsForm initialSettings={settings} />;
}
