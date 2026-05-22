import { HeroSettingsForm } from "@/components/admin/HeroSettingsForm";
import { getHeroMediaItems } from "@/lib/hero-media";
import { getSettings } from "@/lib/settings";

export default async function AdminHeroPage() {
  const [settings, heroMediaItems] = await Promise.all([
    getSettings([
      "hero_version",
      "hero_button_enabled",
      "hero_button_label",
      "hero_button_url",
    ]),
    getHeroMediaItems(),
  ]);

  return (
    <div className="min-w-0 max-w-full overflow-visible p-1 md:max-w-[calc(100vw-var(--sidebar-width)-3rem)] md:group-has-data-[state=collapsed]/sidebar-wrapper:max-w-[calc(100vw-var(--sidebar-width-icon)-3rem)]">
      <HeroSettingsForm
        initialSettings={settings}
        initialHeroMediaItems={heroMediaItems}
      />
    </div>
  );
}
