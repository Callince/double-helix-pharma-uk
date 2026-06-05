import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CircleBadge } from "@/components/ui/CircleBadge";
import { ctaHref, ctaLabel } from "@/lib/site";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-[#2fa56a]/10 blur-3xl" />
        <div className="absolute -right-24 -top-4 h-80 w-80 rounded-full bg-[#3b78d8]/10 blur-3xl" />
      </div>

      <Container className="relative py-14 text-center sm:py-16 lg:py-20">
        <p className="rise label-mono text-[#2fa56a]">Pharmaceutical Quality &amp; Compliance</p>

        <h1
          className="rise mx-auto mt-5 max-w-4xl font-display text-[2.6rem] font-medium leading-[1.05] tracking-[-0.02em] text-navy sm:text-5xl lg:text-[3.7rem]"
          style={{ animationDelay: "80ms" }}
        >
          Where Compliance Meets <span className="text-[#3b78d8]">Confidence.</span>
        </h1>

        <p
          className="rise mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted"
          style={{ animationDelay: "160ms" }}
        >
          Independent EU GMP/GDP audits, contract QP/RP/RPi cover and inspection-ready quality
          systems — led by a Qualified Person with 20+ years across regulated markets.
        </p>

        <div
          className="rise mt-8 flex flex-wrap justify-center gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <Button href={ctaHref} variant="green" size="lg" withArrow>
            {ctaLabel}
          </Button>
          <Button href="/#services" variant="outline" size="lg">
            Explore services
          </Button>
        </div>

        <div
          className="rise relative mx-auto mt-16 max-w-5xl"
          style={{ animationDelay: "320ms" }}
        >
          <div className="relative aspect-[16/11] overflow-hidden rounded-[1.75rem] ring-1 ring-line shadow-[0_44px_90px_-34px_rgba(13,39,64,0.5)] sm:aspect-[16/8]">
            <Image
              src="/hero-pharma.webp"
              alt="Pharmaceutical quality professional reviewing compliance in a laboratory"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy/15 to-transparent" />
          </div>
          <CircleBadge href={ctaHref} className="absolute -top-10 left-1/2 -translate-x-1/2" />
        </div>
      </Container>
    </section>
  );
}
