export type TocItem = { id: string; text: string; level: 2 | 3 };

function slugify(s: string): string {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/gi, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

/**
 * Inject stable `id`s into the article's h2/h3 headings and return a table of
 * contents. Runs server-side on the stored HTML so anchor links + the sticky
 * TOC stay in sync with the content.
 */
export function processArticle(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const out = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/gi, (_m, lvl: string, inner: string) => {
    const level = Number(lvl) as 2 | 3;
    const text = inner.replace(/<[^>]+>/g, "").trim();
    if (!text) return `<h${lvl}>${inner}</h${lvl}>`;
    let id = slugify(text) || "section";
    const base = id;
    let n = 2;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id);
    toc.push({ id, text, level });
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
  });
  return { html: out, toc };
}
