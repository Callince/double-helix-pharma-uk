import type { ReactNode } from "react";
import { PageHeader, Card, AdminButton } from "@/components/admin/primitives";
import { site } from "@/lib/site";

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue?: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy">{label}</span>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-line bg-white px-3.5 py-2 text-sm text-ink shadow-sm outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/25"
      />
    </label>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: ReactNode }) {
  return (
    <Card>
      <div className="grid gap-6 md:grid-cols-[1fr_1.6fr]">
        <div>
          <h2 className="font-display text-base font-semibold text-navy">{title}</h2>
          <p className="mt-1 text-sm text-muted">{desc}</p>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </Card>
  );
}

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Site-wide configuration used across the website and structured data."
        action={<AdminButton variant="green" icon="check">Save changes</AdminButton>}
      />

      <div className="space-y-5">
        <Section title="Contact details" desc="Shown in the footer, contact page and JSON-LD.">
          <Field label="Email" type="email" defaultValue={site.contact.email} />
          <Field label="Phone" defaultValue={site.contact.phoneDisplay} />
          <Field label="Location" defaultValue={`${site.contact.locality}, ${site.contact.region}, ${site.contact.country}`} />
        </Section>

        <Section title="Social" desc="Linked from the footer and organisation schema.">
          <Field label="LinkedIn URL" defaultValue={site.social.linkedin} />
        </Section>

        <Section title="SEO defaults" desc="Fallback metadata when a page doesn't set its own.">
          <Field label="Default meta title" defaultValue={`${site.name} — ${site.tagline}`} />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy">Default meta description</span>
            <textarea
              rows={3}
              defaultValue={site.description}
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2 text-sm text-ink shadow-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/25"
            />
          </label>
        </Section>

        <p className="rounded-lg bg-paper px-4 py-3 text-xs text-muted">
          Demo UI — saving persists via the backend settings API once implemented (spec §4.5, settings table §5.3.16).
        </p>
      </div>
    </>
  );
}
