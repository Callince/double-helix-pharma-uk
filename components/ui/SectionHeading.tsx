import type { ReactNode } from "react";

export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "dark",
  as: Tag = "h2",
  split = false,
  className = "",
  maxW,
}: {
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "center" | "left";
  tone?: "dark" | "light";
  as?: "h1" | "h2" | "h3";
  split?: boolean;
  className?: string;
  /** Override the block max-width (left-aligned headings). Default: max-w-3xl. */
  maxW?: string;
}) {
  const isLight = tone === "light";

  const eyebrowEl =
    (eyebrow || index) && (
      <div
        className={`label-mono flex items-center gap-2.5 ${
          align === "center" ? "justify-center" : ""
        } ${isLight ? "text-cyan" : "text-teal-ink"}`}
      >
        {index && <span className={isLight ? "text-white/45" : "text-muted"}>{index}</span>}
        {index && eyebrow && (
          <span aria-hidden className={isLight ? "text-white/25" : "text-line"}>
            ／
          </span>
        )}
        {eyebrow && <span>{eyebrow}</span>}
      </div>
    );

  const titleEl = (
    <Tag
      className={`font-display text-[2rem] font-medium leading-[1.1] text-balance sm:text-[2.55rem] ${
        isLight ? "text-white" : "text-navy"
      }`}
    >
      {title}
    </Tag>
  );

  if (split && intro) {
    return (
      <div data-reveal className={`grid gap-x-10 gap-y-6 lg:grid-cols-12 ${className}`}>
        <div className="lg:col-span-7">
          {eyebrowEl}
          <div className="mt-4">{titleEl}</div>
        </div>
        <div className="lg:col-span-5 lg:self-end">
          <p className={`text-base leading-relaxed ${isLight ? "text-white/70" : "text-muted"}`}>
            {intro}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-reveal
      className={`${align === "center" ? "mx-auto max-w-2xl text-center" : maxW || "max-w-3xl"} ${className}`}
    >
      {eyebrowEl}
      <div className="mt-4">{titleEl}</div>
      {intro && (
        <p
          className={`mt-5 text-base leading-relaxed sm:text-lg ${
            isLight ? "text-white/75" : "text-muted"
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
