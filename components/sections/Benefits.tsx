import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon, type IconName } from "@/components/ui/Icon";
import { benefits } from "@/lib/site";

export function Benefits({
  eyebrow = "Why partner with us",
  title = "A senior, independent expert",
  intro = "No layers, no juniors learning on your time — direct access to a Qualified Person who has sat on both sides of the inspection table.",
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
}) {
  return (
    <section className="bg-white py-20 sm:py-28 lg:py-32">
      <Container>
        <SectionHeading split eyebrow={eyebrow} title={title} intro={intro} />
        <div data-reveal-group className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="group flex flex-col">
              <span className="grid size-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_14px_28px_-14px_rgba(43,154,205,0.75)] transition-transform duration-300 group-hover:-translate-y-1">
                <Icon name={b.icon as IconName} className="size-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-medium text-navy">{b.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{b.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
