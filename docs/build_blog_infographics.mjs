// Render on-brand SVG infographics for blog posts from *.info.json specs.
//   node docs/build_blog_infographics.mjs
// Reads  docs/generated-blogs/<slug>.info.json
// Writes public/blog/infographics/<slug>.svg
import fs from "node:fs";
import path from "node:path";

const SRC = "docs/generated-blogs";
const OUT = "public/blog/infographics";
fs.mkdirSync(OUT, { recursive: true });

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const clip = (s, n) => { s = String(s ?? "").trim(); return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s; };
function wrap(s, max) {
  const words = String(s ?? "").trim().split(/\s+/);
  const lines = []; let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max) { if (line) lines.push(line); line = w; }
    else line = (line + " " + w).trim();
  }
  if (line) lines.push(line);
  return lines;
}

const DEFS = `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7cc63f"/><stop offset="0.54" stop-color="#0aa6e2"/><stop offset="1" stop-color="#042a63"/></linearGradient></defs>`;

function frame(title, inner) {
  const t = clip(title, 52);
  const fs2 = t.length > 38 ? 22 : 26;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 480" font-family="'Segoe UI',Helvetica,Arial,sans-serif">
${DEFS}
<rect x="1.5" y="1.5" width="917" height="477" rx="18" fill="#ffffff" stroke="#e1e8ee" stroke-width="1.5"/>
<rect x="40" y="34" width="46" height="6" rx="3" fill="url(#bg)"/>
<text x="40" y="72" font-size="${fs2}" font-weight="700" fill="#042a63">${esc(t)}</text>
${inner}
<text x="884" y="456" font-size="12" fill="#9aa7b4" text-anchor="end">Double Helix Pharma</text>
</svg>`;
}

function steps(items) {
  const n = Math.min(items.length, 6);
  const top = 124, bottom = 420, gap = n > 1 ? (bottom - top) / (n - 1) : 0;
  let s = n > 1 ? `<line x1="66" y1="${top}" x2="66" y2="${top + gap * (n - 1)}" stroke="#dbe4ec" stroke-width="3"/>` : "";
  items.slice(0, n).forEach((it, i) => {
    const y = top + gap * i;
    s += `<circle cx="66" cy="${y}" r="20" fill="url(#bg)"/>`;
    s += `<text x="66" y="${y + 6}" font-size="18" font-weight="700" fill="#fff" text-anchor="middle">${i + 1}</text>`;
    s += `<text x="108" y="${y - (it.desc ? 1 : -5)}" font-size="18" font-weight="600" fill="#042a63">${esc(clip(it.label, 56))}</text>`;
    if (it.desc) s += `<text x="108" y="${y + 21}" font-size="14" fill="#5f7283">${esc(clip(it.desc, 78))}</text>`;
  });
  return s;
}

function checklist(items) {
  const n = Math.min(items.length, 6);
  const top = 124, gap = 56;
  let s = "";
  items.slice(0, n).forEach((it, i) => {
    const y = top + gap * i;
    s += `<circle cx="62" cy="${y}" r="16" fill="#eaf6ee" stroke="#2f8f3a" stroke-width="1.5"/>`;
    s += `<path d="M54 ${y} l5 6 l11 -12" fill="none" stroke="#2f8f3a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += `<text x="92" y="${y - (it.desc ? 1 : -5)}" font-size="17" font-weight="600" fill="#042a63">${esc(clip(it.label, 60))}</text>`;
    if (it.desc) s += `<text x="92" y="${y + 19}" font-size="13.5" fill="#5f7283">${esc(clip(it.desc, 84))}</text>`;
  });
  return s;
}

