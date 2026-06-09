// Render designed, on-brand cover banners (1500x900) for blog posts from the
// FLUX cover plan headlines, then rasterise to WebP.
//   node docs/build_blog_covers.mjs           -> writes public/blog/covers/<slug>.webp
//   node docs/build_blog_covers.mjs --sample  -> renders 2 samples to docs/ as PNG for review
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PLAN = JSON.parse(fs.readFileSync("docs/blog-cover-image-plan.json", "utf8")).posts;
const OUT = "public/blog/covers";
fs.mkdirSync(OUT, { recursive: true });

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function wrap(s, max) {
  const words = String(s ?? "").trim().split(/\s+/);
  const lines = []; let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max) { if (line) lines.push(line); line = w; } else line = (line + " " + w).trim();
  }
  if (line) lines.push(line);
  return lines;
}

function helix() {
  // faint DNA double-helix motif on the right
  let s = `<g opacity="0.16" stroke-linecap="round">`;
  const cx = 1230, top = 120, bottom = 780, turns = 3.1, amp = 95;
  const pts = (phase) => {
    let d = "";
    for (let t = 0; t <= 1.0001; t += 0.04) {
      const y = top + (bottom - top) * t;
      const x = cx + amp * Math.sin(t * turns * 2 * Math.PI + phase);
      d += (t === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " ";
    }
    return d;
  };
  s += `<path d="${pts(0)}" fill="none" stroke="#45c7f2" stroke-width="5"/>`;
  s += `<path d="${pts(Math.PI)}" fill="none" stroke="#8ace3a" stroke-width="5"/>`;
  for (let t = 0.06; t < 1; t += 0.1) {
    const y = top + (bottom - top) * t;
    const x1 = cx + amp * Math.sin(t * turns * 2 * Math.PI);
    const x2 = cx + amp * Math.sin(t * turns * 2 * Math.PI + Math.PI);
    s += `<line x1="${x1.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#7fd0ec" stroke-width="3.5"/>`;
  }
  return s + `</g>`;
}

function cover(p) {
  const headlineLines = wrap(p.headline.toUpperCase(), 20).slice(0, 3);
  const subLines = wrap(p.subheading, 46).slice(0, 3);
  const hSize = headlineLines.length >= 3 ? 60 : 70;
  const blockH = headlineLines.length * (hSize + 8) + 26 + subLines.length * 38;
  let y = Math.max(300, (900 - blockH) / 2 + hSize);
  let body = "";
  body += `<text x="100" y="${y - hSize - 26}" font-size="22" font-weight="700" letter-spacing="6" fill="#45c7f2">${esc(p.category.toUpperCase())}</text>`;
  for (const ln of headlineLines) { body += `<text x="100" y="${y}" font-size="${hSize}" font-weight="800" fill="#ffffff">${esc(ln)}</text>`; y += hSize + 8; }
  y += 18;
  for (const ln of subLines) { body += `<text x="100" y="${y}" font-size="30" fill="#cfe0ee">${esc(ln)}</text>`; y += 38; }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1500 900" font-family="'Segoe UI',Helvetica,Arial,sans-serif">
<defs>
  <radialGradient id="glow" cx="0.82" cy="0.12" r="0.9"><stop offset="0" stop-color="#0c3f7a"/><stop offset="0.45" stop-color="#062f63"/><stop offset="1" stop-color="#001a45"/></radialGradient>
  <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8ace3a"/><stop offset="0.5" stop-color="#0aa6e2"/><stop offset="1" stop-color="#042a63"/></linearGradient>
  <pattern id="dots" width="34" height="34" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="#2a6cb0" opacity="0.14"/></pattern>
</defs>
<rect width="1500" height="900" fill="url(#glow)"/>
<rect width="1500" height="900" fill="url(#dots)"/>
${helix()}
<rect x="0" y="0" width="14" height="900" fill="url(#bar)"/>
${body}
<text x="100" y="820" font-size="24" font-weight="700" letter-spacing="2" fill="#ffffff">DOUBLE HELIX PHARMA UK</text>
<text x="100" y="850" font-size="18" fill="#7fa9cf">Pharmaceutical Quality &amp; Compliance</text>
</svg>`;
}

const sample = process.argv.includes("--sample");
const posts = sample ? PLAN.filter((p) => ["gmp-audit-checklist", "mia-vs-wda"].includes(p.slug)) : PLAN;
let n = 0;
for (const p of posts) {
  const svg = Buffer.from(cover(p));
  if (sample) { await sharp(svg).png().toFile("docs/_cover-" + p.slug + ".png"); }
  else { await sharp(svg).webp({ quality: 86 }).toFile(path.join(OUT, p.slug + ".webp")); }
  n++;
}
console.log(sample ? `rendered ${n} sample PNGs to docs/` : `rendered ${n} cover WebPs to ${OUT}`);
