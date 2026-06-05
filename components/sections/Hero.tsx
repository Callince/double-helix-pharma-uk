import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { HeroVisual } from "@/components/three/HeroVisual";

type Cta = { label: string; href: string };
type Crumb = { name: string; href?: string };

const dotPattern = {
  backgroundImage: "radial-gradient(circle at 1px 1px, #16365b 1px, transparent 0)",
  backgroundSize: "26px 26px",
};

// Keeps the copy legible over the full-bleed 3D model (light theme).
const scrimMobile = {
  background:
    "linear-gradient(180deg, rgba(245,249,251,0.95) 0%, rgba(245,249,251,0.68) 52%, rgba(245,249,251,0.88) 100%)",
};
const scrimDesktop = {
  background:
    "linear-gradient(90deg, #f5f9fb 0%, rgba(245,249,251,0.92) 34%, rgba(245,249,251,0.28) 64%, rgba(245,249,251,0) 86%)",
};

export function Hero({
  eyebrow,
  title,
  subtitle,
  primary,
  secondary,
  breadcrumb,
  chips,
  panel = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  primary?: Cta;
  secondary?: Cta;
  breadcrumb?: Crumb[];
  chips?: string[];
  /** Tall landing treatment (home). Sub-page heroes use a shorter height. */
  panel?: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-hero-light text-ink">
      {/* Atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute right-[-10%] top-[-22%] h-[36rem] w-[36rem] rounded-full bg-teal/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.05]" style={dotPattern} />
      </div>

      {/* Full-bleed 3D DNA model + legibility scrims (every hero) */}
      <div className="absolute inset-0 z-0">
        <HeroVisual />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] lg:hidden" style={scrimMobile} />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] hidden lg:block" style={scrimDesktop} />

      <div
        className={`relative z-10 mx-auto flex w-full max-w-[120rem] items-center px-6 sm:px-10 lg:px-16 ${
          panel
            ? "min-h-[calc(100svh-4.5rem)] py-20 lg:py-0"
            : "min-h-[calc(100svh-4.5rem)] py-16 lg:py-0"
        }`}
      >
        <div className="max-w-xl lg:max-w-2xl">
          {breadcrumb && (
            <nav aria-label="Breadcrumb" className="rise mb-7" style={{ animationDelay: "40ms" }}>
              <ol className="label-mono flex flex-wrap items-center gap-2.5 text-muted">
                {breadcrumb.map((c, i) => (
                  <li key={c.name} className="flex items-center gap-2.5">
                    {c.href ? (
                      <Link href={c.href} className="transition-colors hover:text-teal-ink">
                        {c.name}
                      </Link>
                    ) : (
                      <span className="text-navy">{c.name}</span>
                    )}
                    {i < breadcrumb.length - 1 && <span className="text-line">／</span>}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {eyebrow && (
            <div
              className="rise label-mono flex items-center gap-2.5 text-teal-ink"
              style={{ animationDelay: "80ms" }}
            >
              <span className="h-px w-7 bg-teal" />
              {eyebrow}
            </div>
          )}

          <h1
            className="rise mt-6 max-w-[16ch] font-display text-[2.6rem] font-medium leading-[1.04] tracking-[-0.02em] text-navy sm:text-[3.3rem] lg:text-[3.85rem]"
            style={{ animationDelay: "150ms" }}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className="rise mt-7 max-w-xl text-lg leading-relaxed text-ink/85"
              style={{ animationDelay: "240ms" }}
            >
              {subtitle}
            </p>
          )}

          {(primary || secondary) && (
            <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: "320ms" }}>
              {primary && (
                <Button href={primary.href} variant="green" size="lg" withArrow>
                  {primary.label}
                </Button>
              )}
              {secondary && (
                <Button href={secondary.href} variant="outline" size="lg">
                  {secondary.label}
                </Button>
              )}
            </div>
          )}

          {chips && (
            <ul
              className="rise mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
              style={{ animationDelay: "400ms" }}
            >
              {chips.map((chip) => (
                <li key={chip} className="flex items-center gap-2 text-sm text-muted">
                  <Icon name="check" className="size-4 text-green" />
                  {chip}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div aria-hidden className="absolute inset-x-0 bottom-0 z-[2] h-px bg-line" />
    </section>
  );
}
