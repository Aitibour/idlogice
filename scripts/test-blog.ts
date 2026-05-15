import { fetchLatestItems } from "../src/lib/blog/rss";
import { generateArticle } from "../src/lib/blog/generate";
import { fetchUnsplashPhoto } from "../src/lib/blog/unsplash";
import { publishPost } from "../src/lib/blog/publish";
import { createServiceClient } from "../src/lib/supabase/service";

async function run() {
  console.log("Blog generator started:", new Date().toISOString());

  const items = await fetchLatestItems();
  console.log("RSS items:", items.length);
  if (!items.length) { console.log("No items found"); return; }

  const db = createServiceClient();
  let targetItem = null;
  for (const item of items) {
    const { data } = await db.from("blog_posts").select("id").eq("source_url", item.link).maybeSingle();
    if (!data) { targetItem = item; break; }
  }

  if (!targetItem) { console.log("All items already published"); return; }
  console.log("Generating for:", targetItem.title);

  const article = await generateArticle(targetItem);
  console.log("Slug:", article.slug);
  console.log("Title EN:", article.title_en);

  const photo = await fetchUnsplashPhoto(article.unsplash_keyword);
  console.log("Photo:", photo ? photo.url.slice(0, 60) + "..." : "none");

  const result = await publishPost(article, targetItem.link, targetItem.title, photo);
  console.log("Published:", result?.slug ?? "duplicate/skipped");
}

run().catch(console.error);
