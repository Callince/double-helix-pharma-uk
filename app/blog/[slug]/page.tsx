import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CTABand } from "@/components/sections/CTABand";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { getPostBySlug } from "@/lib/db/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post || post.status !== "published") return { title: "Article not found", robots: { index: false } };
  return pageMeta({ title: post.title, description: post.excerpt || post.title, path: `/blog/${post.slug}` });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post || post.status !== "published") notFound();

  const date = new Date(post.created_at).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.created_at,
            dateModified: post.updated_at,
            author: { "@type": "Person", name: post.author },
            publisher: { "@type": "Organization", name: site.name },
            mainEntityOfPage: `${site.url}/blog/${post.slug}`,
          },
        ]}
      />

      <article>
        <header className="border-b border-line bg-hero-light">
          <Container size="narrow">
            <div className="py-14 sm:py-20">
              <Link href="/blog" className="label-mono text-muted transition-colors hover:text-teal-ink">
                &larr; Blog
              </Link>
              <p className="label-mono mt-6 text-teal-ink">
                {post.category || "Article"} · {post.reading_minutes} min read
              </p>
              <h1 className="mt-4 font-display text-[2.3rem] font-medium leading-[1.1] tracking-[-0.02em] text-navy sm:text-[2.9rem]">
                {post.title}
              </h1>
              {post.excerpt && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/80">{post.excerpt}</p>}
              <p className="mt-6 text-sm text-muted">By {post.author} · {date}</p>
            </div>
          </Container>
        </header>

        <section className="bg-white py-12 sm:py-16">
          <Container size="narrow">
            <div
              className="legal-prose text-[1.02rem] leading-relaxed text-ink"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          </Container>
        </section>
      </article>

      <CTABand />
    </>
  );
}
