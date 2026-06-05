# Double Helix Pharma UK — Website

Marketing site for **Double Helix Pharma UK Ltd**, a pharmaceutical quality & compliance
consultancy (GMP/GDP audits, contract QP/RP/RPi, quality-system implementation).

Built with **Next.js (App Router) + TypeScript + Tailwind CSS v4**, statically rendered for
speed and SEO.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Project structure

```
app/                 Routes (App Router) + metadata, sitemap, robots, OG image
  page.tsx           Home
  gmp-audit/         Flagship service page
  contract-qp/       Contract QP/RP/RPi
  qms-implementation/  QMS/PQS implementation
  about/             Founder / E-E-A-T anchor
  contact/           Contact form + /api/contact route handler
components/
  layout/            Header (nav) + Footer
  sections/          Page sections (Hero, ServiceCards, Pillars, FAQ, …)
  ui/                Primitives (Button, Card, Icon, Disclosure, Logo, …)
  seo/               JsonLd helper
lib/
  site.ts            ← single source of truth for content & contact details
  schema.ts          JSON-LD structured-data builders
```

## Editing content

Almost everything (services, FAQs, compliance standards, contact details, nav) is data-driven
from **`lib/site.ts`**. Edit there first.

## Before launch

See **[LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md)** — logo, headshot, real contact details,
live domain, and contact-form email delivery are all marked as placeholders.

## SEO features

- Per-route metadata (title template, descriptions, canonicals, Open Graph/Twitter)
- JSON-LD: `ProfessionalService`/`Organization`, `WebSite`, `Service`, `Person`, `FAQPage`, `BreadcrumbList`
- `sitemap.xml` + `robots.txt` (generated), dynamic OG image, SVG favicon
- Semantic HTML, single `<h1>` per page, native `<details>` FAQs (crawlable), `lang="en-GB"`
- Accessible: skip link, focus-visible styles, reduced-motion support, AA-contrast palette
