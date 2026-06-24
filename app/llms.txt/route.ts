import { site, services } from "@/lib/site";
import { listPublishedPosts, listPublishedCaseStudies, type Post, type CaseStudy } from "@/lib/db/content";

/**
 * /llms.txt — a concise, link-first map of the site for LLMs / AI search
 * (ChatGPT, Gemini, Perplexity, AI Overviews). Follows the llmstxt.org
 * convention: H1 + summary blockquote + sectioned links with descriptions.
 * Generated from live services and published content (static fallback if the
 * DB is unavailable), mirroring the sitemap.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clip(s: string | null | undefined, n: number): string {
  const t = (s || "").replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t;
}

export async function GET() {
  const u = (p: string) => `${site.url}${p}`;

  let posts: Post[] = [];
  let caseStudies: CaseStudy[] = [];
  try { posts = await listPublishedPosts(); } catch { /* DB unavailable — static pages still listed */ }
  try { caseStudies = await listPublishedCaseStudies(); } catch { /* DB unavailable */ }

  const lines: string[] = [
    `# ${site.legalName}`,
    "",
    `> ${site.description}`,
    "",
    `Led by ${site.founder.name} — a Qualified Person (QP), Responsible Person (RP/RPi) and GMP/GDP Lead Auditor with ${site.founder.yearsExperience}+ years in pharmaceutical quality across UK (MHRA), EU (EMA), US (FDA) and MENA markets. Engagements are delivered remote, on-site or hybrid by one senior expert.`,
    "",
    "## Services",
    ...services.map((s) => `- [${s.title}](${u(s.href)}): ${clip(s.short, 160)}`),
    "",
  ];

  if (posts.length) {
    lines.push("## Guides & insights");
    for (const p of posts) {
      lines.push(`- [${p.title}](${u(`/blog/${p.slug}`)})${p.excerpt ? `: ${clip(p.excerpt, 160)}` : ""}`);
    }
    lines.push("");
  }

  if (caseStudies.length) {
    lines.push("## Case studies");
    for (const c of caseStudies) {
      lines.push(`- [${c.title}](${u(`/case-studies/${c.slug}`)})${c.summary ? `: ${clip(c.summary, 160)}` : ""}`);
    }
    lines.push("");
  }

  lines.push(
    "## About & contact",
    `- [About — our Qualified Person](${u("/about")}): The QP/RP/RPi and GMP/GDP Lead Auditor behind ${site.shortName}.`,
    `- [Services overview](${u("/services")}): All pharmaceutical quality & compliance services.`,
    `- [Contact](${u("/contact")}): Book a no-obligation discovery call.`,
    `- [FAQ](${u("/faq")}): Common questions on GMP/GDP audits, QP/RP/RPi cover and quality systems.`,
    "",
    "## Standards & expertise",
    "Works to EU GMP (EudraLex Vol. 4), 21 CFR 210/211, ICH Q7–Q10, EU GDP (2013/C 343/01), Annex 1, Annex 11 / GAMP 5, 21 CFR Part 11 and ISO 13485. Product types: sterile & oncology injectables, biosimilars & biotech, solid oral dose, APIs, raw materials and excipients.",
    "",
    `Contact: ${site.contact.email}`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
