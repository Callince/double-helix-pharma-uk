import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { services } from "@/lib/site";

/**
 * Shared services grid — premium boxed cards used on BOTH the home #services
 * section and the dedicated /services page, so the two stay visually identical
 * and consistent with the detail-page card language.
 */
export function ServiceGrid() {
  return (
    <div
      data-reveal-group
      className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
    >
      {services.map((s, i) => (
        <Link
          key={s.slug}
          href={s.href}
          className="group relative flex flex-col bg-white p-7 transition-colors hover:bg-surface sm:p-8"
        >
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-gradient transition-transform duration-300 group-hover:scale-x-100"
          />
          <div className="flex items-center justify-between">
            <span className="grid size-12 place-items-center rounded-xl bg-navy text-white transition-colors group-hover:bg-teal-ink">
              <Icon name={s.icon} className="size-5" />
            </span>
            <span className="label-mono text-muted">{String(i + 1).padStart(2, "0")}</span>
          </div>
          <h3 className="mt-6 font-display text-xl font-medium text-navy">{s.title}</h3>
          <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">{s.short}</p>
          <span className="label-mono mt-6 inline-flex items-center gap-2 text-teal-ink">
            {s.hasPage ? "Learn more" : "Enquire"}
            <Icon
              name="arrow-right"
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </span>
        </Link>
      ))}
    </div>
  );
}
