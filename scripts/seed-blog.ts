/**
 * One-shot SEO seed script: generates 20 bilingual blog posts with Groq,
 * fetches matching Unsplash photos, and inserts them into Supabase with
 * custom published_at dates spread between Apr 2025 and May 2026.
 *
 * Run with:
 *   npx tsx --env-file=.env.local scripts/seed-blog.ts
 */
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";
import { fetchUnsplashPhoto } from "../src/lib/blog/unsplash";

type Topic = {
  primary_keyword: string;
  title_hint: string;
  unsplash_keyword: string;
  published_at: string;
};

const TOPICS: Topic[] = [
  // Canada Immigration (general) — 6
  { primary_keyword: "Canada immigration",      title_hint: "Complete Guide to Canada Immigration",                                unsplash_keyword: "canada passport",     published_at: "2025-04-08T10:00:00Z" },
  { primary_keyword: "Canada immigration",      title_hint: "Express Entry Updates: What Changed for Canada Immigration",         unsplash_keyword: "toronto skyline",     published_at: "2025-06-17T10:00:00Z" },
  { primary_keyword: "Canada immigration",      title_hint: "How to Immigrate to Canada Without a Job Offer",                     unsplash_keyword: "canadian flag",       published_at: "2025-08-19T10:00:00Z" },
  { primary_keyword: "Canada immigration",      title_hint: "Canadian Permanent Residence Application Process Step by Step",       unsplash_keyword: "canada permanent resident", published_at: "2025-10-22T10:00:00Z" },
  { primary_keyword: "Canada immigration",      title_hint: "Top 10 Canada Immigration Programs Compared",                         unsplash_keyword: "canada immigration",  published_at: "2025-12-09T10:00:00Z" },
  { primary_keyword: "Canada immigration",      title_hint: "Family Sponsorship in Canada Complete Guide",                         unsplash_keyword: "canadian family",     published_at: "2026-03-05T10:00:00Z" },

  // Work in Canada — 5
  { primary_keyword: "work in Canada",          title_hint: "How to Get a Work Permit in Canada",                                 unsplash_keyword: "canadian worker",     published_at: "2025-05-13T10:00:00Z" },
  { primary_keyword: "work in Canada",          title_hint: "Top In-Demand Jobs to Work in Canada as a Foreign Worker",            unsplash_keyword: "canada construction", published_at: "2025-07-24T10:00:00Z" },
  { primary_keyword: "work in Canada",          title_hint: "Working in Canada Without LMIA: All Pathways Explained",              unsplash_keyword: "canada office",       published_at: "2025-09-11T10:00:00Z" },
  { primary_keyword: "work in Canada",          title_hint: "Canadian Work Visa: Open vs Employer-Specific Permits",               unsplash_keyword: "vancouver harbour",   published_at: "2025-11-06T10:00:00Z" },
  { primary_keyword: "work in Canada",          title_hint: "Best Provinces to Work in Canada as a Newcomer",                      unsplash_keyword: "calgary downtown",    published_at: "2026-02-12T10:00:00Z" },

  // Tourist Visa Canada — 3
  { primary_keyword: "visa tourist Canada",     title_hint: "How to Get a Canada Tourist Visa: Step-by-Step Guide",                unsplash_keyword: "banff lake",          published_at: "2025-06-04T10:00:00Z" },
  { primary_keyword: "visa tourist Canada",     title_hint: "Canada Tourist Visa Refused: Top Reasons and How to Reapply",         unsplash_keyword: "niagara falls",       published_at: "2025-09-26T10:00:00Z" },
  { primary_keyword: "visa tourist Canada",     title_hint: "Super Visa Canada: Visiting Parents and Grandparents",                 unsplash_keyword: "canadian grandparents", published_at: "2026-01-15T10:00:00Z" },

  // Consultation Canada Immigration — 3
  { primary_keyword: "Canada immigration consultation", title_hint: "Why You Need a Licensed Canadian Immigration Consultant RCIC",  unsplash_keyword: "immigration office",  published_at: "2025-04-25T10:00:00Z" },
  { primary_keyword: "Canada immigration consultation", title_hint: "RCIC vs Lawyer: Who to Choose for Your Canada Immigration Consultation", unsplash_keyword: "consultation meeting", published_at: "2025-08-07T10:00:00Z" },
  { primary_keyword: "Canada immigration consultation", title_hint: "What to Expect in Your First Canada Immigration Consultation", unsplash_keyword: "professional meeting", published_at: "2025-12-18T10:00:00Z" },

  // Free Evaluation Immigration Canada — 3
  { primary_keyword: "free evaluation immigration Canada", title_hint: "Get a Free Canada Immigration Evaluation: What It Includes",   unsplash_keyword: "evaluation checklist", published_at: "2025-05-29T10:00:00Z" },
  { primary_keyword: "free evaluation immigration Canada", title_hint: "Are You Eligible for Canada? Take Our Free Profile Evaluation", unsplash_keyword: "canada checklist",     published_at: "2025-10-08T10:00:00Z" },
  { primary_keyword: "free evaluation immigration Canada", title_hint: "Free CRS Calculator and Evaluation: Plan Your Express Entry",  unsplash_keyword: "laptop planning",      published_at: "2026-04-23T10:00:00Z" },
];

