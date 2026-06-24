"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import { PageHeader, Card, StatusBadge, AdminButton } from "@/components/admin/primitives";
import { timeAgo, parseDbDate } from "@/lib/admin/data";
import type { EnquiryRow } from "@/lib/db/enquiries";
import { setEnquiryStatusAction } from "./actions";

const FILTERS = [
  { key: "all", label: "All" }, { key: "new", label: "New" }, { key: "in_review", label: "In review" },
  { key: "contacted", label: "Contacted" }, { key: "qualified", label: "Qualified" }, { key: "won", label: "Won" },
  { key: "lost", label: "Lost" }, { key: "spam", label: "Spam" },
];
const STATUS_OPTIONS = ["new", "in_review", "contacted", "qualified", "won", "lost", "spam"];

export function EnquiriesClient({ enquiries }: { enquiries: EnquiryRow[] }) {
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rows = enquiries.filter((e) => {
    const matchStatus = filter === "all" || e.status === filter;
    const matchQ = q === "" || `${e.name} ${e.company ?? ""} ${e.email} ${e.service ?? ""}`.toLowerCase().includes(q.toLowerCase());
    return matchStatus && matchQ;
  });
  const selected = enquiries.find((e) => e.id === selectedId) || null;

  return (
    <>
      <PageHeader
        title="Enquiries"
        subtitle={`${enquiries.length} lead${enquiries.length === 1 ? "" : "s"} from the website contact form · stored in SQLite`}
        action={<AdminButton variant="ghost" icon="filter">Export CSV</AdminButton>}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f.key ? "bg-navy text-white" : "border border-line bg-white text-navy hover:bg-surface"
            }`}
          >
            {f.label}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-1.5 text-sm">
          <Icon name="search" className="size-4 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search enquiries…"
            className="w-44 bg-transparent text-ink outline-none placeholder:text-muted/60" />
        </label>
      </div>

      <Card pad={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-surface/70 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Received</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-muted">No enquiries match.</td></tr>
              ) : rows.map((e) => (
                <tr key={e.id} onClick={() => setSelectedId(e.id)}
                  className="cursor-pointer border-b border-line/70 transition-colors last:border-0 hover:bg-surface/60">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-navy">{e.name}</p>
                    <p className="text-xs text-muted">{e.company || "—"}</p>
                  </td>
                  <td className="px-5 py-3.5 text-ink">{e.service || "—"}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={e.status} /></td>
                  <td className="px-5 py-3.5 text-xs text-muted">{timeAgo(e.created_at)}</td>
                  <td className="px-5 py-3.5 text-right"><Icon name="chevron-right" className="ml-auto size-4 text-muted" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && <EnquiryDrawer enquiry={selected} onClose={() => setSelectedId(null)} />}
    </>
  );
}

function EnquiryDrawer({ enquiry, onClose }: { enquiry: EnquiryRow; onClose: () => void }) {
  const [status, setStatus] = useState(enquiry.status);
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      await setEnquiryStatusAction(enquiry.id, status);
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-navy-deep/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <p className="label-mono text-[0.6rem] text-teal-ink">{enquiry.id}</p>
            <h3 className="font-display text-lg font-semibold text-navy">{enquiry.name}</h3>
          </div>
          <button onClick={onClose} className="grid size-9 place-items-center rounded-lg text-navy hover:bg-surface" aria-label="Close">
            <Icon name="x" className="size-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Detail label="Company" value={enquiry.company || "—"} />
            <Detail label="Service" value={enquiry.service || "—"} />
            <Detail label="Email" value={enquiry.email} link={`mailto:${enquiry.email}`} />
            <Detail label="Received" value={parseDbDate(enquiry.created_at).toLocaleString("en-GB")} />
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Message</p>
            <p className="rounded-xl bg-surface p-4 text-sm leading-relaxed text-ink">{enquiry.message}</p>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Status</p>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm capitalize text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/25">
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-line px-6 py-4">
          <button onClick={save} disabled={pending}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-green px-3.5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60">
            <Icon name="check" className="size-4" />
            {pending ? "Saving…" : "Save changes"}
          </button>
          <a href={`mailto:${enquiry.email}`} className="inline-flex items-center gap-2 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-navy hover:bg-surface">
            <Icon name="mail" className="size-4" /> Reply
          </a>
        </div>
      </aside>
    </div>
  );
}

function Detail({ label, value, link }: { label: string; value: string; link?: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      {link ? <a href={link} className="break-words text-teal-ink hover:underline">{value}</a>
            : <p className="break-words text-navy">{value}</p>}
    </div>
  );
}
