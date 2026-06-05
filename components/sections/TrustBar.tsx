import { Container } from "@/components/ui/Container";

const stats = [
  { v: "20+ yrs", l: "Pharma quality leadership" },
  { v: "QP · RP · RPi", l: "Qualified / Responsible Person" },
  { v: "GMP · GDP", l: "Lead auditor" },
  { v: "UK · EU · US · MENA", l: "Markets supported" },
];

export function TrustBar() {
  return (
    <section className="border-b border-line bg-white">
      <Container>
        <dl data-reveal-group className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.l}
              className={`px-1 py-8 md:px-7 md:first:pl-0 ${
                i % 2 === 1 ? "border-l border-line md:border-l" : "md:border-l"
              } ${i >= 2 ? "border-t border-line md:border-t-0" : ""} ${i === 0 ? "md:border-l-0" : ""}`}
            >
              <dt className="font-display text-xl font-medium tracking-tight text-navy sm:text-2xl">
                {s.v}
              </dt>
              <dd className="label-mono mt-2 text-[0.6rem] text-muted">{s.l}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
