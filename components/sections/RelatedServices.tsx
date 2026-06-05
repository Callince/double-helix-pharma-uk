import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { servicePages } from "@/lib/site";

export function RelatedServices({ currentSlug }: { currentSlug: string }) {
  const others = servicePages.filter((s) => s.slug !== currentSlug);
  if (others.length === 0) return null;

  return (
    <section className="bg-surface py-20 sm:py-24">
      <Container>
        <h2 className="label-mono text-teal-ink">Related services</h2>
        <div
          data-reveal-group
          className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2"
        >
          {others.map((s) => (
            <Link
              key={s.slug}
              href={s.href}
              className="group flex items-start gap-4 bg-white p-7 transition-colors hover:bg-surface"
            >
              <span className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-md bg-navy text-white">
                <Icon name={s.icon} className="size-5" />
              </span>
              <span>
                <span className="flex items-center gap-2 font-display text-lg font-medium text-navy">
                  {s.title}
                  <Icon
                    name="arrow-right"
                    className="size-4 text-teal-ink transition-transform group-hover:translate-x-1"
                  />
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">{s.short}</span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
