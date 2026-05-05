import { ScriptsSettingsForm } from "@/components/admin/ScriptsSettingsForm";
import { getSettings } from "@/lib/settings";

export default async function AdminScriptsPage() {
  const settings = await getSettings([
    "script_head",
    "script_body",
    "script_footer",
  ]);

  return <ScriptsSettingsForm initialSettings={settings} />;
}
