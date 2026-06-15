"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EASE = "power3.out";

/**
 * Site-wide scroll motion (GSAP + Lenis). Mounted once in the root layout.
 *  - Lenis smooth scrolling (wheel), synced to ScrollTrigger — disabled on
 *    /admin and for prefers-reduced-motion.
 *  - [data-reveal]        → reveals on enter. Optional direction via the value:
 *      "up" (default) | "left" | "right" | "scale" | "fade", and an optional
 *      [data-reveal-delay="0.1"].
 *  - [data-reveal-group]  → direct children stagger in.
 *  - [data-parallax="0.18"] → scroll-linked vertical parallax (depth fraction).
 *
 * Content is hidden via `html.gsap-ready` CSS only once this mounts, so the page
 * stays visible with no JS and never flashes. Respects prefers-reduced-motion.
 */
export function ScrollAnimations() {
  const pathname = usePathname();

  // --- Smooth scrolling (Lenis) ---
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || pathname?.startsWith("/admin")) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Smooth in-page anchor links (e.g. the blog table of contents).
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      const href = link?.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -96 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [pathname]);

  // --- Reveals + parallax (re-run per route) ---
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      document.documentElement.classList.add("gsap-ready");

      const fromVars = (dir: string): gsap.TweenVars => {
        switch (dir) {
          case "left": return { opacity: 0, x: -52 };
          case "right": return { opacity: 0, x: 52 };
          case "scale": return { opacity: 0, scale: 0.9, y: 26 };
          case "fade": return { opacity: 0 };
          default: return { opacity: 0, y: 38, scale: 0.985 };
        }
      };

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const dir = el.dataset.reveal || "up";
        const delay = Number.parseFloat(el.dataset.revealDelay || "0") || 0;
        gsap.fromTo(
          el,
          fromVars(dir),
          {
            opacity: 1, x: 0, y: 0, scale: 1,
            duration: 1, ease: EASE, delay,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        const items = Array.from(group.children) as HTMLElement[];
        if (!items.length) return;
        gsap.fromTo(
          items,
          { opacity: 0, y: 38, scale: 0.98 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.8, ease: EASE, stagger: 0.085,
            scrollTrigger: { trigger: group, start: "top 86%", once: true },
          },
        );
      });

      // Scroll-linked parallax — moves a layer as it travels through the viewport.
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const depth = Number.parseFloat(el.dataset.parallax || "0.15") || 0.15;
        gsap.fromTo(
          el,
          { yPercent: -depth * 50 },
          {
            yPercent: depth * 50,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
          },
        );
      });

      ScrollTrigger.refresh();
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
