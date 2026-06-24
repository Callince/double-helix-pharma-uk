import type { MetadataRoute } from "next";
import { site, servicePages } from "@/lib/site";
import { listPublishedPosts, listPublishedCaseStudies } from "@/lib/db/content";

// Generate per-request so the sitemap always reflects currently-published content
// (drafting/publishing posts updates it without a rebuild).
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entry = (
    route: string,
    priority: number,
    changeFrequency: "monthly" | "yearly" = "monthly",
  ) => ({ url: `${site.url}${route}`, lastModified: now, changeFrequency, priority });

  let posts: { slug: string; updated_at: string }[] = [];
  let caseStudies: { slug: string; updated_at: string }[] = [];
  try {
    posts = await listPublishedPosts();
  } catch {
    /* DB unavailable — sitemap still lists static routes */
  }
  try {
    caseStudies = await listPublishedCaseStudies();
  } catch {
    /* DB unavailable — sitemap still lists static routes */
  }

  return [
    entry("/", 1),
    entry("/services", 0.9),
    ...servicePages.map((s) => entry(s.href, 0.8)),
    entry("/blog", 0.7),
    ...posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at || now),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...(caseStudies.length
      ? [
          entry("/case-studies", 0.7),
          ...caseStudies.map((c) => ({
            url: `${site.url}/case-studies/${c.slug}`,
            lastModified: new Date(c.updated_at || now),
            changeFrequency: "monthly" as const,
            priority: 0.5,
          })),
        ]
      : []),
    entry("/about", 0.7),
    entry("/contact", 0.7),
    entry("/faq", 0.6),
    entry("/resources", 0.6),
    entry("/resources/gmp-inspection-readiness-checklist", 0.7),
    entry("/privacy", 0.2, "yearly"),
    entry("/terms", 0.2, "yearly"),
  ];
}
