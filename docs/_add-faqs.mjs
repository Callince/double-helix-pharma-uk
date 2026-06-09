// One-off: attach FAQ sets to the blog draft JSONs. Run: node docs/_add-faqs.mjs
import fs from "node:fs";

const FAQS = {
  "gmp-audit-readiness-checklist": [
    { q: "How long does it take to prepare for a GMP inspection?", a: "It depends on your starting point, but a focused readiness programme usually runs 4–12 weeks: a gap assessment first, then prioritised remediation, with a mock inspection close to the date." },
    { q: "What do MHRA inspectors focus on most?", a: "Data integrity, deviation and CAPA management, and whether your documented quality system matches what actually happens on the floor." },
    { q: "Can you support us during the inspection itself?", a: "Yes — we can run the back room, manage document retrieval and real-time findings, and lead the CAPA response afterwards." },
  ],
  "when-do-you-need-a-contract-qp": [
    { q: "What is the difference between a QP, an RP and an RPi?", a: "A QP certifies batches for release; an RP oversees Good Distribution Practice on a wholesale (WDA) licence; an RPi oversees the import of certain medicines into Great Britain." },
    { q: "Can a contract QP be named on our licence?", a: "Yes — an experienced contract QP can be named on your MIA and certify batches, provided they have genuine, documented oversight of your quality system." },
    { q: "How quickly can interim QP cover start?", a: "Often within days for an urgent gap, after a short due-diligence review of your products and quality system." },
  ],
  "building-an-effective-pharmaceutical-qms": [
    { q: "Which standards should our QMS follow?", a: "EU GMP Chapter 1 and ICH Q10 are the backbone, supported by quality risk management (ICH Q9) and, where relevant, US 21 CFR 210/211." },
    { q: "How long does a QMS take to implement?", a: "A proportionate, inspection-ready system for a small site is typically built in 3–6 months, depending on scope and existing maturity." },
    { q: "Will the system be tailored to our size?", a: "Always — an effective QMS is proportionate to your risk and operations, not a generic binder of SOPs nobody follows." },
  ],
  "mia-wda-licence-readiness-guide": [
    { q: "What is the difference between an MIA and a WDA?", a: "An MIA (Manufacturer's / Importer's Authorisation) covers manufacture or import; a WDA (Wholesale Dealer's Authorisation) covers storage and distribution." },
    { q: "How long does it take to get a licence?", a: "After applying, expect an MHRA inspection and several months to determination — readiness work before you apply is what keeps that timeline short." },
    { q: "What do we need in place before applying?", a: "Suitable premises, a working quality system, named responsible people (QP / RP) and a Site Master File — we help you put all of these in place." },
  ],
  "supplier-qualification-that-protects-quality": [
    { q: "When does a supplier need an on-site audit?", a: "Risk-based: critical material and active-ingredient suppliers usually warrant on-site audits, while lower-risk suppliers may be qualified by questionnaire and documentation." },
    { q: "How often should suppliers be re-audited?", a: "Typically every 1–3 years based on risk and performance, with interim monitoring of quality and delivery metrics." },
    { q: "Can you run supplier audits on our behalf?", a: "Yes — we conduct independent GMP/GDP supplier audits in the UK, EU and internationally and deliver clear, actionable reports." },
  ],
  "protecting-the-gdp-supply-chain": [
    { q: "What does Good Distribution Practice cover?", a: "The storage, transport and handling of medicines after manufacture — temperature control, traceability, verifying supplier and customer bona fides, and preventing falsified products." },
    { q: "Do we need a Responsible Person?", a: "Yes — every WDA holder must name an RP responsible for GDP compliance. We provide contract RP / RPi cover where needed." },
    { q: "How do we keep cold-chain shipments compliant?", a: "Qualified shipping lanes, validated packaging, continuous temperature monitoring and a clear excursion-management procedure." },
  ],
};

const files = fs.readdirSync("docs").filter((f) => f.startsWith("blog-draft-") && f.endsWith(".json"));
for (const f of files) {
  const p = JSON.parse(fs.readFileSync("docs/" + f, "utf8"));
  if (FAQS[p.slug]) {
    p.faqs = FAQS[p.slug];
    fs.writeFileSync("docs/" + f, JSON.stringify(p, null, 2) + "\n");
    console.log("added", FAQS[p.slug].length, "FAQs to", p.slug);
  } else {
    console.log("(no FAQ set for", p.slug + ")");
  }
}
