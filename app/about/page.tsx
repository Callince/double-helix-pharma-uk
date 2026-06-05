import type { Metadata } from "next";
import Image from "next/image";
import { Hero } from "@/components/sections/Hero";
import { DosageForms } from "@/components/sections/DosageForms";
import { PullQuote } from "@/components/sections/PullQuote";
import { CTABand } from "@/components/sections/CTABand";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { personSchema, breadcrumbSchema } from "@/lib/schema";
import { site, credentials } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Double Helix Pharma UK Ltd is led by a Qualified Person (QP), Responsible Person (RP/RPi) and GMP/GDP Lead Auditor with 20+ years in pharmaceutical quality across UK, EU, US and MENA.",
  alternates: { canonical: "/about" },
};

const functional = [
  "GMP/GDP compliance audits",
  "Site readiness for GMP/GDP/MIA/WDA operating models",
  "Contract QP / RP / RPi activities",
  "PQS/QMS implementation to ICH, FDA & EMA requirements",
  "QC testing lab relocation & requalification",
  "QA SOPs, protocols, reports & batch release",
];

const technical = [
  "Pharmaceutical Quality Systems (PQS) expert",
  "GMP/GDP expert — QP, RP & RPi",
  "GMP/GDP Lead Auditor",
  "GxP supplier management",
  "GDP transport validation & supply-chain management",
  "QA & QC leadership; global project management",
];

const experience = [
  "20+ years in pharmaceutical quality across US, UK, EU and MENA markets.",
  "Led quality & compliance teams and harmonised pharmaceutical quality systems across group sites and affiliates.",
  "Performed Responsible Person (RP) and RPi duties for the UK market.",
  "Managed and hosted regulatory GMP/GDP inspections and chaired quality risk-management board meetings.",
  "Supported EU/UK batch release and improved third-party CMO relationships.",
  "Authored and reviewed SMF, VMP, VPP, QTA, change control, deviation, OOS/OOT/OOC, CAPA and Product Quality Reviews.",
  "Oversaw equipment and utility qualification — URS, DQ, IQ, OQ and PQ.",
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          personSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      <Hero
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "About" },
        ]}
        eyebrow="About"
        title={
          <>
            A specialist quality &amp; compliance practice{" "}
            <em className="font-display italic text-teal-ink">you can trust</em>
          </>
        }
        subtitle="Double Helix Pharma UK Ltd pairs the rigour of a large consultancy with the directness of working one-to-one with a senior Qualified Person."
        primary={{ label: "Work with us", href: "/contact" }}
      />

      {/* Founder */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="mx-auto w-full max-w-sm">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface shadow-[0_30px_60px_-25px_rgba(22,54,91,0.5)]">
                <Image
                  src="/founder-web.jpg"
                  alt={`${site.founder.name} — ${site.founder.role} at ${site.shortName}`}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 90vw, 384px"
                  className="object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/80 to-transparent p-6">
                  <p className="font-display text-lg font-semibold text-white">{site.founder.name}</p>
                  <p className="text-sm text-white/80">{site.founder.role}</p>
                </div>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {credentials.map((c) => (
                  <li
                    key={c}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-navy"
                  >
                    <Icon name="badge-check" className="size-4 text-teal" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeading
                align="left"
                eyebrow="The consultant"
                title="An inspector's eye, an operator's pragmatism"
              />
              <div className="mt-5 space-y-4 text-[1.02rem] leading-relaxed text-ink">
                <p>
                  Double Helix Pharma is led by {site.founder.name}, a Qualified Person (QP),
                  Responsible Person (RP) and RP for import (RPi) with over 20 years in
                  pharmaceutical quality for highly regulated US, UK, EU and MENA markets.
                </p>
                <p>
                  Across that career the focus has been constant: implement a high standard of
                  quality, keep sites inspection-ready, and protect patient safety while helping
                  the business move forward — from sterile and oncology injectables and
                  biosimilars to solid oral dose, APIs and excipients.
                </p>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-surface p-6">
                  <h3 className="font-display text-base font-semibold text-navy">
                    Functional expertise
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {functional.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-ink">
                        <Icon name="check" className="mt-0.5 size-4 shrink-0 text-green" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-line bg-surface p-6">
                  <h3 className="font-display text-base font-semibold text-navy">
                    Technical skills
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {technical.map((t) => (
                      <li key={t} className="flex items-start gap-2.5 text-sm text-ink">
                        <Icon name="check" className="mt-0.5 size-4 shrink-0 text-green" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Experience */}
      <section className="bg-surface py-16 sm:py-20 lg:py-24">
        <Container size="narrow">
          <SectionHeading
            eyebrow="Professional experience"
            title="20+ years, distilled"
            intro="A selection of the experience behind every engagement."
          />
          <ul className="mt-10 space-y-4">
            {experience.map((e) => (
              <li key={e} className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5">
                <Icon name="shield-check" className="mt-0.5 size-5 shrink-0 text-teal" />
                <span className="text-[0.975rem] leading-relaxed text-ink">{e}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <DosageForms />
      <PullQuote />
      <CTABand
        title="Let's talk about your quality goals"
        subtitle="Whether it's a single audit or an ongoing partnership, you'll always work directly with a senior expert."
      />
    </>
  );
}
