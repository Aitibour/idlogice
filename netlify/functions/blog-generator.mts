import { fetchLatestItems } from "../../src/lib/blog/rss";
import { generateArticle } from "../../src/lib/blog/generate";
import { fetchUnsplashPhoto } from "../../src/lib/blog/unsplash";
import { publishPost } from "../../src/lib/blog/publish";
import { publishToLinkedIn } from "../../src/lib/blog/linkedin";
import { generateCoverImage } from "../../src/lib/blog/openai-image";
import { createServiceClient } from "../../src/lib/supabase/service";

export default async function handler() {
  console.log("Blog generator started:", new Date().toISOString());

  const items = await fetchLatestItems();
  if (items.length === 0) {
    console.log("No RSS items found — exiting");
    return;
  }

  const db = createServiceClient();
  let targetItem = null;

  for (const item of items) {
    const { data } = await db
      .from("blog_posts")
      .select("id")
      .eq("source_url", item.link)
      .maybeSingle();

    if (!data) {
      targetItem = item;
      break;
    }
  }

  if (!targetItem) {
    console.log("All items already published — exiting");
    return;
  }

  console.log("Generating article for:", targetItem.title);

  const article = await generateArticle(targetItem);
  const photo = await fetchUnsplashPhoto(article.unsplash_keyword);
  const result = await publishPost(article, targetItem.link, targetItem.title, photo);

  if (result) {
    console.log("Done. Slug:", result.slug);

    // Generate DALL-E cover image for LinkedIn (rotates between 2 API keys)
    const coverImage = await generateCoverImage(
      article.title_en ?? targetItem.title,
      article.unsplash_keyword ?? "canada immigration"
    );

    // Publish to LinkedIn with cover image and URL as first comment
    await publishToLinkedIn({
      title: article.title_en ?? targetItem.title,
      summary: article.excerpt_en ?? article.excerpt_fr ?? "",
      slug: result.slug,
      locale: "en",
      coverImage,
    });
  }
}

export const config = { schedule: "0 7 * * *" };
