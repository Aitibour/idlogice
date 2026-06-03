import { Marked, Renderer } from "marked";

type Props = { content: string };

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[char] ?? char);
}

function isSafeHref(href: string): boolean {
  if (href.startsWith("/") || href.startsWith("#")) return true;
  try {
    const url = new URL(href);
    return ["https:", "http:", "mailto:"].includes(url.protocol);
  } catch {
    return false;
  }
}

const renderer = new Renderer();

renderer.html = () => "";
renderer.link = ({ href, title, tokens }) => {
  const text = tokens.map((token) => {
    if ("text" in token && typeof token.text === "string") return escapeHtml(token.text);
    return escapeHtml(token.raw);
  }).join("");
  if (!href || !isSafeHref(href)) return text;
  const safeHref = escapeHtml(href);
  const safeTitle = title ? ` title="${escapeHtml(title)}"` : "";
  const rel = href.startsWith("http") ? ' rel="noopener noreferrer"' : "";
  const target = href.startsWith("http") ? ' target="_blank"' : "";
  return `<a href="${safeHref}"${safeTitle}${target}${rel}>${text}</a>`;
};
renderer.image = ({ href, title, text }) => {
  if (!href || !isSafeHref(href)) return "";
  const safeHref = escapeHtml(href);
  const safeAlt = escapeHtml(text ?? "");
  const safeTitle = title ? ` title="${escapeHtml(title)}"` : "";
  return `<img src="${safeHref}" alt="${safeAlt}"${safeTitle} loading="lazy" decoding="async" />`;
};

const parser = new Marked({ breaks: true, gfm: true, renderer });

export function PostBody({ content }: Props) {
  const safeHtml = parser.parse(content) as string;

  return (
    <div
      className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-900 prose-p:leading-relaxed prose-li:text-gray-900 prose-strong:text-gray-900 prose-a:text-primary prose-a:font-semibold prose-blockquote:text-gray-800 prose-blockquote:border-primary prose-code:text-gray-900"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
