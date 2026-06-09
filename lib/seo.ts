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
  const images = image ? [{ url: image, alt: title }] : [DEFAULT_OG];
  const openGraph: Metadata["openGraph"] =
    type === "article"
      ? {
          title, description, url: path, type: "article",
          siteName: site.name, locale: site.locale, images,
          publishedTime, modifiedTime, authors, section,
        }
      : {
          title, description, url: path, type: "website",
          siteName: site.name, locale: site.locale, images,
        };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    ...(index ? {} : { robots: { index: false, follow: true } }),
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
