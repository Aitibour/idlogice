import { marked } from "marked";

type Props = { content: string };

// Lightweight server-side sanitization. Content comes from our own Groq
// pipeline stored in our DB so we already trust the source; this strips
// script/style/iframe/object/embed tags and any "on*" event handlers as
// defense-in-depth. Avoids isomorphic-dompurify (which requires jsdom and
// crashed in Netlify's Node serverless runtime, breaking some posts).
function stripUnsafe(html: string): string {
  return html
    .replace(/<\s*(script|style|iframe|object|embed|link|meta)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|link|meta)[^>]*\/?>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript\s*:/gi, "");
}

marked.setOptions({ breaks: true, gfm: true });

export function PostBody({ content }: Props) {
  const rawHtml = marked.parse(content) as string;
  const safeHtml = stripUnsafe(rawHtml);

  return (
    <div
      className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-900 prose-p:leading-relaxed prose-li:text-gray-900 prose-strong:text-gray-900 prose-a:text-primary prose-a:font-semibold prose-blockquote:text-gray-800 prose-blockquote:border-primary prose-code:text-gray-900"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
