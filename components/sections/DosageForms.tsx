import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { dosageForms } from "@/lib/site";

export function DosageForms() {
  return (
    <section className="bg-white py-20 sm:py-28 lg:py-32">
      <Container>
        <SectionHeading
          split
          eyebrow="Industries & dosage forms"
          title="Experience across product types"
          intro="Quality and compliance expertise spanning sterile and non-sterile manufacturing."
        />
        <div
          data-reveal-group
          className="mt-14 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
        >
          {dosageForms.map((d, i) => (
            <div key={d.label} className="flex items-start gap-4 bg-white p-7">
              <span className="label-mono pt-1 text-teal-ink">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-display text-lg font-medium text-navy">{d.label}</p>
                <p className="mt-1 text-sm text-muted">{d.note}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
