import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Your enquiry has been received by Double Helix Pharma UK.",
  alternates: { canonical: "/thank-you" },
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return (
    <section className="relative isolate flex min-h-[72vh] items-center overflow-hidden bg-hero-light py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-18%] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-green/12 blur-[120px]" />
        <div className="absolute bottom-[-25%] right-[-5%] h-80 w-80 rounded-full bg-teal/10 blur-[110px]" />
      </div>
      <Container size="narrow">
        <div className="mx-auto max-w-xl text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_20px_44px_-18px_rgba(43,154,205,0.75)]">
            <Icon name="check" className="size-8" />
          </span>
          <p className="label-mono mt-8 text-teal-ink">Enquiry received</p>
          <h1 className="mt-4 font-display text-[2.4rem] font-medium leading-[1.08] tracking-[-0.02em] text-navy sm:text-5xl">
            Thank you — we&apos;ll be in touch
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink/80">
            Your message has reached us, and we aim to respond personally within one business day.
            For urgent inspection or batch-release matters, please call us directly.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href="/" variant="green" size="lg" withArrow>
              Back to home
            </Button>
            <Button href="/services" variant="outline" size="lg">
              Explore services
            </Button>
          </div>
          <p className="mt-10 text-sm text-muted">
            While you wait, browse our{" "}
            <Link href="/faq" className="text-teal-ink underline underline-offset-2">
              frequently asked questions
            </Link>{" "}
            or read about{" "}
            <Link href="/about" className="text-teal-ink underline underline-offset-2">
              the consultant
            </Link>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
