/**
 * Central site configuration — edit this file to update content site-wide.
 *
 * ⚠️  PLACEHOLDERS pending client confirmation are marked `PLACEHOLDER`.
 *     See LAUNCH-CHECKLIST.md before going live.
 */

export const site = {
  name: "Double Helix Pharma UK Ltd",
  shortName: "Double Helix Pharma",
  legalName: "Double Helix Pharma UK Ltd",
  companyNumber: "14557169",
  tagline: "Pharmaceutical Quality & Compliance Consultancy",
  description:
    "UK-based pharmaceutical quality & compliance consultancy delivering EU GMP/GDP audits, contract QP/RP/RPi services and inspection-ready quality systems for pharma, biotech and CMOs.",
  // Canonical site origin — drives canonical URLs, sitemap, OG & structured data.
  // Override per environment with NEXT_PUBLIC_SITE_URL (set the live domain on Vercel).
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.doublehelixpharma.co.uk").replace(/\/+$/, ""),
  locale: "en_GB",

  founder: {
    name: "Balasubramanian", // PLACEHOLDER — confirm full display name
    initials: "B",
    role: "Principal Consultant",
    credentials: "QP · RP · RPi · GMP/GDP Lead Auditor",
    yearsExperience: 20,
  },

  // ⚠️ PLACEHOLDER contact details — replace with real ones before launch.
  contactIsPlaceholder: true,
  contact: {
    email: "info@doublehelixpharma.co.uk",
    phoneDisplay: "+44 (0)1296 000 000",
    phoneHref: "+441296000000",
    locality: "Aylesbury",
    region: "Buckinghamshire",
    postalArea: "HP18",
    country: "United Kingdom",
    countryCode: "GB",
  },

  social: {
    linkedin: "https://www.linkedin.com/", // PLACEHOLDER
  },

  markets: ["United Kingdom (MHRA)", "European Union (EMA)", "United States (FDA)", "MENA"],
} as const;

/* ----------------------------- Navigation ----------------------------- */

export type NavLink = { label: string; href: string };

export const primaryNav: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const ctaLabel = "Book a discovery call";
export const ctaHref = "/contact";

/* ------------------------------ Services ------------------------------ */

export type IconName =
  | "clipboard-check"
  | "badge-check"
  | "layers"
  | "building"
  | "link"
  | "truck";

export type Service = {
  slug: string;
  href: string;
  title: string;
  short: string;
  icon: IconName;
  hasPage: boolean;
  metaTitle: string;
  metaDescription: string;
};

export const services: Service[] = [
  {
    slug: "gmp-audit",
    href: "/gmp-audit",
    title: "GMP & GDP Audits",
    short:
      "Independent GMP/GDP, supplier and for-cause audits, mock regulatory inspections and inspection-readiness reviews.",
    icon: "clipboard-check",
    hasPage: true,
    metaTitle: "GMP & GDP Audit Consulting",
    metaDescription:
      "Independent GMP & GDP audit consulting — supplier audits, mock inspections, gap assessments and inspection readiness against EU GMP, 21 CFR 210/211 and ICH.",
  },
  {
    slug: "contract-qp",
    href: "/contract-qp",
    title: "Contract QP, RP & RPi",
    short:
      "Qualified Person batch certification plus Responsible Person (WDA) and Responsible Person for import (RPi) cover.",
    icon: "badge-check",
    hasPage: true,
    metaTitle: "Contract QP, RP & RPi Services",
    metaDescription:
      "Contract Qualified Person (QP) batch certification and release, plus Responsible Person (RP) and RPi import services for UK and EU pharmaceutical operations.",
  },
  {
    slug: "qms-implementation",
    href: "/qms-implementation",
    title: "QMS & PQS Implementation",
    short:
      "Build and remediate quality systems to ICH Q10 — SOPs, CAPA, deviations, change control and self-inspection.",
    icon: "layers",
    hasPage: true,
    metaTitle: "QMS & PQS Implementation",
    metaDescription:
      "Pharmaceutical Quality System (PQS) build and remediation to ICH Q10 — SOPs, CAPA, deviation and change control, self-inspection and inspection remediation.",
  },
  {
    slug: "site-readiness",
    href: "/site-readiness",
    title: "Site Readiness (MIA / WDA)",
    short:
      "Prepare sites, dossiers and teams for MIA/WDA licensing, regulatory inspection and operational go-live.",
    icon: "building",
    hasPage: true,
    metaTitle: "Site Readiness for MIA & WDA Licensing",
    metaDescription:
      "MIA/WDA site readiness — licence-application support, facility and quality-system gap assessment, mock pre-licensing inspection and operational go-live for UK pharmaceutical sites.",
  },
  {
    slug: "supplier-management",
    href: "/supplier-management",
    title: "Supplier & Vendor Management",
    short:
      "GxP supplier qualification, technical/quality agreements (QTA) and ongoing performance oversight.",
    icon: "link",
    hasPage: true,
    metaTitle: "Supplier & Vendor Quality Management",
    metaDescription:
      "GxP supplier and vendor management — risk-based qualification, technical/quality agreements (QTA), audit programmes and ongoing performance oversight for pharmaceutical supply chains.",
  },
  {
    slug: "gdp-supply-chain",
    href: "/gdp-supply-chain",
    title: "GDP Transport & Supply Chain",
    short:
      "Transport validation, cold-chain assurance and distribution compliance across the GDP supply chain.",
    icon: "truck",
    hasPage: true,
    metaTitle: "GDP Transport & Supply Chain Compliance",
    metaDescription:
      "GDP transport and supply-chain compliance — transport validation, cold-chain and temperature mapping, distribution gap assessments and WDA/RP support to EU GDP standards.",
  },
];

