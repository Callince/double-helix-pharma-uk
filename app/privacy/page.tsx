import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell } from "@/components/sections/LegalShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Double Helix Pharma UK Ltd collects, uses and protects your personal data under UK GDPR and the Data Protection Act 2018.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "5 June 2026";

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      updated={UPDATED}
      intro={`This policy explains how ${site.legalName} collects, uses and protects your personal data when you use this website or contact us.`}
    >
      <h2>1. Who we are</h2>
      <p>
        {site.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is the data
        controller responsible for your personal data. We are a pharmaceutical quality &amp;
        compliance consultancy registered in England &amp; Wales (company number{" "}
        {site.companyNumber}), based in {site.contact.locality}, {site.contact.region},{" "}
        {site.contact.country}.
      </p>
      <p>
        For any questions about this policy or your personal data, contact us at{" "}
        <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
      </p>

      <h2>2. The personal data we collect</h2>
      <p>We only collect data that you choose to provide, or that is needed to run the website securely:</p>
      <ul>
        <li>
          <strong>Enquiry data</strong> — your name, company, email address and the details of your
          message when you complete our contact form or email us.
        </li>
        <li>
          <strong>Technical data</strong> — limited information such as IP address, browser type and
          pages visited, collected automatically by our hosting provider for security and
          reliability.
        </li>
      </ul>
      <p>
        We do <strong>not</strong> intentionally collect special category data. Please do not include
        sensitive or confidential commercial information in your initial enquiry.
      </p>

      <h2>3. How and why we use it</h2>
      <p>We use your personal data only for the purposes below, relying on the following lawful bases under UK GDPR:</p>
      <ul>
        <li>
          <strong>To respond to your enquiry</strong> and discuss a possible engagement — lawful
          basis: legitimate interests, and/or taking steps at your request prior to entering a
          contract.
        </li>
        <li>
          <strong>To operate, secure and improve the website</strong> — lawful basis: legitimate
          interests in running a safe, functional website.
        </li>
        <li>
          <strong>To comply with legal obligations</strong> where applicable — lawful basis: legal
          obligation.
        </li>
      </ul>
      <p>We do not use your data for automated decision-making or profiling, and we never sell it.</p>

      <h2>4. Sharing and processors</h2>
      <p>
        We do not sell or rent your personal data. We share it only with trusted service providers
        who process it on our behalf under appropriate contractual safeguards:
      </p>
      <ul>
        <li>
          <strong>Hosting</strong> — our website is hosted on Vercel, which processes technical/log
          data to deliver the site.
        </li>
        <li>
          <strong>Email delivery</strong> — contact-form submissions are delivered to us using an
          email service provider so we can read and reply to your enquiry.
        </li>
      </ul>
      <p>
        Some providers may process data outside the UK. Where they do, we rely on appropriate
        safeguards (such as UK adequacy regulations or International Data Transfer Agreements /
        Standard Contractual Clauses) to protect your data.
      </p>

      <h2>5. Cookies and analytics</h2>
      <p>
        This website uses only the cookies strictly necessary for it to function and stay secure. We
        do not currently use advertising or third-party tracking cookies. If we introduce analytics
        or marketing cookies in future, we will update this policy and request your consent where
        required.
      </p>

      <h2>6. How long we keep your data</h2>
      <p>
        We keep enquiry data only for as long as necessary to respond to and manage your enquiry and
        any resulting relationship, and to meet our legal and accounting obligations. Where an
        enquiry does not lead to an engagement, we delete the related personal data once it is no
        longer needed.
      </p>

      <h2>7. Your rights</h2>
      <p>Under UK data protection law you have the right to:</p>
      <ul>
        <li>access a copy of the personal data we hold about you;</li>
        <li>have inaccurate data corrected;</li>
        <li>request erasure of your data;</li>
        <li>restrict or object to our processing;</li>
        <li>data portability; and</li>
        <li>withdraw consent at any time, where we rely on consent.</li>
      </ul>
      <p>
        To exercise any of these rights, email{" "}
        <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>. We will respond within one
        month.
      </p>

      <h2>8. Complaints</h2>
      <p>
        If you have a concern about how we handle your data, please contact us first so we can put
        it right. You also have the right to complain to the UK&apos;s supervisory authority, the
        Information Commissioner&apos;s Office (ICO), at{" "}
        <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">
          ico.org.uk
        </a>
        .
      </p>

      <h2>9. Security</h2>
      <p>
        We use appropriate technical and organisational measures to protect your personal data
        against unauthorised access, loss or disclosure, including encrypted (HTTPS) transmission and
        access controls.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The latest version will always be published on
        this page with a revised &ldquo;last updated&rdquo; date.
      </p>

      <p className="mt-10 text-sm text-muted">
        See also our{" "}
        <Link href="/terms" className="text-teal-ink underline underline-offset-2">
          Website Terms
        </Link>
        .
      </p>
    </LegalShell>
  );
}
