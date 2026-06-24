import { site, methodology, type Faq } from "./site";
import type { SiteConfig } from "./site-config";

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

/** ProfessionalService / Organization — emitted site-wide in the root layout. */
export function organizationSchema(cfg: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "Organization"],
    "@id": ORG_ID,
    name: cfg.legalName,
    alternateName: cfg.shortName,
    url: cfg.url,
    description: cfg.description,
    slogan: cfg.tagline,
    email: cfg.contact.email,
    telephone: cfg.contact.phoneHref,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: cfg.contact.email,
      telephone: cfg.contact.phoneHref,
      areaServed: ["GB", "EU", "US", "MENA"],
      availableLanguage: "en",
    },
    foundingLocation: "United Kingdom",
    areaServed: ["United Kingdom", "European Union", "United States", "MENA"],
    address: {
      "@type": "PostalAddress",
      streetAddress: cfg.contact.street,
      addressLocality: cfg.contact.locality,
      addressRegion: cfg.contact.region,
      postalCode: cfg.contact.postcode,
      addressCountry: cfg.contact.countryCode,
    },
    identifier: {
      "@type": "PropertyValue",
      name: "UK Company Number",
      value: cfg.companyNumber,
    },
    founder: {
      "@type": "Person",
      name: cfg.founder.name,
      jobTitle: cfg.founder.role,
    },
    knowsAbout: [
      "GMP audit",
      "GDP audit",
      "Qualified Person (QP) services",
      "Responsible Person (RP / RPi) services",
      "Pharmaceutical Quality System (PQS)",
      "ICH Q10",
      "EU GMP",
      "21 CFR 210/211",
      "Inspection readiness",
      "CAPA management",
    ],
    sameAs: [
      `https://find-and-update.company-information.service.gov.uk/company/${cfg.companyNumber}`,
      ...(cfg.social.linkedin ? [cfg.social.linkedin] : []),
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.name,
    inLanguage: "en-GB",
    publisher: { "@id": ORG_ID },
  };
}

export function personSchema(cfg: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: cfg.founder.name,
    jobTitle: `${cfg.founder.role} — ${cfg.founder.credentials}`,
    worksFor: { "@id": ORG_ID },
    sameAs: [
      "https://find-and-update.company-information.service.gov.uk/officers/WEZU7C6jo8wr20j8K_PSUJW_4BY/appointments",
      ...(cfg.social.linkedin ? [cfg.social.linkedin] : []),
    ],
    description:
      "Qualified Person (QP), Responsible Person (RP/RPi) and GMP/GDP Lead Auditor with 20+ years in pharmaceutical quality across UK, EU, US and MENA markets.",
    knowsAbout: [
      "EU GMP / GDP compliance",
      "Qualified Person batch certification",
      "Pharmaceutical Quality System (ICH Q10)",
      "Sterile and non-sterile manufacturing",
      "Oncology injectables and biosimilars",
      "Equipment & utility qualification (URS/DQ/IQ/OQ/PQ)",
    ],
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: `${site.url}${opts.path}`,
    serviceType: opts.name,
    provider: { "@id": ORG_ID },
    areaServed: ["United Kingdom", "European Union", "United States", "MENA"],
    audience: {
      "@type": "BusinessAudience",
      name: "Pharmaceutical and biotech manufacturers, CMOs and importers",
    },
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** HowTo describing the engagement methodology — helps AI answer "how does a GMP/GDP engagement work". */
export function howToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How a Double Helix Pharma quality & compliance engagement works",
    description:
      "Our five-step approach to GMP/GDP audits, contract QP/RP/RPi cover and quality-system work — from scope and risk assessment through to CAPA and follow-up.",
    step: methodology.map((m, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: m.title,
      text: m.body,
      url: `${site.url}/#methodology-${m.step}`,
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path}`,
    })),
  };
}

/** Article schema for a case study (challenge/approach/outcome write-up). */
export function caseStudySchema(opts: {
  title: string;
  description?: string | null;
  sector?: string | null;
  path: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.sector ? { articleSection: opts.sector } : {}),
    ...(opts.dateModified
      ? { datePublished: opts.dateModified, dateModified: opts.dateModified }
      : {}),
    url: `${site.url}${opts.path}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${site.url}${opts.path}` },
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@type": "Thing", name: "Pharmaceutical quality and compliance" },
    inLanguage: "en-GB",
  };
}

/** CollectionPage (+ optional ItemList) for listing pages like /blog, /case-studies. */
export function collectionPageSchema(opts: {
  name: string;
  description: string;
  path: string;
  items?: { name: string; path: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: `${site.url}${opts.path}`,
    isPartOf: { "@id": WEBSITE_ID },
    ...(opts.items && opts.items.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: opts.items.length,
            itemListElement: opts.items.map((it, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: it.name,
              url: `${site.url}${it.path}`,
            })),
          },
        }
      : {}),
  };
}
