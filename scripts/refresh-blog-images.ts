/**
 * Walk every published blog post, ensure each has a unique hero image
 * (no two posts share the same image_url). For each duplicate, pull a
 * fresh random Unsplash photo using the post's source_title as the query.
 *
 * Run with:
 *   npx tsx --env-file=.env.local scripts/refresh-blog-images.ts
 */
import { createClient } from "@supabase/supabase-js";
import { fetchUnsplashPhoto } from "../src/lib/blog/unsplash";

function keywordFromTitle(title: string): string {
  // Pick 2–3 meaningful words from the title for the Unsplash query.
  const stop = new Set([
    "the","and","or","of","in","to","for","on","at","a","an","is","are",
    "your","my","our","with","what","how","step","by","without",
    "complete","guide","top","best","2025","2026","canada","canadian",
  ]);
  const words = title
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !stop.has(w))
    .slice(0, 3);
  // Always anchor with "canada" so results stay on-topic.
  return `canada ${words.join(" ")}`.trim();
}

async function run() {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

  const { data: posts, error } = await db
    .from("blog_posts")
    .select("slug, source_title, image_url")
    .eq("status", "published")
    .order("published_at", { ascending: true });

  if (error) throw error;
  if (!posts) return;

  const seen = new Set<string>();
  let refreshed = 0;
  let unchanged = 0;

  for (const post of posts) {
    if (post.image_url && !seen.has(post.image_url)) {
      seen.add(post.image_url);
      unchanged++;
      console.log(`keep   ${post.slug}`);
      continue;
    }

    // Either missing image or duplicate — pull a new one.
    const query = keywordFromTitle(post.source_title ?? post.slug);
    let photo = null;
    // Retry a few times in case Unsplash returns a photo we've already used.
    for (let attempt = 0; attempt < 4; attempt++) {
      photo = await fetchUnsplashPhoto(query);
      if (!photo) break;
      if (!seen.has(photo.url)) break;
      photo = null;
      await new Promise((r) => setTimeout(r, 800));
    }

    if (!photo) {
      console.log(`skip   ${post.slug}  (no fresh photo for "${query}")`);
      continue;
    }

    const { error: upErr } = await db
      .from("blog_posts")
      .update({
        image_url: photo.url,
        image_alt: photo.alt,
        image_credit: photo.credit,
      })
      .eq("slug", post.slug);

    if (upErr) {
      console.error(`error  ${post.slug}: ${upErr.message}`);
      continue;
    }

    seen.add(photo.url);
    refreshed++;
    console.log(`fresh  ${post.slug}  ←  ${query}`);
    await new Promise((r) => setTimeout(r, 1200));
  }

  console.log(`\nDone. kept=${unchanged} refreshed=${refreshed}`);
}

run().catch((e) => { console.error(e); process.exit(1); });