export const servicePages = services.filter((s) => s.hasPage);

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/* --------------------------- Credentials ------------------------------ */

export const credentials: string[] = [
  "Qualified Person (QP)",
  "Responsible Person (RP)",
  "RP for import (RPi)",
  "GMP/GDP Lead Auditor",
  "PQS / QMS Expert",
  "20+ years in pharma quality",
];

export const dosageForms: { label: string; note: string }[] = [
  { label: "Sterile injectables", note: "Sterile liquid & freeze-dried" },
  { label: "Oncology injectables", note: "High-potency handling" },
  { label: "Biosimilars & biotech", note: "Biological products" },
  { label: "Solid oral dose", note: "Tablets & capsules" },
  { label: "APIs & raw materials", note: "Active ingredients" },
  { label: "Excipients", note: "Supporting materials" },
];

/* -------------------- Compliance reach (standards) -------------------- */

export const complianceReach: { product: string; frameworks: string[] }[] = [
  {
    product: "Sterile & non-sterile medicines",
    frameworks: ["EU GMP — EudraLex Vol. 4", "21 CFR 210/211", "ICH Q7–Q10"],
  },
  {
    product: "Biologics & biosimilars",
    frameworks: ["EU GMP Annex 1/2", "ICH Q5/Q6", "21 CFR 600s"],
  },
  {
    product: "APIs, raw materials & excipients",
    frameworks: ["ICH Q7", "EXCiPACT", "EudraLex Vol. 4 Part II"],
  },
  {
    product: "Distribution & importation",
    frameworks: ["EU GDP 2013/C 343/01", "MHRA WDA(H)", "GDP RPi"],
  },
  {
    product: "Computerised systems & data",
    frameworks: ["GAMP 5", "21 CFR Part 11", "Annex 11 / ALCOA+"],
  },
  {
    product: "Medical devices & combination",
    frameworks: ["ISO 13485", "ISO 9001", "ISO 14971"],
  },
];

/* ----------------------------- Pillars -------------------------------- */

export const pillars: { title: string; tag: string; items: string[]; icon: IconName }[] = [
  {
    title: "Inspection Readiness",
    tag: "Preventative",
    icon: "clipboard-check",
    items: [
      "Mock regulatory inspections",
      "GMP/GDP gap assessments",
      "Pre-approval inspection prep",
      "Self-inspection programmes",
    ],
  },
  {
    title: "Routine Compliance",
    tag: "Maintenance",
    icon: "badge-check",
    items: [
      "Scheduled supplier audits",
      "Periodic self-inspections",
      "QMS / PQS health checks",
      "QP / RP oversight",
    ],
  },
  {
    title: "Remediation & CAPA",
    tag: "Reactive",
    icon: "layers",
    items: [
      "For-cause & triggered audits",
      "Post-inspection remediation",
      "CAPA design & effectiveness",
      "Data-integrity reviews",
    ],
  },
];

/* --------------------------- Methodology ------------------------------ */

