import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { Methodology } from "@/components/sections/Methodology";
import { Benefits } from "@/components/sections/Benefits";
import { FAQ } from "@/components/sections/FAQ";
import { RelatedServices } from "@/components/sections/RelatedServices";
import { CTABand } from "@/components/sections/CTABand";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { faqsQms, getService } from "@/lib/site";

const service = getService("qms-implementation")!;

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

const buildItems = [
  { title: "Pharmaceutical Quality System (ICH Q10)", body: "Design and implement a right-sized PQS that satisfies EU GMP and ICH Q10." },
  { title: "SOPs, SMF, VMP & VPP", body: "Core quality documentation — Site Master File, Validation Master Plan and procedures." },
  { title: "Deviation, CAPA & change control", body: "Risk-based systems that keep issues controlled, investigated and closed." },
  { title: "OOS / OOT / OOC handling", body: "Robust laboratory investigation processes aligned to regulatory expectations." },
  { title: "Self-inspection programme", body: "An audit schedule and process that keeps you continuously inspection-ready." },
  { title: "Equipment & utility qualification", body: "URS, DQ, IQ, OQ and PQ protocols and reports for facilities and equipment." },
  { title: "Quality / technical agreements (QTA)", body: "Clear responsibility matrices with your CMOs, suppliers and partners." },
  { title: "Product Quality Reviews (PQR)", body: "Annual product reviews and quality metrics that demonstrate control." },
];

export default function QmsImplementationPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "QMS & PQS Implementation",
            description: service.metaDescription,
            path: service.href,
          }),
          faqSchema(faqsQms),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "QMS & PQS Implementation", path: service.href },
          ]),
        ]}
      />

      <Hero
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/#services" },
          { name: "QMS & PQS Implementation" },
        ]}
        eyebrow="QMS & PQS Implementation"
        title={
          <>
            Build, remediate and embed a quality system{" "}
            <em className="font-display italic text-teal-ink">that holds up</em>
          </>
        }
        subtitle="From a first MIA/WDA to post-inspection remediation — practical Pharmaceutical Quality Systems aligned to ICH Q10, built to be lived by your team, not just filed."
        primary={{ label: "Plan your QMS", href: "/contact" }}
        secondary={{ label: "All services", href: "/#services" }}
        chips={["ICH Q10 aligned", "Inspection remediation", "SOPs to qualification"]}
      />

      <FeatureGrid
        eyebrow="What we build"
        title="A complete, inspection-ready quality system"
        intro="Implemented from scratch or remediated where you already have gaps."
        items={buildItems}
        bg="surface"
      />

      <Methodology tone="dark" />
      <Benefits eyebrow="Why it works" title="Systems that survive contact with the real world" />
      <FAQ faqs={faqsQms} />
      <RelatedServices currentSlug="qms-implementation" />
      <CTABand
        title="Build a quality system that lasts"
        subtitle="Whether you're starting fresh or recovering from findings, let's map the fastest route to compliance."
        primary={{ label: "Plan your QMS", href: "/contact" }}
      />
    </>
  );
}
