"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PageHeader, Card, AdminButton } from "@/components/admin/primitives";
import { Input, Select, Textarea, FormActions } from "@/components/admin/Form";
import { Icon } from "@/components/ui/Icon";
import { savePost } from "../content-actions";
import type { Post } from "@/lib/db/content";

const RichEditor = dynamic(() => import("@/components/admin/RichEditor"), {
  ssr: false,
  loading: () => (
    <div className="rounded-lg border border-line bg-surface p-6 text-sm text-muted">Loading editor…</div>
  ),
});

const inputCls =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2 text-sm text-ink shadow-sm outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/25";

type FaqRow = { q: string; a: string };

function parseFaqs(json?: string | null): FaqRow[] {
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr)
      ? arr.map((f) => ({ q: String(f?.q ?? ""), a: String(f?.a ?? "") })).filter((f) => f.q || f.a)
      : [];
  } catch {
    return [];
  }
}

export function BlogForm({ post }: { post?: Post }) {
  const [body, setBody] = useState(post?.body ?? "");
  const [cover, setCover] = useState(post?.cover_image ?? "");
  const [coverAlt, setCoverAlt] = useState(post?.cover_alt ?? "");
  const [uploading, setUploading] = useState(false);
  const [coverErr, setCoverErr] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FaqRow[]>(parseFaqs(post?.faqs));
  const [aiBusy, setAiBusy] = useState(false);
  const [aiMsg, setAiMsg] = useState<string | null>(null);

  async function uploadCover(file: File) {
    setCoverErr(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("upload", file);
      const res = await fetch("/admin/blog/upload-image", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setCoverErr(data?.error?.message || "Upload failed — you can paste an image URL instead.");
        return;
      }
      setCover(data.url);
      // Pre-fill alt/title from the post title or the file name if not set yet.
      if (!coverAlt.trim()) {
        setCoverAlt(post?.title || file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim());
      }
    } catch {
      setCoverErr("Could not reach the upload service — paste an image URL instead.");
    } finally {
      setUploading(false);
    }
  }

  const addFaq = () => setFaqs((f) => [...f, { q: "", a: "" }]);
  const removeFaq = (i: number) => setFaqs((f) => f.filter((_, idx) => idx !== i));
  const updateFaq = (i: number, key: "q" | "a", value: string) =>
    setFaqs((f) => f.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)));

  async function suggestLinks() {
    setAiBusy(true);
    setAiMsg(null);
    try {
      const res = await fetch("/admin/blog/interlink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: body, slug: post?.slug ?? "" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAiMsg(data.error || "AI is not available right now.");
        return;
      }
      if (data.added > 0) {
        setBody(data.html);
        setAiMsg(`Added ${data.added} internal link${data.added === 1 ? "" : "s"}. Review and save.`);
      } else {
        setAiMsg("No new internal links suggested.");
      }
    } catch {
      setAiMsg("Could not reach the AI service.");
    } finally {
      setAiBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title={post ? "Edit post" : "New post"}
        subtitle="Posts appear on the public /blog when published. Internal links are added automatically on publish."
      />
      <Card>
        <form action={savePost} className="space-y-5">
          {post && <input type="hidden" name="id" defaultValue={post.id} />}
          <Input label="Title" name="title" defaultValue={post?.title} required />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Slug" name="slug" defaultValue={post?.slug} hint="Leave blank to auto-generate from the title." />
            <Input label="Category" name="category" defaultValue={post?.category ?? ""} placeholder="e.g. GMP, Inspections" />
          </div>
          <Select
            label="Status"
            name="status"
            defaultValue={post?.status ?? "draft"}
            options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }]}
          />
          <Textarea label="Excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} hint="Short summary shown in listings & the meta/social description." />

          {/* Cover image — upload from your computer (or paste a URL) + alt/title text */}
          <div>
            <span className="mb-1.5 block text-sm font-medium text-navy">Cover image</span>
            <div className="rounded-lg border border-line bg-surface p-4">
              <div className="flex flex-wrap items-center gap-3">
                <label className={`inline-flex cursor-pointer items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-teal-ink transition hover:bg-surface ${uploading ? "pointer-events-none opacity-60" : ""}`}>
                  <Icon name="upload" className="size-4" />
                  {uploading ? "Uploading…" : cover ? "Replace image" : "Choose image from your computer"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(f); e.target.value = ""; }}
                  />
                </label>
                {cover && (
                  <button type="button" onClick={() => setCover("")} className="text-xs font-medium text-rose-500 hover:underline">
                    Remove
                  </button>
                )}
              </div>

              {cover && (
                <div className="mt-3 w-full max-w-md overflow-hidden rounded-md border border-line bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover} alt={coverAlt || "Cover preview"} className="aspect-[16/9] w-full object-cover" />
                </div>
              )}

              <input
                type="text"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                placeholder="…or paste an image URL, e.g. /uploads/cover.webp"
                className={`${inputCls} mt-3`}
              />
              <input type="hidden" name="cover_image" value={cover} />
              {coverErr && <p className="mt-1.5 text-xs text-rose-500">{coverErr}</p>}

              <label className="mt-3 block">
                <span className="mb-1.5 block text-sm font-medium text-navy">Image alt text / title</span>
                <input
                  type="text"
                  name="cover_alt"
                  value={coverAlt}
                  onChange={(e) => setCoverAlt(e.target.value)}
                  placeholder="Describe the image — used as its alt text & title"
                  className={inputCls}
                />
                <span className="mt-1 block text-xs text-muted">
                  Read by screen readers and search engines as the image title. Defaults to the post title if left blank.
                </span>
              </label>
            </div>
          </div>

          {/* Body */}
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <span className="block text-sm font-medium text-navy">Body</span>
              <button
                type="button"
                onClick={suggestLinks}
                disabled={aiBusy}
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white px-2.5 py-1 text-xs font-semibold text-teal-ink transition hover:bg-surface disabled:opacity-60"
              >
                <Icon name="sparkles" className="size-3.5" /> {aiBusy ? "Thinking…" : "AI: suggest links"}
              </button>
            </div>
            <RichEditor value={body} onChange={setBody} />
            {aiMsg && <p className="mt-1.5 text-xs text-muted">{aiMsg}</p>}
            <input type="hidden" name="body" value={body} />
            <p className="mt-1.5 text-xs text-muted">Use the image button in the toolbar to upload or embed images. Headings (H2/H3) build the table of contents automatically.</p>
          </div>

          {/* Q&A (FAQs) — paired question/answer inputs with add (+) and remove */}
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <span className="block text-sm font-medium text-navy">Q&amp;A (FAQs)</span>
              <button
                type="button"
                onClick={addFaq}
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white px-2.5 py-1 text-xs font-semibold text-teal-ink transition hover:bg-surface"
              >
                <Icon name="plus" className="size-3.5" /> Add Q&amp;A
              </button>
            </div>

            <div className="space-y-3">
              {faqs.length === 0 && (
                <p className="rounded-lg border border-dashed border-line bg-surface px-4 py-6 text-center text-sm text-muted">
                  No questions yet — click <span className="font-semibold text-teal-ink">Add Q&amp;A</span> to create one.
                </p>
              )}
              {faqs.map((row, i) => (
                <div key={i} className="relative rounded-lg border border-line bg-surface p-4 pr-11">
                  <button
                    type="button"
                    onClick={() => removeFaq(i)}
                    aria-label="Remove this question"
                    className="absolute right-2 top-2 grid size-7 place-items-center rounded-md text-muted transition hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Icon name="x" className="size-4" />
                  </button>
                  <input
                    type="text"
                    value={row.q}
                    onChange={(e) => updateFaq(i, "q", e.target.value)}
                    placeholder="Question"
                    className={`${inputCls} font-medium`}
                  />
                  <textarea
                    value={row.a}
                    onChange={(e) => updateFaq(i, "a", e.target.value)}
                    rows={2}
                    placeholder="Answer"
                    className={`${inputCls} mt-2`}
                  />
                </div>
              ))}
            </div>

            <input type="hidden" name="faqs" value={JSON.stringify(faqs.filter((f) => f.q.trim() && f.a.trim()))} />
            <p className="mt-1.5 text-xs text-muted">Renders an FAQ section on the post and emits FAQ schema for SEO.</p>
          </div>

          <FormActions>
            <AdminButton type="submit" variant="green" icon="check">Save post</AdminButton>
            <AdminButton href="/admin/blog" variant="ghost">Cancel</AdminButton>
          </FormActions>
        </form>
      </Card>
    </>
  );
}
