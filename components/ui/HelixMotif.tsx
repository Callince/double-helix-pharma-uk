/**
 * Decorative double-helix line-art. Inherits `currentColor` for the strands.
 * Used as a subtle signature motif across hero, CTA and section accents.
 */
export function HelixMotif({
  className = "",
  rungs = true,
}: {
  className?: string;
  rungs?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 600"
      fill="none"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M60 0 C112 70 112 130 60 200 S8 330 60 400 S112 530 60 600" />
        <path d="M60 0 C8 70 8 130 60 200 S112 330 60 400 S8 530 60 600" opacity="0.6" />
        {rungs && (
          <g strokeWidth="1.25" opacity="0.5">
            <line x1="44" y1="40" x2="76" y2="40" />
            <line x1="30" y1="100" x2="90" y2="100" />
            <line x1="44" y1="160" x2="76" y2="160" />
            <line x1="44" y1="240" x2="76" y2="240" />
            <line x1="30" y1="300" x2="90" y2="300" />
            <line x1="44" y1="360" x2="76" y2="360" />
            <line x1="44" y1="440" x2="76" y2="440" />
            <line x1="30" y1="500" x2="90" y2="500" />
            <line x1="44" y1="560" x2="76" y2="560" />
          </g>
        )}
      </g>
    </svg>
  );
}
