/**
 * Expand every published blog post:
 *   - Rewrite EN + FR bodies to 1800–2200 words with proper H2/H3 structure
 *   - Generate 5 FAQ Q&A pairs per locale (rendered visibly + used in
 *     FAQPage JSON-LD on the slug page)
 *
 * Stores everything inside the existing `content` jsonb column as
 *   { en, fr, faq_en: [{q,a}...], faq_fr: [{q,a}...] }
 * — no schema migration needed.
 *
 * Run: npx tsx --env-file=.env.local scripts/expand-blog.ts
 */
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

const SYSTEM_PROMPT = `You are a senior SEO content strategist for a Canadian
immigration consulting firm. You write E-E-A-T-grade content backed by IRCC
facts. Always respond with valid JSON only — no markdown fences, no prose
wrapper.`;

function buildPrompt(title: string, primaryKeyword: string, existing: string) {
  return `You are expanding an existing article into a long-form, SEO-optimized
piece. Title: "${title}". Primary keyword: "${primaryKeyword}".

Existing draft (for context — feel free to rewrite, but keep the same factual
intent):
"""
${existing}
"""

Return JSON with EXACTLY these keys:
- content_en: 1800-2200 words of valid markdown. Structure: short intro
  paragraph mentioning the primary keyword in the first 100 chars, then 6-8
  ## H2 sections covering subtopics, each with 2-4 paragraphs and at least
  one bulleted or numbered list. Use natural LSI keywords (Express Entry,
  CRS, IRCC, RCIC, work permit, study permit, PNP, etc.). Include 2-3
  internal-link suggestions written as plain markdown links pointing to
  /evaluation, /calculator, or /services/<program>. End with a short "Next
  steps" paragraph inviting the reader to claim a free profile evaluation.
- content_fr: French equivalent, 1800-2200 words, same structure and link
  targets.
- faq_en: array of EXACTLY 5 objects each {"q": "...", "a": "..."}. Questions
  are real things searchers ask (mirror Google "People Also Ask"). Answers
  are 40-80 words, helpful, factual.
- faq_fr: French equivalent of faq_en, same 5 questions translated.

Tone: professional, warm, accurate. Cite IRCC where relevant. Do NOT mention
the firm name. Do NOT include code fences or HTML tags.`;
}

async function generate(args: { title: string; primaryKeyword: string; existing: string }) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildPrompt(args.title, args.primaryKeyword, args.existing) },
    ],
    temperature: 0.5,
    max_tokens: 8000,
    response_format: { type: "json_object" },
  });
  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty Groq response");
  const parsed = JSON.parse(raw);
  const required = ["content_en", "content_fr", "faq_en", "faq_fr"];
  for (const k of required) {
    if (!parsed[k]) throw new Error("Groq missing " + k);
  }
  return parsed as {
    content_en: string;
    content_fr: string;
    faq_en: Array<{ q: string; a: string }>;
    faq_fr: Array<{ q: string; a: string }>;
  };
}

function inferPrimaryKeyword(slug: string): string {
  if (slug.includes("tourist") || slug.includes("super-visa")) return "Canada tourist visa";
  if (slug.includes("consultation") || slug.includes("rcic")) return "Canada immigration consultation";
  if (slug.includes("evaluation") || slug.includes("crs")) return "free Canada immigration evaluation";
  if (slug.includes("work")) return "work in Canada";
  return "Canada immigration";
}

async function run() {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

  const { data: posts, error } = await db
    .from("blog_posts")
    .select("slug, source_title, title, content")
    .eq("status", "published")
    .order("published_at", { ascending: true });

  if (error) throw error;
  if (!posts) return;

  let ok = 0;
  let fail = 0;
  for (const [i, post] of posts.entries()) {
    const c = post.content as Record<string, unknown>;
    // Skip if already expanded (faq_en present).
    if (c && Array.isArray(c.faq_en) && c.faq_en.length >= 3) {
      console.log(`[${i + 1}/${posts.length}] skip (already expanded): ${post.slug}`);
      continue;
    }

    const title = (post.title as Record<string, string>)?.en ?? post.source_title ?? post.slug;
    const existing = (c?.en as string) ?? "";
    const primary = inferPrimaryKeyword(post.slug);

    console.log(`[${i + 1}/${posts.length}] expanding: ${post.slug}  primary=${primary}`);
    try {
      const out = await generate({ title, primaryKeyword: primary, existing });

      const merged = {
        en: out.content_en,
        fr: out.content_fr,
        faq_en: out.faq_en,
        faq_fr: out.faq_fr,
      };

      // Note: schema has no `updated_at` column — we only touch `content`.
      // Sitemap lastModified falls back to `published_at`.
      const { error: upErr } = await db
        .from("blog_posts")
        .update({ content: merged })
        .eq("slug", post.slug);

      if (upErr) throw upErr;

      const words = out.content_en.split(/\s+/).filter(Boolean).length;
      console.log(`  ok — ${words} words (en) + ${out.faq_en.length} FAQ`);
      ok++;
    } catch (e) {
      console.error("  fail:", (e as Error).message);
      fail++;
    }
    await new Promise((r) => setTimeout(r, 2500));
  }

  console.log(`\nDone. ok=${ok} fail=${fail}`);
}

run().catch((e) => { console.error(e); process.exit(1); });
