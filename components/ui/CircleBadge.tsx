import Link from "next/link";
import { Icon } from "./Icon";

/**
 * Rotating circular "badge" button (Metscript-style): spinning mono text ring
 * with a solid arrow disc in the centre. Spin pauses under reduced-motion.
 */
export function CircleBadge({
  href,
  label = "Book a discovery call",
  className = "",
}: {
  href: string;
  label?: string;
  className?: string;
}) {
  const ring = `${label}  ·  ${label}  ·  `;
  return (
    <Link
      href={href}
      aria-label={label}
      className={`group grid size-28 place-items-center rounded-full bg-white shadow-[0_18px_44px_-18px_rgba(13,39,64,0.45)] ring-1 ring-line ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="absolute inset-0 size-full motion-safe:animate-[spin_16s_linear_infinite]"
      >
        <defs>
          <path id="dhx-badge-path" fill="none" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text className="fill-navy" style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "1px", textTransform: "uppercase" }}>
          <textPath href="#dhx-badge-path" startOffset="0" textLength="232" lengthAdjust="spacingAndGlyphs">
            {ring}
          </textPath>
        </text>
      </svg>
      <span className="relative grid size-12 place-items-center rounded-full bg-[#2fa56a] text-white transition-transform duration-300 group-hover:scale-110">
        <Icon name="arrow-up-right" className="size-5" />
      </span>
    </Link>
  );
}
