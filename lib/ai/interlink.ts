// AI-assisted internal linking via Qwen on OpenRouter (OpenAI-compatible API).
// Fails open everywhere: with no API key (or any error) it simply returns no
// links, so publishing a post never breaks.
import { listPublishedPosts } from "@/lib/db/content";
import { servicePages } from "@/lib/site";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
// Free Qwen models tried in order — if one is rate-limited upstream, fall through to the next.
const MODELS = process.env.OPENROUTER_MODEL
  ? [process.env.OPENROUTER_MODEL]
  : ["qwen/qwen3-next-80b-a3b-instruct:free", "qwen/qwen3-coder:free"];
const KEY = process.env.OPENROUTER_API_KEY;

export type LinkTarget = { title: string; url: string };
export type LinkSuggestion = { phrase: string; url: string };

export function aiConfigured(): boolean {
  return Boolean(KEY);
}

/** Strip HTML to readable text (keeps anchor text) for sending to the model. */
export function htmlToText(html: string): string {
  return html
    .replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** Build the list of pages a post may link to (services, key pages, other posts). */
export async function getLinkTargets(excludeSlug?: string): Promise<LinkTarget[]> {
  const targets: LinkTarget[] = [
    { title: "Services overview", url: "/services" },
    { title: "Case studies", url: "/case-studies" },
    { title: "About Double Helix Pharma", url: "/about" },
    { title: "Contact / book a call", url: "/contact" },
    { title: "FAQ", url: "/faq" },
    ...servicePages.map((s) => ({ title: s.title, url: s.href })),
  ];
  try {
    const posts = await listPublishedPosts();
    for (const p of posts) {
      if (p.slug === excludeSlug) continue;
      targets.push({ title: p.title, url: `/blog/${p.slug}` });
    }
  } catch {
    /* DB unavailable — still link to the static pages above */
  }
  return targets;
}

/** Call the free Qwen models in order; return the first non-empty completion. */
async function callQwen(prompt: string): Promise<string | null> {
  for (const model of MODELS) {
    try {
      const res = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${KEY}`,
          "HTTP-Referer": "https://www.doublehelixpharma.co.uk",
          "X-Title": "Double Helix Pharma",
        },
        body: JSON.stringify({ model, temperature: 0.2, messages: [{ role: "user", content: prompt }] }),
      });
      if (res.ok) {
        const data = await res.json();
        const content: string = data?.choices?.[0]?.message?.content ?? "";
        if (content.trim()) return content;
      } else {
        console.error("[interlink]", model, res.status, (await res.text().catch(() => "")).slice(0, 180));
      }
    } catch (err) {
      console.error("[interlink] request failed", model, err);
    }
  }
  return null;
}

/** Ask Qwen which phrases in the text should link to which target pages. */
export async function suggestInterlinks(text: string, targets: LinkTarget[], max = 6): Promise<LinkSuggestion[] | null> {
  if (!KEY || !text.trim() || targets.length === 0) return [];
  const list = targets.map((t, i) => `${i + 1}. ${t.title} -> ${t.url}`).join("\n");
  const prompt = [
    "You are an SEO internal-linking assistant for a pharmaceutical quality & compliance consultancy website.",
    `Given the ARTICLE and the list of TARGET PAGES, choose up to ${max} places where a short, natural phrase should link to one of the target pages.`,
    "Rules:",
    "- Only use URLs from the TARGET PAGES list. Never invent or modify a URL.",
    "- Each phrase MUST be an exact, verbatim, case-sensitive substring of the ARTICLE text.",
    "- Pick phrases genuinely relevant to that target page's topic. Prefer 1-4 word phrases.",
    "- Do not link the same phrase twice and do not link generic words.",
    'Respond with ONLY a JSON array, e.g. [{"phrase":"GMP audit","url":"/gmp-audit"}]. No commentary.',
    "",
    "TARGET PAGES:",
    list,
    "",
    "ARTICLE:",
    text.slice(0, 6000),
  ].join("\n");

  const content = await callQwen(prompt);
  if (!content) return null; // AI attempted but unavailable (e.g. free-tier rate limit)
  const start = content.indexOf("[");
  const end = content.lastIndexOf("]");
  if (start === -1 || end === -1) return [];
  try {
    const parsed = JSON.parse(content.slice(start, end + 1)) as LinkSuggestion[];
    const allowed = new Set(targets.map((t) => t.url));
    return parsed.filter((s) => s && typeof s.phrase === "string" && allowed.has(s.url)).slice(0, max);
  } catch {
    return [];
  }
}

/** Insert <a> links into the HTML — text nodes only, first occurrence, never inside an existing link. */
export function applyInterlinks(html: string, suggestions: LinkSuggestion[]): string {
  let out = html;
  const used = new Set<string>();
  for (const { phrase, url } of suggestions) {
    if (!phrase || used.has(phrase.toLowerCase())) continue;
    out = linkFirst(out, phrase, url);
    used.add(phrase.toLowerCase());
  }
  return out;
}

function linkFirst(html: string, phrase: string, url: string): string {
  const tokens = html.split(/(<[^>]+>)/g);
  let insideAnchor = false;
  let done = false;
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok.startsWith("<")) {
      if (/^<a\b/i.test(tok)) insideAnchor = true;
      else if (/^<\/a>/i.test(tok)) insideAnchor = false;
      continue;
    }
    if (done || insideAnchor) continue;
    const idx = tok.indexOf(phrase);
    if (idx !== -1) {
      const anchor = `<a href="${url}" data-ai-link="1">${phrase}</a>`;
      tokens[i] = tok.slice(0, idx) + anchor + tok.slice(idx + phrase.length);
      done = true;
    }
  }
  return tokens.join("");
}

/** Remove previously auto-inserted links so re-publishing recomputes cleanly. */
export function stripAutoLinks(html: string): string {
  return html.replace(/<a\b[^>]*\bdata-ai-link="1"[^>]*>([\s\S]*?)<\/a>/gi, "$1");
}
