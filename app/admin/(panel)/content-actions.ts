"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin, assertEditor } from "@/lib/admin/guard";
import * as db from "@/lib/db/content";
import { stripAutoLinks, getLinkTargets, suggestInterlinks, applyInterlinks, htmlToText } from "@/lib/ai/interlink";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

/* ------------------------------------------------------------------- posts */
export async function savePost(fd: FormData) {
  await assertEditor();
  const status = str(fd, "status") || "draft";
  const slug = str(fd, "slug");
  let body = str(fd, "body");
  // Auto-add internal links when publishing (Qwen via OpenRouter; fails open).
  if (status === "published") {
    try {
      const clean = stripAutoLinks(body);
      const targets = await getLinkTargets(slug || undefined);
      const suggestions = await suggestInterlinks(htmlToText(clean), targets, 6);
      if (suggestions) body = applyInterlinks(clean, suggestions);
    } catch (err) {
      console.error("[blog] auto-interlink failed", err);
    }
  }
  // FAQs come from the structured editor as a JSON array of {q,a}; fall back to
  // the legacy "Question :: Answer" per-line format for older forms.
  const rawFaqs = str(fd, "faqs");
  let faqs: { q: string; a: string }[] = [];
  if (rawFaqs.startsWith("[")) {
    try {
      const arr = JSON.parse(rawFaqs);
      if (Array.isArray(arr))
        faqs = arr
          .map((f) => ({ q: String(f?.q ?? "").trim(), a: String(f?.a ?? "").trim() }))
          .filter((f) => f.q && f.a);
    } catch { /* ignore malformed JSON */ }
  } else {
    faqs = rawFaqs
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => { const i = l.indexOf("::"); return i === -1 ? null : { q: l.slice(0, i).trim(), a: l.slice(i + 1).trim() }; })
      .filter((f): f is { q: string; a: string } => Boolean(f && f.q && f.a));
  }

  await db.upsertPost({
    id: str(fd, "id") || undefined,
    title: str(fd, "title"),
    slug,
    category: str(fd, "category"),
    status,
    excerpt: str(fd, "excerpt"),
    cover_image: str(fd, "cover_image"),
    cover_alt: str(fd, "cover_alt"),
    faqs: faqs.length ? JSON.stringify(faqs) : "",
    body,
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}
export async function deletePostAction(id: string) {
  await assertEditor();
  await db.deletePost(id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

/** Drip-publish automation: schedule the next N drafts, one per day (Day 1 = today). */
export async function scheduleDripAction(fd: FormData) {
  await assertEditor();
  const days = Number(fd.get("days") || 1);
  await db.scheduleNextDrafts(days);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

/** Revert every post to draft (also clears any pending schedule). */
export async function setAllPostsDraftAction() {
  await assertEditor();
  await db.setAllPostsDraft();
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

/* -------------------------------------------------------------------- faqs */
export async function saveFaq(fd: FormData) {
  await assertEditor();
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
  await assertEditor();
  await db.deleteFaq(id);
  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
}

/* ---------------------------------------------------------------- services */
export async function saveService(fd: FormData) {
  await assertEditor();
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

/* ------------------------------------------------------------- case studies */
export async function saveCaseStudy(fd: FormData) {
  await assertEditor();
  await db.upsertCaseStudy({
    id: str(fd, "id") || undefined,
    title: str(fd, "title"),
    slug: str(fd, "slug"),
    sector: str(fd, "sector"),
    summary: str(fd, "summary"),
    challenge: str(fd, "challenge"),
    approach: str(fd, "approach"),
    outcome: str(fd, "outcome"),
    status: str(fd, "status") || "draft",
  });
  revalidatePath("/admin/case-studies");
  revalidatePath("/case-studies");
  redirect("/admin/case-studies");
}
export async function deleteCaseStudyAction(id: string) {
  await assertEditor();
  await db.deleteCaseStudy(id);
  revalidatePath("/admin/case-studies");
  revalidatePath("/case-studies");
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
