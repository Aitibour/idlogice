/**
 * Expand every published blog post:
 *   - Rewrite EN + FR bodies to 1800–2200 words with proper H2/H3 structure
 *   - Generate 5 FAQ Q&A pairs per locale
 *
 * Stores everything inside the existing `content` jsonb column as
 *   { en, fr, faq_en: [{q,a}...], faq_fr: [{q,a}...] }
 *
 * Run: npx tsx --env-file=.env.local scripts/expand-blog.ts
 */
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

const GROQ_KEY =
  process.env.GROQ_API_KEY ||
  "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";

// Each model has its own independent TPD pool. Ordered by quality.
// (mixtral, gemma2, llama-3.1-70b are all decommissioned as of May 2026)
const MODELS = [
  { id: "llama-3.3-70b-versatile",                   maxTokens: 6000 },
  { id: "qwen/qwen3-32b",                             maxTokens: 7000 },
  { id: "meta-llama/llama-4-scout-17b-16e-instruct",  maxTokens: 7000 },
];

let modelIdx = 0;

/** Parse "Please try again in 12m43.776s" → seconds */
function parseWaitSeconds(msg: string): number {
  const m = msg.match(/try again in (?:(\d+)m)?(?:(\d+(?:\.\d+)?)s)?/i);
  if (!m) return 75;
  const mins = parseFloat(m[1] ?? "0");
  const secs = parseFloat(m[2] ?? "0");
  return mins * 60 + secs + 15; // +15s buffer
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

const SYSTEM_PROMPT = `You are a senior SEO content strategist for a Canadian
immigration consulting firm. You write E-E-A-T-grade content backed by IRCC
facts. Always respond with valid JSON only — no markdown fences, no prose.`;

function buildPrompt(title: string, keyword: string, existing: string) {
  // Keep existing draft short to reduce token usage
  const draft = existing.slice(0, 800);
  return `Expand into a long-form SEO article.
Title: "${title}". Primary keyword: "${keyword}".
Draft excerpt: """${draft}"""

Return JSON with EXACTLY these keys:
- content_en: 1800-2200 word markdown article. Intro mentions keyword in first
  80 chars. 6-8 ## H2 sections, each 2-4 paragraphs + one list. LSI keywords:
  Express Entry, CRS, IRCC, RCIC, work/study/visitor permit, PNP. 2-3 internal
  links to /evaluation /calculator or /services/<program>. End with Next Steps
  paragraph.
- content_fr: French equivalent, same structure, 1800-2200 words.
- faq_en: exactly 5 {"q":"...","a":"..."} objects, answers 40-80 words.
- faq_fr: French translation of faq_en.

Professional tone. No firm name. No HTML or code fences.`;
}

type ExpandedPost = {
  content_en: string;
  content_fr: string;
  faq_en: Array<{ q: string; a: string }>;
  faq_fr: Array<{ q: string; a: string }>;
};

async function callGroq(prompt: string): Promise<string> {
  // Each model has its own independent TPD pool — rotate model on rate limit.
  // All GROQ_KEY variants share the same org limits, so key rotation doesn't help.
  const startModel = modelIdx;
  let rotations = 0;

  while (rotations < MODELS.length) {
    const { id, maxTokens } = MODELS[modelIdx % MODELS.length];
    try {
      const groq = new Groq({ apiKey: GROQ_KEY });
      const res = await groq.chat.completions.create({
        model: id,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.5,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
      });
      const text = res.choices[0]?.message?.content;
      if (!text) throw new Error("Empty response");
      return text;
    } catch (e) {
      const msg = (e as Error).message ?? "";
      const isRateLimit =
        msg.includes("429") ||
        msg.includes("rate_limit") ||
        msg.toLowerCase().includes("rate limit");

      if (isRateLimit) {
        // Parse exact wait from error before rotating to next model
        const waitSec = parseWaitSeconds(msg);
        modelIdx = (modelIdx + 1) % MODELS.length;
        rotations++;
        const nextModel = MODELS[modelIdx % MODELS.length].id;
        console.log(`  ⏳ ${id} rate limited — trying ${nextModel} (wait ${Math.ceil(waitSec)}s if needed)`);
        // Only sleep if we've exhausted all models and looped back
        if (modelIdx % MODELS.length === startModel % MODELS.length) {
          console.log(`  All models exhausted — waiting ${Math.ceil(waitSec)}s for window to clear`);
          await sleep(waitSec * 1000);
        }
        continue;
      }
      throw e;
    }
  }
  throw new Error("All model pools exhausted");
}

async function generate(args: {
  title: string;
  keyword: string;
  existing: string;
}): Promise<ExpandedPost> {
  const raw = await callGroq(buildPrompt(args.title, args.keyword, args.existing));
  const parsed = JSON.parse(raw);
  for (const k of ["content_en", "content_fr", "faq_en", "faq_fr"]) {
    if (!parsed[k]) throw new Error("Missing field: " + k);
  }
  return parsed as ExpandedPost;
}

function inferKeyword(slug: string): string {
  if (slug.includes("tourist") || slug.includes("visitor")) return "Canada tourist visa";
  if (slug.includes("super-visa")) return "Canada super visa for parents";
  if (slug.includes("consultation") || slug.includes("rcic")) return "Canada immigration consultation";
  if (slug.includes("evaluation") || slug.includes("crs")) return "Canada immigration CRS evaluation";
  if (slug.includes("express-entry")) return "Canada Express Entry 2025";
  if (slug.includes("pnp") || slug.includes("provincial")) return "Canada provincial nominee program";
  if (slug.includes("study")) return "Canada student visa";
  if (slug.includes("work")) return "work permit Canada";
  if (slug.includes("family") || slug.includes("spousal")) return "Canada family sponsorship";
  if (slug.includes("refugee") || slug.includes("asylum")) return "Canada refugee claim";
  if (slug.includes("citizenship")) return "Canada citizenship application";
  if (slug.includes("permanent") || slug.includes("pr")) return "Canada permanent residence";
  if (slug.includes("lmia")) return "Canada LMIA work permit";
  return "Canada immigration 2025";
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
  if (!posts?.length) { console.log("No posts found."); return; }

  console.log(`Found ${posts.length} posts. Models: ${MODELS.map(m => m.id.split("/").pop()).join(", ")}`);

  let ok = 0, skip = 0, fail = 0;

  for (const [i, post] of posts.entries()) {
    const c = post.content as Record<string, unknown>;

    const enWords = typeof c?.en === "string"
      ? c.en.split(/\s+/).filter(Boolean).length
      : 0;
    const alreadyExpanded =
      c && Array.isArray(c.faq_en) && c.faq_en.length >= 3 && enWords >= 1500;
    if (alreadyExpanded) {
      console.log(`[${i + 1}/${posts.length}] skip: ${post.slug} (${enWords} words)`);
      skip++;
      continue;
    }

    const title =
      (post.title as Record<string, string>)?.en ?? post.source_title ?? post.slug;
    const existing = (c?.en as string) ?? "";
    const keyword = inferKeyword(post.slug);

    console.log(`[${i + 1}/${posts.length}] ${post.slug}  (${keyword})`);

    try {
      const out = await generate({ title, keyword, existing });

      const merged = {
        en: out.content_en,
        fr: out.content_fr,
        faq_en: out.faq_en,
        faq_fr: out.faq_fr,
      };

      // blog_posts has no updated_at column — only touch content
      const { error: upErr } = await db
        .from("blog_posts")
        .update({ content: merged })
        .eq("slug", post.slug);

      if (upErr) throw upErr;

      const words = out.content_en.split(/\s+/).filter(Boolean).length;
      console.log(`  ✓ ${words} words EN | ${out.faq_en.length} FAQ`);
      ok++;
    } catch (e) {
      console.error(`  ✗ ${(e as Error).message.slice(0, 120)}`);
      fail++;
    }

    await sleep(1500);
  }

  console.log(`\nDone. ok=${ok} skip=${skip} fail=${fail}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
