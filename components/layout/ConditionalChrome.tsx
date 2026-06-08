"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Renders the public marketing chrome (header/footer/skip-link) for site routes,
 * but nothing for /admin/* — the admin section provides its own dashboard shell.
 * Header/Footer are passed in as slots so this client component can decide
 * whether to show them without importing the (server) Footer directly.
 */
export function ConditionalChrome({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      {header}
      <main id="content" className="flex-1">
        {children}
      </main>
      {footer}
    </>
  );
}
