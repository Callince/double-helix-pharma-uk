import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { complianceReach } from "@/lib/site";

export function ComplianceTable() {
  return (
    <section className="bg-surface py-20 sm:py-28 lg:py-32">
      <Container>
        <SectionHeading
          split
          eyebrow="GxP compliance reach"
          title="Standards we audit & build against"
          intro="Across product types and the regulatory frameworks that govern them — UK, EU and US."
        />
        <div data-reveal className="mt-14 overflow-hidden rounded-lg border border-line bg-white">
          <div className="hidden grid-cols-[1fr_1.7fr] border-b border-line bg-navy text-white sm:grid">
            <div className="label-mono px-6 py-4 text-white/70">Product type</div>
            <div className="label-mono px-6 py-4 text-white/70">Applicable frameworks</div>
          </div>
          <ul className="divide-y divide-line">
            {complianceReach.map((row) => (
              <li
                key={row.product}
                className="grid gap-3 px-6 py-6 transition-colors hover:bg-surface sm:grid-cols-[1fr_1.7fr] sm:items-center sm:gap-8"
              >
                <span className="font-display text-lg font-medium text-navy">{row.product}</span>
                <span className="flex flex-wrap gap-2">
                  {row.frameworks.map((f) => (
                    <span
                      key={f}
                      className="font-mono text-[0.7rem] tracking-tight rounded-md border border-line bg-surface px-2.5 py-1 text-ink"
                    >
                      {f}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
