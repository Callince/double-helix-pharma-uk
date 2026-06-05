import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { services } from "@/lib/site";

export function ServiceCards() {
  return (
    <section id="services" className="scroll-mt-24 bg-surface py-20 sm:py-28 lg:py-32">
      <Container>
        <SectionHeading
          split
          eyebrow="Services"
          title="Quality & compliance, end to end"
          intro="From a single supplier audit to ongoing QP/RP cover and full quality-system builds — delivered by one senior expert."
        />
        <div data-reveal-group className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Link
              key={s.slug}
              href={s.href}
              className="group flex flex-col border-t border-line pt-6 transition-colors hover:border-navy"
            >
              <div className="flex items-center justify-between">
                <span className="label-mono text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon name={s.icon} className="size-6 text-teal" />
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
      </Container>
    </section>
  );
}
