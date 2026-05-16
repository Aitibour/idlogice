import { tryCreateServiceClient } from "@/lib/supabase/service";
import { PostCard } from "@/components/blog/PostCard";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  return {
    title: t("meta_title"),
    description: t("meta_desc"),
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const db = tryCreateServiceClient();
  const { data: posts } = db
    ? await db
        .from("blog_posts")
        .select("slug, title, excerpt, image_url, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(18)
    : { data: null };

  const t = await getTranslations({ locale, namespace: "Blog" });

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
      <p className="text-muted-foreground mb-12">{t("subtitle")}</p>

      {!posts?.length ? (
        <p className="text-muted-foreground">{t("no_posts")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              slug={post.slug}
              title={(post.title as Record<string, string>)[locale] ?? (post.title as Record<string, string>).en}
              excerpt={(post.excerpt as Record<string, string>)[locale] ?? (post.excerpt as Record<string, string>).en}
              imageUrl={post.image_url}
              publishedAt={post.published_at}
              locale={locale}
            />
          ))}
        </div>
      )}
    </main>
  );
}
