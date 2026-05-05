import { revalidatePath } from "next/cache";

export async function POST() {
  revalidatePath("/");
  revalidatePath("/casting");

  return Response.json({ revalidated: true });
}
