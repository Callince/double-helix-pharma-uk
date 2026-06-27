import { Icon } from "./Icon";

/**
 * Native <details> disclosure — accessible and crawlable (content stays in the
 * DOM), so FAQ answers are visible to search engines without client JS.
 */
export function Disclosure({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group mb-3 overflow-hidden rounded-2xl border border-line/70 bg-white shadow-soft transition-shadow duration-300 hover:shadow-float [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-left">
        <span className="font-display text-lg font-medium leading-snug text-navy">
          {question}
        </span>
        <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-navy transition-colors group-open:border-transparent group-open:bg-brand-gradient group-open:text-white">
          <Icon
            name="chevron-down"
            className="size-4 transition-transform duration-200 group-open:rotate-180"
          />
        </span>
      </summary>
      <p className="max-w-2xl px-6 pb-6 pr-12 leading-relaxed text-muted">{answer}</p>
    </details>
  );
}
