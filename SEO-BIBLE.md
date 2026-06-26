# SEO Bible — Double Helix Pharma UK

> The single master reference for this site's SEO. Last full audit: **2026-06-26** (30 pages, **0 on-page issues**).
> Supporting docs in this repo: **[KEYWORDS.md](KEYWORDS.md)**, **[LINK-BUILDING.md](LINK-BUILDING.md)**,
> **Link-Building-Plan.xlsx**, **Website-To-Do.xlsx**, **CLOUDFLARE.md**.

---

## 1. Strategy in one paragraph
Double Helix Pharma is a **UK pharmaceutical quality & compliance consultancy** led by a single **Qualified Person**
(Balasubramanian Ramaiah — QP/RP/RPi, GMP/GDP lead auditor). Its market is **niche B2B**: search volumes are *small*
but intent and deal value are *very high*, and competition is *low*. **So the game is not traffic — it's owning the
exact terms a handful of buyers (and AI assistants) use, and earning enough trust (links + time) to get indexed and
ranked.** Win on **intent + topical authority + E-E-A-T**, not volume.

---

## 2. Current health snapshot (2026-06-26)
| Area | Status | Notes |
|---|---|---|
| **On-page** | ✅ **Perfect** | 30/30 pages: title ≤60, meta ≤160, 1× H1, canonical, schema. Audited, 0 issues. |
| **Technical** | ✅ Strong | Fast (ISR), crawlable, sitemap, robots, HTTPS + security headers. |
| **Schema** | ✅ Comprehensive | Org, WebSite, Person, Service ×6, FAQPage, BreadcrumbList, Article, HowTo. |
| **Content** | ✅ Deep | 112 blog posts (6 clusters), 50-question FAQ hub, downloadable GMP checklist. |
| **Speed** | ✅ Good | Static ~0.1s; blog/FAQ/case studies ISR ~0.1–0.3s. Mobile PSI 89, TBT 30ms, CLS 0. |
| **Off-page** | 🔶 Building | LinkedIn page live + wired in. GBP + directories = next. |
| **Indexing** | 🔶 In progress | New domain (≈June 2026); Google/Bing crawling slowly. Normal. |

**Bottom line: the controllable, on-site work is essentially complete. The growth lever now is OFF-site (links) + time.**

---

## 3. Technical SEO (the foundation — all done)
- **Crawlability:** `robots.txt` allows everything except `/api` + `/admin`; lists the sitemap. All public pages return
  200, `index, follow`, no stray `noindex`.
- **Sitemap:** `/sitemap.xml` is generated per-request (`force-dynamic`) so it always reflects published content. 30 URLs.
- **Canonicals:** every page self-canonicals. `/blog?category=…` canonicals to `/blog` (+ unique titles). `www` → apex (308).
- **Speed architecture (important):**
  - Static pages (home, services, about, contact, resources, legal) → prerendered, ~0.1s.
  - **Blog posts, `/faq`, `/case-studies`** → **ISR** (`export const revalidate = 3600`) → cached ~0.1–0.3s, and updated
    *instantly* on publish via `revalidatePath`. **Do not revert these to `force-dynamic`** — that was the slow-crawl bug.
  - `/blog` listing → dynamic (reads the `?category` filter); ~0.6s, acceptable.
