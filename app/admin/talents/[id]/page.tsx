import { notFound } from "next/navigation";

import { TalentForm } from "@/components/admin/TalentForm";
import { getTalent } from "@/lib/talents";

type AdminTalentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminTalentPage({ params }: AdminTalentPageProps) {
  const { id } = await params;
  const talent = id === "new" ? null : await getTalent(id);

  if (id !== "new" && !talent) {
    notFound();
  }

  return <TalentForm talent={talent} />;
}
