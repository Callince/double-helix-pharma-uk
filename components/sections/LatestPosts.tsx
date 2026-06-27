import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { listPublishedPosts, type Post } from "@/lib/db/content";

/** Landing-page "latest 3 blog posts" strip. Server component — pulls the newest
 *  published posts; renders nothing if there are none (so the page never breaks). */
export async function LatestPosts() {
  const all = await listPublishedPosts().catch(() => [] as Post[]);
  const posts = all.slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="bg-surface py-20 sm:py-28 lg:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Insights"
            title="Latest from the blog"
            intro="Practical, field-tested guidance on audits, QP duties, quality systems and inspection readiness."
            maxW="max-w-2xl"
          />
          <Link
            href="/blog"
            className="label-mono inline-flex items-center gap-2 text-teal-ink transition-colors hover:text-navy"
          >
            All articles
            <Icon name="arrow-right" className="size-4" />
          </Link>
        </div>

        <div data-reveal-group className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line/70 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan/40 hover:shadow-float"
            >
              {p.cover_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.cover_image}
                  alt={p.cover_alt || p.title}
                  className="aspect-[16/9] w-full object-cover"
                />
              ) : (
                <div aria-hidden className="aspect-[16/9] w-full bg-brand-gradient opacity-90" />
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2">
                  <span className="label-mono text-teal-ink">{p.category || "Article"}</span>
                  <span className="text-xs text-muted">· {p.reading_minutes} min</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-medium leading-snug text-navy transition-colors group-hover:text-teal-ink">
                  {p.title}
                </h3>
                <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{p.excerpt}</p>
                <span className="label-mono mt-5 inline-flex items-center gap-2 text-teal-ink">
                  Read more
                  <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
