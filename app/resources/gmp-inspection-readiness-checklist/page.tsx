import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CTABand } from "@/components/sections/CTABand";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { PrintButton } from "@/components/PrintButton";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "GMP Inspection-Readiness Checklist | Double Helix Pharma",
  absoluteTitle: true,
  description:
    "A free, QP-built GMP inspection-readiness checklist covering the 10 areas an MHRA inspector examines — PQS, data integrity, suppliers, CAPA and more.",
  path: "/resources/gmp-inspection-readiness-checklist",
});

type Section = { n: string; title: string; ref: string; items: string[] };

const sections: Section[] = [
  {
    n: "01",
    title: "Pharmaceutical Quality System (PQS)",
    ref: "EU GMP Ch.1 · ICH Q10",
    items: [
      "Quality Manual is current, approved and reflects how the site actually operates",
      "Quality policy and measurable quality objectives are defined and communicated",
      "Management review held at a defined frequency with documented, tracked actions",
      "Quality risk management (ICH Q9) is embedded in decisions, not retrofitted",
      "Product Quality Reviews (PQRs/APRs) are complete and on schedule for every product",
      "Quality metrics/KPIs are trended, escalated and acted on",
    ],
  },
  {
    n: "02",
    title: "Documentation & Data Integrity",
    ref: "ALCOA+ · Annex 11",
    items: [
      "Document control SOP in place; all SOPs are within their review date",
      "Good documentation practice followed — no uncontrolled forms or loose paper",
      "Data integrity policy applies ALCOA+ to both paper and electronic records",
      "Audit trails are enabled, reviewed and protected on all computerised systems",
      "Unique user logins and role-based access — no shared accounts",
      "Backup, archival and retention are defined and have been restore-tested",
    ],
  },
  {
    n: "03",
    title: "Personnel & Training",
    ref: "EU GMP Ch.2",
    items: [
      "Organisation chart is current; key roles and named deputies are defined",
      "Job descriptions capture GMP responsibilities (including QP duties)",
      "Role-based training matrix; GMP and data-integrity training are current",
      "Training effectiveness is assessed — not just attendance recorded",
      "Hygiene and gowning qualification for production and clean areas",
    ],
  },
  {
    n: "04",
    title: "Premises & Equipment",
    ref: "Annex 15 · Annex 1",
    items: [
      "Facility layout supports material/personnel flow with no cross-contamination risk",
      "Cleaning and sanitisation SOPs and records; cleaning validation where required",
      "Equipment qualified (URS/DQ/IQ/OQ/PQ) and within calibration",
      "Preventive maintenance is scheduled and recorded",
      "Utilities (HVAC, water, compressed gases) qualified and monitored",
      "Environmental monitoring programme in place where applicable (incl. Annex 1)",
    ],
  },
  {
    n: "05",
    title: "Production & Process Control",
    ref: "EU GMP Ch.5 · Annex 15",
    items: [
      "Process validation current; ongoing process verification in place",
      "Batch records reviewed; in-process controls defined and consistently met",
      "Line clearance procedures and records prevent product mix-ups",
      "Yield reconciliation performed and discrepancies investigated",
      "Labelling and packaging controls prevent mix-ups and errors",
    ],
  },
  {
    n: "06",
    title: "Quality Control & Laboratory",
    ref: "EU GMP Ch.6",
    items: [
      "Specifications and analytical methods are validated or verified",
      "OOS/OOT investigation procedure is followed — no invalidation without cause",
      "Reference standards, reagents and columns are controlled and in date",
      "Stability programme is ongoing and results are trended",
      "Sampling plans and retained/reference samples meet requirements",
    ],
  },
  {
    n: "07",
    title: "Materials & Supplier Management",
    ref: "EU GMP Ch.5 & Ch.7",
    items: [
      "Approved Supplier List maintained; suppliers qualified on a risk basis",
      "Supplier/vendor audits scheduled and current (especially APIs and sterile)",
      "Quality/technical agreements in place for all outsourced activities",
      "Incoming identity testing and API GMP evidence in place",
      "Goods received, quarantined and released under defined controls",
    ],
  },
  {
    n: "08",
    title: "Deviations, CAPA & Change Control",
    ref: "ICH Q10",
    items: [
      "Deviation system drives root-cause analysis, not just correction",
      "CAPA effectiveness checks are closed within agreed timelines",
      "Change control assesses regulatory and validation impact before implementation",
      "Open deviation/CAPA backlog is under control and any ageing is justified",
    ],
  },
  {
    n: "09",
    title: "Complaints, Recalls & Returns",
    ref: "EU GMP Ch.8",
    items: [
      "Complaint-handling procedure in place; complaints are trended",
      "Recall procedure tested by mock recall; out-of-hours contact confirmed",
      "Returns and falsified-medicine (FMD) procedures are defined",
      "Reporting routes to the MHRA / competent authority are understood",
    ],
  },
  {
    n: "10",
    title: "Self-Inspection & Inspection Readiness",
    ref: "EU GMP Ch.9",
    items: [
      "Self-inspection programme covers every GMP area on a defined cycle",
      "Previous inspection findings and CAPAs are closed and verified effective",
      "Site Master File is current and accurate",
      "Front-room/back-room, SME list and rapid document retrieval are ready",
      "Staff briefed on inspection conduct: answer the question asked, tell the truth, don't speculate",
    ],
  },
];

const totalItems = sections.reduce((n, s) => n + s.items.length, 0);

