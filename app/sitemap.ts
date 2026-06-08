import type { MetadataRoute } from "next";
import { site, servicePages } from "@/lib/site";
import { listPublishedPosts } from "@/lib/db/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entry = (
    route: string,
    priority: number,
    changeFrequency: "monthly" | "yearly" = "monthly",
  ) => ({ url: `${site.url}${route}`, lastModified: now, changeFrequency, priority });

  let posts: { slug: string; updated_at: string }[] = [];
  try {
    posts = await listPublishedPosts();
  } catch {
    /* DB unavailable — sitemap still lists static routes */
  }

  return [
    entry("/", 1),
    entry("/services", 0.9),
    ...servicePages.map((s) => entry(s.href, 0.8)),
    entry("/insights", 0.7),
    ...posts.map((p) => ({
      url: `${site.url}/insights/${p.slug}`,
      lastModified: new Date(p.updated_at || now),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    entry("/about", 0.7),
    entry("/contact", 0.7),
    entry("/faq", 0.6),
    entry("/privacy", 0.2, "yearly"),
    entry("/terms", 0.2, "yearly"),
  ];
}
