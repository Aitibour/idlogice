import Link from "next/link";
import Image from "next/image";
import { getRelatedBlogImage } from "@/lib/blog/images";
import { getBlogTopic } from "@/lib/blog/topics";
import { cleanImageUrl, isUnsplashUrl } from "@/lib/seo/images";

type Props = {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  imageAlt?: string | null;
  publishedAt: string;
  locale: string;
};

export function PostCard({ slug, title, excerpt, imageUrl, imageAlt, publishedAt, locale }: Props) {
  const date = new Date(publishedAt).toLocaleDateString(
    locale === "fr" ? "fr-CA" : "en-CA",
    { year: "numeric", month: "long", day: "numeric" },
  );
  const fallback = getRelatedBlogImage(title, excerpt, slug);
  const cleanSrc = cleanImageUrl(imageUrl) ?? fallback.url;
  const alt = imageAlt || fallback.alt;
  const bypassOptimizer = isUnsplashUrl(cleanSrc) || cleanSrc.startsWith("/images/");
  const topic = getBlogTopic(title, excerpt, slug);

  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-white hover:shadow-lg transition-shadow">
      <Link href={`/${locale}/blog/${slug}`} className="block">
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <Image
          src={cleanSrc}
          alt={alt}
          fill
          unoptimized={bypassOptimizer}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{date}</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-primary">{topic.label}</span>
        </div>
        <h2 className="font-semibold text-lg leading-snug mb-2 group-hover:text-primary transition-colors">
          {title}
        </h2>
        <p className="text-muted-foreground text-sm line-clamp-2">{excerpt}</p>
      </div>
      </Link>
      <div className="px-5 pb-5">
        <Link
          href={`/${locale}${topic.href}`}
          className="inline-flex text-xs font-bold text-primary underline-offset-4 hover:underline"
        >
          {topic.anchor}
        </Link>
      </div>
    </article>
  );
}