export default function ChecklistPage() {
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to prepare for an MHRA GMP inspection",
    description:
      "A 10-area GMP inspection-readiness checklist covering the pharmaceutical quality system, data integrity, suppliers, CAPA and self-inspection.",
    totalTime: "P6W",
    step: sections.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      itemListElement: s.items.map((t) => ({ "@type": "HowToDirection", text: t })),
      url: `${site.url}/resources/gmp-inspection-readiness-checklist#area-${s.n}`,
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
            { name: "GMP Inspection-Readiness Checklist", path: "/resources/gmp-inspection-readiness-checklist" },
          ]),
          howTo,
        ]}
      />

      {/* Header */}
      <header className="border-b border-line bg-hero-light">
        <Container size="narrow">
          <div className="py-14 sm:py-20">
            <nav className="label-mono flex items-center gap-2 text-muted">
              <a href="/resources" className="transition-colors hover:text-teal-ink">Resources</a>
              <span aria-hidden>/</span>
              <span className="text-teal-ink">Checklist</span>
            </nav>
            <p className="label-mono mt-6 text-teal-ink">Free download · {totalItems} checkpoints</p>
            <h1 className="mt-4 font-display text-[2.3rem] font-medium leading-[1.1] tracking-[-0.02em] text-navy sm:text-[2.9rem]">
              GMP Inspection-Readiness Checklist
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/80">
              A GMP inspection-readiness checklist is a structured, area-by-area review of the systems an
              MHRA (or EMA/FDA) inspector will examine — from the quality system and data integrity to
              suppliers, CAPA and self-inspection. Work through the {totalItems} checkpoints below to find
              your gaps <em className="font-display not-italic text-teal-ink">before</em> an inspector does.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <PrintButton />
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-navy/20 px-6 py-3 text-[0.95rem] font-medium text-navy transition-colors hover:border-navy/50 hover:bg-navy/[0.03]"
              >
                Have a QP run it with you
                <Icon name="arrow-right" className="size-4" />
              </a>
            </div>
          </div>
        </Container>
      </header>

      {/* Checklist */}
      <section className="bg-white py-12 sm:py-16">
        <Container size="narrow">
          <div data-print-root>
            {/* Print-only masthead */}
            <div className="hidden print:mb-6 print:block">
              <p className="text-sm font-semibold text-navy">Double Helix Pharma UK — GMP Inspection-Readiness Checklist</p>
              <p className="text-xs text-muted">doublehelixpharma.co.uk/resources/gmp-inspection-readiness-checklist</p>
            </div>

            <div className="space-y-5">
              {sections.map((s) => (
                <div
                  key={s.n}
                  id={`area-${s.n}`}
                  className="break-inside-avoid rounded-2xl border border-line bg-white p-6 sm:p-7"
                >
                  <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
                    <h2 className="font-display text-xl font-medium text-navy">
                      <span className="text-teal-ink">{s.n}</span> &nbsp;{s.title}
                    </h2>
                    <span className="label-mono shrink-0 text-right text-muted">{s.ref}</span>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 size-4 shrink-0 rounded-[5px] border border-navy/35" aria-hidden />
                        <span className="text-[0.98rem] leading-relaxed text-ink">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Print-only footer */}
            <p className="mt-6 hidden text-xs leading-relaxed text-muted print:block">
              © Double Helix Pharma UK Ltd. A guide only — confirm against the current EudraLex Vol. 4,
              MHRA guidance and your own licence conditions. Need help closing the gaps? doublehelixpharma.co.uk/contact
            </p>
          </div>

          {/* On-screen only: related links + CTA */}
          <div className="no-print mt-12 rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <h2 className="font-display text-xl font-medium text-navy">Turn the gaps into an inspection-ready operation</h2>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">
              Found items you can&apos;t confidently tick? That&apos;s exactly where we work. Explore the
              services behind each section:
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { href: "/gmp-audit", label: "GMP & GDP Audits", desc: "Independent gap assessment & mock inspection" },
                { href: "/contract-qp", label: "Contract QP / RP / RPi", desc: "Qualified Person cover and batch release" },
                { href: "/qms-implementation", label: "QMS Implementation", desc: "Build the PQS, SOPs and data-integrity controls" },
                { href: "/site-readiness", label: "MIA / WDA Site Readiness", desc: "From application to a clean first inspection" },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="group flex items-start gap-3 rounded-xl border border-line bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-[0_18px_40px_-30px_rgba(6,41,92,0.5)]"
                >
                  <Icon name="shield-check" className="mt-0.5 size-5 shrink-0 text-teal-ink" />
                  <span>
                    <span className="block font-medium text-navy transition-colors group-hover:text-teal-ink">{l.label}</span>
                    <span className="mt-0.5 block text-sm text-muted">{l.desc}</span>
                  </span>
                </a>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted">
              Prefer the full write-up? Read{" "}
              <a href="/blog/gmp-audit-readiness-checklist" className="font-medium text-teal-ink underline-offset-2 hover:underline">
                the complete GMP audit-readiness guide
              </a>
              .
            </p>
          </div>
        </Container>
      </section>

      <div className="no-print">
        <CTABand
          title="Want a second pair of eyes before the MHRA arrives?"
          subtitle="A QP-led mock inspection finds the findings first — so your real inspection is the quiet one."
          primary={{ label: "Book a discovery call", href: "/contact" }}
        />
      </div>
    </>
  );
}