const SYSTEM_PROMPT = `You are an expert Canadian immigration content writer.
Generate SEO-optimized bilingual blog posts for an immigration consulting firm based in Montreal.
Always respond with valid JSON only — no markdown fences, no extra text.`;

type GeneratedArticle = {
  slug: string;
  title_en: string;
  title_fr: string;
  excerpt_en: string;
  excerpt_fr: string;
  content_en: string;
  content_fr: string;
  meta_desc_en: string;
  meta_desc_fr: string;
};

async function generate(t: Topic): Promise<GeneratedArticle> {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const userPrompt = `Topic / title hint: ${t.title_hint}
Primary SEO keyword: ${t.primary_keyword}

Generate a blog post JSON with exactly these keys:
- slug: lowercase-hyphenated URL slug derived from the title, max 60 chars, no dates, no stop-words at start
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
- Use related semantic keywords throughout (LSI)
- Content must be accurate and helpful for prospective immigrants to Canada in 2025-2026
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
  return JSON.parse(raw) as GeneratedArticle;
}

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error("Missing Supabase credentials");
  const db = createClient(url, key, { auth: { persistSession: false } });

  let ok = 0;
  let fail = 0;
  for (const [i, t] of TOPICS.entries()) {
    console.log(`\n[${i + 1}/${TOPICS.length}] ${t.title_hint}  (${t.published_at.slice(0, 10)})`);
    try {
      const article = await generate(t);
      const photo = await fetchUnsplashPhoto(t.unsplash_keyword);

      const { error } = await db.from("blog_posts").insert({
        slug: article.slug,
        source_url: `https://idlogice.com/internal/${article.slug}`,
        source_title: t.title_hint,
        title: { en: article.title_en, fr: article.title_fr },
        excerpt: { en: article.excerpt_en, fr: article.excerpt_fr },
        content: { en: article.content_en, fr: article.content_fr },
        meta_desc: { en: article.meta_desc_en, fr: article.meta_desc_fr },
        image_url: photo?.url ?? null,
        image_alt: photo?.alt ?? null,
        image_credit: photo?.credit ?? null,
        status: "published",
        published_at: t.published_at,
      });

      if (error) {
        if (error.code === "23505") {
          console.log("  already exists, skipping");
        } else {
          console.error("  insert error:", error.message);
          fail++;
          continue;
        }
      }
      console.log(`  ok — /en/blog/${article.slug}`);
      ok++;
    } catch (e) {
      console.error("  failed:", (e as Error).message);
      fail++;
    }
    // small delay to be nice to Groq + Unsplash free tiers
    await new Promise((r) => setTimeout(r, 2500));
  }
  console.log(`\nDone. ok=${ok} fail=${fail}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
