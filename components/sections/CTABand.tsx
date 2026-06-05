import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HelixMotif } from "@/components/ui/HelixMotif";
import { ctaHref, ctaLabel } from "@/lib/site";

export function CTABand({
  title = "Ready to get inspection-ready?",
  subtitle = "Book a no-obligation discovery call to talk through your audit, QP/RP or quality-system needs.",
  primary = { label: ctaLabel, href: ctaHref },
  secondary,
}: {
  title?: string;
  subtitle?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div data-reveal className="relative overflow-hidden rounded-2xl bg-ink-gradient px-7 py-16 sm:px-14">
          <div
            aria-hidden
            className="absolute right-[-8%] top-[-40%] h-[24rem] w-[24rem] rounded-full bg-cyan/10 blur-[100px]"
          />
          <HelixMotif className="pointer-events-none absolute -right-2 top-0 hidden h-full w-44 text-white/[0.06] sm:block" />
          <div className="relative max-w-2xl">
            <div className="label-mono flex items-center gap-2.5 text-cyan">
              <span className="h-px w-7 bg-cyan/60" />
              Get started
            </div>
            <h2 className="mt-5 font-display text-[2rem] font-medium leading-[1.1] text-white sm:text-[2.6rem]">
              {title}
            </h2>
            <p className="mt-4 max-w-xl text-lg text-white/80">{subtitle}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={primary.href} variant="green" size="lg" withArrow>
                {primary.label}
              </Button>
              {secondary && (
                <Button href={secondary.href} size="lg" variant="outline-light">
                  {secondary.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
