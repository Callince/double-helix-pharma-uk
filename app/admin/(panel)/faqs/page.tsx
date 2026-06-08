import Link from "next/link";
import { PageHeader, Card, StatusBadge, AdminButton } from "@/components/admin/primitives";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Icon } from "@/components/ui/Icon";
import { listFaqs } from "@/lib/db/content";
import { deleteFaqAction } from "../content-actions";

export const dynamic = "force-dynamic";

export default async function FaqsAdminPage() {
  const faqs = await listFaqs().catch(() => []);
  return (
    <>
      <PageHeader
        title="FAQs"
        subtitle="Question & answer pairs shown on the public FAQ page."
        action={<AdminButton href="/admin/faqs/new" icon="plus" variant="green">New FAQ</AdminButton>}
      />
      <Card pad={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-surface/70 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3">Question</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-12 text-center text-muted">No FAQs yet.</td></tr>
              ) : faqs.map((f) => (
                <tr key={f.id} className="border-b border-line/70 transition-colors last:border-0 hover:bg-surface/60">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/faqs/${f.id}`} className="font-medium text-navy hover:text-teal-ink">{f.question}</Link>
                  </td>
                  <td className="px-5 py-3.5 text-ink">{f.category || "—"}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={f.published ? "published" : "draft"} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/faqs/${f.id}`} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-surface hover:text-navy" aria-label="Edit">
                        <Icon name="edit" className="size-4" />
                      </Link>
                      <DeleteButton action={deleteFaqAction.bind(null, f.id)} label="Delete this FAQ?" />
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
