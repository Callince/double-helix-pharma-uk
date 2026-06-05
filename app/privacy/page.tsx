import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Double Helix Pharma UK Ltd handles your personal data.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <Container size="narrow" className="py-16 sm:py-24">
      <h1 className="font-display text-4xl font-bold tracking-tight text-navy">Privacy Policy</h1>
      <p className="mt-4 text-muted">
        This is a placeholder privacy policy for {site.legalName}. Replace it with your finalised
        policy before launch. See LAUNCH-CHECKLIST.md.
      </p>
      <div className="mt-8 space-y-4 text-[0.975rem] leading-relaxed text-ink">
        <p>
          We collect only the information you choose to provide through our contact form (such as
          your name, company, email address and message) in order to respond to your enquiry.
        </p>
        <p>
          We do not sell or share your personal data. You can request access to, or deletion of,
          your data at any time by contacting{" "}
          <a href={`mailto:${site.contact.email}`} className="text-[#1d6d85] hover:underline">
            {site.contact.email}
          </a>
          .
        </p>
      </div>
    </Container>
  );
}
