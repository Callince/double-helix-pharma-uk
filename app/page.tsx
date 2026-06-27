import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
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
import { LatestPosts } from "@/components/sections/LatestPosts";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, howToSchema } from "@/lib/schema";
import { faqsHome, ctaHref, ctaLabel } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  absoluteTitle: true,
  title: "GMP/GDP Audits & Contract QP | Double Helix Pharma UK",
  description:
    "UK pharmaceutical quality consultant — independent GMP/GDP audits, contract QP/RP/RPi cover and inspection-ready quality systems from a QP with 20+ years.",
  path: "/",
});

// The homepage now shows the latest blog posts (DB-driven) — cache it as ISR, refresh hourly.
export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <JsonLd data={[faqSchema(faqsHome), howToSchema()]} />

      <Hero
        panel
        eyebrow="UK Pharmaceutical Quality Consultant"
        title={
          <>
            Where compliance meets{" "}
            <em className="font-display italic text-teal-ink">confidence</em>
          </>
        }
        subtitle="Independent EU GMP/GDP audits, contract QP/RP/RPi cover and inspection-ready quality systems — from a UK pharmaceutical quality consultant and Qualified Person with 20+ years across regulated markets."
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
      <LatestPosts />
      <FAQ faqs={faqsHome} />
      <CTABand />
    </>
  );
}
