import sanitizeHtml from "sanitize-html";

/**
 * Sanitise editor-authored article HTML before it is rendered with
 * dangerouslySetInnerHTML. Permits the formatting CKEditor produces, strips
 * <script>/<style>/event-handler attributes and unsafe URL schemes, so stored
 * content can never execute script in a visitor's browser.
 */
export function sanitizeArticleHtml(dirty: string): string {
  if (!dirty) return "";
  return sanitizeHtml(dirty, {
    allowedTags: [
      "p", "br", "hr", "blockquote", "pre", "code", "span", "div",
      "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li",
      "strong", "em", "b", "i", "u", "s", "sub", "sup", "mark",
      "a", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      th: ["colspan", "rowspan", "scope"],
      td: ["colspan", "rowspan"],
      "*": ["id"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
    // Force safe rel on links (prevents tabnabbing on target=_blank).
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
    },
  });
}
