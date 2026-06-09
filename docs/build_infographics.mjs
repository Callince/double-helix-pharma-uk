// Generates branded SVG infographics for the blog → public/blog/*.svg
// Run: node docs/build_infographics.mjs
import fs from "node:fs";
import path from "node:path";

const NAVY = "#042a63", TEAL = "#0aa6e2", GREEN = "#2f8f3a", NAVY_T = "#9fd0ec",
      MUTED = "#5f7283", LINE = "#d4dde6";
const FONT = "Helvetica, Arial, system-ui, sans-serif";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function infographic({ eyebrow, title, items }) {
  const W = 800, headerH = 96, padX = 40, rowH = 66, top = headerH + 26;
  const H = top + items.length * rowH + 40;
  const rows = items.map((it, i) => {
    const y = top + i * rowH, cy = y + 20;
    const divider = i < items.length - 1
      ? `<line x1="${padX + 58}" y1="${y + rowH - 12}" x2="${W - padX}" y2="${y + rowH - 12}" stroke="${LINE}" stroke-width="1"/>` : "";
    return `<g>
    <circle cx="${padX + 20}" cy="${cy}" r="19" fill="url(#g)"/>
    <text x="${padX + 20}" y="${cy + 6}" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="700" fill="#ffffff">${i + 1}</text>
    <text x="${padX + 58}" y="${y + 15}" font-family="${FONT}" font-size="17" font-weight="700" fill="${NAVY}">${esc(it.label)}</text>
    <text x="${padX + 58}" y="${y + 37}" font-family="${FONT}" font-size="13" fill="${MUTED}">${esc(it.desc)}</text>
    ${divider}
  </g>`;
  }).join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(title)}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${TEAL}"/><stop offset="1" stop-color="${GREEN}"/>
    </linearGradient>
  </defs>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="16" fill="#ffffff" stroke="${LINE}"/>
  <path d="M0,16 Q0,0 16,0 H${W - 16} Q${W},0 ${W},16 V${headerH} H0 Z" fill="${NAVY}"/>
  <rect x="0" y="${headerH - 4}" width="${Math.round(W * 0.34)}" height="4" fill="${GREEN}"/>
  <rect x="${Math.round(W * 0.34)}" y="${headerH - 4}" width="${W - Math.round(W * 0.34)}" height="4" fill="${TEAL}"/>
  <text x="${padX}" y="40" font-family="${FONT}" font-size="12" font-weight="700" letter-spacing="1.5" fill="${NAVY_T}">${esc(eyebrow.toUpperCase())}</text>
  <text x="${padX}" y="73" font-family="${FONT}" font-size="24" font-weight="700" fill="#ffffff">${esc(title)}</text>
  ${rows}
  <text x="${W - padX}" y="${H - 17}" text-anchor="end" font-family="${FONT}" font-size="11" font-weight="700" letter-spacing="0.5" fill="${MUTED}">DOUBLE HELIX PHARMA UK</text>
</svg>`;
}

const SETS = {
  "gmp-7-steps": {
    eyebrow: "GMP & GDP Audits", title: "7 Steps to Inspection Readiness",
    items: [
      { label: "Honest gap assessment", desc: "Score every gap against EU GMP by risk and effort." },
      { label: "Quality-system documentation", desc: "Site Master File, quality manual and SOPs all current." },
      { label: "Defensible deviations & CAPAs", desc: "Sound root cause, real impact, on-time closure." },
      { label: "Data integrity", desc: "Walk your data against the ALCOA+ principles." },
      { label: "Supplier oversight", desc: "Approved list current; audits scheduled and on time." },
      { label: "Mock inspection", desc: "A realistic dry run, ideally led independently." },
      { label: "Inspection-day plan", desc: "Hosts, back room and document control agreed up front." },
    ],
  },
  "qp-roles": {
    eyebrow: "Contract QP, RP & RPi", title: "QP vs RP vs RPi: Who Does What",
    items: [
      { label: "Qualified Person (QP)", desc: "Certifies and releases each batch of product to market." },
      { label: "Responsible Person (RP)", desc: "Ensures GDP across storage and distribution for a WDA." },
      { label: "RP for Import (RPi)", desc: "Oversees the import of medicines into Great Britain." },
    ],
  },
  "qms-pillars": {
    eyebrow: "QMS & PQS Implementation", title: "Pillars of an Effective Quality System",
    items: [
      { label: "Document control", desc: "One controlled source of truth for every procedure." },
      { label: "Deviation & CAPA", desc: "Investigate, correct and prevent recurrence." },
      { label: "Change control", desc: "Assess and approve changes before they happen." },
      { label: "Risk management", desc: "Decisions driven by documented risk (ICH Q9)." },
      { label: "Management review", desc: "Leadership owns quality-system performance." },
      { label: "Continual improvement", desc: "Trend, learn and raise the standard over time." },
    ],
  },
  "site-readiness-journey": {
    eyebrow: "Site Readiness (MIA / WDA)", title: "The Licence Journey, Step by Step",
    items: [
      { label: "Gap assessment", desc: "Map the distance to MIA / WDA requirements." },
      { label: "Build the QMS", desc: "Procedures, roles and records all in place." },
      { label: "Facilities & validation", desc: "Premises, equipment and systems qualified." },
      { label: "Application & dossier", desc: "Submit a complete, defensible application." },
      { label: "Pre-inspection prep", desc: "Mock inspection and subject-matter-expert readiness." },
      { label: "Inspection & grant", desc: "Host the MHRA visit and close any findings." },
    ],
  },
  "supplier-lifecycle": {
    eyebrow: "Supplier & Vendor Management", title: "The Supplier Qualification Lifecycle",
    items: [
      { label: "Risk classification", desc: "Rank suppliers by their impact on product quality." },
      { label: "Initial qualification", desc: "Documentation, questionnaires and evidence." },
      { label: "Audit", desc: "Verify GMP / GDP compliance on the ground." },
      { label: "Approval", desc: "Add to the approved supplier list with a defined scope." },
      { label: "Ongoing monitoring", desc: "Track performance, deviations and changes." },
      { label: "Re-qualification", desc: "Re-audit on a risk-based schedule." },
    ],
  },
  "gdp-flow": {
    eyebrow: "GDP Transport & Supply Chain", title: "Protecting the Distribution Chain",
    items: [
      { label: "Qualified partners", desc: "Only approved suppliers, hauliers and customers." },
      { label: "Temperature control", desc: "Mapped, monitored and alarmed throughout transit." },
      { label: "Secure transport", desc: "Routes and handovers that prevent loss or tampering." },
      { label: "Documentation", desc: "Full traceability from dispatch to delivery." },
      { label: "Risk management", desc: "Assess and mitigate the weak points in the chain." },
      { label: "Recall readiness", desc: "Be able to act fast and completely when needed." },
    ],
  },
};

const outDir = path.join(process.cwd(), "public", "blog");
fs.mkdirSync(outDir, { recursive: true });
for (const [name, data] of Object.entries(SETS)) {
  fs.writeFileSync(path.join(outDir, `${name}.svg`), infographic(data), "utf8");
  console.log("wrote public/blog/" + name + ".svg");
}
