import Image from "next/image";

/**
 * Brand logo. Uses a trimmed, transparent web asset (public/logo-web.webp),
 * generated from the supplied artwork (public/logo.png) by cropping to the
 * alpha bounds. `unoptimized` serves it straight from /public so it never waits
 * on the Next image optimizer. On dark backgrounds (`tone="light"`) it sits on a
 * white chip so the colour mark stays legible.
 */
export function Logo({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  if (tone === "light") {
    return (
      <span
        className={`inline-flex items-center rounded-lg bg-white px-3 py-2 ${className}`}
      >
        <Image
          src="/logo-web.webp"
          alt="Double Helix Pharma UK"
          width={760}
          height={249}
          unoptimized
          className="h-9 w-auto"
        />
      </span>
    );
  }

  return (
    <Image
      src="/logo-web.webp"
      alt="Double Helix Pharma UK"
      width={760}
      height={249}
      priority
      unoptimized
      className={`h-14 w-auto ${className}`}
    />
  );
}
