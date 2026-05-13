import { createServiceClient } from "../supabase/service";
import { indexNow } from "../indexnow";
import type { GeneratedArticle } from "./generate";
import type { UnsplashPhoto } from "./unsplash";

export async function publishPost(
  article: GeneratedArticle,
  sourceUrl: string,
  sourceTitle: string,
  photo: UnsplashPhoto | null,
): Promise<{ slug: string } | null> {
  const db = createServiceClient();

  const { data, error } = await db
    .from("blog_posts")
    .insert({
      slug: article.slug,
      source_url: sourceUrl,
      source_title: sourceTitle,
      title: { en: article.title_en, fr: article.title_fr },
      excerpt: { en: article.excerpt_en, fr: article.excerpt_fr },
      content: { en: article.content_en, fr: article.content_fr },
      meta_desc: { en: article.meta_desc_en, fr: article.meta_desc_fr },
      image_url: photo?.url ?? null,
      image_alt: photo?.alt ?? null,
      image_credit: photo?.credit ?? null,
      status: "published",
    })
    .select("slug")
    .single();

  if (error) {
    if (error.code === "23505") {
      console.log("Already published:", sourceUrl);
      return null;
    }
    throw new Error(`Supabase insert failed: ${error.message}`);
  }

  const slug = data.slug;

  await indexNow([
    `https://idlogice.com/en/blog/${slug}`,
    `https://idlogice.com/fr/blog/${slug}`,
  ]).catch((e) => console.warn("IndexNow ping failed:", e));

  console.log(`Published: /en/blog/${slug}`);
  return { slug };
}
