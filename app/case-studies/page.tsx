import Link from "next/link";
import { Hero } from "@/components/sections/Hero";
import { Container } from "@/components/ui/Container";
import { CTABand } from "@/components/sections/CTABand";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { listPublishedCaseStudies } from "@/lib/db/content";

export const metadata = pageMeta({
  title: "Case Studies — Pharma Quality & Compliance",
  description: "Anonymised examples of GMP/GDP audits, contract QP cover, quality systems and inspection-readiness engagements delivered by Double Helix Pharma.",
  path: "/case-studies",
});
export const dynamic = "force-dynamic";

export default async function CaseStudiesPage() {
  const studies = await listPublishedCaseStudies().catch(() => []);
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Case Studies", path: "/case-studies" }])} />
      <Hero
        breadcrumb={[{ name: "Home", href: "/" }, { name: "Case Studies" }]}
        eyebrow="Case Studies"
        title={<>Proven <em className="font-display italic text-teal-ink">compliance outcomes</em></>}
        subtitle="Anonymised examples of audits, contract QP cover and quality systems delivered for pharma, biotech and CMO clients."
        primary={{ label: "Book a discovery call", href: "/contact" }}
        secondary={{ label: "All services", href: "/services" }}
      />

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          {studies.length === 0 ? (
            <p className="rounded-2xl border border-line bg-surface p-10 text-center text-muted">
              No case studies published yet — check back soon.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {studies.map((c) => (
                <Link
                  key={c.id}
                  href={`/case-studies/${c.slug}`}
                  className="group flex flex-col rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-[0_26px_55px_-30px_rgba(6,41,92,0.5)]"
                >
                  {c.sector && <span className="label-mono text-teal-ink">{c.sector}</span>}
                  <h2 className="mt-3 font-display text-xl font-medium leading-snug text-navy transition-colors group-hover:text-teal-ink">
                    {c.title}
                  </h2>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">{c.summary}</p>
                  <span className="label-mono mt-6 inline-flex items-center gap-2 text-teal-ink">
                    Read case study
                    <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>

      <CTABand />
    </>
  );
}
