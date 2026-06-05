import Image from "next/image";

/**
 * Brand logo. Uses a trimmed, transparent web asset (public/logo-web.png),
 * generated from the supplied artwork (public/logo.png) with the white
 * background knocked out. `unoptimized` serves it straight from /public so it
 * never waits on the Next image optimizer. On dark backgrounds (`tone="light"`)
 * it sits on a white chip so the colour mark stays legible.
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
          src="/logo-web.png"
          alt="Double Helix Pharma UK"
          width={900}
          height={311}
          unoptimized
          className="h-8 w-auto"
        />
      </span>
    );
  }

  return (
    <Image
      src="/logo-web.png"
      alt="Double Helix Pharma UK"
      width={900}
      height={311}
      priority
      unoptimized
      className={`h-12 w-auto ${className}`}
    />
  );
}
