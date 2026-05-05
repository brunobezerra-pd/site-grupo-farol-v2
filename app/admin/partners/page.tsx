import { PartnersAdmin } from "@/components/admin/PartnersAdmin";
import { getPartners } from "@/lib/partners";

export default async function AdminPartnersPage() {
  const partners = await getPartners();

  return <PartnersAdmin initialPartners={partners} />;
}
