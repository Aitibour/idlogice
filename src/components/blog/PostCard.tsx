import Link from "next/link";
import Image from "next/image";
import { getRelatedBlogImage } from "@/lib/blog/images";
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

  return (
    <Link
      href={`/${locale}/blog/${slug}`}
      className="group block overflow-hidden rounded-xl border border-border bg-white hover:shadow-lg transition-shadow"
    >
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
        <p className="text-sm text-muted-foreground mb-2">{date}</p>
        <h2 className="font-semibold text-lg leading-snug mb-2 group-hover:text-primary transition-colors">
          {title}
        </h2>
        <p className="text-muted-foreground text-sm line-clamp-2">{excerpt}</p>
      </div>
    </Link>
  );
}
