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
import { pageMeta } from "@/lib/seo";
import { faqsSupplier, getService } from "@/lib/site";

const service = getService("supplier-management")!;

export const metadata: Metadata = pageMeta({
  title: service.metaTitle,
  description: service.metaDescription,
  path: service.href,
});

const programme = [
  { title: "Risk-based qualification", body: "Criticality assessment, questionnaires and document review to qualify new suppliers proportionately to risk." },
  { title: "Supplier & third-party audits", body: "On-site or remote audits of API and excipient makers, CMOs, packaging, labs and logistics providers." },
  { title: "Technical / quality agreements", body: "Clear QTAs that define quality responsibilities, aligned to EU GMP Chapter 7." },
  { title: "Ongoing performance oversight", body: "KPIs, complaint and deviation trending, with escalation when a supplier drifts out of spec." },
  { title: "Re-qualification cycle", body: "A defined, risk-based schedule that keeps your supplier approvals current." },
  { title: "Supply-chain mapping", body: "Document the full chain so risks, single points of failure and dependencies are visible." },
];

export default function SupplierManagementPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "Supplier & Vendor Quality Management",
            description: service.metaDescription,
            path: service.href,
          }),
          faqSchema(faqsSupplier),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Supplier & Vendor Management", path: service.href },
          ]),
        ]}
      />

      <Hero
        image={{
          src: "/hero-supplier-management.webp",
          alt: "Pharmaceutical supplier qualification and quality oversight",
        }}
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Supplier & Vendor Management" },
        ]}
        eyebrow="Supplier & Vendor Management"
        title={
          <>
            Supplier quality you can{" "}
            <em className="font-display italic text-teal-ink">actually rely on</em>
          </>
        }
        subtitle="Risk-based GxP supplier qualification, technical/quality agreements and ongoing oversight — so every link in your supply chain stays compliant and audit-ready."
        primary={{ label: "Strengthen your supply chain", href: "/contact" }}
        secondary={{ label: "All services", href: "/services" }}
        chips={["Risk-based qualification", "QTAs (GMP Ch. 7)", "Audit programmes"]}
      />

      <Pillars />

      <FeatureGrid
        eyebrow="What we cover"
        title="A complete supplier-management programme"
        intro="Qualify, agree, audit and monitor — proportionate to risk."
        items={programme}
        bg="surface"
      />

      <ComplianceTable />

      <Methodology tone="dark" />
      <Benefits eyebrow="Why partner with us" title="Supply-chain assurance, end to end" />
      <FAQ faqs={faqsSupplier} bg="surface" />
      <RelatedServices currentSlug="supplier-management" />
      <CTABand
        title="Need stronger supplier oversight?"
        subtitle="Tell us about your suppliers and CMOs and we'll propose a risk-based qualification and audit programme."
        primary={{ label: "Strengthen your supply chain", href: "/contact" }}
      />
    </>
  );
}