export const methodology: { step: string; title: string; body: string }[] = [
  {
    step: "01",
    title: "Scope & risk assessment",
    body: "We agree objectives, the regulatory basis and risk priorities so effort lands where it matters most.",
  },
  {
    step: "02",
    title: "Plan & prepare",
    body: "A clear agenda, document requests and logistics — delivered on-site, remote or hybrid to suit your site.",
  },
  {
    step: "03",
    title: "Execute",
    body: "Rigorous, experienced assessment against the applicable GxP requirements — or hands-on implementation work.",
  },
  {
    step: "04",
    title: "Report",
    body: "Clear, graded findings mapped to regulations and ranked by risk, so your team knows exactly what to fix first.",
  },
  {
    step: "05",
    title: "CAPA & follow-up",
    body: "A practical corrective-action plan, effectiveness checks and re-assessment to close the loop and stay inspection-ready.",
  },
];

/* ----------------------------- Benefits ------------------------------- */

export const benefits: { title: string; body: string; icon: string }[] = [
  {
    icon: "badge-check",
    title: "An ex-industry QP perspective",
    body: "Audits and advice from someone who has held QP, RP and RPi roles and hosted regulatory inspections — not theory.",
  },
  {
    icon: "globe",
    title: "UK, EU, US & MENA experience",
    body: "20+ years harmonising quality systems and supporting batch release across highly regulated global markets.",
  },
  {
    icon: "shield-check",
    title: "Sterile to solid oral dose",
    body: "Deep experience across sterile injectables, oncology, biosimilars, solid oral dose, APIs and excipients.",
  },
  {
    icon: "file-text",
    title: "Reports you can act on",
    body: "Findings graded by risk and mapped to the regulation — clear enough to take straight into CAPA.",
  },
  {
    icon: "refresh-cw",
    title: "Flexible delivery",
    body: "On-site, remote or hybrid engagements scaled to a single audit or an ongoing compliance partnership.",
  },
  {
    icon: "users",
    title: "One senior point of contact",
    body: "You work directly with a senior expert from first call to final sign-off — no hand-offs, no juniors.",
  },
];

/* ------------------------------- FAQs --------------------------------- */

export type Faq = { q: string; a: string };

export const faqsHome: Faq[] = [
  {
    q: "What does a pharmaceutical quality & compliance consultant do?",
    a: "We help pharma, biotech and CMOs meet GMP and GDP requirements — auditing sites and suppliers, acting as a contract QP/RP/RPi, building or remediating quality systems, and preparing teams for regulatory inspection.",
  },
  {
    q: "Which markets and regulators do you cover?",
    a: "Engagements span the UK (MHRA), European Union (EMA), United States (FDA) and the MENA region, drawing on 20+ years working to EU GMP/GDP standards.",
  },
  {
    q: "Do you work with small, virtual or first-time pharma companies?",
    a: "Yes. Whether you are a virtual company outsourcing to a CMO or preparing for your first MIA/WDA, engagements scale to your stage and budget.",
  },
  {
    q: "Can you act as our contract QP, RP or RPi?",
    a: "Yes — contract and interim QP (batch certification/release), RP (WDA) and RPi (import) cover is available. See the Contract QP, RP & RPi page for detail.",
  },
];

export const faqsGmp: Faq[] = [
  {
    q: "What types of GMP audit do you carry out?",
    a: "Supplier and third-party audits, internal/self-inspections, mock regulatory inspections, pre-approval inspection preparation and for-cause (triggered) audits across GMP and GDP.",
  },
  {
    q: "Do you offer remote, on-site or hybrid audits?",
    a: "All three. Many supplier and documentation audits run effectively remotely; sterile and complex sites usually benefit from on-site or hybrid assessment.",
  },
  {
    q: "What will the audit report look like?",
    a: "A clear report with findings graded by risk and mapped to the relevant regulation (e.g. EudraLex Vol. 4, 21 CFR 210/211), plus practical recommendations ready to feed into CAPA.",
  },
  {
    q: "Which standards and product types can you audit against?",
    a: "EU GMP, FDA 21 CFR 210/211, ICH Q-series, EU/MHRA GDP, ISO 13485/9001 and GAMP 5 — across sterile and non-sterile medicines, biologics, APIs, excipients and distribution.",
  },
];