- **IndexNow:** key file hosted; `lib/indexnow.ts` auto-pings Bing on every publish (blog/FAQ/case study + drip cron).
- **Security headers:** HTTPS, HSTS, CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` (in `next.config.mjs`).

---

## 4. On-page SEO — the rules (keep following these)
- **Title tag:** ≤ 60 chars, primary keyword first, then ` | Double Helix Pharma`. DB-driven pages use `seoTitle()` in
  `lib/seo.ts` (appends brand only if it fits, else clamps at a word boundary). **Never let a title exceed 60.**
- **Meta description:** ≤ 160 chars (auto-clamped in `pageMeta()`), 70–160 ideal, lead with the keyword + a value/benefit.
- **Headings:** exactly **one H1** = the page's primary topic/keyword; logical H2/H3 below (questions make great H2s).
- **Internal links:** every blog post links **up to its money page + `/contact`** with descriptive anchor text (verified).
  This passes topical authority to the pages you want to rank. Keep doing it in new posts.
- **Images:** descriptive `alt` on every content image; right-sized WebP. The header **logo is the LCP** — it's preloaded
  `fetchpriority="high"`; keep it small.
- **The 7 money pages + their primary keyword** (full secondaries in KEYWORDS.md):

  | Page | Primary keyword |
  |---|---|
  | `/` | UK pharmaceutical quality consultant |
  | `/contract-qp` | contract qualified person |
  | `/gmp-audit` | GMP audit services |
  | `/qms-implementation` | pharmaceutical quality system implementation |
  | `/site-readiness` | MIA and WDA licence support |
  | `/supplier-management` | supplier qualification (pharmaceutical) |
  | `/gdp-supply-chain` | good distribution practice (GDP) |

---

## 5. Keywords → KEYWORDS.md
136 mapped keywords: **7 primary** (one per money page), **43 secondary**, **6 cluster pillars**, **69 long-tail**, **7 AEO
questions**, brand terms. Filter `Keyword-Map.xlsx` by Tier to work it.
**Rule:** target *long-tail* first (winnable on a new domain), let it build authority that lifts the head terms over months.

---

## 6. Content strategy
- **6 topic clusters** (= your blog categories), each with a **pillar** + supporting long-tails, all linking to a money page:
  GMP/GDP Audits · Contract QP/RP/RPi · QMS/PQS · Site Readiness (MIA/WDA) · Supplier Management · GDP/Supply Chain.
- **112 posts** authored. Publish the cluster **pillars** first (cornerstones earn the AI citations). Edit/publish from
  **Admin → Blog**; ISR + IndexNow make changes go live + notify Bing automatically.
- **Cadence:** quality over dump. A steady trickle reads as an active site; avoid publishing 100 the same day.
- **FAQ/AEO hub** (`/faq`): 50 answer-first Q&As with FAQPage schema. Expand it as new questions come up.

---

## 7. AEO / GEO — winning AI search (Google AI Overviews, ChatGPT, Copilot)
- **Answer-first:** open each page/section with a 40–80 word direct answer to the question it targets.
- **FAQPage schema** on `/faq` + per-post FAQs → eligible for AI Overviews + featured snippets.
- **`/llms.txt`** route exists for AI crawlers.
- **E-E-A-T:** pharma is "Your Money or Your Life" — Google weights author expertise heavily. Keep **Bala bylined** on every
  post, credentials visible, Person schema with `sameAs` (Companies House + LinkedIn). This is a real ranking asset.

---

## 8. Structured data inventory (`lib/schema.ts`)
Organization/ProfessionalService · WebSite · **Person** (founder, `sameAs` = Companies House + LinkedIn) · **Service** ×6 ·
**FAQPage** · **BreadcrumbList** (sitewide) · **Article/BlogPosting** (blog) · **Article** (case studies) · **HowTo** · CollectionPage.
**Rule:** schema must match visible content — never mark up something not on the page.

---

## 9. Off-page SEO → LINK-BUILDING.md + Link-Building-Plan.xlsx
**This is now your #1 growth lever.** A brand-new domain with no links doesn't get crawled/ranked, full stop.
- ✅ **Done:** LinkedIn company page (+ backlink to the site, + wired into schema `sameAs`).
- 🔜 **Next (this week):** **Google Business Profile**, then **RQA / TOPRA / ISPE** (niche, highest value), then 2–3 UK directories.
- **nofollow vs dofollow:** LinkedIn/social links are usually **nofollow** — great for *discovery + brand*, weaker for *ranking
  weight*. Mix in **dofollow** links (directories, guest articles) over time.
- **NEVER buy links / use PBNs** — manual-penalty risk in a YMYL niche.

---

## 10. Local / entity SEO — NAP (keep identical everywhere)
| Field | Value |
|---|---|
| Business | Double Helix Pharma UK Ltd |
| Website | https://doublehelixpharma.co.uk |
| Email | info@doublehelixpharma.co.uk |
| Phone | +44 7909 174355 |
| Address | 7 Draycott Close, Aylesbury, Buckinghamshire, HP18 1AZ |
| Company no. | 14557169 |
Use this byte-for-byte on GBP, Bing Places, and every directory. Inconsistency dilutes trust.

---

## 11. Indexing playbook (the current situation — read this when frustrated)
A new domain takes **days-to-weeks** to get crawled + indexed by Google/Bing. **"Discovered but not crawled" is normal
boilerplate, not a bug** — verified repeatedly that the site is technically flawless (200, index/follow, sitemap, fast).
**No tool forces it.** The order of operations:
1. **GSC + Bing WMT:** verify, submit `sitemap.xml`, use URL Inspection → Request Indexing (Bing also has bulk *URL Submission*).
2. **IndexNow:** ✅ automatic.
3. **Backlinks:** the actual trigger — a couple of links tells the engines you're real. (LinkedIn done; GBP next.)
4. **Time + patience:** re-check **weekly, not daily**.

---

## 12. Monitoring & maintenance
**Tools:** Google Search Console · Bing Webmaster Tools · PageSpeed Insights (PSI) · (optional) a rank tracker.
**Cadence:**
- **Weekly:** GSC + Bing coverage/indexed count; new query impressions (optimise anything at position 8–30); do 1–2 link tasks.
- **Monthly:** rankings for the 7 primaries + 6 pillars; publish/refresh content; run PSI on home + 1 service page.
- **Quarterly:** refresh top posts (update dates/facts → re-ping IndexNow); full on-page re-audit (re-run the audit script).
**KPIs to track:** indexed pages → impressions → clicks → avg position → **referring domains** → enquiries (the real goal).

---

## 13. The do-not list
✗ Buy links / PBNs / "1000 backlinks" gigs ✗ keyword-stuff ✗ vary the NAP ✗ duplicate content across URLs
✗ publish thin/auto pages at scale ✗ block crawlers ✗ revert blog/FAQ/case-study to `force-dynamic` ✗ add `noindex` to public pages.

---

## 14. Roadmap — next 30 / 60 / 90 days
- **30 days:** Google Business Profile + Bing Places; 2–3 UK directories; verify both engines + Request Indexing; add Website
  link on LinkedIn + post once; watch GSC for first impressions.
- **60 days:** join RQA/TOPRA/ISPE; pitch 1–2 guest articles; publish the cluster pillars; reply to journalist queries (Qwoted).
- **90 days:** head terms begin to move; refresh the best-performing posts; expand the FAQ + clusters around what's getting impressions.

---

## 15. Asset index (everything SEO in this repo)
| File | What it is |
|---|---|
| **SEO-BIBLE.md** | This master reference |
| **KEYWORDS.md** / **Keyword-Map.xlsx** | Keyword strategy + 136-keyword tracker |
| **LINK-BUILDING.md** / **Link-Building-Plan.xlsx** | Backlink targets + 4-week plan |
| **Website-To-Do.xlsx** | Overall task tracker |
| **CLOUDFLARE.md** | (separate) Cloudflare migration notes |
| `lib/seo.ts`, `lib/schema.ts` | The code that enforces titles/meta/schema rules |

---

*Re-run the on-page audit any time to confirm 0 issues; the growth from here is links + content + patience.*
