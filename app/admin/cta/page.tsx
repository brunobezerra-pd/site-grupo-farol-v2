import { CtaSettingsForm } from "@/components/admin/CtaSettingsForm";
import { getSettings } from "@/lib/settings";

export default async function AdminCtaPage() {
  const settings = await getSettings([
    "contact_button_label",
    "contact_button_url",
    "talents_button_enabled",
  ]);

  return <CtaSettingsForm initialSettings={settings} />;
}
