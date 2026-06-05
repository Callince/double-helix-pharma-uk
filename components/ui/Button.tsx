import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

type Variant = "primary" | "gradient" | "green" | "outline" | "outline-light" | "white" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-navy text-white hover:bg-navy-deep",
  gradient:
    "bg-brand-gradient text-white shadow-[0_12px_34px_-14px_rgba(22,54,91,0.7)] hover:brightness-[1.06]",
  green:
    "bg-green text-white shadow-[0_12px_30px_-14px_rgba(28,156,95,0.75)] hover:brightness-110",
  outline: "border border-navy/20 text-navy hover:border-navy/50 hover:bg-navy/[0.03]",
  "outline-light": "border border-white/30 text-white hover:bg-white/10",
  white: "bg-white text-navy hover:bg-white/90",
  ghost: "text-navy hover:bg-navy/[0.05]",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-[0.95rem]",
  lg: "px-6 py-3 text-[0.95rem]",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  className?: string;
};

type ButtonAsLink = CommonProps & {
  href: string;
  type?: never;
  "aria-label"?: string;
};

type ButtonAsButton = CommonProps & {
  href?: undefined;
  type?: "button" | "submit";
  "aria-label"?: string;
  disabled?: boolean;
};

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const {
    children,
    variant = "primary",
    size = "md",
    withArrow = false,
    className = "",
  } = props;

  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const content = (
    <>
      {children}
      {withArrow && (
        <Icon
          name="arrow-right"
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      )}
    </>
  );

  if ("href" in props && props.href) {
    const isExternal = props.href.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={props.href}
          className={cls}
          aria-label={props["aria-label"]}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={props.href} className={cls} aria-label={props["aria-label"]}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      className={cls}
      aria-label={props["aria-label"]}
      disabled={"disabled" in props ? props.disabled : undefined}
    >
      {content}
    </button>
  );
}