export const faqsContractQp: Faq[] = [
  {
    q: "What is the difference between a QP, an RP and an RPi?",
    a: "A Qualified Person (QP) certifies and releases medicinal product batches under an MIA. A Responsible Person (RP) oversees GDP compliance under a WDA. An RPi (RP for import) covers importation of medicines from outside the UK/EEA.",
  },
  {
    q: "Can you provide interim or ongoing QP/RP cover?",
    a: "Yes — from short-term interim cover during recruitment or absence, through to an ongoing named-person arrangement, subject to scope and eligibility checks.",
  },
  {
    q: "Which product types can you support for batch release?",
    a: "Sterile injectables (liquid and freeze-dried), oncology injectables, biosimilars and solid oral dose, alongside APIs and raw materials oversight.",
  },
  {
    q: "Do you also manage our CMOs and suppliers?",
    a: "Yes. CMO oversight, technical/quality agreements (QTA) and supplier qualification can be combined with QP/RP duties for end-to-end assurance.",
  },
];

export const faqsQms: Faq[] = [
  {
    q: "We are preparing for our first MHRA inspection — can you help?",
    a: "Yes. We build the Pharmaceutical Quality System (PQS), run mock inspections and gap assessments, and prepare your team and documentation so you walk in inspection-ready.",
  },
  {
    q: "Can you remediate findings from a recent inspection?",
    a: "Yes — we translate inspection observations into a prioritised CAPA plan, implement the fixes and verify effectiveness so deficiencies stay closed.",
  },
  {
    q: "Do you write SOPs, the SMF, VMP and quality agreements?",
    a: "Yes. Quality-system documentation including SMF, VMP/VPP, SOPs, QTA, change control, deviation, OOS/OOT/OOC handling, CAPA and Product Quality Reviews.",
  },
];

export const faqsSiteReadiness: Faq[] = [
  {
    q: "What does ‘site readiness’ actually involve?",
    a: "Getting a site, its quality system, documentation and team to the point where they can pass a regulatory pre-licensing inspection and begin licensed operations — covering gap assessment, remediation, mock inspection and go-live support.",
  },
  {
    q: "Can you help with the MIA or WDA application itself?",
    a: "Yes — we support the licence application and supporting documentation (e.g. the Site Master File), help nominate the QP/RP/RPi, and prepare you for the MHRA inspection that precedes the licence.",
  },
  {
    q: "How early should we engage you?",
    a: "As early as possible — ideally before the application — so gaps are found and fixed on your timeline rather than during an inspection. We can also help recover a stalled application.",
  },
  {
    q: "Do you cover both manufacturing and wholesale dealer sites?",
    a: "Yes. Manufacturing/Import Authorisation (MIA / MIA(IMP)) and Wholesale Dealer’s Authorisation (WDA(H)), including the importation (RPi) route.",
  },
];

export const faqsSupplier: Faq[] = [
  {
    q: "How do you qualify and risk-rate suppliers?",
    a: "A risk-based programme: criticality assessment, questionnaires, document review and on-site or remote audits where warranted, with a defined re-qualification cycle proportionate to risk.",
  },
  {
    q: "Can you write our technical/quality agreements (QTAs)?",
    a: "Yes — clear QTAs that define quality responsibilities between you and your CMOs, suppliers and service providers, aligned to EU GMP Chapter 7.",
  },
  {
    q: "Do you run ongoing supplier audits?",
    a: "Yes. Scheduled and for-cause supplier/third-party audits, performance monitoring (KPIs, complaints, deviations) and escalation when a supplier drifts out of specification.",
  },
  {
    q: "Which suppliers does this cover?",
    a: "API and excipient manufacturers, CMOs, packaging, laboratories, calibration, logistics and other GxP service providers across your supply chain.",
  },
];

export const faqsGdp: Faq[] = [
  {
    q: "What does transport validation involve?",
    a: "Demonstrating that your distribution routes, packaging and processes keep products within their required conditions — temperature mapping and qualification of lanes, packaging and vehicles, plus a control strategy for excursions.",
  },
  {
    q: "Can you help with cold-chain and temperature-sensitive products?",
    a: "Yes — cold-chain qualification, temperature mapping of stores and shipping, monitoring strategy and excursion management for refrigerated and frozen products.",
  },
  {
    q: "Do you provide GDP gap assessments and RP support?",
    a: "Yes. GDP gap assessments against EU GDP (2013/C 343/01) and MHRA expectations, plus Responsible Person (RP) and RPi support under your WDA.",
  },
  {
    q: "Can you investigate a temperature excursion or distribution deviation?",
    a: "Yes — root-cause investigation, risk assessment of product impact, and CAPA to prevent recurrence across the supply chain.",
  },
];
