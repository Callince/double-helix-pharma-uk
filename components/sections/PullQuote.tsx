import { Container } from "@/components/ui/Container";
import { HelixMotif } from "@/components/ui/HelixMotif";
import { site } from "@/lib/site";

export function PullQuote() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <figure
          data-reveal
          className="relative isolate overflow-hidden rounded-3xl bg-green-gradient px-7 py-16 text-center shadow-[0_40px_90px_-50px_rgba(4,42,99,0.85)] sm:px-16 sm:py-20"
        >
          {/* Atmosphere — green/lime + cyan glow and a faint helix */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-12 -top-16 h-80 w-80 rounded-full bg-lime/25 blur-[110px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 right-[-6%] h-96 w-96 rounded-full bg-cyan/20 blur-[120px]"
          />
          <HelixMotif className="pointer-events-none absolute -right-6 top-0 hidden h-full w-48 text-white/[0.08] sm:block" />

          <span aria-hidden className="relative block font-display text-7xl leading-none text-lime">
            &ldquo;
          </span>
          <blockquote className="relative mx-auto -mt-3 max-w-3xl font-display text-[1.7rem] font-medium italic leading-[1.32] text-white sm:text-[2.3rem]">
            Compliance isn&apos;t paperwork — it&apos;s patient safety. My job is to make sure you
            can walk into any inspection with complete confidence.
          </blockquote>
          <figcaption className="label-mono mt-9 text-white/65">
            <span className="text-lime">{site.founder.name}</span> &mdash; {site.founder.role}
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
