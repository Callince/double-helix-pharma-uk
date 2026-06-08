import { ResourceList, StatusBadge } from "@/components/admin/primitives";
import { posts } from "@/lib/admin/data";

export default function PostsPage() {
  return (
    <ResourceList
      title="Insights"
      subtitle="Articles that drive organic traffic and authority."
      newLabel="New insight"
      columns={[
        { key: "title", label: "Title", render: (r) => <span className="font-medium text-navy">{r.title}</span> },
        { key: "category", label: "Category" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        { key: "views", label: "Views", render: (r) => Number(r.views).toLocaleString() },
        { key: "updatedAt", label: "Updated", className: "text-muted" },
      ]}
      rows={posts}
    />
  );
}
