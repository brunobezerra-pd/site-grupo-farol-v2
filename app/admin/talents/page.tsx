import { TalentsAdmin } from "@/components/admin/TalentsAdmin";
import { getSettings } from "@/lib/settings";
import { getTalents } from "@/lib/talents";

export default async function AdminTalentsPage() {
  const [talents, settings] = await Promise.all([
    getTalents(),
    getSettings(["marquee_count"]),
  ]);

  return (
    <TalentsAdmin
      initialTalents={talents}
      initialMarqueeCount={settings.marquee_count || "12"}
    />
  );
}
