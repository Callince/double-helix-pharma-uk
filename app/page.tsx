import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { StandardsTicker } from "@/components/sections/StandardsTicker";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { Pillars } from "@/components/sections/Pillars";
import { FounderAbout } from "@/components/sections/FounderAbout";
import { Methodology } from "@/components/sections/Methodology";
import { DosageForms } from "@/components/sections/DosageForms";
import { PullQuote } from "@/components/sections/PullQuote";
import { FAQ } from "@/components/sections/FAQ";
import { CTABand } from "@/components/sections/CTABand";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/schema";
import { faqsHome, ctaHref, ctaLabel } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Double Helix Pharma UK | GMP/GDP Audits & Contract QP Services" },
  description:
    "UK pharmaceutical quality & compliance consultancy: independent GMP/GDP audits, contract QP/RP/RPi services and inspection-ready quality systems. 20+ years across UK, EU, US & MENA.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(faqsHome)} />

      <Hero
        panel
        eyebrow="Pharmaceutical Quality & Compliance"
        title={
          <>
            Where compliance meets{" "}
            <em className="font-display italic text-teal-ink">confidence</em>
          </>
        }
        subtitle="Independent EU GMP/GDP audits, contract QP/RP/RPi cover and inspection-ready quality systems — led by a Qualified Person with 20+ years across regulated markets."
        primary={{ label: ctaLabel, href: ctaHref }}
        secondary={{ label: "Explore services", href: "/#services" }}
        chips={["Remote, on-site or hybrid", "UK · EU · US · MENA", "Audit-graded reporting"]}
      />

      <TrustBar />
      <StandardsTicker />
      <ServiceCards />
      <Pillars />
      <FounderAbout />
      <Methodology />
      <DosageForms />
      <PullQuote />
      <FAQ faqs={faqsHome} />
      <CTABand />
    </>
  );
}
