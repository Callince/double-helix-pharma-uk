"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/admin/guard";
import * as db from "@/lib/db/content";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

/* ------------------------------------------------------------------- posts */
export async function savePost(fd: FormData) {
  await assertAdmin();
  await db.upsertPost({
    id: str(fd, "id") || undefined,
    title: str(fd, "title"),
    slug: str(fd, "slug"),
    category: str(fd, "category"),
    status: str(fd, "status") || "draft",
    excerpt: str(fd, "excerpt"),
    body: str(fd, "body"),
  });
  revalidatePath("/admin/posts");
  revalidatePath("/insights");
  redirect("/admin/posts");
}
export async function deletePostAction(id: string) {
  await assertAdmin();
  await db.deletePost(id);
  revalidatePath("/admin/posts");
  revalidatePath("/insights");
}

/* -------------------------------------------------------------------- faqs */
export async function saveFaq(fd: FormData) {
  await assertAdmin();
  await db.upsertFaq({
    id: str(fd, "id") || undefined,
    question: str(fd, "question"),
    answer: str(fd, "answer"),
    category: str(fd, "category"),
    published: fd.get("published") === "on",
  });
  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
  redirect("/admin/faqs");
}
export async function deleteFaqAction(id: string) {
  await assertAdmin();
  await db.deleteFaq(id);
  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
}

/* ---------------------------------------------------------------- services */
export async function saveService(fd: FormData) {
  await assertAdmin();
  await db.updateService({
    id: str(fd, "id"),
    title: str(fd, "title"),
    short: str(fd, "short"),
    body: str(fd, "body"),
    order_index: Number(fd.get("order_index") || 0),
    published: fd.get("published") === "on",
  });
  revalidatePath("/admin/services");
  revalidatePath("/services");
  redirect("/admin/services");
}

/* ---------------------------------------------------------------- settings */
export async function saveSettings(fd: FormData) {
  await assertAdmin();
  await db.saveSetting("contact", {
    email: str(fd, "contact_email"),
    phone: str(fd, "contact_phone"),
    locality: str(fd, "contact_locality"),
    region: str(fd, "contact_region"),
  });
  await db.saveSetting("social", { linkedin: str(fd, "social_linkedin") });
  await db.saveSetting("seo", { metaTitle: str(fd, "seo_title"), metaDescription: str(fd, "seo_description") });
  revalidatePath("/admin/settings");
}
