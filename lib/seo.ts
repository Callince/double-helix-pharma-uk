import type { Metadata } from "next";
import { site } from "./site";

const DEFAULT_OG = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.shortName} — ${site.tagline}`,
};

/**
 * Builds consistent on-page metadata for a route: title (brand suffix via the
 * layout template unless `absoluteTitle`), description, canonical, and
 * page-specific Open Graph + Twitter cards. Pass `image` to override the social
 * image (e.g. a blog cover); pass `type: "article"` with dates/author/section to
 * emit article Open Graph tags.
 */
export function pageMeta({
  title,
  description,
  path,
  index = true,
  absoluteTitle = false,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  section,
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
  absoluteTitle?: boolean;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
}): Metadata {
  // Search engines truncate descriptions past ~160 chars — clamp at a word boundary
  // as a safety net so no page (incl. DB-driven blog/case-study excerpts) overflows.
  const desc =
    description.length > 160
      ? description.slice(0, 157).replace(/\s+\S*$/, "").trimEnd() + "…"
      : description;
  const images = image ? [{ url: image, alt: title }] : [DEFAULT_OG];
  const openGraph: Metadata["openGraph"] =
    type === "article"
      ? {
          title, description: desc, url: path, type: "article",
          siteName: site.name, locale: site.locale, images,
          publishedTime, modifiedTime, authors, section,
        }
      : {
          title, description: desc, url: path, type: "website",
          siteName: site.name, locale: site.locale, images,
        };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: { canonical: path },
    ...(index ? {} : { robots: { index: false, follow: true } }),
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      ...(image ? { images: [image] } : {}),
    },
  };
}

/**
 * Build an SEO <title> ≤ 60 chars for DB-driven pages (blog posts, case studies):
 * append the brand only when it fits, otherwise use the raw title, clamping at a
 * word boundary if it's long on its own. Use with `absoluteTitle: true`.
 */
export function seoTitle(raw: string): string {
  const brand = " | Double Helix Pharma";
  if (raw.length + brand.length <= 60) return raw + brand;
  if (raw.length <= 60) return raw;
  return raw.slice(0, 59).replace(/\s+\S*$/, "").trimEnd() + "…";
}
