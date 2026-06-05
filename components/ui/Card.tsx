import Link from "next/link";
import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  interactive?: boolean;
};

export function Card({ children, href, className = "", interactive }: CardProps) {
  const clickable = Boolean(href) || interactive;
  const cls = `relative rounded-lg border border-line bg-white p-6 transition-all duration-200 ${
    clickable
      ? "hover:-translate-y-1 hover:border-navy/25 hover:shadow-[0_18px_40px_-24px_rgba(13,39,64,0.45)]"
      : ""
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={`block ${cls}`}>
        {children}
      </Link>
    );
  }
  return <div className={cls}>{children}</div>;
}
