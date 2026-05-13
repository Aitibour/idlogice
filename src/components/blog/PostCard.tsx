import Link from "next/link";
import Image from "next/image";

type Props = {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  publishedAt: string;
  locale: string;
};

export function PostCard({ slug, title, excerpt, imageUrl, publishedAt, locale }: Props) {
  const date = new Date(publishedAt).toLocaleDateString(
    locale === "fr" ? "fr-CA" : "en-CA",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <Link
      href={`/${locale}/blog/${slug}`}
      className="group block rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow"
    >
      {imageUrl && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
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
