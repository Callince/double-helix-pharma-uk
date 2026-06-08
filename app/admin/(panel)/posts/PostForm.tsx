import { PageHeader, Card, AdminButton } from "@/components/admin/primitives";
import { Input, Textarea, Select, FormActions } from "@/components/admin/Form";
import { savePost } from "../content-actions";
import type { Post } from "@/lib/db/content";

export function PostForm({ post }: { post?: Post }) {
  return (
    <>
      <PageHeader
        title={post ? "Edit insight" : "New insight"}
        subtitle="Articles render on the public /insights blog when published."
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
          <Textarea label="Excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} hint="Short summary shown in listings & meta description." />
          <Textarea label="Body (Markdown)" name="body" rows={16} mono defaultValue={post?.body} required />
          <FormActions>
            <AdminButton type="submit" variant="green" icon="check">Save insight</AdminButton>
            <AdminButton href="/admin/posts" variant="ghost">Cancel</AdminButton>
          </FormActions>
        </form>
      </Card>
    </>
  );
}
