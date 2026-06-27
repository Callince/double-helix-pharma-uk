"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide scroll reveals — IntersectionObserver + CSS transitions.
 * Replaced GSAP + Lenis to drop ~130KB of JS from the initial load; the only
 * remaining GSAP user is the lazy desktop DNA scene, so public pages ship none.
 *
 *  - [data-reveal]       → fades/rises in on enter. Optional direction via the
 *      value: "up" (default) | "left" | "right" | "scale" | "fade", plus an
 *      optional [data-reveal-delay="0.1"] (seconds).
 *  - [data-reveal-group] → direct children stagger in.
 *
 * Smooth scrolling, the fixed-header anchor offset, and hero parallax are pure
 * CSS now (globals.css). Content stays visible with no JS — elements only hide
 * once `.reveal-ready` is set — and prefers-reduced-motion shows everything.
 */
export function ScrollAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.classList.add("reveal-ready");

    const STAGGER = 0.07; // seconds between grouped children

    const reveal = (el: HTMLElement) => {
      if (el.hasAttribute("data-reveal-group")) {
        (Array.from(el.children) as HTMLElement[]).forEach(
          (kid, i) => (kid.style.transitionDelay = `${i * STAGGER}s`),
        );
      } else if (el.dataset.revealDelay) {
        el.style.transitionDelay = `${Number.parseFloat(el.dataset.revealDelay)}s`;
      }
      el.classList.add("is-revealed");
    };

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            reveal(e.target as HTMLElement);
            obs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.1 }, // reveal once 10% of the element is in view (targets are all < viewport tall, so this is always reachable — nothing strands at page-bottom)
    );

    // Elements already scrolled past (above the viewport — e.g. a deep hash link
    // or restored scroll position) reveal immediately so they're never stuck
    // hidden; everything in or below the viewport animates in as it enters.
    document
      .querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-group]")
      .forEach((el) => {
        if (el.getBoundingClientRect().bottom <= 0) reveal(el);
        else io.observe(el);
      });

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
