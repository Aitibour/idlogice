import { tryCreateServiceClient } from "@/lib/supabase/service";
import { PostCard } from "@/components/blog/PostCard";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { BLOG_TOPICS, getBlogTopic, isBlogTopicId } from "@/lib/blog/topics";

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ topic?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  return {
    title: t("meta_title"),
    description: t("meta_desc"),
      alternates: generatePageAlternates(locale, "/blog"),
  };
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const query = await searchParams;
  const selectedTopic = isBlogTopicId(query?.topic) ? query.topic : "all";
  const db = tryCreateServiceClient();
  const { data: posts } = db
    ? await db
        .from("blog_posts")
        .select("slug, title, excerpt, image_url, image_alt, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(18)
    : { data: null };

  const t = await getTranslations({ locale, namespace: "Blog" });
  const localizedPosts = (posts ?? []).map((post) => {
    const title = (post.title as Record<string, string>)[locale] ?? (post.title as Record<string, string>).en;
    const excerpt = (post.excerpt as Record<string, string>)[locale] ?? (post.excerpt as Record<string, string>).en;
    return {
      ...post,
      titleText: title,
      excerptText: excerpt,
      topic: getBlogTopic(title, excerpt, post.slug),
    };
  });
  const visiblePosts = selectedTopic === "all"
    ? localizedPosts
    : localizedPosts.filter((post) => post.topic.id === selectedTopic);

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
      <p className="text-muted-foreground mb-8">{t("subtitle")}</p>

      <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-5">
        <p className="text-sm font-bold text-gray-950">Need the newest IRCC and draw updates?</p>
        <p className="mt-1 text-sm text-gray-700">
          Visit the Canada Immigration News hub for fresh Express Entry, PNP, work permit, and study permit updates.
        </p>
        <Link href={`/${locale}/news`} className="mt-3 inline-flex text-sm font-bold text-primary underline-offset-4 hover:underline">
          Canada Immigration News
        </Link>
      </div>

      <nav aria-label="Blog topics" className="mb-10 flex flex-wrap gap-2">
        {BLOG_TOPICS.map((topic) => {
          const active = selectedTopic === topic.id;
          const href = topic.id === "all" ? `/${locale}/blog` : `/${locale}/blog?topic=${topic.id}`;
          return (
            <Link
              key={topic.id}
              href={href}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-gray-800 hover:border-primary hover:text-primary"
              }`}
            >
              {topic.label}
            </Link>
          );
        })}
      </nav>

      {!visiblePosts.length ? (
        <p className="text-muted-foreground">{t("no_posts")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visiblePosts.map((post) => (
            <PostCard
              key={post.slug}
              slug={post.slug}
              title={post.titleText}
              excerpt={post.excerptText}
              imageUrl={post.image_url}
              imageAlt={post.image_alt}
              publishedAt={post.published_at}
              locale={locale}
            />
          ))}
        </div>
      )}
    </main>
  );
}
