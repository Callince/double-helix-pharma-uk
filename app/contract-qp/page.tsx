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
import { faqsContractQp, getService } from "@/lib/site";

const service = getService("contract-qp")!;

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

const roles = [
  {
    title: "Qualified Person (QP)",
    body: "Certification and release of medicinal product batches under your Manufacturing/Import Authorisation (MIA / MIA(IMP)).",
  },
  {
    title: "Responsible Person (RP)",
    body: "Oversight of GDP compliance for wholesale distribution under a Wholesale Dealer's Authorisation (WDA(H)).",
  },
  {
    title: "RP for import (RPi)",
    body: "The named role overseeing importation of medicines into Great Britain from approved countries.",
  },
];

const coverage = [
  { title: "Batch certification & release", body: "Disposition decisions for sterile, oncology, biosimilar and solid-oral-dose products." },
  { title: "Interim & ongoing cover", body: "Short-term cover during recruitment or absence, or a standing named-person arrangement." },
  { title: "CMO & supplier oversight", body: "Technical/quality agreements (QTA), supplier qualification and ongoing performance review." },
  { title: "Importation oversight", body: "RPi duties, confirmation of QP certification and import documentation review." },
  { title: "Deviation & release support", body: "Risk-based handling of deviations, OOS/OOT and complaints affecting release." },
  { title: "Eligibility & gap checks", body: "An honest assessment of scope, eligibility and what's needed before we start." },
];

export default function ContractQpPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "Contract QP, RP & RPi Services",
            description: service.metaDescription,
            path: service.href,
          }),
          faqSchema(faqsContractQp),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contract QP, RP & RPi", path: service.href },
          ]),
        ]}
      />

      <Hero
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/#services" },
          { name: "Contract QP, RP & RPi" },
        ]}
        eyebrow="Contract QP, RP & RPi"
        title={
          <>
            Contract Qualified Person &amp;{" "}
            <em className="font-display italic text-teal-ink">Responsible Person</em> cover
          </>
        }
        subtitle="Named QP, RP and RPi support for UK and EU operations — from interim cover to an ongoing arrangement, backed by 20+ years of batch release and inspection experience."
        primary={{ label: "Discuss your requirements", href: "/contact" }}
        secondary={{ label: "All services", href: "/#services" }}
        chips={["Batch certification & release", "WDA & import (RPi)", "Interim or ongoing"]}
      />

      <FeatureGrid
        eyebrow="The roles explained"
        title="QP, RP and RPi — what's the difference?"
        intro="Three distinct regulatory roles. We can provide cover for each, individually or combined."
        items={roles}
        bg="surface"
      />

      <FeatureGrid
        eyebrow="What's covered"
        title="End-to-end release and distribution assurance"
        items={coverage}
      />

      <Methodology />
      <Benefits
        eyebrow="Why work with us"
        title="Senior cover you can rely on"
      />
      <FAQ faqs={faqsContractQp} bg="surface" />
      <RelatedServices currentSlug="contract-qp" />
      <CTABand
        title="Need QP, RP or RPi cover?"
        subtitle="Tell us about your authorisation, products and timelines and we'll confirm scope and eligibility."
        primary={{ label: "Discuss your requirements", href: "/contact" }}
      />
    </>
  );
}
