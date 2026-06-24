import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

/* ------------------------------------------------------------------ buttons */
const variants: Record<string, string> = {
  primary: "bg-navy text-white hover:bg-navy-deep",
  green: "bg-green text-white hover:brightness-110",
  ghost: "border border-line bg-white text-navy hover:bg-surface",
};
export function AdminButton({
  children, href, icon, variant = "primary", type = "button", className = "",
}: {
  children: ReactNode; href?: string; icon?: IconName;
  variant?: "primary" | "green" | "ghost"; type?: "button" | "submit"; className?: string;
}) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${variants[variant]} ${className}`;
  const inner = (<>{icon && <Icon name={icon} className="size-4" />}{children}</>);
  return href ? <Link href={href} className={cls}>{inner}</Link> : <button type={type} className={cls}>{inner}</button>;
}

/* -------------------------------------------------------------------- layout */
export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-navy">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "", pad = true }: { children: ReactNode; className?: string; pad?: boolean }) {
  return (
    <div className={`rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(13,39,64,0.04)] ${pad ? "p-6" : ""} ${className}`}>
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------- stat card */
const tones: Record<string, string> = {
  teal: "bg-teal/12 text-teal-ink",
  green: "bg-green/12 text-green-ink",
  navy: "bg-navy/10 text-navy",
  plum: "bg-[#6d4aa0]/12 text-[#6d4aa0]",
};
export function StatCard({ label, value, delta, icon, tone = "teal" }: {
  label: string; value: string; delta?: string; icon: IconName; tone?: "teal" | "green" | "navy" | "plum";
}) {
  return (
    <Card className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-muted">{label}</p>
        <p className="mt-2 font-display text-[1.7rem] font-semibold leading-none text-navy">{value}</p>
        {delta && <p className="mt-2 text-xs text-muted">{delta}</p>}
      </div>
      <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${tones[tone]}`}>
        <Icon name={icon} className="size-5" />
      </span>
    </Card>
  );
}

/* --------------------------------------------------------------- status badge */
const STATUS: Record<string, { label: string; cls: string }> = {
  new:          { label: "New",          cls: "bg-teal/12 text-teal-ink" },
  in_review:    { label: "In review",    cls: "bg-amber-100 text-amber-700" },
  contacted:    { label: "Contacted",    cls: "bg-indigo-100 text-indigo-700" },
  qualified:    { label: "Qualified",    cls: "bg-green/12 text-green-ink" },
  won:          { label: "Won",          cls: "bg-green text-white" },
  lost:         { label: "Lost",         cls: "bg-rose-100 text-rose-600" },
  spam:         { label: "Spam",         cls: "bg-slate-100 text-slate-500" },
  draft:        { label: "Draft",        cls: "bg-slate-100 text-slate-600" },
  scheduled:    { label: "Scheduled",    cls: "bg-amber-100 text-amber-700" },
  published:    { label: "Published",    cls: "bg-green/12 text-green-ink" },
  pending:      { label: "Pending",      cls: "bg-amber-100 text-amber-700" },
  confirmed:    { label: "Confirmed",    cls: "bg-green/12 text-green-ink" },
  unsubscribed: { label: "Unsubscribed", cls: "bg-slate-100 text-slate-500" },
};
export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, cls: "bg-slate-100 text-slate-600" };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.cls}`}>{s.label}</span>;
}

/* ---------------------------------------------------------------- data table */
export type Column = { key: string; label: string; render?: (row: any) => ReactNode; className?: string };
export function DataTable({ columns, rows, empty = "No records yet." }: { columns: Column[]; rows: any[]; empty?: string }) {
  return (
    <Card pad={false} className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-surface/70 text-left">
              {columns.map((c) => (
                <th key={c.key} className={`px-5 py-3 text-[0.7rem] font-semibold uppercase tracking-wide text-muted ${c.className ?? ""}`}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-5 py-12 text-center text-muted">{empty}</td></tr>
            ) : rows.map((row, i) => (
              <tr key={row.id ?? i} className="border-b border-line/70 transition-colors last:border-0 hover:bg-surface/60">
                {columns.map((c) => (
                  <td key={c.key} className={`px-5 py-3.5 align-middle text-ink ${c.className ?? ""}`}>
                    {c.render ? c.render(row) : String(row[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ponytail: removed unused ResourceList wrapper (0 callers) — admin pages build tables directly.
