import type { MetadataRoute } from "next";
import { site, servicePages } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["/", "/services", "/about", "/contact"];
  const serviceRoutes = servicePages.map((s) => s.href);

  return [...staticRoutes, ...serviceRoutes].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
