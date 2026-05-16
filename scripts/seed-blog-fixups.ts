/**
 * Backfill the 3 articles whose Groq-generated slugs collided in seed-blog.ts.
 * Forces unique slugs and re-runs only the missing topics.
 */
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";
import { fetchUnsplashPhoto } from "../src/lib/blog/unsplash";

type Topic = {
  slug: string;
  primary_keyword: string;
  title_hint: string;
  unsplash_keyword: string;
  published_at: string;
};

const TOPICS: Topic[] = [
  {
    slug: "work-in-canada-without-lmia",
    primary_keyword: "work in Canada",
    title_hint: "Working in Canada Without LMIA: All Pathways Explained",
    unsplash_keyword: "canada office",
    published_at: "2025-09-11T10:00:00Z",
  },
  {
    slug: "rcic-vs-lawyer-canada-immigration",
    primary_keyword: "Canada immigration consultation",
    title_hint: "RCIC vs Lawyer: Who to Choose for Your Canada Immigration Consultation",
    unsplash_keyword: "consultation meeting",
    published_at: "2025-08-07T10:00:00Z",
  },
  {
    slug: "first-canada-immigration-consultation",
    primary_keyword: "Canada immigration consultation",
    title_hint: "What to Expect in Your First Canada Immigration Consultation",
    unsplash_keyword: "professional meeting",
    published_at: "2025-12-18T10:00:00Z",
  },
];

const SYSTEM_PROMPT = `You are an expert Canadian immigration content writer.
Generate SEO-optimized bilingual blog posts for an immigration consulting firm based in Montreal.
Always respond with valid JSON only — no markdown fences, no extra text.`;

async function generate(t: Topic) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const userPrompt = `Topic / title hint: ${t.title_hint}
Primary SEO keyword: ${t.primary_keyword}

Generate a blog post JSON with exactly these keys:
- title_en: SEO title in English, 50-60 chars, contains the primary keyword
- title_fr: SEO title in French, 50-60 chars
- excerpt_en: 1-2 sentence summary in English, 120-160 chars, mentions the primary keyword
- excerpt_fr: 1-2 sentence summary in French, 120-160 chars
- content_en: Full article in English, 700-1000 words, valid markdown with ## H2 headings
- content_fr: Full article in French, 700-1000 words, valid markdown with ## H2 headings
- meta_desc_en: Meta description in English, 140-155 chars
- meta_desc_fr: Meta description in French, 140-155 chars

Rules:
- Primary keyword must appear naturally in the title and within the first 100 chars of the body
- Tone: professional, warm, helpful
- End each article with a soft CTA paragraph inviting the reader to request a free profile evaluation`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4500,
    response_format: { type: "json_object" },
  });
  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty Groq response");
  return JSON.parse(raw) as {
    title_en: string; title_fr: string;
    excerpt_en: string; excerpt_fr: string;
    content_en: string; content_fr: string;
    meta_desc_en: string; meta_desc_fr: string;
  };
}

async function run() {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

  let ok = 0;
  let fail = 0;
  for (const [i, t] of TOPICS.entries()) {
    console.log(`\n[${i + 1}/${TOPICS.length}] ${t.title_hint}  (${t.published_at.slice(0, 10)})  slug=${t.slug}`);
    try {
      const a = await generate(t);
      const photo = await fetchUnsplashPhoto(t.unsplash_keyword);

      const { error } = await db.from("blog_posts").insert({
        slug: t.slug,
        source_url: `https://idlogice.com/internal/${t.slug}`,
        source_title: t.title_hint,
        title: { en: a.title_en, fr: a.title_fr },
        excerpt: { en: a.excerpt_en, fr: a.excerpt_fr },
        content: { en: a.content_en, fr: a.content_fr },
        meta_desc: { en: a.meta_desc_en, fr: a.meta_desc_fr },
        image_url: photo?.url ?? null,
        image_alt: photo?.alt ?? null,
        image_credit: photo?.credit ?? null,
        status: "published",
        published_at: t.published_at,
      });

      if (error) {
        console.error("  insert error:", error.message);
        fail++;
        continue;
      }
      console.log(`  ok — /en/blog/${t.slug}`);
      ok++;
    } catch (e) {
      console.error("  failed:", (e as Error).message);
      fail++;
    }
    await new Promise((r) => setTimeout(r, 2500));
  }
  console.log(`\nDone. ok=${ok} fail=${fail}`);
}

run().catch((e) => { console.error(e); process.exit(1); });
