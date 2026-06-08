import Link from "next/link";
import { StatCard, Card, PageHeader, StatusBadge, AdminButton } from "@/components/admin/primitives";
import { Icon, type IconName } from "@/components/ui/Icon";
import { stats, enquiries, timeAgo } from "@/lib/admin/data";

const pipeline = [
  { status: "new", label: "New", count: 9 },
  { status: "in_review", label: "In review", count: 5 },
  { status: "contacted", label: "Contacted", count: 7 },
  { status: "qualified", label: "Qualified", count: 4 },
  { status: "won", label: "Won", count: 21 },
];

const quickActions: { label: string; href: string; icon: IconName }[] = [
  { label: "Write a new insight", href: "/admin/posts", icon: "file-text" },
  { label: "Add a case study", href: "/admin/case-studies", icon: "briefcase" },
  { label: "Review enquiries", href: "/admin/enquiries", icon: "inbox" },
  { label: "Edit site settings", href: "/admin/settings", icon: "settings" },
];

export default function DashboardPage() {
  const recent = enquiries.slice(0, 5);
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of enquiries, content and subscribers."
        action={<AdminButton href="/admin/posts" icon="plus" variant="green">New insight</AdminButton>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-navy">Recent enquiries</h2>
            <Link href="/admin/enquiries" className="text-sm font-semibold text-teal-ink hover:underline">View all &rarr;</Link>
          </div>
          <Card pad={false} className="overflow-hidden">
            <ul className="divide-y divide-line">
              {recent.map((e) => (
                <li key={e.id}>
                  <Link href="/admin/enquiries" className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface/60">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy/5 text-xs font-bold text-navy">
                      {e.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-navy">
                        {e.name} <span className="font-normal text-muted">· {e.company}</span>
                      </p>
                      <p className="truncate text-xs text-muted">{e.service}</p>
                    </div>
                    <StatusBadge status={e.status} />
                    <span className="hidden w-16 text-right text-xs text-muted sm:block">{timeAgo(e.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="mb-3 font-display text-lg font-semibold text-navy">Enquiry pipeline</h2>
            <Card className="space-y-3">
              {pipeline.map((p) => (
                <div key={p.status} className="flex items-center gap-3">
                  <StatusBadge status={p.status} />
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
                    <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${Math.min(100, p.count * 4)}%` }} />
                  </div>
                  <span className="w-6 text-right text-sm font-semibold text-navy">{p.count}</span>
                </div>
              ))}
            </Card>
          </div>

          <div>
            <h2 className="mb-3 font-display text-lg font-semibold text-navy">Quick actions</h2>
            <Card pad={false} className="overflow-hidden">
              <ul className="divide-y divide-line">
                {quickActions.map((a) => (
                  <li key={a.href}>
                    <Link href={a.href} className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-navy transition-colors hover:bg-surface/60">
                      <Icon name={a.icon} className="size-[18px] text-teal-ink" />
                      {a.label}
                      <Icon name="chevron-right" className="ml-auto size-4 text-muted" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
