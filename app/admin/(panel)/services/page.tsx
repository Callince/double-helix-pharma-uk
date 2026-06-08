import Link from "next/link";
import { PageHeader, Card, StatusBadge } from "@/components/admin/primitives";
import { Icon } from "@/components/ui/Icon";
import { listServices } from "@/lib/db/content";

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  const services = await listServices().catch(() => []);
  return (
    <>
      <PageHeader title="Services" subtitle="The service offerings shown across the website — stored in SQLite." />
      <Card pad={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-surface/70 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3 w-12">#</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">URL</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-b border-line/70 transition-colors last:border-0 hover:bg-surface/60">
                  <td className="px-5 py-3.5 text-muted">{s.order_index + 1}</td>
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/services/${s.id}`} className="font-medium text-navy hover:text-teal-ink">{s.title}</Link>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-teal-ink">/{s.slug}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={s.published ? "published" : "draft"} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end">
                      <Link href={`/admin/services/${s.id}`} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-surface hover:text-navy" aria-label="Edit">
                        <Icon name="edit" className="size-4" />
                      </Link>
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
