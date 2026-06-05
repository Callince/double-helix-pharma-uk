import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Container } from "@/components/ui/Container";
import { Disclosure } from "@/components/ui/Disclosure";
import { CTABand } from "@/components/sections/CTABand";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";
import {
  faqsHome,
  faqsGmp,
  faqsContractQp,
  faqsQms,
  faqsSiteReadiness,
  faqsSupplier,
  faqsGdp,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about GMP/GDP audits, contract QP/RP/RPi cover, QMS & PQS implementation, site readiness, supplier management and GDP distribution compliance.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ | Double Helix Pharma UK",
    description:
      "Straight answers on pharmaceutical audits, Qualified Person cover, quality systems and distribution compliance.",
    url: "/faq",
  },
};

const groups = [
  { id: "general", title: "General", faqs: faqsHome },
  { id: "audits", title: "GMP & GDP Audits", faqs: faqsGmp },
  { id: "contract-qp", title: "Contract QP, RP & RPi", faqs: faqsContractQp },
  { id: "qms", title: "QMS & PQS Implementation", faqs: faqsQms },
  { id: "site-readiness", title: "Site Readiness (MIA / WDA)", faqs: faqsSiteReadiness },
  { id: "supplier", title: "Supplier & Vendor Management", faqs: faqsSupplier },
  { id: "gdp", title: "GDP Transport & Supply Chain", faqs: faqsGdp },
];

const allFaqs = groups.flatMap((g) => g.faqs);

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(allFaqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
        ]}
      />

      <Hero
        breadcrumb={[{ name: "Home", href: "/" }, { name: "FAQ" }]}
        eyebrow="FAQ"
        title={
          <>
            Frequently asked{" "}
            <em className="font-display italic text-teal-ink">questions</em>
          </>
        }
        subtitle="Straight answers on audits, Qualified Person cover, quality systems and distribution compliance. Can't find what you need? Get in touch — you'll reach a senior expert directly."
        primary={{ label: "Ask a question", href: "/contact" }}
        secondary={{ label: "All services", href: "/services" }}
      />

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <Container size="narrow">
          <nav aria-label="FAQ categories" className="flex flex-wrap gap-2 border-b border-line pb-8">
            {groups.map((g) => (
              <a
                key={g.id}
                href={`#${g.id}`}
                className="rounded-full border border-line bg-surface px-4 py-1.5 text-sm text-navy transition-colors hover:border-teal hover:text-teal-ink"
              >
                {g.title}
              </a>
            ))}
          </nav>

          <div className="mt-12 space-y-14">
            {groups.map((g) => (
              <div key={g.id} id={g.id} className="scroll-mt-24">
                <h2 className="label-mono text-teal-ink">{g.title}</h2>
                <div data-reveal-group className="mt-5">
                  {g.faqs.map((f) => (
                    <Disclosure key={f.q} question={f.q} answer={f.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTABand
        title="Still have a question?"
        subtitle="Tell us about your site, supplier or upcoming inspection and we'll point you in the right direction — usually within one business day."
        primary={{ label: "Book a discovery call", href: "/contact" }}
      />
    </>
  );
}
