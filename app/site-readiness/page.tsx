import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { Pillars } from "@/components/sections/Pillars";
import { ComplianceTable } from "@/components/sections/ComplianceTable";
import { Methodology } from "@/components/sections/Methodology";
import { Benefits } from "@/components/sections/Benefits";
import { FAQ } from "@/components/sections/FAQ";
import { RelatedServices } from "@/components/sections/RelatedServices";
import { CTABand } from "@/components/sections/CTABand";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { faqsSiteReadiness, getService } from "@/lib/site";

const service = getService("site-readiness")!;

export const metadata: Metadata = {
  title: service.metaTitle,
  description: service.metaDescription,
  alternates: { canonical: service.href },
  openGraph: {
    title: `${service.metaTitle} | Double Helix Pharma UK`,
    description: service.metaDescription,
    url: service.href,
  },
};

const scope = [
  { title: "Licence application support", body: "MIA / MIA(IMP) / WDA(H) applications and the supporting documentation, including the Site Master File (SMF)." },
  { title: "QMS & facility gap assessment", body: "Benchmark your quality system, facility and processes against the licence requirements and prioritise the gaps." },
  { title: "QP / RP / RPi nomination", body: "Help identify and prepare the named person(s) the licence requires, with interim cover where needed." },
  { title: "Mock pre-licensing inspection", body: "A realistic MHRA-style inspection to test readiness and rehearse your team before the real one." },
  { title: "Remediation & CAPA", body: "Close the gaps with a practical, prioritised action plan and verify effectiveness." },
  { title: "Operational go-live", body: "Final readiness checks so you can begin licensed operations with confidence." },
];

export default function SiteReadinessPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "Site Readiness for MIA & WDA Licensing",
            description: service.metaDescription,
            path: service.href,
          }),
          faqSchema(faqsSiteReadiness),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Site Readiness", path: service.href },
          ]),
        ]}
      />

      <Hero
        image={{
          src: "/hero-site-readiness.webp",
          alt: "Pharmaceutical site prepared for an MHRA MIA/WDA licensing inspection",
        }}
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Site Readiness" },
        ]}
        eyebrow="Site Readiness (MIA / WDA)"
        title={
          <>
            Get your site{" "}
            <em className="font-display italic text-teal-ink">licence &amp; inspection ready</em>
          </>
        }
        subtitle="From a first MIA/WDA application to operational go-live — gap assessment, remediation, mock inspection and team preparation so you pass and start licensed operations on time."
        primary={{ label: "Plan your licensing", href: "/contact" }}
        secondary={{ label: "All services", href: "/services" }}
        chips={["MIA · MIA(IMP) · WDA(H)", "Mock pre-licensing inspection", "QP / RP / RPi support"]}
      />

      <Pillars />

      <FeatureGrid
        eyebrow="What we cover"
        title="Everything between application and go-live"
        intro="A clear path to a licensed, inspection-ready site."
        items={scope}
        bg="surface"
      />

      <ComplianceTable />

      <Methodology tone="dark" />
      <Benefits eyebrow="Why partner with us" title="An inspector's eye on your readiness" />
      <FAQ faqs={faqsSiteReadiness} bg="surface" />
      <RelatedServices currentSlug="site-readiness" />
      <CTABand
        title="Preparing for an MIA or WDA?"
        subtitle="Tell us your target licence, site and timeline and we'll map the fastest route to inspection-ready."
        primary={{ label: "Plan your licensing", href: "/contact" }}
      />
    </>
  );
}
