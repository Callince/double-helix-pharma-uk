import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { methodology } from "@/lib/site";

export function Methodology({ tone = "light" }: { tone?: "light" | "dark" }) {
  const isDark = tone === "dark";
  return (
    <section
      className={`relative overflow-hidden py-20 sm:py-28 lg:py-32 ${
        isDark ? "bg-ink-gradient text-white" : "bg-white"
      }`}
    >
      {isDark && (
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-8%] top-[-18%] h-[34rem] w-[34rem] rounded-full bg-teal/15 blur-[130px]"
        />
      )}
      <Container>
        <SectionHeading
          split
          eyebrow="How we work"
          title="A clear, inspection-grade method"
          intro="Every engagement follows the same disciplined path — so you always know what happens next."
          tone={isDark ? "light" : "dark"}
        />
        <ol data-reveal-group className="relative mt-16 space-y-4">
          <span
            aria-hidden
            className={`absolute left-[1.625rem] top-4 bottom-8 hidden w-px sm:block ${
              isDark
                ? "bg-gradient-to-b from-cyan/70 via-white/20 to-transparent"
                : "bg-gradient-to-b from-teal via-teal/30 to-transparent"
            }`}
          />
          {methodology.map((m) => (
            <li key={m.step} className="relative grid gap-4 sm:grid-cols-[3.25rem_1fr] sm:gap-7">
              <span
                className={`relative z-10 grid size-[3.25rem] place-items-center rounded-2xl font-display text-lg font-medium ${
                  isDark
                    ? "bg-white/[0.07] text-cyan ring-1 ring-white/15 backdrop-blur"
                    : "bg-white text-teal-ink ring-1 ring-line shadow-[0_12px_26px_-16px_rgba(6,41,92,0.6)]"
                }`}
              >
                {m.step}
              </span>
              <div
                className={`rounded-2xl p-6 transition-colors duration-300 ${
                  isDark
                    ? "bg-white/[0.04] ring-1 ring-white/10 hover:bg-white/[0.07]"
                    : "bg-surface ring-1 ring-line/70 hover:bg-paper"
                }`}
              >
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
