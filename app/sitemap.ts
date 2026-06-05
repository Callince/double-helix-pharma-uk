import type { MetadataRoute } from "next";
import { site, servicePages } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (
    route: string,
    priority: number,
    changeFrequency: "monthly" | "yearly" = "monthly",
  ) => ({ url: `${site.url}${route}`, lastModified: now, changeFrequency, priority });

  return [
    entry("/", 1),
    entry("/services", 0.9),
    ...servicePages.map((s) => entry(s.href, 0.8)),
    entry("/about", 0.7),
    entry("/contact", 0.7),
    entry("/faq", 0.6),
    entry("/privacy", 0.2, "yearly"),
    entry("/terms", 0.2, "yearly"),
  ];
}
