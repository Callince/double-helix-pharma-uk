"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Site-wide scroll motion (GSAP). Mounted once in the root layout.
 * - [data-reveal]          → fades/slides up when it enters the viewport
 * - [data-reveal-group]    → its direct children stagger in
 *
 * Elements are hidden via `html.gsap-ready` CSS only once this mounts, so the
 * page stays fully visible if JS is disabled, and never flashes (useGSAP runs
 * in a layout effect, before paint). Respects prefers-reduced-motion.
 */
export function ScrollAnimations() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      document.documentElement.classList.add("gsap-ready");

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        const items = Array.from(group.children);
        if (!items.length) return;
        gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.09,
            scrollTrigger: { trigger: group, start: "top 84%", once: true },
          },
        );
      });

      ScrollTrigger.refresh();
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
