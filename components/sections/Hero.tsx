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

  const content = (
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
  );

  return (
    <section className="relative isolate overflow-hidden bg-hero-light text-ink">
      {/* Atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div data-parallax="0.35" className="absolute right-[-10%] top-[-22%] h-[36rem] w-[36rem] rounded-full bg-teal/10 blur-[120px]" />
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
