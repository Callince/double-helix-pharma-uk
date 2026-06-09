import Link from "next/link";
import { PageHeader, Card, StatusBadge, AdminButton } from "@/components/admin/primitives";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Icon } from "@/components/ui/Icon";
import { listCaseStudies } from "@/lib/db/content";
import { deleteCaseStudyAction } from "../content-actions";

export const dynamic = "force-dynamic";

export default async function CaseStudiesAdminPage() {
  const rows = await listCaseStudies().catch(() => []);
  return (
    <>
      <PageHeader
        title="Case Studies"
        subtitle="Anonymised engagement write-ups — stored in SQLite, shown on /case-studies."
        action={<AdminButton href="/admin/case-studies/new" icon="plus" variant="green">New case study</AdminButton>}
      />
      <Card pad={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-surface/70 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Sector</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Updated</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-muted">No case studies yet — create your first one.</td></tr>
              ) : rows.map((c) => (
                <tr key={c.id} className="border-b border-line/70 transition-colors last:border-0 hover:bg-surface/60">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/case-studies/${c.id}`} className="font-medium text-navy hover:text-teal-ink">{c.title}</Link>
                  </td>
                  <td className="px-5 py-3.5 text-ink">{c.sector || "—"}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-3.5 text-xs text-muted">{String(c.updated_at).slice(0, 10)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/case-studies/${c.id}`} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-surface hover:text-navy" aria-label="Edit">
                        <Icon name="edit" className="size-4" />
                      </Link>
                      <DeleteButton action={deleteCaseStudyAction.bind(null, c.id)} label={`Delete "${c.title}"?`} />
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
