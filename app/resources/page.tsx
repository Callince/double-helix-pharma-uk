import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABand } from "@/components/sections/CTABand";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Regulatory Resources — MHRA, EMA & EU GMP/GDP Guidance",
  description:
    "The official UK & EU pharmaceutical compliance sources we work to — MHRA, the MHRA Inspectorate blog, EMA GMP/GDP Q&A and EudraLex Volume 4 (EU GMP), including key chapters and annexes.",
  path: "/resources",
});

type Link = { name: string; desc: string; url: string };
type Group = { heading: string; blurb: string; links: Link[] };

const groups: Group[] = [
  {
    heading: "UK regulator — MHRA",
    blurb: "The UK authority for medicines and the GMP/GDP inspections we help you prepare for.",
    links: [
      { name: "MHRA", desc: "Medicines & Healthcare products Regulatory Agency — UK licensing, inspections and guidance.", url: "https://www.gov.uk/government/organisations/medicines-and-healthcare-products-regulatory-agency" },
      { name: "MHRA Inspectorate Blog", desc: "First-hand inspector insight on GMP, GDP, data integrity and common inspection findings.", url: "https://mhrainspectorate.blog.gov.uk/" },
    ],
  },
  {
    heading: "EU GMP guidelines — EudraLex Volume 4",
    blurb: "The EU Guidelines to Good Manufacturing Practice — the basis of EU/UK GMP expectations. Key chapters and annexes:",
    links: [
      { name: "EudraLex Volume 4 — EU GMP Guidelines", desc: "The full set of EU GMP guidelines (basic requirements, Part II and annexes).", url: "https://health.ec.europa.eu/medicinal-products/eudralex/eudralex-volume-4_en" },
      { name: "Chapter 1 — Pharmaceutical Quality System", desc: "The PQS / ICH Q10 foundation for a compliant quality system.", url: "https://health.ec.europa.eu/document/download/e458c423-f564-4171-b344-030a461c567f_en" },
      { name: "Chapter 7 — Outsourced Activities", desc: "Contract giver/acceptor duties and technical/quality agreements.", url: "https://health.ec.europa.eu/document/download/58b5106a-cf6f-4352-9dca-1caf5d27d97e_en" },
      { name: "Chapter 9 — Self Inspection", desc: "The basis for internal audit and self-inspection programmes.", url: "https://health.ec.europa.eu/document/download/07195808-d02e-4d7a-b8f4-f84a83278b62_en" },
      { name: "Part II — Active Substances (APIs)", desc: "GMP for active substances used as starting materials.", url: "https://health.ec.europa.eu/document/download/bd537ccf-9271-4230-bca1-2d8cb655fd83_en" },
      { name: "Annex 1 — Manufacture of Sterile Medicinal Products", desc: "Contamination control strategy and sterile manufacturing expectations.", url: "https://health.ec.europa.eu/document/download/e05af55b-38e9-42bf-8495-194bbf0b9262_en" },
      { name: "Annex 11 — Computerised Systems", desc: "Validation, data integrity and controls for computerised systems.", url: "https://health.ec.europa.eu/document/download/8d305550-dd22-4dad-8463-2ddb4a1345f1_en" },
      { name: "Annex 15 — Qualification and Validation", desc: "URS/DQ/IQ/OQ/PQ and process validation requirements.", url: "https://health.ec.europa.eu/document/download/7c6c5b3c-4902-46ea-b7ab-7608682fb68d_en" },
      { name: "Annex 16 — Certification by a QP and Batch Release", desc: "Qualified Person certification and batch release responsibilities.", url: "https://health.ec.europa.eu/document/download/20c41532-33d5-4635-ae80-8735d3d09fe0_en" },
    ],
  },
  {
    heading: "EU guidance & legislation",
    blurb: "Interpretive guidance and the wider EU pharmaceutical legislation library.",
    links: [
      { name: "EMA — GMP/GDP Questions & Answers", desc: "Interpretive Q&A agreed by the GMP/GDP Inspectors Working Group.", url: "https://www.ema.europa.eu/en/human-regulatory-overview/research-development/compliance-research-development/good-manufacturing-practice/guidance-good-manufacturing-practice-good-distribution-practice-questions-answers" },
      { name: "EudraLex — EU Pharmaceutical Legislation", desc: "The complete EudraLex collection (Volumes 1–10).", url: "https://health.ec.europa.eu/medicinal-products/eudralex_en" },
    ],
  },
];

export default function ResourcesPage() {
  const allLinks = groups.flatMap((g) => g.links);
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Resources", path: "/resources" }]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Regulatory Resources",
            description: "Official MHRA, EMA and EudraLex Volume 4 GMP/GDP sources.",
            url: `${site.url}/resources`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: allLinks.length,
              itemListElement: allLinks.map((l, i) => ({ "@type": "ListItem", position: i + 1, name: l.name, url: l.url })),
            },
          },
        ]}
      />

      <Hero
        image={{ src: "/hero-pharma.webp", alt: "UK and EU pharmaceutical regulatory guidance" }}
        breadcrumb={[{ name: "Home", href: "/" }, { name: "Resources" }]}
        eyebrow="Regulatory Resources"
        title={<>The official guidance we <em className="font-display italic text-teal-ink">work to</em></>}
        subtitle="The primary UK and EU GMP/GDP sources behind our audits, QP services and quality systems — MHRA, EMA and EudraLex Volume 4. Bookmark them; always check the latest published version."
        primary={{ label: "Talk to a QP", href: "/contact" }}
        secondary={{ label: "Read the blog", href: "/blog" }}
      />

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="space-y-14">
            {groups.map((g) => (
              <div key={g.heading}>
                <SectionHeading eyebrow="Source" title={g.heading} intro={g.blurb} />
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {g.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-4 rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-[0_22px_45px_-30px_rgba(6,41,92,0.5)]"
                    >
                      <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-teal/12 text-teal-ink">
                        <Icon name="file-text" className="size-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5 font-display text-lg font-medium text-navy transition-colors group-hover:text-teal-ink">
                          {l.name}
                          <Icon name="arrow-up-right" className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-muted">{l.desc}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-12 rounded-2xl border border-line bg-surface px-6 py-5 text-sm leading-relaxed text-muted">
            <strong className="text-navy">Disclaimer:</strong> these links point to external official sources, provided for convenience. Guidance is updated periodically — always confirm against the latest published version. Double Helix Pharma UK Ltd is not affiliated with the MHRA, EMA or European Commission.
          </p>
        </Container>
      </section>

      <CTABand
        title="Need help applying this guidance?"
        subtitle="From a GMP/GDP audit to contract QP cover, we translate these requirements into an inspection-ready operation."
        primary={{ label: "Book a discovery call", href: "/contact" }}
      />
    </>
  );
}
