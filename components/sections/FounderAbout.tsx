import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { site, credentials } from "@/lib/site";

export function FounderAbout() {
  return (
    <section className="bg-surface py-20 sm:py-28 lg:py-32">
      <Container>
        <div data-reveal-group className="grid items-center gap-14 lg:grid-cols-[0.82fr_1.18fr]">
          {/* Portrait */}
          <div className="mx-auto w-full max-w-sm">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-navy/10 bg-surface">
              <Image
                src="/founder-web.webp"
                alt={`${site.founder.name} — ${site.founder.role} at ${site.shortName}`}
                fill
                unoptimized
                sizes="(max-width: 1024px) 90vw, 384px"
                className="object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-navy-deep/70 px-6 py-4 backdrop-blur-sm">
                <p className="font-display text-lg font-medium text-white">{site.founder.name}</p>
                <p className="label-mono mt-1 text-[0.6rem] text-cyan">{site.founder.credentials}</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <div className="label-mono flex items-center gap-2.5 text-teal-ink">
              <span className="h-px w-7 bg-teal/50" />
              Meet your auditor
            </div>
            <h2 className="mt-5 max-w-xl font-display text-[2rem] font-medium leading-[1.1] text-navy sm:text-[2.5rem]">
              Led by a hands-on Qualified Person, <em className="text-teal-ink">not a faceless firm</em>
            </h2>
            <div className="mt-6 space-y-4 text-[1.02rem] leading-relaxed text-ink">
              <p>
                Double Helix Pharma is led by {site.founder.name}, a Qualified Person (QP),
                Responsible Person (RP) and RP for import (RPi) with{" "}
                <strong className="font-semibold text-navy">20+ years in pharmaceutical quality</strong>{" "}
                across the UK, EU, US and MENA markets.
              </p>
              <p>
                Having led quality &amp; compliance teams, harmonised pharmaceutical quality systems,
                performed RP/RPi duties for the UK market and hosted regulatory GMP/GDP inspections,
                the practice brings an inspector&apos;s eye and an operator&apos;s pragmatism — from
                sterile and oncology injectables to biosimilars and solid oral dose.
              </p>
            </div>

            <ul className="mt-7 flex flex-wrap gap-2.5">
              {credentials.map((c) => (
                <li
                  key={c}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 font-mono text-[0.68rem] tracking-tight text-navy"
                >
                  <Icon name="badge-check" className="size-4 text-green" />
                  {c}
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <Button href="/about" variant="outline" withArrow>
                More about the consultant
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
