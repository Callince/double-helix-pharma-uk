import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CTABand } from "@/components/sections/CTABand";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema, caseStudySchema } from "@/lib/schema";
import { getCaseStudyBySlug } from "@/lib/db/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug).catch(() => null);
  if (!cs || cs.status !== "published") return { title: "Case study not found", robots: { index: false } };
  return pageMeta({ title: cs.title, description: cs.summary || cs.title, path: `/case-studies/${cs.slug}` });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug).catch(() => null);
  if (!cs || cs.status !== "published") notFound();

  const sections = [
    { label: "Challenge", body: cs.challenge },
    { label: "Approach", body: cs.approach },
    { label: "Outcome", body: cs.outcome },
  ].filter((s) => s.body && s.body.trim());

  return (
    <>
      <JsonLd
        data={[
          caseStudySchema({
            title: cs.title,
            description: cs.summary,
            sector: cs.sector,
            path: `/case-studies/${cs.slug}`,
            dateModified: cs.updated_at,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Case Studies", path: "/case-studies" },
            { name: cs.title, path: `/case-studies/${cs.slug}` },
          ]),
        ]}
      />

      <article>
        <header className="border-b border-line bg-hero-light">
          <Container size="narrow">
            <div className="py-14 sm:py-20">
              <Link href="/case-studies" className="label-mono text-muted transition-colors hover:text-teal-ink">
                &larr; Case Studies
              </Link>
              {cs.sector && <p className="label-mono mt-6 text-teal-ink">{cs.sector}</p>}
              <h1 className="mt-4 font-display text-[2.3rem] font-medium leading-[1.1] tracking-[-0.02em] text-navy sm:text-[2.9rem]">
                {cs.title}
              </h1>
              {cs.summary && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/80">{cs.summary}</p>}
            </div>
          </Container>
        </header>

        <section className="bg-white py-12 sm:py-16">
          <Container size="narrow">
            <div className="space-y-10">
              {sections.map((s) => (
                <div key={s.label}>
                  <h2 className="label-mono text-teal-ink">{s.label}</h2>
                  <div className="mt-3 space-y-4 text-[1.02rem] leading-relaxed text-ink/85">
                    {s.body!.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </article>

      <CTABand />
    </>
  );
}
