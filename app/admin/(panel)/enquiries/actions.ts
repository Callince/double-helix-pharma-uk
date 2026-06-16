"use server";

import { revalidatePath } from "next/cache";
import { updateEnquiryStatus } from "@/lib/db/enquiries";
import { assertEditor } from "@/lib/admin/guard";

export async function setEnquiryStatusAction(id: string, status: string) {
  await assertEditor();
  await updateEnquiryStatus(id, status);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}
