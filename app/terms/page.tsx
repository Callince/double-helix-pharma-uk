import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { LegalShell } from "@/components/sections/LegalShell";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Website Terms of Use",
  description:
    "The terms of use governing the Double Helix Pharma UK website, including intellectual property, disclaimers and governing law.",
  path: "/terms",
});

const UPDATED = "5 June 2026";

export default function TermsPage() {
  return (
    <LegalShell
      title="Website Terms of Use"
      updated={UPDATED}
      intro={`These terms govern your use of this website. By using it, you agree to them.`}
    >
      <h2>1. About us</h2>
      <p>
        This website is operated by {site.legalName}, a company registered in England &amp; Wales
        under company number {site.companyNumber}, based in {site.contact.locality},{" "}
        {site.contact.region}, {site.contact.country}. You can contact us at{" "}
        <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
      </p>

      <h2>2. Acceptance of these terms</h2>
      <p>
        By accessing or using this website you confirm that you accept these terms and agree to
        comply with them. If you do not agree, please do not use the site.
      </p>

      <h2>3. Information only — not professional advice</h2>
      <p>
        The content on this website is provided for general information about our services. It does
        not constitute regulatory, legal, scientific or other professional advice, and should not be
        relied upon as such. Any engagement with us is governed by a separate written agreement that
        defines the specific scope, deliverables and terms of work.
      </p>

      <h2>4. Intellectual property</h2>
      <p>
        All content on this website — including text, graphics, logos, the Double Helix Pharma name
        and mark, and design — is owned by or licensed to us and is protected by intellectual
        property laws. You may view and print pages for your own reference, but you may not reproduce,
        republish or exploit any content commercially without our prior written permission.
      </p>

      <h2>5. Accuracy and availability</h2>
      <p>
        We take care to keep the website accurate and up to date, but we make no warranties that the
        content is complete, current or error-free, or that the site will be available
        uninterrupted. We may change, suspend or withdraw any part of the site at any time.
      </p>

      <h2>6. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, we are not liable for any loss or damage arising from
        your use of, or reliance on, this website or its content. Nothing in these terms excludes or
        limits our liability where it would be unlawful to do so, including liability for death or
        personal injury caused by negligence, or for fraud.
      </p>

      <h2>7. Links to other sites</h2>
      <p>
        Where this website links to third-party sites, those links are provided for convenience only.
        We have no control over and accept no responsibility for the content of any third-party site.
      </p>

      <h2>8. Privacy</h2>
      <p>
        Your use of the website is also governed by our{" "}
        <Link href="/privacy" className="text-teal-ink underline underline-offset-2">
          Privacy Policy
        </Link>
        , which explains how we handle your personal data.
      </p>

      <h2>9. Governing law</h2>
      <p>
        These terms are governed by the laws of England &amp; Wales, and any disputes will be subject
        to the exclusive jurisdiction of the courts of England &amp; Wales.
      </p>

      <h2>10. Changes to these terms</h2>
      <p>
        We may revise these terms from time to time. The version published on this page at the time
        you use the site is the version that applies.
      </p>
    </LegalShell>
  );
}
