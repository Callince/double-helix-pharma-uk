import Link from "next/link";
import { Hero } from "@/components/sections/Hero";
import { Container } from "@/components/ui/Container";
import { CTABand } from "@/components/sections/CTABand";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { listPublishedPosts, type Post } from "@/lib/db/content";

export const metadata = pageMeta({
  title: "Blog — Pharma Quality & Compliance",
  description: "Practical guidance on GMP/GDP audits, Qualified Person duties, quality systems, inspections and pharmaceutical compliance.",
  path: "/blog",
});
export const dynamic = "force-dynamic";

const PER_PAGE = 9;
const catSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string; category?: string }> }) {
  const sp = await searchParams;
  const all = await listPublishedPosts().catch(() => [] as Post[]);

  // Category chips (distinct categories with counts)
  const catMap = new Map<string, { name: string; slug: string; count: number }>();
  for (const p of all) {
    const name = p.category || "General";
    const slug = catSlug(name);
    const e = catMap.get(slug) || { name, slug, count: 0 };
    e.count++;
    catMap.set(slug, e);
  }
  const categories = [...catMap.values()].sort((a, b) => b.count - a.count);

  const activeCat = sp?.category ? catSlug(sp.category) : "";
  const posts = activeCat ? all.filter((p) => catSlug(p.category || "General") === activeCat) : all;

  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const current = Math.min(Math.max(1, Number.parseInt(String(sp?.page ?? "1"), 10) || 1), totalPages);
  const pagePosts = posts.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const hrefFor = (cat: string, n: number) => {
    const q = new URLSearchParams();
    if (cat) q.set("category", cat);
    if (n > 1) q.set("page", String(n));
    const s = q.toString();
    return s ? `/blog?${s}` : "/blog";
  };
  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${active ? "border-teal bg-teal/10 text-teal-ink" : "border-line text-navy hover:border-teal/50 hover:bg-surface"}`;

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])} />
      <Hero
        image={{ src: "/hero-blog.webp", alt: "Pharmaceutical quality and compliance insights" }}
        breadcrumb={[{ name: "Home", href: "/" }, { name: "Blog" }]}
        eyebrow="Blog"
        title={<>Practical pharma <em className="font-display italic text-teal-ink">quality &amp; compliance</em></>}
        subtitle="Field-tested guidance on audits, Qualified Person duties, quality systems and inspection readiness — written by a senior QP."
        primary={{ label: "Book a discovery call", href: "/contact" }}
        secondary={{ label: "All services", href: "/services" }}
      />

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          {/* Category filter */}
          {categories.length > 1 && (
            <div className="mb-10 flex flex-wrap justify-center gap-2.5">
              <Link href={hrefFor("", 1)} className={chip(!activeCat)}>All <span className="text-muted">({all.length})</span></Link>
              {categories.map((c) => (
                <Link key={c.slug} href={hrefFor(c.slug, 1)} className={chip(activeCat === c.slug)}>
                  {c.name} <span className="text-muted">({c.count})</span>
                </Link>
              ))}
            </div>
          )}

          {pagePosts.length === 0 ? (
            <p className="rounded-2xl border border-line bg-surface p-10 text-center text-muted">
              No articles in this category yet — check back soon.
            </p>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pagePosts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/blog/${p.slug}`}
                    className="group flex flex-col rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-[0_26px_55px_-30px_rgba(6,41,92,0.5)]"
                  >
                    {p.cover_image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.cover_image} alt="" className="mb-4 aspect-[16/9] w-full rounded-lg border border-line object-cover" />
                    )}
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

              {totalPages > 1 && (
                <nav className="mt-14 flex flex-wrap items-center justify-center gap-2" aria-label="Blog pagination">
                  {current > 1 && (
                    <Link href={hrefFor(activeCat, current - 1)} rel="prev" className="rounded-lg border border-line px-3.5 py-2 text-sm font-medium text-navy transition-colors hover:bg-surface">Previous</Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <Link
                      key={n}
                      href={hrefFor(activeCat, n)}
                      aria-current={n === current ? "page" : undefined}
                      className={`grid size-10 place-items-center rounded-lg border text-sm font-medium transition-colors ${n === current ? "border-teal bg-teal/10 text-teal-ink" : "border-line text-navy hover:bg-surface"}`}
                    >
                      {n}
                    </Link>
                  ))}
                  {current < totalPages && (
                    <Link href={hrefFor(activeCat, current + 1)} rel="next" className="rounded-lg border border-line px-3.5 py-2 text-sm font-medium text-navy transition-colors hover:bg-surface">Next</Link>
                  )}
                </nav>
              )}
            </>
          )}
        </Container>
      </section>

      <CTABand />
    </>
  );
}
