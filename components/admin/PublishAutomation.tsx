"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { scheduleDripAction, setAllPostsDraftAction } from "@/app/admin/(panel)/content-actions";

/**
 * Admin blog toolbar: drip-publish automation + "set all to draft".
 * The dropdown lists the next drafts as Day 1, Day 2, … (1 post/day, Day 1 = today);
 * clicking a day schedules that many drafts. A daily Vercel cron publishes the rest.
 */
export function PublishAutomation({
  nextDrafts,
  totalDrafts,
}: {
  nextDrafts: { title: string }[];
  totalDrafts: number;
}) {
  const [open, setOpen] = useState(false);

  const dayLabel = (i: number) => {
    if (i === 0) return "Today";
    if (i === 1) return "Tomorrow";
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form action={setAllPostsDraftAction}>
        <button
          type="submit"
          onClick={(e) => { if (!confirm("Set ALL posts back to draft? This unpublishes everything currently live.")) e.preventDefault(); }}
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3.5 py-2 text-sm font-semibold text-navy transition hover:bg-surface"
        >
          <Icon name="refresh-cw" className="size-4" /> Set all to draft
        </button>
      </form>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="inline-flex items-center gap-2 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-navy-deep"
        >
          <Icon name="clock" className="size-4" /> Automate publishing
          <Icon name="chevron-down" className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <>
            {/* click-away layer */}
            <button type="button" aria-hidden tabIndex={-1} className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} />
            <div className="absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-xl border border-line bg-white shadow-[0_24px_60px_-24px_rgba(6,41,92,0.45)]">
              <div className="border-b border-line bg-surface/60 px-4 py-3">
                <p className="text-sm font-semibold text-navy">Drip‑publish · 1 post per day</p>
                <p className="mt-0.5 text-xs text-muted">
                  {totalDrafts} draft{totalDrafts === 1 ? "" : "s"} available. Day 1 goes live now; the rest publish automatically, one each day.
                </p>
              </div>

              {nextDrafts.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted">No drafts to schedule.</p>
              ) : (
                <div className="divide-y divide-line/70">
                  {nextDrafts.map((d, i) => (
                    <form key={i} action={scheduleDripAction} className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-surface/60">
                      <input type="hidden" name="days" value={i + 1} />
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-navy/10 text-xs font-bold text-navy">{i + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-navy">{d.title}</span>
                        <span className="block text-xs text-muted">Day {i + 1} · {dayLabel(i)}</span>
                      </span>
                      <button type="submit" className="shrink-0 rounded-md border border-line bg-white px-2.5 py-1 text-xs font-semibold text-teal-ink transition hover:bg-teal/10">
                        Schedule {i + 1}
                      </button>
                    </form>
                  ))}
                </div>
              )}

              {totalDrafts > nextDrafts.length && (
                <form action={scheduleDripAction} className="border-t border-line bg-surface/40 px-4 py-2.5">
                  <input type="hidden" name="days" value={totalDrafts} />
                  <button type="submit" className="w-full rounded-md bg-green px-3 py-2 text-xs font-semibold text-white transition hover:brightness-110">
                    Schedule all {totalDrafts} · 1 per day
                  </button>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
