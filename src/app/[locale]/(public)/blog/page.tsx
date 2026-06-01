import { tryCreateServiceClient } from "@/lib/supabase/service";
import { PostCard } from "@/components/blog/PostCard";
import { BlogAuthorityHub } from "@/components/blog/BlogAuthorityHub";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { BLOG_TOPICS, getBlogTopic, isBlogTopicId } from "@/lib/blog/topics";

export const revalidate = 3600;

const BASE = "https://idlogice.com";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ topic?: string }>;
};

function jsonLd(data: object) {
  const props = { dangerouslySetInnerHTML: { __html: JSON.stringify(data) } };
  return <script type="application/ld+json" {...props} />;
}

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
  const topicCounts = localizedPosts.reduce<Partial<Record<(typeof BLOG_TOPICS)[number]["id"], number>>>((acc, post) => {
    acc[post.topic.id] = (acc[post.topic.id] ?? 0) + 1;
    return acc;
  }, {});
  const pageUrl = `${BASE}/${locale}/blog${selectedTopic === "all" ? "" : `?topic=${selectedTopic}`}`;
  const activeTopic = BLOG_TOPICS.find((topic) => topic.id === selectedTopic) ?? BLOG_TOPICS[0];
  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "IDLOGICE Canada Immigration Blog",
    description: t("subtitle"),
    url: `${BASE}/${locale}/blog`,
    inLanguage: locale === "fr" ? "fr-CA" : locale === "es" ? "es" : locale === "ar" ? "ar" : "en-CA",
    publisher: { "@type": "Organization", name: "IDLOGICE", url: BASE },
    about: BLOG_TOPICS.filter((topic) => topic.id !== "all").map((topic) => topic.anchor),
  };
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: selectedTopic === "all" ? "Canada Immigration Blog" : `${activeTopic.label} Immigration Articles`,
    description: selectedTopic === "all"
      ? "Latest Canada immigration guides, news, and pathway analysis from IDLOGICE."
      : `Latest IDLOGICE articles about ${activeTopic.anchor}.`,
    url: pageUrl,
    isPartOf: { "@type": "Blog", name: "IDLOGICE Canada Immigration Blog", url: `${BASE}/${locale}/blog` },
    about: activeTopic.anchor,
  };
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: selectedTopic === "all" ? "Latest Canada Immigration Articles" : `Latest ${activeTopic.label} Articles`,
    itemListElement: visiblePosts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${BASE}/${locale}/blog/${post.slug}`,
      name: post.titleText,
    })),
  };

  return (
    <>
      {jsonLd(blogLd)}
      {jsonLd(collectionLd)}
      {jsonLd(itemListLd)}
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

        <BlogAuthorityHub locale={locale} counts={topicCounts} />

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
    </>
  );
}
