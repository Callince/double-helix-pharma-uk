"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { services, ctaHref, ctaLabel } from "@/lib/site";

const topLinks = [
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setServicesOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLink =
    "text-[0.95rem] font-medium text-navy/80 transition-colors hover:text-teal-ink";

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-line bg-white/90 shadow-[0_6px_28px_-16px_rgba(13,39,64,0.35)]"
          : "border-transparent bg-white/70"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between px-5 transition-[height] duration-300 sm:px-6 lg:px-8 ${
          scrolled ? "h-16" : "h-[4.5rem]"
        }`}
        aria-label="Primary"
      >
        <Link href="/" className="rounded-md" aria-label="Double Helix Pharma UK — home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <div className="relative" ref={servicesRef}>
            <button
              type="button"
              onClick={() => setServicesOpen((v) => !v)}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              className={`inline-flex items-center gap-1.5 ${navLink}`}
            >
              Services
              <Icon
                name="chevron-down"
                className={`size-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {servicesOpen && (
              <div className="absolute left-1/2 top-full mt-4 w-[22rem] -translate-x-1/2 overflow-hidden rounded-xl border border-line bg-white p-2 shadow-[0_24px_60px_-24px_rgba(13,39,64,0.45)]">
                {services.map((s, i) => (
                  <Link
                    key={s.slug}
                    href={s.href}
                    className="group flex items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-surface"
                  >
                    <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-md bg-brand-gradient text-white">
                      <Icon name={s.icon} className="size-[18px]" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="label-mono text-[0.6rem] text-muted">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm font-semibold text-navy">{s.title}</span>
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-muted">
                        {s.short.split(",")[0]}.
                      </span>
                    </span>
                  </Link>
                ))}
                <Link
                  href="/services"
                  className="mt-1 flex items-center justify-between gap-2 rounded-lg bg-surface px-3 py-3 text-sm font-semibold text-navy transition-colors hover:bg-line/60"
                >
                  View all services
                  <Icon name="arrow-right" className="size-4 text-teal-ink" />
                </Link>
              </div>
            )}
          </div>

          {topLinks.map((l) => (
            <Link key={l.href} href={l.href} className={navLink}>
              {l.label}
            </Link>
          ))}

          <Button href={ctaHref} size="sm" variant="green" withArrow>
            {ctaLabel}
          </Button>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-lg text-navy hover:bg-navy/[0.05] lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <Icon name={mobileOpen ? "x" : "menu"} className="size-6" />
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-line bg-white lg:hidden">
          <div className="space-y-1 px-5 py-5 sm:px-6">
            <Link
              href="/services"
              className="label-mono flex items-center gap-2 px-2 pb-2 text-muted transition-colors hover:text-teal-ink"
            >
              Services
              <Icon name="arrow-right" className="size-3.5" />
            </Link>
            {services.map((s) => (
              <Link
                key={s.slug}
                href={s.href}
                className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-surface"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-brand-gradient text-white">
                  <Icon name={s.icon} className="size-[18px]" />
                </span>
                <span className="text-sm font-semibold text-navy">{s.title}</span>
              </Link>
            ))}
            <div className="my-3 h-px bg-line" />
            {topLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block rounded-lg px-2 py-2.5 font-medium text-navy hover:bg-surface"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-3">
              <Button href={ctaHref} variant="gradient" withArrow className="w-full">
                {ctaLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
