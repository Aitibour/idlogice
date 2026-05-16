/**
 * Bulk-submit every published blog post to IndexNow (Bing / Yandex /
 * DuckDuckGo via Bing). The seed script bypassed publish.ts so these
 * URLs were never pinged — this fills the gap.
 *
 * Run with:
 *   npx tsx --env-file=.env.local scripts/submit-indexnow.ts
 */
import { createClient } from "@supabase/supabase-js";
import { indexNow } from "../src/lib/indexnow";

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr"] as const; // only locales with translated content

async function run() {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

  const { data: posts, error } = await db
    .from("blog_posts")
    .select("slug")
    .eq("status", "published");

  if (error) throw error;
  if (!posts || posts.length === 0) {
    console.log("No published posts found");
    return;
  }

  const urls: string[] = [];
  for (const p of posts) {
    for (const loc of LOCALES) {
      urls.push(`${BASE}/${loc}/blog/${p.slug}`);
    }
  }
  // Also ping the blog list pages.
  for (const loc of LOCALES) urls.push(`${BASE}/${loc}/blog`);

  console.log(`Submitting ${urls.length} URLs to IndexNow...`);
  const res = await indexNow(urls);
  console.log("Result:", res);
}

run().catch((e) => { console.error(e); process.exit(1); });
