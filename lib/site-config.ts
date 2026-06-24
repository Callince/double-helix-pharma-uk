import { cache } from "react";
import { site } from "./site";
import { getSettings } from "./db/content";

/**
 * Effective site configuration: the static lib/site.ts defaults with admin
 * Settings (the `settings` table) layered on top. Any field left blank in
 * Settings — or a DB outage — falls back to the default, so the live site can
 * never break. Memoised per request via React cache() so a page renders one
 * DB read regardless of how many components (layout, footer, schema) call it.
 */
export const getSiteConfig = cache(async () => {
  let s: Record<string, Record<string, string>> = {};
  try {
    s = await getSettings();
  } catch {
    /* DB unreachable -> fall back to the static defaults below */
  }
  const c = s.contact ?? {};
  const soc = s.social ?? {};
  const seo = s.seo ?? {};
  const phone = c.phone?.trim();
  return {
    ...site,
    contact: {
      ...site.contact,
      ...(c.email?.trim() ? { email: c.email.trim() } : {}),
      ...(phone ? { phoneDisplay: phone, phoneHref: phone.replace(/[^+\d]/g, "") } : {}),
      ...(c.locality?.trim() ? { locality: c.locality.trim() } : {}),
      ...(c.region?.trim() ? { region: c.region.trim() } : {}),
    },
    social: {
      ...site.social,
      ...(soc.linkedin?.trim() ? { linkedin: soc.linkedin.trim() } : {}),
    },
    seo: {
      metaTitle: seo.metaTitle?.trim() || "",
      metaDescription: seo.metaDescription?.trim() || "",
    },
  };
});

export type SiteConfig = Awaited<ReturnType<typeof getSiteConfig>>;
