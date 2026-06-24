import { PageHeader, Card, StatusBadge } from "@/components/admin/primitives";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Icon } from "@/components/ui/Icon";
import { listSubscribers } from "@/lib/db/content";
import {
  approveSubscriberAction,
  unsubscribeSubscriberAction,
  deleteSubscriberAction,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function SubscribersAdminPage() {
  const rows = await listSubscribers().catch(() => []);
  const pending = rows.filter((r) => r.status === "pending").length;

  return (
    <>
      <PageHeader
        title="Subscribers"
        subtitle={`Newsletter list — ${rows.length} total${pending ? ` · ${pending} pending approval` : ""}.`}
        action={
          <a
            href="/admin/subscribers/export"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-navy-deep"
          >
            <Icon name="download" className="size-4" /> Export CSV
          </a>
        }
      />
      <Card pad={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-surface/70 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Subscribed</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-muted">No subscribers yet.</td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-b border-line/70 transition-colors last:border-0 hover:bg-surface/60">
                    <td className="px-5 py-3.5 font-medium text-navy">{r.email}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                    <td className="px-5 py-3.5 text-muted">{String(r.created_at).slice(0, 10)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        {r.status !== "confirmed" && (
                          <form action={approveSubscriberAction.bind(null, r.id)}>
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-green/12 px-2.5 py-1.5 text-xs font-semibold text-green-ink transition hover:bg-green/20"
                            >
                              <Icon name="badge-check" className="size-3.5" /> Approve
                            </button>
                          </form>
                        )}
                        {r.status === "confirmed" && (
                          <form action={unsubscribeSubscriberAction.bind(null, r.id)}>
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-semibold text-muted transition hover:bg-surface hover:text-navy"
                            >
                              Unsubscribe
                            </button>
                          </form>
                        )}
                        <DeleteButton action={deleteSubscriberAction.bind(null, r.id)} label={`Delete ${r.email}?`} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
