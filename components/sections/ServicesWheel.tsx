"use client";

import { useState } from "react";
import { services } from "@/lib/site";

/* On-brand wedge colours: navy -> blue -> teal -> green ramp (matches the site UI),
   all dark enough to keep the white in-wedge labels legible. */
const COLORS = ["#042a63", "#0b5394", "#136c9c", "#0a8a8f", "#1f8a55", "#2f7d22"];
/* Two-line labels that sit inside each wedge. */
const LINES: [string, string][] = [
  ["GMP & GDP", "Audits"],
  ["Contract QP,", "RP & RPi"],
  ["QMS &", "PQS"],
  ["Site", "Readiness"],
  ["Supplier", "Management"],
  ["GDP &", "Supply Chain"],
];

/* Donut / pie geometry. */
const C = 150;
const R_IN = 56;
const R_OUT = 146;
const R_LBL = 101;
const GAP = 2.4; // degrees between wedges (plus a white stroke)

const rad = (d: number) => (d * Math.PI) / 180;
const pt = (deg: number, r: number): [number, number] => [
  +(C + r * Math.cos(rad(deg))).toFixed(2),
  +(C + r * Math.sin(rad(deg))).toFixed(2),
];

function wedge(i: number): string {
  const a0 = -90 + i * 60 + GAP / 2;
  const a1 = -90 + (i + 1) * 60 - GAP / 2;
  const [ox0, oy0] = pt(a0, R_OUT);
  const [ox1, oy1] = pt(a1, R_OUT);
  const [ix1, iy1] = pt(a1, R_IN);
  const [ix0, iy0] = pt(a0, R_IN);
  return `M${ox0} ${oy0} A${R_OUT} ${R_OUT} 0 0 1 ${ox1} ${oy1} L${ix1} ${iy1} A${R_IN} ${R_IN} 0 0 0 ${ix0} ${iy0} Z`;
}
const midDeg = (i: number) => -90 + i * 60 + 30;

export function ServicesWheel() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="relative mx-auto aspect-square w-[300px] sm:w-[360px] lg:w-[330px] xl:w-[384px]">
      <svg
        viewBox="0 0 300 300"
        className="h-full w-full drop-shadow-[0_24px_55px_rgba(6,41,92,0.22)]"
        role="img"
        aria-label="Our six quality and compliance services arranged as a continuous cycle"
      >
        {services.map((s, i) => {
          const on = active === i;
          const m = midDeg(i);
          const [lx, ly] = pt(m, R_LBL);
          const dx = on ? +(7 * Math.cos(rad(m))).toFixed(2) : 0;
          const dy = on ? +(7 * Math.sin(rad(m))).toFixed(2) : 0;
          return (
            <a
              key={s.slug}
              href={s.href}
              aria-label={s.title}
              className="dh-wedge"
              style={{ animationDelay: `${0.12 + i * 0.08}s` }}
            >
              <g
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="cursor-pointer"
                style={{
                  transform: `translate(${dx}px, ${dy}px)`,
                  transition: "transform .2s ease, filter .2s ease",
                  filter: on ? "brightness(1.08)" : "none",
                }}
              >
                <path
                  d={wedge(i)}
                  fill={COLORS[i]}
                  stroke="#f5f9fb"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#ffffff"
                  fontSize="10.5"
                  fontWeight="600"
                  className="pointer-events-none select-none font-sans"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.28)" }}
                >
                  <tspan x={lx} dy="-0.55em">{LINES[i][0]}</tspan>
                  <tspan x={lx} dy="1.1em">{LINES[i][1]}</tspan>
                </text>
              </g>
            </a>
          );
        })}

        {/* Center hole */}
        <circle cx={C} cy={C} r={R_IN - 12} fill="#ffffff" stroke="#e1e8ee" strokeWidth="1.5" className="dh-center" />
      </svg>
    </div>
  );
}
