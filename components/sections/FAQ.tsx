import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Disclosure } from "@/components/ui/Disclosure";
import type { Faq } from "@/lib/site";

export function FAQ({
  faqs,
  eyebrow = "FAQ",
  title = "Frequently asked questions",
  intro,
  bg = "surface",
}: {
  faqs: Faq[];
  eyebrow?: string;
  title?: string;
  intro?: string;
  bg?: "white" | "surface";
}) {
  return (
    <section className={`${bg === "surface" ? "bg-surface" : "bg-white"} py-20 sm:py-28 lg:py-32`}>
      <Container size="narrow">
        <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
        <div data-reveal-group className="mt-12">
          {faqs.map((f) => (
            <Disclosure key={f.q} question={f.q} answer={f.a} />
          ))}
        </div>
      </Container>
    </section>
  );
}