function pillars(items) {
  const n = Math.min(Math.max(items.length, 1), 5);
  const m = 28, gapX = 18, w = (920 - 2 * m - gapX * (n - 1)) / n, top = 108, h = 326;
  let s = "";
  items.slice(0, n).forEach((it, i) => {
    const x = m + i * (w + gapX);
    s += `<rect x="${x}" y="${top}" width="${w}" height="${h}" rx="12" fill="#f3f7fa" stroke="#e1e8ee"/>`;
    s += `<rect x="${x}" y="${top}" width="${w}" height="8" rx="4" fill="url(#bg)"/>`;
    s += `<text x="${x + w / 2}" y="${top + 52}" font-size="22" font-weight="700" fill="#0aa6e2" text-anchor="middle">${i + 1}</text>`;
    wrap(it.label, Math.max(10, Math.floor(w / 8))).slice(0, 2).forEach((ln, li) =>
      s += `<text x="${x + w / 2}" y="${top + 88 + li * 22}" font-size="16" font-weight="600" fill="#042a63" text-anchor="middle">${esc(ln)}</text>`);
    if (it.desc) wrap(it.desc, Math.max(14, Math.floor(w / 6.5))).slice(0, 4).forEach((ln, li) =>
      s += `<text x="${x + w / 2}" y="${top + 142 + li * 18}" font-size="12.5" fill="#5f7283" text-anchor="middle">${esc(ln)}</text>`);
  });
  return s;
}

function comparison(d) {
  const sides = [[d.left || {}, 36, "#0aa6e2"], [d.right || {}, 478, "#2f8f3a"]];
  let s = "";
  for (const [p, x, clr] of sides) {
    s += `<rect x="${x}" y="104" width="406" height="332" rx="14" fill="#ffffff" stroke="#e1e8ee"/>`;
    s += `<path d="M${x + 14} 104 h378 a14 14 0 0 1 14 14 v34 h-406 v-34 a14 14 0 0 1 14 -14 z" fill="${clr}"/>`;
    s += `<text x="${x + 203}" y="135" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">${esc(clip(p.heading || "", 30))}</text>`;
    (p.points || []).slice(0, 5).forEach((pt, i) => {
      const y = 188 + i * 46;
      s += `<circle cx="${x + 26}" cy="${y - 4}" r="3.5" fill="${clr}"/>`;
      wrap(pt, 44).slice(0, 2).forEach((ln, li) =>
        s += `<text x="${x + 42}" y="${y + li * 17}" font-size="13.5" fill="#243748">${esc(ln)}</text>`);
    });
  }
  s += `<circle cx="460" cy="270" r="25" fill="#042a63"/><text x="460" y="276" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">VS</text>`;
  return s;
}

function cycle(items) {
  const cx = 460, cy = 276, R = 132, n = Math.min(Math.max(items.length, 2), 6);
  let s = `<circle cx="${cx}" cy="${cy}" r="58" fill="url(#bg)"/><text x="${cx}" y="${cy + 5}" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">CONTINUOUS</text>`;
  items.slice(0, n).forEach((it, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const nx = cx + R * Math.cos(a), ny = cy + R * Math.sin(a);
    s += `<circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="28" fill="#fff" stroke="#0aa6e2" stroke-width="2"/>`;
    s += `<text x="${nx.toFixed(1)}" y="${(ny + 5).toFixed(1)}" font-size="15" font-weight="700" fill="#136c9c" text-anchor="middle">${i + 1}</text>`;
    const lx = cx + (R + 52) * Math.cos(a), ly = cy + (R + 52) * Math.sin(a);
    const anchor = Math.abs(Math.cos(a)) < 0.34 ? "middle" : Math.cos(a) > 0 ? "start" : "end";
    wrap(it.label, 20).slice(0, 2).forEach((ln, li) =>
      s += `<text x="${lx.toFixed(1)}" y="${(ly + li * 15).toFixed(1)}" font-size="13" font-weight="600" fill="#042a63" text-anchor="${anchor}">${esc(ln)}</text>`);
  });
  return s;
}

const RENDER = { steps, checklist, pillars, cycle };

const files = fs.readdirSync(SRC).filter((f) => f.endsWith(".info.json"));
let ok = 0, skip = [];
for (const f of files) {
  try {
    const d = JSON.parse(fs.readFileSync(path.join(SRC, f), "utf8"));
    if (!d.slug || !d.type || !d.title) { skip.push(f + " (missing fields)"); continue; }
    let body;
    if (d.type === "comparison") body = comparison(d);
    else if (RENDER[d.type]) body = RENDER[d.type]((d.items || []));
    else body = pillars(d.items || []); // fallback
    const svg = frame(d.title, body);
    fs.writeFileSync(path.join(OUT, d.slug + ".svg"), svg);
    ok++;
  } catch (e) { skip.push(f + " (" + e.message + ")"); }
}
console.log("rendered SVGs:", ok, "of", files.length);
if (skip.length) console.log("skipped:", skip.length, skip.slice(0, 8));
