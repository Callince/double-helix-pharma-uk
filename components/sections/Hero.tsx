import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { HelixMotif } from "@/components/ui/HelixMotif";
import { HeroVisual } from "@/components/three/HeroVisual";

type Cta = { label: string; href: string };
type Crumb = { name: string; href?: string };
type HeroImage = { src: string; alt: string };

const dotPattern = {
  backgroundImage: "radial-gradient(circle at 1px 1px, #16365b 1px, transparent 0)",
  backgroundSize: "26px 26px",
};

// Keeps the copy legible over the full-bleed 3D model (landing page only).
const scrimMobile = {
  background:
    "linear-gradient(180deg, rgba(245,249,251,0.95) 0%, rgba(245,249,251,0.62) 50%, rgba(245,249,251,0.85) 100%)",
};
const scrimDesktop = {
  background:
    "linear-gradient(90deg, #f5f9fb 0%, rgba(245,249,251,0.9) 30%, rgba(245,249,251,0.18) 60%, rgba(245,249,251,0) 82%)",
};

export function Hero({
  eyebrow,
  title,
  subtitle,
  primary,
  secondary,
  breadcrumb,
  chips,
  image,
  panel = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  primary?: Cta;
  secondary?: Cta;
  breadcrumb?: Crumb[];
  chips?: string[];
  /** Side image for compact sub-page heroes (ignored on the landing/panel hero). */
  image?: HeroImage;
  /** Tall full-screen 3D treatment (landing page). */
  panel?: boolean;
}) {
  const hasSideImage = Boolean(image) && !panel;
  const centered = false; // landing hero is two-column: text left, services wheel right

  const content = (
    <div className={`max-w-xl lg:max-w-2xl ${centered ? "mx-auto text-center" : ""}`}>
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
        <div className={`rise ${centered ? "flex justify-center" : ""}`} style={{ animationDelay: "80ms" }}>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-cyan/30 bg-white/70 px-3.5 py-1.5 label-mono text-teal-ink shadow-soft backdrop-blur-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-teal" />
            </span>
            {eyebrow}
          </span>
        </div>
      )}

      <h1
        className={`rise mt-6 max-w-[16ch] font-display text-display-md font-medium leading-[1.04] tracking-[-0.02em] text-navy sm:text-display-lg lg:text-display-xl ${centered ? "mx-auto" : ""}`}
        style={{ animationDelay: "150ms" }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className={`rise mt-7 max-w-xl text-lg leading-relaxed text-ink/85 ${centered ? "mx-auto" : ""}`}
          style={{ animationDelay: "240ms" }}
        >
          {subtitle}
        </p>
      )}

      {(primary || secondary) && (
        <div className={`rise mt-9 flex flex-wrap gap-3 ${centered ? "justify-center" : ""}`} style={{ animationDelay: "320ms" }}>
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
          className={`rise mt-9 flex flex-wrap items-center gap-2.5 ${centered ? "justify-center" : ""}`}
          style={{ animationDelay: "400ms" }}
        >
          {chips.map((chip) => (
            <li key={chip} className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-sm font-medium text-navy shadow-soft backdrop-blur-sm">
              <span className="grid size-4 place-items-center rounded-full bg-green/15">
                <Icon name="check" className="size-3 text-green-ink" />
              </span>
              {chip}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <section className="relative isolate overflow-hidden bg-hero-modern text-ink">
      {/* Atmosphere — biotech precision: cyan halo, soft depth */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div data-parallax="0.3" className="absolute right-[3%] top-[4%] h-[34rem] w-[34rem] rounded-full bg-cyan/20 blur-[120px]" />
        <div data-parallax="0.18" className="absolute -left-[8%] bottom-[-18%] h-[26rem] w-[26rem] rounded-full bg-teal/12 blur-[110px]" />
        <div className="absolute inset-0 opacity-[0.05]" style={dotPattern} />
        {/* Subtle helix accent only when there's no side image and no 3D */}
        {!panel && !image && (
          <HelixMotif className="absolute -right-8 top-0 hidden h-full w-56 text-teal/20 lg:block" />
        )}
      </div>

      {/* Full-bleed 3D DNA model + legibility scrims — landing page only */}
      {panel && (
        <>
          <div className="absolute inset-0 z-0">
            <HeroVisual />
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] lg:hidden" style={scrimMobile} />
          <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] hidden lg:block" style={scrimDesktop} />
        </>
      )}

      <div
        className={`relative z-10 mx-auto flex w-full max-w-6xl items-center px-5 sm:px-6 lg:px-8 ${
          panel
            ? "min-h-[calc(100svh-4.5rem)] py-20 lg:py-0"
            : "min-h-[42vh] py-16 lg:min-h-[46vh] lg:py-20"
        }`}
      >
        {hasSideImage ? (
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {content}
            <div
              className="rise relative hidden aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-line shadow-[0_30px_70px_-32px_rgba(6,41,92,0.5)] lg:block"
              style={{ animationDelay: "220ms" }}
            >
              <Image
                src={image!.src}
                alt={image!.alt}
                fill
                unoptimized
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-tr from-navy/20 via-transparent to-transparent"
              />
            </div>
          </div>
        ) : (
          content
        )}
      </div>

      <div aria-hidden className="absolute inset-x-0 bottom-0 z-[2] h-px bg-line" />
    </section>
  );
}
