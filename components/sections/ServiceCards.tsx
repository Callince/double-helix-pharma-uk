import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { ServiceGrid } from "@/components/sections/ServiceGrid";

export function ServiceCards() {
  return (
    <section id="services" className="scroll-mt-24 bg-surface py-20 sm:py-28 lg:py-32">
      <Container>
        <SectionHeading
          split
          eyebrow="Services"
          title="Quality & compliance, end to end"
          intro="From a single supplier audit to ongoing QP/RP cover and full quality-system builds — delivered by one senior expert."
        />
        <div className="mt-14">
          <ServiceGrid />
        </div>
        <div data-reveal className="mt-9">
          <Link
            href="/services"
            className="label-mono inline-flex items-center gap-2 text-teal-ink transition-colors hover:text-navy"
          >
            View all services
            <Icon name="arrow-right" className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
