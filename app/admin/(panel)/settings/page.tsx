import type { ReactNode } from "react";
import { PageHeader, Card, AdminButton } from "@/components/admin/primitives";
import { Input, Textarea } from "@/components/admin/Form";
import { getSettings } from "@/lib/db/content";
import { saveSettings } from "../content-actions";

export const dynamic = "force-dynamic";

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

export default async function SettingsPage() {
  const s = await getSettings().catch(() => ({} as Record<string, Record<string, string>>));
  const contact = s.contact ?? {};
  const social = s.social ?? {};
  const seo = s.seo ?? {};

  return (
    <>
      <PageHeader title="Settings" subtitle="Site-wide configuration — saved to the database." />
      <form action={saveSettings} className="space-y-5">
        <Section title="Contact details" desc="Shown in the footer, contact page and JSON-LD.">
          <Input label="Email" name="contact_email" type="email" defaultValue={contact.email} />
          <Input label="Phone" name="contact_phone" defaultValue={contact.phone} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Locality" name="contact_locality" defaultValue={contact.locality} />
            <Input label="Region" name="contact_region" defaultValue={contact.region} />
          </div>
        </Section>

        <Section title="Social" desc="Linked from the footer and organisation schema.">
          <Input label="LinkedIn URL" name="social_linkedin" defaultValue={social.linkedin} />
        </Section>

        <Section title="SEO defaults" desc="Fallback metadata for pages without their own.">
          <Input label="Default meta title" name="seo_title" defaultValue={seo.metaTitle} />
          <Textarea label="Default meta description" name="seo_description" rows={3} defaultValue={seo.metaDescription} />
        </Section>

        <div className="flex items-center gap-3">
          <AdminButton type="submit" variant="green" icon="check">Save changes</AdminButton>
        </div>
      </form>
    </>
  );
}
