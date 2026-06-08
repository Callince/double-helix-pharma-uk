import { ResourceList, StatusBadge } from "@/components/admin/primitives";
import { listSubscribers } from "@/lib/db/content";

export const dynamic = "force-dynamic";

export default async function SubscribersAdminPage() {
  const rows = await listSubscribers().catch(() => []);
  return (
    <ResourceList
      title="Subscribers"
      subtitle="Newsletter list (double opt-in) — stored in SQLite."
      newLabel="Export CSV"
      columns={[
        { key: "email", label: "Email", render: (r) => <span className="font-medium text-navy">{r.email}</span> },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        { key: "created_at", label: "Subscribed", render: (r) => String(r.created_at).slice(0, 10), className: "text-muted" },
      ]}
      rows={rows}
    />
  );
}
