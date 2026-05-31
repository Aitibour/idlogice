import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, RefreshCw, TrendingUp } from "lucide-react";
import { BlogConversionCta } from "@/components/blog/BlogConversionCta";
import { PostCard } from "@/components/blog/PostCard";
import { tryCreateServiceClient } from "@/lib/supabase/service";
import { BLOG_TOPICS, getBlogTopic } from "@/lib/blog/topics";
import { generatePageAlternates } from "@/lib/seo/alternates";

export const revalidate = 1800;

type Props = { params: Promise<{ locale: string }> };

const BASE = "https://idlogice.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = "Canada Immigration News | IRCC, Express Entry, PNP Updates";
  const description = "Latest Canada immigration news, IRCC updates, Express Entry draws, PNP invitations, work permit changes, and study permit policy updates.";
  return {
    title,
    description,
    alternates: generatePageAlternates(locale, "/news"),
    openGraph: {
      title,
      description,
      url: `${BASE}/${locale}/news`,
      type: "website",
      images: [{ url: `${BASE}/images/cta-bg.jpg`, width: 1200, height: 630, alt: "Canada immigration news and policy updates" }],
    },
  };
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  const db = tryCreateServiceClient();
  const { data: posts } = db
    ? await db
        .from("blog_posts")
        .select("slug, title, excerpt, image_url, image_alt, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(24)
    : { data: null };

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

  const newsTopics = BLOG_TOPICS.filter((topic) => topic.id !== "all").slice(0, 5);
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Canada Immigration News",
    itemListElement: localizedPosts.slice(0, 12).map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${BASE}/${locale}/blog/${post.slug}`,
      name: post.titleText,
    })),
  };

  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <section className="border-b border-border bg-gray-50">
        <div className="container mx-auto px-4 py-14">
          <div className="max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              <Newspaper className="size-3.5" />
              Canada Immigration News
            </div>
            <h1 className="text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
              Latest Canada Immigration News
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-700">
              IRCC updates, Express Entry draws, PNP invitations, work permit changes, study permit news, and practical analysis for people planning their move to Canada.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/${locale}/draws`} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:opacity-90">
                <RefreshCw className="size-4" />
                Express Entry Draw Tracker
              </Link>
              <Link href={`/${locale}/blog?topic=immigration-news`} className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-bold text-gray-900 hover:border-primary hover:text-primary">
                <TrendingUp className="size-4" />
                Immigration News Articles
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="mb-10">
          <BlogConversionCta locale={locale} topicLabel="Canada immigration news" compact />
        </div>

        <div className="mb-8 grid gap-3 md:grid-cols-5">
          {newsTopics.map((topic) => (
            <Link
              key={topic.id}
              href={`/${locale}${topic.href}`}
              className="rounded-lg border border-border bg-white p-4 text-sm font-bold text-gray-900 hover:border-primary hover:text-primary"
            >
              {topic.anchor}
            </Link>
          ))}
        </div>

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-950">Latest Updates</h2>
            <p className="mt-1 text-sm text-gray-600">Fresh articles connected to the main immigration authority pages.</p>
          </div>
          <Link href={`/${locale}/blog`} className="hidden text-sm font-bold text-primary underline-offset-4 hover:underline sm:inline">
            View all blog posts
          </Link>
        </div>

        {!localizedPosts.length ? (
          <p className="text-muted-foreground">No news posts found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {localizedPosts.map((post) => (
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
      </section>
    </main>
  );
}
