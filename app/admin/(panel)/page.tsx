import Link from "next/link";
import { StatCard, Card, PageHeader, StatusBadge, AdminButton } from "@/components/admin/primitives";
import { Icon, type IconName } from "@/components/ui/Icon";
import { timeAgo } from "@/lib/admin/data";
import { enquiryStats, listEnquiries, type EnquiryRow } from "@/lib/db/enquiries";
import { listPosts, listSubscribers } from "@/lib/db/content";

export const dynamic = "force-dynamic";

const quickActions: { label: string; href: string; icon: IconName }[] = [
  { label: "Write a new post", href: "/admin/blog", icon: "file-text" },
  { label: "Add a case study", href: "/admin/case-studies", icon: "briefcase" },
  { label: "Review enquiries", href: "/admin/enquiries", icon: "inbox" },
  { label: "Edit site settings", href: "/admin/settings", icon: "settings" },
];

const PIPE: { status: string; label: string }[] = [
  { status: "new", label: "New" }, { status: "in_review", label: "In review" },
  { status: "contacted", label: "Contacted" }, { status: "qualified", label: "Qualified" },
  { status: "won", label: "Won" },
];

export default async function DashboardPage() {
  let all: EnquiryRow[] = [];
  let totals = { total: 0, newCount: 0 };
  let insights = { published: 0, drafts: 0 };
  let subs = { total: 0, confirmed: 0 };
  try {
    all = await listEnquiries();
    totals = await enquiryStats();
    const posts = await listPosts();
    insights = {
      published: posts.filter((p) => p.status === "published").length,
      drafts: posts.filter((p) => p.status !== "published").length,
    };
    const list = await listSubscribers();
    subs = { total: list.length, confirmed: list.filter((s) => s.status === "confirmed").length };
  } catch (err) {
    console.error("[admin] dashboard read failed", err);
  }

  const recent = all.slice(0, 5);
  const pipeline = PIPE.map((p) => ({ ...p, count: all.filter((e) => e.status === p.status).length }));
  const maxCount = Math.max(1, ...pipeline.map((p) => p.count));

  const stats = [
    { label: "Total enquiries", value: String(totals.total), delta: "live from SQLite", icon: "inbox" as IconName, tone: "teal" as const },
    { label: "New (untriaged)", value: String(totals.newCount), delta: "needs attention", icon: "bell" as IconName, tone: "green" as const },
    { label: "Published posts", value: String(insights.published), delta: `${insights.drafts} in draft`, icon: "file-text" as IconName, tone: "navy" as const },
    { label: "Subscribers", value: String(subs.total), delta: `${subs.confirmed} confirmed`, icon: "users" as IconName, tone: "plum" as const },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of enquiries, content and subscribers."
        action={<AdminButton href="/admin/blog" icon="plus" variant="green">New post</AdminButton>}
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
            {recent.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted">No enquiries yet.</p>
            ) : (
              <ul className="divide-y divide-line">
                {recent.map((e) => (
                  <li key={e.id}>
                    <Link href="/admin/enquiries" className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface/60">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy/5 text-xs font-bold text-navy">
                        {e.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-navy">
                          {e.name} <span className="font-normal text-muted">· {e.company || "—"}</span>
                        </p>
                        <p className="truncate text-xs text-muted">{e.service || "—"}</p>
                      </div>
                      <StatusBadge status={e.status} />
                      <span className="hidden w-16 text-right text-xs text-muted sm:block">{timeAgo(e.created_at)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
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
                    <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${(p.count / maxCount) * 100}%` }} />
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
