import type { ReactNode } from "react";

function inline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : p,
  );
}

/** Minimal, safe Markdown renderer for admin-authored article bodies. */
export function Markdown({ content, className = "" }: { content: string; className?: string }) {
  const blocks = content.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className={`legal-prose text-[1.02rem] leading-relaxed text-ink ${className}`}>
      {blocks.map((b, i) => {
        if (b.startsWith("### ")) return <h3 key={i}>{b.slice(4)}</h3>;
        if (b.startsWith("## ")) return <h2 key={i}>{b.slice(3)}</h2>;
        if (b.startsWith("# ")) return <h2 key={i}>{b.slice(2)}</h2>;
        if (/^[-*] /.test(b)) {
          const items = b.split("\n").map((l) => l.replace(/^[-*] /, ""));
          return <ul key={i}>{items.map((it, j) => <li key={j}>{inline(it)}</li>)}</ul>;
        }
        return <p key={i}>{inline(b)}</p>;
      })}
    </div>
  );
}
