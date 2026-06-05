import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";

export type Feature = { title: string; body?: string };

export function FeatureGrid({
  eyebrow,
  title,
  intro,
  items,
  bg = "white",
  cols = 3,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  items: Feature[];
  bg?: "white" | "surface";
  cols?: 2 | 3;
}) {
  return (
    <section className={`${bg === "surface" ? "bg-surface" : "bg-white"} py-20 sm:py-28 lg:py-32`}>
      <Container>
        <SectionHeading split eyebrow={eyebrow} title={title} intro={intro} />
        <div
          data-reveal-group
          className={`mt-14 grid gap-x-10 gap-y-11 sm:grid-cols-2 ${cols === 3 ? "lg:grid-cols-3" : ""}`}
        >
          {items.map((item) => (
            <div key={item.title} className="border-t border-line pt-6">
              <Icon name="check" className="size-5 text-green" />
              <h3 className="mt-5 font-display text-lg font-medium text-navy">{item.title}</h3>
              {item.body && <p className="mt-2.5 text-sm leading-relaxed text-muted">{item.body}</p>}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
