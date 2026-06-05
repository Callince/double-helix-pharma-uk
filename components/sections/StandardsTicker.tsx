const standards = [
  "Audited & built against",
  "EudraLex Volume 4",
  "21 CFR 210 / 211",
  "ICH Q7–Q10",
  "EU GDP 2013/C 343/01",
  "Annex 1",
  "ISO 13485",
  "GAMP 5",
  "21 CFR Part 11",
  "WDA(H) · RPi",
];

export function StandardsTicker() {
  return (
    <section data-reveal className="overflow-hidden border-b border-line bg-white py-6" aria-label="Standards we work against">
      <div className="edge-fade">
        <div className="marquee-track flex w-max items-center">
          {[0, 1].map((dup) => (
            <ul key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {standards.map((s, i) => (
                <li key={i} className="flex items-center whitespace-nowrap">
                  <span
                    className={`label-mono ${
                      i === 0 ? "text-teal-ink" : "text-muted"
                    }`}
                  >
                    {s}
                  </span>
                  <span aria-hidden className="mx-9 text-teal/40">
                    ✦
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
