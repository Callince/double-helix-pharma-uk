import { ResourceList, StatusBadge } from "@/components/admin/primitives";
import { listCaseStudies } from "@/lib/db/content";

export const dynamic = "force-dynamic";

export default async function CaseStudiesAdminPage() {
  const rows = await listCaseStudies().catch(() => []);
  return (
    <ResourceList
      title="Case Studies"
      subtitle="Anonymised engagement write-ups — stored in SQLite."
      newLabel="New case study"
      columns={[
        { key: "title", label: "Title", render: (r) => <span className="font-medium text-navy">{r.title}</span> },
        { key: "sector", label: "Sector", render: (r) => r.sector || "—" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        { key: "updated_at", label: "Updated", render: (r) => String(r.updated_at).slice(0, 10), className: "text-muted" },
      ]}
      rows={rows}
    />
  );
}
