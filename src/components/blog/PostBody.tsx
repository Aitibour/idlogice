import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

type Props = { content: string };

export function PostBody({ content }: Props) {
  const rawHtml = marked.parse(content) as string;
  const safeHtml = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      "h1","h2","h3","h4","p","ul","ol","li","strong","em","a","blockquote",
      "code","pre","br","hr","img",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "rel", "target"],
    FORCE_BODY: true,
  });

  return (
    <div
      className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
