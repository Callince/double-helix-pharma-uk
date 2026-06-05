import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export function PullQuote() {
  return (
    <section className="bg-surface py-20 sm:py-28">
      <Container size="narrow">
        <figure data-reveal className="text-center">
          <span aria-hidden className="block font-display text-6xl leading-none text-teal/30">
            &ldquo;
          </span>
          <blockquote className="mt-2 font-display text-[1.7rem] font-medium italic leading-[1.3] text-navy sm:text-[2.15rem]">
            Compliance isn&apos;t paperwork — it&apos;s patient safety. My job is to make sure you
            can walk into any inspection with complete confidence.
          </blockquote>
          <figcaption className="label-mono mt-8 text-muted">
            <span className="text-teal-ink">{site.founder.name}</span> — {site.founder.role}
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
