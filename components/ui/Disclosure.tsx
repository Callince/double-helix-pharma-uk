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
    <details className="group border-t border-line py-2 last:border-b [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left">
        <span className="font-display text-lg font-medium leading-snug text-navy">
          {question}
        </span>
        <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full border border-line text-navy transition-colors group-open:border-navy group-open:bg-navy group-open:text-white">
          <Icon
            name="chevron-down"
            className="size-4 transition-transform duration-200 group-open:rotate-180"
          />
        </span>
      </summary>
      <p className="max-w-2xl pb-6 pr-10 leading-relaxed text-muted">{answer}</p>
    </details>
  );
}
