import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

export function LegalShell({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated?: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <section className="border-b border-line bg-hero-light">
        <Container size="narrow">
          <div className="py-14 sm:py-20">
            <p className="label-mono text-teal-ink">Legal</p>
            <h1 className="mt-4 font-display text-[2.4rem] font-medium leading-[1.08] tracking-[-0.02em] text-navy sm:text-5xl">
              {title}
            </h1>
            {updated && <p className="mt-5 text-sm text-muted">Last updated: {updated}</p>}
            {intro && <p className="mt-4 max-w-2xl leading-relaxed text-ink/80">{intro}</p>}
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <Container size="narrow">
          <div className="legal-prose text-[0.975rem] leading-relaxed text-ink">{children}</div>
        </Container>
      </section>
    </>
  );
}
