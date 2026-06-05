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
import { faqsGdp, getService } from "@/lib/site";

const service = getService("gdp-supply-chain")!;

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
  { title: "Transport validation", body: "Qualify routes, lanes, packaging and vehicles so products stay within their required conditions." },
  { title: "Cold-chain & temperature mapping", body: "Mapping and qualification of stores and shipping for refrigerated and frozen products." },
  { title: "GDP gap assessments", body: "Benchmark distribution against EU GDP (2013/C 343/01) and MHRA expectations." },
  { title: "WDA & RP / RPi support", body: "Responsible Person duties and wholesale-dealer compliance under your WDA(H)." },
  { title: "Excursion & deviation management", body: "Root-cause investigation and product-impact assessment for temperature excursions." },
  { title: "Supply-chain risk", body: "Identify and mitigate distribution risks across the end-to-end chain." },
];

export default function GdpSupplyChainPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "GDP Transport & Supply Chain Compliance",
            description: service.metaDescription,
            path: service.href,
          }),
          faqSchema(faqsGdp),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "GDP Transport & Supply Chain", path: service.href },
          ]),
        ]}
      />

      <Hero
        image={{
          src: "/hero-gdp-supply-chain.jpg",
          alt: "Temperature-controlled pharmaceutical distribution and cold-chain logistics",
        }}
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/#services" },
          { name: "GDP Transport & Supply Chain" },
        ]}
        eyebrow="GDP Transport & Supply Chain"
        title={
          <>
            Keep every shipment{" "}
            <em className="font-display italic text-teal-ink">compliant &amp; in-spec</em>
          </>
        }
        subtitle="Transport validation, cold-chain assurance and distribution compliance to EU GDP — so your products reach patients within specification, every time."
        primary={{ label: "Secure your distribution", href: "/contact" }}
        secondary={{ label: "All services", href: "/#services" }}
        chips={["Transport validation", "Cold-chain mapping", "EU GDP 2013/C 343/01"]}
      />

      <FeatureGrid
        eyebrow="What we cover"
        title="End-to-end distribution compliance"
        intro="From the loading bay to the patient — validated and controlled."
        items={scope}
        bg="surface"
      />

      <Methodology />
      <Benefits eyebrow="Why partner with us" title="Distribution you can defend in an inspection" />
      <FAQ faqs={faqsGdp} bg="surface" />
      <RelatedServices currentSlug="gdp-supply-chain" />
      <CTABand
        title="Need GDP or cold-chain support?"
        subtitle="Tell us about your routes, products and temperature requirements and we'll propose a validation and compliance plan."
        primary={{ label: "Secure your distribution", href: "/contact" }}
      />
    </>
  );
}
