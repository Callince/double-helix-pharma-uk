/**
 * Generate 100 blog cover images via Pollinations FLUX (no ComfyUI needed),
 * then composite the headline + subheading over each. RUN THIS IN YOUR OWN
 * TERMINAL — Pollinations blocks Claude's server IP (402) but NOT your home IP:
 *
 *     node docs/generate-covers-pollinations.mjs
 *
 * Reads POLLINATIONS_TOKEN from .env.flux.local and the briefs from
 * docs/blog-cover-image-plan.json. Output: public/blog/covers/<slug>.webp
 * (overwrites the designed banners). Resumable via docs/_poll-covers-done.json.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT = "public/blog/covers";
const DONE_FILE = "docs/_poll-covers-done.json";
fs.mkdirSync(OUT, { recursive: true });

const env = Object.fromEntries(
  fs.readFileSync(".env.flux.local", "utf8").split(/\r?\n/).filter((l) => l && l.includes("=")).map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);
const TOKEN = env.POLLINATIONS_TOKEN || "";

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function wrap(s, max) {
  const words = String(s ?? "").trim().split(/\s+/); const lines = []; let line = "";
  for (const w of words) { if ((line + " " + w).trim().length > max) { if (line) lines.push(line); line = w; } else line = (line + " " + w).trim(); }
  if (line) lines.push(line); return lines;
}
function seedFrom(slug) { let h = 0; for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h % 2147483647; }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchImage(prompt, slug) {
  const url = "https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt) +
    "?width=1536&height=896&nologo=true&model=flux&seed=" + seedFrom(slug) +
    (TOKEN ? "&token=" + encodeURIComponent(TOKEN) : "");
  let lastErr = "";
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt) await sleep([0, 4000, 9000, 18000][attempt]);
    try {
      const r = await fetch(url, { headers: TOKEN ? { Authorization: "Bearer " + TOKEN } : {}, redirect: "follow" });
      const ct = r.headers.get("content-type") || "";
      const buf = Buffer.from(await r.arrayBuffer());
      if (r.ok && ct.startsWith("image") && buf.length > 2000) return buf;
      lastErr = r.status + " " + ct + " " + buf.toString().slice(0, 120);
    } catch (e) { lastErr = e.message; }
  }
  throw new Error(lastErr);
}

function overlay(p) {
  const head = wrap(p.headline.toUpperCase(), 20).slice(0, 3);
  const sub = wrap(p.subheading, 46).slice(0, 3);
  const hSize = head.length >= 3 ? 60 : 70;
  const blockH = head.length * (hSize + 8) + 26 + sub.length * 38;
  let y = Math.max(300, (900 - blockH) / 2 + hSize);
  let t = "";
  t += `<text x="100" y="${y - hSize - 26}" font-size="22" font-weight="700" letter-spacing="6" fill="#7fe0ff">${esc(p.category.toUpperCase())}</text>`;
  for (const ln of head) { t += `<text x="100" y="${y}" font-size="${hSize}" font-weight="800" fill="#ffffff">${esc(ln)}</text>`; y += hSize + 8; }
  y += 18;
  for (const ln of sub) { t += `<text x="100" y="${y}" font-size="30" fill="#e8f1f8">${esc(ln)}</text>`; y += 38; }
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="900">
<defs>
  <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#021634" stop-opacity="0.92"/><stop offset="0.55" stop-color="#042a63" stop-opacity="0.55"/><stop offset="1" stop-color="#042a63" stop-opacity="0"/></linearGradient>
  <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8ace3a"/><stop offset="0.5" stop-color="#0aa6e2"/><stop offset="1" stop-color="#042a63"/></linearGradient>
</defs>
<rect width="1500" height="900" fill="url(#scrim)"/>
<rect x="0" y="0" width="12" height="900" fill="url(#bar)"/>
${t}
<text x="100" y="822" font-size="24" font-weight="700" letter-spacing="2" fill="#ffffff" font-family="'Segoe UI',Helvetica,Arial,sans-serif">DOUBLE HELIX PHARMA UK</text>
<text x="100" y="850" font-size="18" fill="#bcd4e8" font-family="'Segoe UI',Helvetica,Arial,sans-serif">Pharmaceutical Quality &amp; Compliance</text>
</svg>`);
}

// ---- run ----
const posts = JSON.parse(fs.readFileSync("docs/blog-cover-image-plan.json", "utf8")).posts;
const done = new Set(fs.existsSync(DONE_FILE) ? JSON.parse(fs.readFileSync(DONE_FILE, "utf8")) : []);
console.log(`Pollinations FLUX → ${posts.length} covers (token: ${TOKEN ? "yes" : "NONE"})`);
let ok = done.size, fail = 0;
for (const p of posts) {
  if (done.has(p.slug)) continue;
  try {
    const bg = await fetchImage(p.flux_prompt, p.slug);
    const base = await sharp(bg).resize(1500, 900, { fit: "cover", position: "centre" }).toBuffer();
    await sharp(base).composite([{ input: overlay(p), top: 0, left: 0 }]).webp({ quality: 86 }).toFile(path.join(OUT, p.slug + ".webp"));
    done.add(p.slug); ok++;
    fs.writeFileSync(DONE_FILE, JSON.stringify([...done]));
    console.log(`  [${ok}/${posts.length}] ${p.slug}`);
    await sleep(1200);
  } catch (e) {
    fail++; console.error(`  ✗ ${p.slug}: ${e.message}`);
  }
}
console.log(`Done. covers: ${ok}/${posts.length}, failures: ${fail}.${fail ? " Re-run to retry the failures." : ""} Then tell Claude to deploy.`);
