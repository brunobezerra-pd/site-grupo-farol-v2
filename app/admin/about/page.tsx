import { AboutSettingsForm } from "@/components/admin/AboutSettingsForm";
import { getSettings } from "@/lib/settings";

export default async function AdminAboutPage() {
  const settings = await getSettings(["about_version"]);

  return <AboutSettingsForm initialSettings={settings} />;
}
