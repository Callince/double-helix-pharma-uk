import Link from "next/link";
import { Hero } from "@/components/sections/Hero";
import { Container } from "@/components/ui/Container";
import { CTABand } from "@/components/sections/CTABand";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { listPublishedPosts } from "@/lib/db/content";

export const metadata = pageMeta({
  title: "Blog — Pharma Quality & Compliance",
  description: "Practical guidance on GMP/GDP audits, Qualified Person duties, quality systems, inspections and pharmaceutical compliance.",
  path: "/blog",
});
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await listPublishedPosts().catch(() => []);
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])} />
      <Hero
        breadcrumb={[{ name: "Home", href: "/" }, { name: "Blog" }]}
        eyebrow="Blog"
        title={<>Practical pharma <em className="font-display italic text-teal-ink">quality &amp; compliance</em></>}
        subtitle="Field-tested guidance on audits, Qualified Person duties, quality systems and inspection readiness — written by a senior QP."
        primary={{ label: "Book a discovery call", href: "/contact" }}
        secondary={{ label: "All services", href: "/services" }}
      />

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          {posts.length === 0 ? (
            <p className="rounded-2xl border border-line bg-surface p-10 text-center text-muted">
              No articles published yet — check back soon.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-[0_26px_55px_-30px_rgba(6,41,92,0.5)]"
                >
                  <div className="flex items-center gap-2">
                    <span className="label-mono text-teal-ink">{p.category || "Article"}</span>
                    <span className="text-xs text-muted">· {p.reading_minutes} min</span>
                  </div>
                  <h2 className="mt-3 font-display text-xl font-medium leading-snug text-navy transition-colors group-hover:text-teal-ink">
                    {p.title}
                  </h2>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">{p.excerpt}</p>
                  <span className="label-mono mt-6 inline-flex items-center gap-2 text-teal-ink">
                    Read more
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
