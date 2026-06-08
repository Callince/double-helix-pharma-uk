import { Hero } from "@/components/sections/Hero";
import { Container } from "@/components/ui/Container";
import { Disclosure } from "@/components/ui/Disclosure";
import { CTABand } from "@/components/sections/CTABand";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { listPublishedFaqs, type Faq } from "@/lib/db/content";

export const metadata = pageMeta({
  title: "Frequently Asked Questions",
  description:
    "Answers on GMP/GDP audits, contract QP/RP/RPi cover, QMS implementation, site readiness, supplier management and GDP distribution compliance.",
  path: "/faq",
});
export const dynamic = "force-dynamic";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default async function FaqPage() {
  const faqs = await listPublishedFaqs().catch(() => [] as Faq[]);

  const groups: { category: string; items: Faq[] }[] = [];
  for (const f of faqs) {
    const cat = f.category || "General";
    let g = groups.find((x) => x.category === cat);
    if (!g) { g = { category: cat, items: [] }; groups.push(g); }
    g.items.push(f);
  }

  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs.map((f) => ({ q: f.question, a: f.answer }))),
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]),
        ]}
      />

      <Hero
        breadcrumb={[{ name: "Home", href: "/" }, { name: "FAQ" }]}
        eyebrow="FAQ"
        title={<>Frequently asked <em className="font-display italic text-teal-ink">questions</em></>}
        subtitle="Straight answers on audits, Qualified Person cover, quality systems and distribution compliance. Can't find what you need? Get in touch."
        primary={{ label: "Ask a question", href: "/contact" }}
        secondary={{ label: "All services", href: "/services" }}
      />

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <Container size="narrow">
          {groups.length === 0 ? (
            <p className="rounded-2xl border border-line bg-surface p-10 text-center text-muted">No questions published yet.</p>
          ) : (
            <>
              <nav aria-label="FAQ categories" className="flex flex-wrap gap-2 border-b border-line pb-8">
                {groups.map((g) => (
                  <a key={g.category} href={`#${slug(g.category)}`}
                    className="rounded-full border border-line bg-surface px-4 py-1.5 text-sm text-navy transition-colors hover:border-teal hover:text-teal-ink">
                    {g.category}
                  </a>
                ))}
              </nav>
              <div className="mt-12 space-y-14">
                {groups.map((g) => (
                  <div key={g.category} id={slug(g.category)} className="scroll-mt-24">
                    <h2 className="label-mono text-teal-ink">{g.category}</h2>
                    <div data-reveal-group className="mt-5">
                      {g.items.map((f) => <Disclosure key={f.id} question={f.question} answer={f.answer} />)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Container>
      </section>

      <CTABand
        title="Still have a question?"
        subtitle="Tell us about your site, supplier or upcoming inspection and we'll point you in the right direction."
        primary={{ label: "Book a discovery call", href: "/contact" }}
      />
    </>
  );
}
