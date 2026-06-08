import { ResourceList, StatusBadge } from "@/components/admin/primitives";
import { caseStudies } from "@/lib/admin/data";

export default function CaseStudiesPage() {
  return (
    <ResourceList
      title="Case Studies"
      subtitle="Anonymised engagement write-ups for credibility."
      newLabel="New case study"
      columns={[
        { key: "title", label: "Title", render: (r) => <span className="font-medium text-navy">{r.title}</span> },
        { key: "sector", label: "Sector" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        { key: "updatedAt", label: "Updated", className: "text-muted" },
      ]}
      rows={caseStudies}
    />
  );
}
