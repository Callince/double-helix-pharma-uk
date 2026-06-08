import { ResourceList, StatusBadge } from "@/components/admin/primitives";
import { subscribers } from "@/lib/admin/data";

export default function SubscribersPage() {
  return (
    <ResourceList
      title="Subscribers"
      subtitle="Newsletter list (double opt-in)."
      newLabel="Export CSV"
      columns={[
        { key: "email", label: "Email", render: (r) => <span className="font-medium text-navy">{r.email}</span> },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        { key: "createdAt", label: "Subscribed", className: "text-muted" },
      ]}
      rows={subscribers}
    />
  );
}
