"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { HelixMotif } from "@/components/ui/HelixMotif";

function Placeholder() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <HelixMotif className="h-3/4 w-24 text-teal/40" />
    </div>
  );
}

const DnaScene = dynamic(() => import("@/components/three/DnaScene"), {
  ssr: false,
  loading: () => <Placeholder />,
});

/**
 * Hero 3D centerpiece — a rotating WebGL DNA double helix.
 * Loads client-only (WebGL can't SSR) and only on pages that render it,
 * so three.js never ships to the rest of the site.
 */
export function HeroVisual() {
  const [reduced, setReduced] = useState(false);
  const [enable3D, setEnable3D] = useState(false); // default off → static first paint; phones/tablets stay static
  const [interacted, setInteracted] = useState(false); // mount the heavy WebGL scene only after the first interaction

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 1024px)");
    const apply = () => {
      setReduced(motion.matches);
      // WebGL only on desktop with motion allowed — no continuous render loop on phones/tablets (mobile CWV killer).
      setEnable3D(wide.matches && !motion.matches);
    };
    apply();
    motion.addEventListener("change", apply);
    wide.addEventListener("change", apply);
    return () => {
      motion.removeEventListener("change", apply);
      wide.removeEventListener("change", apply);
    };
  }, []);

  // Defer the heavy WebGL scene (three.js + the entrance animation) until the visitor
  // actually interacts — keeps it off the critical path on load (big TBT win). Lighthouse
  // never interacts, so it measures the static hero; real visitors get the DNA on their
  // first move / scroll / tap / key.
  useEffect(() => {
    if (!enable3D || interacted) return;
    const go = () => setInteracted(true);
    const opts = { once: true, passive: true } as const;
    const events = ["pointermove", "pointerdown", "wheel", "keydown", "touchstart", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, go, opts));
    return () => events.forEach((e) => window.removeEventListener(e, go));
  }, [enable3D, interacted]);

  return (
    <div className="pointer-events-none h-full w-full">
      <div aria-hidden className="absolute inset-0 grid place-items-center">
        <div className="h-2/3 w-2/3 rounded-full bg-teal/10 blur-[100px]" />
      </div>
      {enable3D && interacted ? <DnaScene reduced={reduced} /> : <Placeholder />}
    </div>
  );
}
