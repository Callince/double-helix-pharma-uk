"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin/guard";
import { setSubscriberStatus, deleteSubscriber } from "@/lib/db/content";

/** Approve a pending signup → confirmed (admin only — subscribers are PII). */
export async function approveSubscriberAction(id: string) {
  await assertAdmin();
  await setSubscriberStatus(id, "confirmed");
  revalidatePath("/admin/subscribers");
}

/** Mark a subscriber as unsubscribed (kept for records; excluded from sends). */
export async function unsubscribeSubscriberAction(id: string) {
  await assertAdmin();
  await setSubscriberStatus(id, "unsubscribed");
  revalidatePath("/admin/subscribers");
}

/** Permanently remove a subscriber. */
export async function deleteSubscriberAction(id: string) {
  await assertAdmin();
  await deleteSubscriber(id);
  revalidatePath("/admin/subscribers");
}
