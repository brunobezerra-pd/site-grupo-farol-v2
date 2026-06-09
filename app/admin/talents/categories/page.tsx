import { TalentCategoriesAdmin } from "@/components/admin/TalentCategoriesAdmin";
import { getTalentCategories } from "@/lib/talent-categories";

export default async function AdminTalentCategoriesPage() {
  const categories = await getTalentCategories();

  return <TalentCategoriesAdmin initialCategories={categories} />;
}
