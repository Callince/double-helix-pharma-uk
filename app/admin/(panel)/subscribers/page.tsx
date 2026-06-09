import { PageHeader, DataTable, StatusBadge } from "@/components/admin/primitives";
import { Icon } from "@/components/ui/Icon";
import { listSubscribers } from "@/lib/db/content";

export const dynamic = "force-dynamic";

export default async function SubscribersAdminPage() {
  const rows = await listSubscribers().catch(() => []);
  return (
    <>
      <PageHeader
        title="Subscribers"
        subtitle="Newsletter list (double opt-in) — stored in SQLite."
        action={
          <a
            href="/admin/subscribers/export"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-navy-deep"
          >
            <Icon name="download" className="size-4" /> Export CSV
          </a>
        }
      />
      <DataTable
        empty="No subscribers yet."
        columns={[
          { key: "email", label: "Email", render: (r) => <span className="font-medium text-navy">{r.email}</span> },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          { key: "created_at", label: "Subscribed", render: (r) => String(r.created_at).slice(0, 10), className: "text-muted" },
        ]}
        rows={rows}
      />
    </>
  );
}
