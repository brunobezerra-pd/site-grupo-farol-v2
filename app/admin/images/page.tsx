import { ImageSlotsAdmin } from "@/components/admin/ImageSlotsAdmin";
import { getImageSlots } from "@/lib/image-slots";

export default async function AdminImagesPage() {
  const slots = await getImageSlots();

  return <ImageSlotsAdmin initialSlots={slots} />;
}
