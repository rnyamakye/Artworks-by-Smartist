import sanitizeHtml from "sanitize-html";

const defaultOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "blockquote", "p", "a", "ul", "ol",
    "nl", "li", "b", "i", "strong", "em",
    "strike", "code", "hr", "br", "div",
    "table", "thead", "caption", "tbody", "tr", "th", "td",
    "pre", "span"
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    "*": ["class", "className", "style"]
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    a: (tagName, attribs) => {
      // Force safe links
      return {
        tagName: "a",
        attribs: {
          ...attribs,
          target: "_blank",
          rel: "noopener noreferrer nofollow"
        }
      };
    }
  }
};

export function sanitize(dirty: string | null | undefined): string {
  if (!dirty) return "";
  return sanitizeHtml(dirty, defaultOptions);
}

