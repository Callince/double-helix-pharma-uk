import type { ReactNode } from "react";

type Tone = "default" | "accent" | "light";

const tones: Record<Tone, string> = {
  default: "border border-line bg-white text-muted",
  accent: "border border-teal/30 bg-teal/[0.06] text-teal-ink",
  light: "bg-white/5 text-white/80 ring-1 ring-white/20",
};

export function Badge({
  children,
  tone = "default",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`label-mono inline-flex items-center gap-2 rounded-full px-3 py-1 ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
