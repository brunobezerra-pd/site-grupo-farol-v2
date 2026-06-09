import { notFound } from "next/navigation";

import { TalentForm } from "@/components/admin/TalentForm";
import { getTalentCategories } from "@/lib/talent-categories";
import { getTalent } from "@/lib/talents";

type AdminTalentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminTalentPage({ params }: AdminTalentPageProps) {
  const { id } = await params;
  const [categories, talent] = await Promise.all([
    getTalentCategories(),
    id === "new" ? Promise.resolve(null) : getTalent(id),
  ]);

  if (id !== "new" && !talent) {
    notFound();
  }

  return <TalentForm categories={categories} talent={talent} />;
}
