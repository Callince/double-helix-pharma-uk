import { site, type Faq } from "./site";

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

/** ProfessionalService / Organization — emitted site-wide in the root layout. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "Organization"],
    "@id": ORG_ID,
    name: site.legalName,
    alternateName: site.shortName,
    url: site.url,
    description: site.description,
    slogan: site.tagline,
    email: site.contact.email,
    telephone: site.contact.phoneHref,
    foundingLocation: "United Kingdom",
    areaServed: ["United Kingdom", "European Union", "United States", "MENA"],
    address: {
      "@type": "PostalAddress",
      addressLocality: site.contact.locality,
      addressRegion: site.contact.region,
      addressCountry: site.contact.countryCode,
    },
    identifier: {
      "@type": "PropertyValue",
      name: "UK Company Number",
      value: site.companyNumber,
    },
    founder: {
      "@type": "Person",
      name: site.founder.name,
      jobTitle: site.founder.role,
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
    sameAs: [site.social.linkedin],
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

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.founder.name,
    jobTitle: `${site.founder.role} — ${site.founder.credentials}`,
    worksFor: { "@id": ORG_ID },
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
