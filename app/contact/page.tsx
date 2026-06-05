import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Double Helix Pharma UK to discuss GMP/GDP audits, contract QP/RP/RPi cover or quality-system support. We aim to respond within one business day.",
  alternates: { canonical: "/contact" },
};

const methods = [
  { icon: "mail" as const, label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}` },
  { icon: "phone" as const, label: "Phone", value: site.contact.phoneDisplay, href: `tel:${site.contact.phoneHref}` },
  {
    icon: "map-pin" as const,
    label: "Location",
    value: `${site.contact.locality}, ${site.contact.region}, ${site.contact.country}`,
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <Hero
        image={{
          src: "/hero-contact.jpg",
          alt: "Welcoming modern pharmaceutical consultancy office",
        }}
        breadcrumb={[{ name: "Home", href: "/" }, { name: "Contact" }]}
        eyebrow="Contact"
        title={
          <>
            Let&apos;s talk about your{" "}
            <em className="font-display italic text-teal-ink">quality &amp; compliance</em> needs
          </>
        }
        subtitle="Tell us about your audit, QP/RP requirement or quality-system project. You'll deal directly with a senior Qualified Person — no call centres, no hand-offs."
      />

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-navy">
                Get in touch
              </h2>
              <p className="mt-3 text-[0.975rem] leading-relaxed text-muted">
                We typically respond within one business day. For urgent inspection or release
                matters, please call.
              </p>

              <ul className="mt-8 space-y-4">
                {methods.map((m) => (
                  <li key={m.label} className="flex items-start gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white">
                      <Icon name={m.icon} className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                        {m.label}
                      </p>
                      {m.href ? (
                        <a href={m.href} className="font-medium text-navy hover:text-[#1d6d85]">
                          {m.value}
                        </a>
                      ) : (
                        <p className="font-medium text-navy">{m.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl border border-line bg-surface p-5">
                <p className="flex items-center gap-2 font-display text-sm font-semibold text-navy">
                  <Icon name="clock" className="size-4 text-teal" />
                  Response time
                </p>
                <p className="mt-1.5 text-sm text-muted">
                  Enquiries are answered personally, usually within one business day.
                </p>
              </div>

              {site.contactIsPlaceholder && (
                <p className="mt-4 text-xs text-muted">
                  Note: contact details shown are placeholders pending confirmation.
                </p>
              )}
            </div>

            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
