import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { site, services } from "@/lib/site";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="bg-navy-deep text-white/75">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo tone="light" />
            <p className="mt-6 max-w-sm font-display text-lg leading-snug text-white/85">
              {site.tagline}.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
              Independent EU GMP/GDP audits, contract QP/RP/RPi services and inspection-ready
              quality systems for pharma, biotech and CMOs.
            </p>
            <a
              href={site.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="mt-7 inline-grid size-10 place-items-center rounded-lg ring-1 ring-white/20 transition-colors hover:bg-white/10"
            >
              <Icon name="linkedin" className="size-5" />
            </a>

            <div className="mt-8 max-w-sm">
              <p className="text-sm font-semibold text-white/85">Get compliance updates</p>
              <p className="mt-1 text-xs text-white/60">Occasional GMP/GDP insight — no spam, unsubscribe anytime.</p>
              <NewsletterForm />
            </div>
          </div>

          <nav aria-label="Services">
            <h2 className="label-mono text-white/60">
              <Link href="/services" className="transition-colors hover:text-cyan">
                Services
              </Link>
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={s.href} className="text-white/65 transition-colors hover:text-cyan">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Explore">
            <h2 className="label-mono text-white/60">Explore</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                { label: "About", href: "/about" },
                { label: "Case Studies", href: "/case-studies" },
                { label: "Blog", href: "/blog" },
                { label: "Resources", href: "/resources" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact", href: "/contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/65 transition-colors hover:text-cyan">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="label-mono text-white/60">Get in touch</h2>
            <ul className="mt-5 space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <Icon name="mail" className="mt-0.5 size-4 shrink-0 text-cyan" />
                <a href={`mailto:${site.contact.email}`} className="hover:text-cyan">
                  {site.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="phone" className="mt-0.5 size-4 shrink-0 text-cyan" />
                <a href={`tel:${site.contact.phoneHref}`} className="hover:text-cyan">
                  {site.contact.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="map-pin" className="mt-0.5 size-4 shrink-0 text-cyan" />
                <span>
                  {site.contact.locality}, {site.contact.region}
                  <br />
                  {site.contact.country}
                </span>
              </li>
            </ul>
            {site.contactIsPlaceholder && (
              <p className="mt-5 border-l-2 border-white/15 pl-3 text-xs text-white/60">
                Contact details are placeholders pending confirmation.
              </p>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. Company No. {site.companyNumber} · Registered in England &amp; Wales.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
