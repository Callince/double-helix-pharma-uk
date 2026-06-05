import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Website Terms",
  description: "Terms of use for the Double Helix Pharma UK website.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <Container size="narrow" className="py-16 sm:py-24">
      <h1 className="font-display text-4xl font-bold tracking-tight text-navy">Website Terms</h1>
      <p className="mt-4 text-muted">
        This is a placeholder terms-of-use page for {site.legalName}. Replace it with your
        finalised terms before launch. See LAUNCH-CHECKLIST.md.
      </p>
      <div className="mt-8 space-y-4 text-[0.975rem] leading-relaxed text-ink">
        <p>
          The content on this website is provided for general information about our services and
          does not constitute regulatory or legal advice. Engagements are governed by a separate
          written agreement.
        </p>
        <p>
          {site.legalName} is registered in England &amp; Wales, company number {site.companyNumber}.
        </p>
      </div>
    </Container>
  );
}
