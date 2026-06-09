import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CTABand } from "@/components/sections/CTABand";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { getPostBySlug, listPublishedPosts, type Post } from "@/lib/db/content";
import { processArticle } from "@/lib/blog/toc";

export const dynamic = "force-dynamic";

function parseFaqs(json: string | null): { q: string; a: string }[] {
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.filter((f) => f && f.q && f.a) : [];
  } catch {
    return [];
  }
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post || post.status !== "published") return { title: "Article not found", robots: { index: false } };
  return pageMeta({
    title: post.title,
    description: post.excerpt || post.title,
    path: `/blog/${post.slug}`,
    image: post.cover_image || undefined,
    type: "article",
    publishedTime: post.created_at,
    modifiedTime: post.updated_at,
    authors: post.author ? [post.author] : undefined,
    section: post.category || undefined,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post || post.status !== "published") notFound();

  const { html, toc } = processArticle(post.body);
  const faqs = parseFaqs(post.faqs);
  const published = fmtDate(post.created_at);
  const updated = fmtDate(post.updated_at);

  const all = await listPublishedPosts().catch(() => [] as Post[]);
  const others = all.filter((p) => p.slug !== post.slug);
  const sameCat = others.filter((p) => p.category && p.category === post.category);
  const related = (sameCat.length ? sameCat : others).slice(0, 3);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.cover_image ? [`${site.url}${post.cover_image}`] : undefined,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: post.author || site.founder.name, worksFor: { "@type": "Organization", name: site.name } },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/logo-web.webp` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${site.url}/blog/${post.slug}` },
    articleSection: post.category || undefined,
    wordCount: html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length,
    inLanguage: "en-GB",
  };

  const ld = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
    articleLd,
    ...(faqs.length ? [faqSchema(faqs)] : []),
  ];

  return (
    <>
      <JsonLd data={ld} />

      <article>
        <header className="border-b border-line bg-hero-light">
          <Container size="narrow">
            <div className="py-14 sm:py-20">
              <Link href="/blog" className="label-mono text-muted transition-colors hover:text-teal-ink">&larr; Blog</Link>
              <p className="label-mono mt-6 text-teal-ink">{post.category || "Article"} · {post.reading_minutes} min read</p>
              <h1 className="mt-4 font-display text-[2.3rem] font-medium leading-[1.1] tracking-[-0.02em] text-navy sm:text-[2.9rem]">
                {post.title}
              </h1>
              {post.excerpt && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/80">{post.excerpt}</p>}
              <p className="mt-6 text-sm text-muted">
                By {post.author} · {published}
                {updated !== published ? ` · Updated ${updated}` : ""}
              </p>
            </div>
          </Container>
        </header>

        {post.cover_image && (
          <Container size="narrow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image}
              alt={post.title}
              className="-mt-8 aspect-[16/7] w-full rounded-2xl border border-line object-cover shadow-sm sm:-mt-12"
            />
          </Container>
        )}

        <section className="bg-white py-12 sm:py-16">
          <Container>
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_15rem]">
              {/* Article */}
              <div className="min-w-0">
                <div
                  className="legal-prose text-[1.02rem] leading-relaxed text-ink"
                  dangerouslySetInnerHTML={{ __html: html }}
                />

                {faqs.length > 0 && (
                  <section className="mt-14" aria-labelledby="faq-heading">
                    <h2 id="faq-heading" className="font-display text-2xl font-medium text-navy">Frequently asked questions</h2>
                    <div className="mt-6 overflow-hidden rounded-2xl border border-line">
                      {faqs.map((f, i) => (
                        <details key={i} className="group border-b border-line last:border-0 [&_summary::-webkit-details-marker]:hidden">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-navy hover:bg-surface/60">
                            {f.q}
                            <span className="shrink-0 text-xl leading-none text-teal-ink transition-transform group-open:rotate-45">+</span>
                          </summary>
                          <p className="px-5 pb-5 text-[0.98rem] leading-relaxed text-ink/85">{f.a}</p>
                        </details>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Sticky table of contents */}
              {toc.length > 0 && (
                <aside className="hidden lg:block">
                  <div className="sticky top-24">
                    <p className="label-mono text-muted">On this page</p>
                    <nav className="mt-4 border-l border-line">
                      {toc.map((t) => (
                        <a
                          key={t.id}
                          href={`#${t.id}`}
                          className={`-ml-px block border-l-2 border-transparent py-1 text-sm text-muted transition-colors hover:border-teal hover:text-teal-ink ${t.level === 3 ? "pl-7" : "pl-4"}`}
                        >
                          {t.text}
                        </a>
                      ))}
                      {faqs.length > 0 && (
                        <a href="#faq-heading" className="-ml-px block border-l-2 border-transparent py-1 pl-4 text-sm text-muted transition-colors hover:border-teal hover:text-teal-ink">
                          FAQs
                        </a>
                      )}
                    </nav>
                  </div>
                </aside>
              )}
            </div>
          </Container>
        </section>

        {related.length > 0 && (
          <section className="border-t border-line bg-surface py-14">
            <Container>
              <h2 className="font-display text-2xl font-medium text-navy">Related reading</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/blog/${r.slug}`}
                    className="group rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-[0_26px_55px_-30px_rgba(6,41,92,0.5)]"
                  >
                    <span className="label-mono text-teal-ink">{r.category || "Article"}</span>
                    <h3 className="mt-2 font-display text-lg font-medium leading-snug text-navy transition-colors group-hover:text-teal-ink">
                      {r.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        )}
      </article>

      <CTABand />
    </>
  );
}
