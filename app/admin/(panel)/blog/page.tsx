import Link from "next/link";
import { PageHeader, Card, StatusBadge, AdminButton } from "@/components/admin/primitives";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { PublishAutomation } from "@/components/admin/PublishAutomation";
import { Icon } from "@/components/ui/Icon";
import { listPosts } from "@/lib/db/content";
import { deletePostAction } from "../content-actions";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  const posts = await listPosts().catch(() => []);
  const drafts = posts.filter((p) => p.status === "draft").sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
  const nextDrafts = drafts.slice(0, 4).map((p) => ({ title: p.title }));
  return (
    <>
      <PageHeader
        title="Blog"
        subtitle="Articles for the public /blog — stored in SQLite. Internal links are auto-added on publish."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <PublishAutomation nextDrafts={nextDrafts} totalDrafts={drafts.length} />
            <AdminButton href="/admin/blog/new" icon="plus" variant="green">New post</AdminButton>
          </div>
        }
      />
      <Card pad={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-surface/70 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Views</th>
                <th className="px-5 py-3">Updated</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-muted">No posts yet — write your first one.</td></tr>
              ) : posts.map((p) => (
                <tr key={p.id} className="border-b border-line/70 transition-colors last:border-0 hover:bg-surface/60">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/blog/${p.id}`} className="font-medium text-navy hover:text-teal-ink">{p.title}</Link>
                  </td>
                  <td className="px-5 py-3.5 text-ink">{p.category || "—"}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={p.status} />
                    {p.status === "scheduled" && p.publish_at && (
                      <span className="mt-1 block text-xs text-muted">{p.publish_at.slice(0, 10)}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-muted">{Number(p.views).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-xs text-muted">{p.updated_at?.slice(0, 10)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/blog/${p.id}`} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-surface hover:text-navy" aria-label="Edit">
                        <Icon name="edit" className="size-4" />
                      </Link>
                      <DeleteButton action={deletePostAction.bind(null, p.id)} label={`Delete "${p.title}"?`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
