# Launch Checklist — Double Helix Pharma UK

Everything below is a **placeholder** in the current build. Replace before going live.
Most values live in one file: [`lib/site.ts`](lib/site.ts).

## 1. Brand & assets
- [ ] Drop in the **official logo** (replace the SVG wordmark in [`components/ui/Logo.tsx`](components/ui/Logo.tsx)) and sample the exact brand hex codes; update the tokens in [`app/globals.css`](app/globals.css) if they differ from the derived palette (`#16365B` navy / `#2F9FBE` teal / `#45B5CE` cyan).
- [ ] Add a real **founder headshot** (used in `FounderAbout` and `/about` — currently a monogram).
- [ ] Optional: replace decorative gradients with real **lab/manufacturing photography** (`next/image`, remote pattern for `images.unsplash.com` is already enabled in `next.config.mjs`).

## 2. Contact details (`lib/site.ts` → `contact`)
- [ ] Real **email** (currently `info@doublehelixpharma.co.uk`)
- [ ] Real **phone** (currently `+44 (0)1296 000 000`)
- [ ] Real **address / locality**
- [ ] Real **LinkedIn** URL (`social.linkedin`)
- [ ] Set `contactIsPlaceholder: false` to hide the "placeholder" notes in the footer & contact page.

## 3. Domain & SEO
- [ ] Set the live **domain** in `lib/site.ts` → `url` (drives canonical URLs, `sitemap.xml`, `robots.txt`, OG tags and JSON-LD).
- [ ] Confirm the **founder display name** (`founder.name`) — currently `Balasubramanian`.
- [ ] Verify structured data in Google's Rich Results Test once deployed.
- [ ] Submit `sitemap.xml` in Google Search Console.

## 4. Contact form delivery (`app/api/contact/route.ts`)
- [ ] Wire real delivery. Easiest option: add `RESEND_API_KEY` and send via Resend, or post to a CRM/Formspree webhook. Until then enquiries are logged server-side and the form reports success.

## 5. Legal
- [ ] Replace `/privacy` and `/terms` placeholder content with finalised policies.

## 6. Content to confirm
- [ ] Any **testimonials / client references** you're permitted to publish (none are fabricated in this build — the home page uses a founder pull-quote instead).
- [ ] Confirm all capability claims match what the business will stand behind.

---
Run `npm run dev` to preview, `npm run build` to verify a production build.
