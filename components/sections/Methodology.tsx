import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { methodology } from "@/lib/site";

export function Methodology({ tone = "light" }: { tone?: "light" | "dark" }) {
  const isDark = tone === "dark";
  return (
    <section className={isDark ? "bg-navy-deep py-20 text-white sm:py-28 lg:py-32" : "bg-white py-20 sm:py-28 lg:py-32"}>
      <Container>
        <SectionHeading
          split
          eyebrow="How we work"
          title="A clear, inspection-grade method"
          intro="Every engagement follows the same disciplined path — so you always know what happens next."
          tone={isDark ? "light" : "dark"}
        />
        <ol data-reveal-group className={`mt-14 border-t ${isDark ? "border-white/12" : "border-line"}`}>
          {methodology.map((m) => (
            <li
              key={m.step}
              className={`grid items-start gap-3 border-b py-8 sm:grid-cols-[6rem_1fr] sm:gap-10 ${
                isDark ? "border-white/12" : "border-line"
              }`}
            >
              <span className={`font-display text-4xl font-medium leading-none ${isDark ? "text-cyan" : "text-teal/70"}`}>
                {m.step}
              </span>
              <div>
                <h3 className={`font-display text-xl font-medium ${isDark ? "text-white" : "text-navy"}`}>
                  {m.title}
                </h3>
                <p className={`mt-2 max-w-2xl leading-relaxed ${isDark ? "text-white/70" : "text-muted"}`}>
                  {m.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
