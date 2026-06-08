"use server";

import { revalidatePath } from "next/cache";
import { updateEnquiryStatus } from "@/lib/db/enquiries";
import { assertAdmin } from "@/lib/admin/guard";

export async function setEnquiryStatusAction(id: string, status: string) {
  await assertAdmin();
  await updateEnquiryStatus(id, status);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}
