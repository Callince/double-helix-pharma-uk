import { ImageResponse } from "next/og";

export const alt =
  "Double Helix Pharma UK — Pharmaceutical Quality & Compliance Consultancy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #16365b 0%, #0f2942 55%, #0b2138 100%)",
          padding: "72px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          <svg width="60" height="72" viewBox="0 0 36 44" fill="none">
            <g stroke="#45b5ce" strokeWidth="3" strokeLinecap="round">
              <path d="M9 3c0 9 18 11 18 19S9 32 9 41" />
              <path d="M27 3c0 9-18 11-18 19s18 11 18 19" />
            </g>
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-0.02em" }}>
              Double Helix
            </span>
            <span style={{ fontSize: 17, letterSpacing: "0.3em", color: "#9fc7d6" }}>
              PHARMA UK
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              width: 84,
              height: 6,
              borderRadius: 4,
              marginBottom: 26,
              display: "flex",
              background: "linear-gradient(90deg,#45b5ce,#2f9fbe)",
            }}
          />
          <span
            style={{
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              maxWidth: 940,
            }}
          >
            GMP/GDP Audits & Contract QP Services
          </span>
          <span style={{ fontSize: 28, color: "#cde3ec", marginTop: 18 }}>
            Pharmaceutical Quality &amp; Compliance Consultancy
          </span>
        </div>

        <div style={{ display: "flex", gap: "24px", fontSize: 22, color: "#9fc7d6" }}>
          <span>20+ years experience</span>
          <span>·</span>
          <span>UK · EU · US · MENA</span>
          <span>·</span>
          <span>QP · RP · RPi</span>
        </div>
      </div>
    ),
    size,
  );
}
