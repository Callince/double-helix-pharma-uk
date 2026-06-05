import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { pillars } from "@/lib/site";

export function Pillars() {
  return (
    <section className="bg-white py-20 sm:py-28 lg:py-32">
      <Container>
        <SectionHeading
          split
          eyebrow="Proactive ⇔ Reactive"
          title="Whatever stage of compliance you're at"
          intro="Stay ahead of inspections, keep routine compliance on track, or recover quickly when something goes wrong."
        />
        <div data-reveal-group className="mt-14 grid gap-6 lg:grid-cols-3">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="group relative overflow-hidden rounded-lg border border-line bg-white p-8 transition-colors hover:border-navy/20"
            >
              <span className="absolute inset-x-0 top-0 h-0.5 bg-brand-gradient" />
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-md bg-navy text-white">
                  <Icon name={p.icon} className="size-5" />
                </span>
                <span className="label-mono text-teal-ink">{p.tag}</span>
              </div>
              <h3 className="mt-6 font-display text-xl font-medium text-navy">{p.title}</h3>
              <ul className="mt-5 space-y-3">
                {p.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink">
                    <Icon name="check" className="mt-0.5 size-4 shrink-0 text-green" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
