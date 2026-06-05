import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon, type IconName } from "@/components/ui/Icon";

export type Feature = { title: string; body?: string };

export function FeatureGrid({
  eyebrow,
  title,
  intro,
  items,
  bg = "white",
  cols = 3,
  icon = "check",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  items: Feature[];
  bg?: "white" | "surface";
  cols?: 2 | 3 | 4;
  icon?: IconName;
}) {
  return (
    <section
      className={`relative overflow-hidden ${
        bg === "surface" ? "bg-surface" : "bg-white"
      } py-20 sm:py-28 lg:py-32`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-12%] top-[-15%] h-[30rem] w-[30rem] rounded-full bg-teal/[0.07] blur-[120px]"
      />
      <Container>
        <SectionHeading split eyebrow={eyebrow} title={title} intro={intro} />
        <div
          data-reveal-group
          className={`relative mt-14 grid gap-5 sm:grid-cols-2 ${
            cols === 4 ? "lg:grid-cols-4" : cols === 3 ? "lg:grid-cols-3" : ""
          }`}
        >
          {items.map((item, i) => (
            <div
              key={item.title}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-[0_26px_55px_-30px_rgba(6,41,92,0.5)]"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand-gradient transition-transform duration-300 group-hover:scale-x-100"
              />
              <div className="flex items-start justify-between">
                <span className="grid size-12 place-items-center rounded-xl bg-teal/10 text-teal-ink transition-colors duration-300 group-hover:bg-teal group-hover:text-white">
                  <Icon name={icon} className="size-5" />
                </span>
                <span className="font-display text-3xl font-medium leading-none text-navy/[0.08]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-6 font-display text-lg font-medium text-navy">{item.title}</h3>
              {item.body && (
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{item.body}</p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
