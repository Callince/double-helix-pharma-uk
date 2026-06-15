/**
 * Append a precise "Regulatory sources" citation block to every blog post,
 * mapped from the post's category + topic keywords to the exact MHRA / EMA /
 * EudraLex Volume 4 guidance. Idempotent: the block is wrapped in <!--rs-->…
 * <!--/rs--> markers, so re-running replaces it instead of duplicating.
 *
 * Reads TURSO creds from .env.prod.local. Run: node scripts/add-regulatory-refs.mjs
 */
import fs from "node:fs";
import { createClient } from "@libsql/client";

const env = Object.fromEntries(
  fs.readFileSync(".env.prod.local", "utf8").split(/\r?\n/).filter((l) => l && l.includes("=") && !l.startsWith("#")).map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);
const db = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });

// Canonical sources (exact URLs from MHRA / EMA / EudraLex Vol 4)
const S = {
  gmp:     ["https://health.ec.europa.eu/medicinal-products/eudralex/eudralex-volume-4_en", "EudraLex Volume 4 — EU GMP Guidelines"],
  ch1:     ["https://health.ec.europa.eu/document/download/e458c423-f564-4171-b344-030a461c567f_en", "EU GMP Chapter 1 — Pharmaceutical Quality System"],
  ch7:     ["https://health.ec.europa.eu/document/download/58b5106a-cf6f-4352-9dca-1caf5d27d97e_en", "EU GMP Chapter 7 — Outsourced Activities"],
  ch9:     ["https://health.ec.europa.eu/document/download/07195808-d02e-4d7a-b8f4-f84a83278b62_en", "EU GMP Chapter 9 — Self Inspection"],
  partII:  ["https://health.ec.europa.eu/document/download/bd537ccf-9271-4230-bca1-2d8cb655fd83_en", "EU GMP Part II — Active Substances (APIs)"],
  annex1:  ["https://health.ec.europa.eu/document/download/e05af55b-38e9-42bf-8495-194bbf0b9262_en", "EU GMP Annex 1 — Manufacture of Sterile Medicinal Products"],
  annex11: ["https://health.ec.europa.eu/document/download/8d305550-dd22-4dad-8463-2ddb4a1345f1_en", "EU GMP Annex 11 — Computerised Systems"],
  annex15: ["https://health.ec.europa.eu/document/download/7c6c5b3c-4902-46ea-b7ab-7608682fb68d_en", "EU GMP Annex 15 — Qualification and Validation"],
  annex16: ["https://health.ec.europa.eu/document/download/20c41532-33d5-4635-ae80-8735d3d09fe0_en", "EU GMP Annex 16 — Certification by a Qualified Person and Batch Release"],
  emaqa:   ["https://www.ema.europa.eu/en/human-regulatory-overview/research-development/compliance-research-development/good-manufacturing-practice/guidance-good-manufacturing-practice-good-distribution-practice-questions-answers", "EMA — GMP/GDP Questions & Answers"],
  mhra:    ["https://www.gov.uk/government/organisations/medicines-and-healthcare-products-regulatory-agency", "MHRA — UK Medicines & Healthcare products Regulatory Agency"],
  mhrablog:["https://mhrainspectorate.blog.gov.uk/", "MHRA Inspectorate Blog"],
};

const byCat = {
  "gmp & gdp audits": ["gmp", "ch9", "mhrablog", "emaqa"],
  "gmp & inspections": ["gmp", "ch9", "mhrablog", "emaqa"],
  "qms & pqs implementation": ["ch1", "gmp", "emaqa"],
  "quality systems": ["ch1", "gmp", "emaqa"],
  "gdp transport & supply chain": ["emaqa", "mhrablog", "mhra"],
  "gdp & distribution": ["emaqa", "mhrablog", "mhra"],
  "supplier & vendor management": ["ch7", "partII", "emaqa"],
  "supplier management": ["ch7", "partII", "emaqa"],
  "site readiness (mia/wda)": ["mhra", "gmp", "mhrablog"],
  "site readiness": ["mhra", "gmp", "mhrablog"],
  "contract qp, rp & rpi": ["annex16", "emaqa", "gmp"],
  "qualified person": ["annex16", "emaqa", "gmp"],
};
const fallback = ["gmp", "emaqa", "mhra"];

function extras(text) {
  const t = text.toLowerCase();
  const ex = [];
  if (/sterile|annex.?1\b|aseptic|contamination/.test(t)) ex.push("annex1");
  if (/data.?integrity|computeri[sz]|annex.?11|alcoa|audit.?trail|\bcsv\b/.test(t)) ex.push("annex11");
  if (/\bvalidation\b|annex.?15|\biq\b|\boq\b|\bpq\b|process.?qualif|equipment.?qualif/.test(t)) ex.push("annex15");
  if (/\bapi\b|active.?substance|excipient/.test(t)) ex.push("partII");
  if (/outsourc|contract.?manufactur|\bcmo\b|technical.?agreement|quality.?agreement/.test(t)) ex.push("ch7");
  return ex;
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function block(post) {
  const keys = [];
  for (const k of extras(`${post.slug || ""} ${post.title || ""}`)) if (!keys.includes(k)) keys.push(k);
  for (const k of (byCat[(post.category || "").trim().toLowerCase()] || fallback)) if (!keys.includes(k)) keys.push(k);
  const lis = keys.slice(0, 4).map((k) => { const [u, n] = S[k]; return `<li><a href="${u}" target="_blank" rel="noopener noreferrer">${esc(n)}</a></li>`; }).join("");
  return `<!--rs--><h2>Regulatory sources</h2><p>This guidance reflects current UK and EU GMP/GDP requirements. Primary references:</p><ul>${lis}</ul><p><em>Always confirm against the latest published version of each source.</em></p><!--/rs-->`;
}

const posts = (await db.execute("SELECT id, slug, title, category, body FROM posts")).rows;
let n = 0;
for (const p of posts) {
  const stripped = String(p.body || "").replace(/<!--rs-->[\s\S]*?<!--\/rs-->/g, "").trimEnd();
  const next = stripped + block(p);
  await db.execute({ sql: "UPDATE posts SET body=?, updated_at=datetime('now') WHERE id=?", args: [next, p.id] });
  n++;
}
console.log(`Added regulatory-sources block to ${n} posts.`);
const sample = (await db.execute("SELECT title, category, substr(body, -520) tail FROM posts WHERE slug='annex-1-sterile-audit'")).rows[0];
if (sample) { console.log(`\nSample (${sample.title} | ${sample.category}):\n`, sample.tail); }
