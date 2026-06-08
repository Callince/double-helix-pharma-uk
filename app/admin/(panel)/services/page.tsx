import { ResourceList, StatusBadge } from "@/components/admin/primitives";
import { Icon } from "@/components/ui/Icon";
import { services } from "@/lib/admin/data";

export default function ServicesPage() {
  return (
    <ResourceList
      title="Services"
      subtitle="The service offerings shown across the website."
      newLabel="New service"
      columns={[
        { key: "order", label: "#", className: "w-12 text-muted" },
        { key: "title", label: "Service", render: (r) => <span className="font-medium text-navy">{r.title}</span> },
        {
          key: "slug",
          label: "URL",
          render: (r) => (
            <span className="inline-flex items-center gap-1 font-mono text-xs text-teal-ink">
              /{r.slug}<Icon name="external-link" className="size-3" />
            </span>
          ),
        },
        { key: "published", label: "Status", render: (r) => <StatusBadge status={r.published ? "published" : "draft"} /> },
      ]}
      rows={services}
    />
  );
}
