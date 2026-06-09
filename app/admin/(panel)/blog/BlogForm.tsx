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

export function BlogForm({ post }: { post?: Post }) {
  const [body, setBody] = useState(post?.body ?? "");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiMsg, setAiMsg] = useState<string | null>(null);

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
          <Textarea label="Excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} hint="Short summary shown in listings & the meta description." />
          <Input label="Cover image" name="cover_image" defaultValue={post?.cover_image ?? ""} hint="Banner image path, e.g. /hero-gmp-audit.webp or an uploaded /uploads/… file." />

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
