import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Pillars } from "@/components/sections/Pillars";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { ComplianceTable } from "@/components/sections/ComplianceTable";
import { Methodology } from "@/components/sections/Methodology";
import { Benefits } from "@/components/sections/Benefits";
import { FAQ } from "@/components/sections/FAQ";
import { RelatedServices } from "@/components/sections/RelatedServices";
import { CTABand } from "@/components/sections/CTABand";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { faqsGmp, getService } from "@/lib/site";

const service = getService("gmp-audit")!;

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

const auditTypes = [
  {
    title: "Supplier & third-party audits",
    body: "Qualify and monitor CMOs, API and material suppliers and service providers against your quality agreements.",
  },
  {
    title: "Internal & self-inspection",
    body: "Independent self-inspections that satisfy EU GMP Chapter 9 and GDP self-inspection expectations.",
  },
  {
    title: "Mock regulatory inspections",
    body: "Realistic MHRA/FDA-style dry runs that test readiness and rehearse your team before the real inspection.",
  },
  {
    title: "Pre-approval & for-cause audits",
    body: "Targeted assessments ahead of approval, or in response to a specific trigger, complaint or quality signal.",
  },
  {
    title: "GMP / GDP gap assessments",
    body: "Benchmark a site, supplier or system against the applicable GxP requirements and prioritise the gaps.",
  },
  {
    title: "Data-integrity reviews",
    body: "ALCOA+, EU Annex 11 and 21 CFR Part 11 assessment of records and computerised systems.",
  },
];

export default function GmpAuditPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "GMP & GDP Audit Consulting",
            description: service.metaDescription,
            path: service.href,
          }),
          faqSchema(faqsGmp),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "GMP & GDP Audits", path: service.href },
          ]),
        ]}
      />

      <Hero
        image={{
          src: "/hero-gmp-audit.webp",
          alt: "Pharmaceutical quality auditor inspecting a GMP manufacturing site",
        }}
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "GMP & GDP Audits" },
        ]}
        eyebrow="GMP & GDP Audit Consulting"
        title={
          <>
            Independent GMP &amp; GDP audits that{" "}
            <em className="font-display italic text-teal-ink">stand up to inspection</em>
          </>
        }
        subtitle="Supplier, internal and mock-regulatory audits delivered by an experienced GMP/GDP Lead Auditor — with clear, graded, regulation-mapped reports your team can act on immediately."
        primary={{ label: "Speak to a GMP expert", href: "/contact" }}
        secondary={{ label: "All services", href: "/services" }}
        chips={["Supplier & for-cause audits", "Remote, on-site or hybrid", "Graded, actionable reports"]}
      />

      <Pillars />

      <FeatureGrid
        eyebrow="Audit types"
        title="Every audit you're likely to need"
        intro="Across GMP and GDP, planned or triggered — scoped to your product, site and regulatory context."
        items={auditTypes}
        bg="surface"
      />

      <ComplianceTable />
      <Methodology tone="dark" />
      <Benefits
        eyebrow="Why these audits work"
        title="An inspector's eye, an operator's pragmatism"
      />
      <FAQ faqs={faqsGmp} bg="surface" />
      <RelatedServices currentSlug="gmp-audit" />
      <CTABand
        title="Book your GMP/GDP audit"
        subtitle="Tell us about your site, supplier or upcoming inspection and we'll propose a scope and timeline."
        primary={{ label: "Speak to a GMP expert", href: "/contact" }}
      />
    </>
  );
}
