import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Pillars } from "@/components/sections/Pillars";
import { Methodology } from "@/components/sections/Methodology";
import { Benefits } from "@/components/sections/Benefits";
import { FAQ } from "@/components/sections/FAQ";
import { CTABand } from "@/components/sections/CTABand";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { site, services, faqsHome, ctaHref, ctaLabel } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "GMP Audits, QP & QMS Services",
  description:
    "Pharmaceutical quality & compliance services — GMP/GDP audits, contract QP/RP/RPi cover, QMS implementation, site readiness, supplier and GDP compliance.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Pharmaceutical quality & compliance services",
            itemListElement: services.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: s.title,
              url: `${site.url}${s.href}`,
            })),
          },
          faqSchema(faqsHome),
        ]}
      />

      <Hero
        image={{
          src: "/hero-pharma.webp",
          alt: "Pharmaceutical quality and compliance consulting — Double Helix Pharma UK",
        }}
        breadcrumb={[{ name: "Home", href: "/" }, { name: "Services" }]}
        eyebrow="Services"
        title={
          <>
            Quality &amp; compliance,{" "}
            <em className="font-display italic text-teal-ink">end to end</em>
          </>
        }
        subtitle="Six focused services — from independent GMP/GDP audits and contract QP/RP/RPi cover to quality-system builds, site licensing and GDP distribution — delivered by one senior Qualified Person with 20+ years across regulated markets."
        primary={{ label: ctaLabel, href: ctaHref }}
        secondary={{ label: "Meet the consultant", href: "/about" }}
        chips={["Remote · on-site · hybrid", "UK · EU · US · MENA", "One senior expert"]}
      />

      <section className="bg-white py-20 sm:py-28 lg:py-32">
        <Container>
          <SectionHeading
            split
            eyebrow="What we do"
            title="A complete quality & compliance toolkit"
            intro="Engage a single service or combine several into an ongoing compliance partnership — each one scaled to your stage, market and budget."
          />
          <div className="mt-14">
            <ServiceGrid />
          </div>
        </Container>
      </section>

      <Pillars />
      <Methodology tone="dark" />
      <Benefits />
      <FAQ faqs={faqsHome} bg="surface" />
      <CTABand />
    </>
  );
}
