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

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="pointer-events-none h-full w-full">
      <div aria-hidden className="absolute inset-0 grid place-items-center">
        <div className="h-2/3 w-2/3 rounded-full bg-teal/10 blur-[100px]" />
      </div>
      <DnaScene reduced={reduced} />
    </div>
  );
}
