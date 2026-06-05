import type { Metadata } from "next";
import { site } from "./site";

const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.shortName} — ${site.tagline}`,
};

/**
 * Builds consistent on-page metadata for a route: title (brand suffix via the
 * layout template unless `absoluteTitle`), description, canonical, and
 * page-specific Open Graph + Twitter cards that always carry the OG image.
 * Centralising this prevents the per-page OG drift (missing image / generic
 * social title) that happens when each page hand-rolls its own openGraph.
 */
export function pageMeta({
  title,
  description,
  path,
  index = true,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
  absoluteTitle?: boolean;
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    ...(index ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      siteName: site.name,
      locale: site.locale,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
