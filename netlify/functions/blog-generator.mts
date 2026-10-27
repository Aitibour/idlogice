import { fetchLatestItems } from "../../src/lib/blog/rss";
import { generateArticle } from "../../src/lib/blog/generate";
import { fetchUnsplashPhoto } from "../../src/lib/blog/unsplash";
import { publishPost } from "../../src/lib/blog/publish";
import { publishToTwitter } from "../../src/lib/blog/twitter";
import { generateCoverImage } from "../../src/lib/blog/openai-image";
import { createServiceClient } from "../../src/lib/supabase/service";

type NetlifyEvent = {
  headers?: Record<string, string | undefined>;
};

function headerValue(headers: NetlifyEvent["headers"], name: string): string | undefined {
  const lower = name.toLowerCase();
  const entry = Object.entries(headers ?? {}).find(([key]) => key.toLowerCase() === lower);
  return entry?.[1];
}

function isAuthorized(event: NetlifyEvent): boolean {
  // NOTE: x-netlify-event: schedule is NOT a trusted signal — it is a plain HTTP
  // header and can be spoofed by any external caller reaching the function URL.
  // Always require the bearer token, even for scheduled invocations.
  // Netlify's scheduler sets BLOG_GENERATOR_SECRET via env; configure it in
  // netlify.toml [context.production.environment] or via the Netlify UI.
  const secret = process.env.BLOG_GENERATOR_SECRET;
  const auth = headerValue(event.headers, "authorization");
  return !!secret && auth === `Bearer ${secret}`;
}

export default async function handler(event: NetlifyEvent = {}) {
  if (!isAuthorized(event)) {
    return new Response("Unauthorized", { status: 401 });
  }

  console.log("Blog generator started:", new Date().toISOString());

  const items = await fetchLatestItems();
  if (items.length === 0) {
    console.log("No RSS items found — exiting");
    return;
  }

  const db = createServiceClient();
  let targetItem = null;

  for (const item of items) {
    const { data, error } = await db
      .from("blog_posts")
      .select("id")
      .eq("source_url", item.link)
      .maybeSingle();

    if (error) {
      console.error("[blog-generator] Supabase dedup check failed:", error.message);
      continue; // skip item — do not treat DB error as "not yet published"
    }
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

    // LinkedIn has its own calendar, image requirement and durable posting history.

    // Publish to X / Twitter (image + link in tweet body)
    await publishToTwitter({
      title: article.title_en ?? targetItem.title,
      summary: article.excerpt_en ?? article.excerpt_fr ?? "",
      slug: result.slug,
      locale: "en",
      coverImage,
    });
  }
}

export const config = { schedule: "0 7,19 * * *" };
