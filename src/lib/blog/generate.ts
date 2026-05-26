import Groq from "groq-sdk";
import type { RssItem } from "./rss";

export type GeneratedArticle = {
  slug: string;
  title_en: string;
  title_fr: string;
  excerpt_en: string;
  excerpt_fr: string;
  content_en: string;
  content_fr: string;
  meta_desc_en: string;
  meta_desc_fr: string;
  unsplash_keyword: string;
};

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an expert Canadian immigration content writer.
Generate SEO-optimized bilingual blog posts for an immigration consulting firm (IDLOGICE) based in Montreal.
Always respond with valid JSON only — no markdown fences, no extra text.`;

export async function generateArticle(item: RssItem): Promise<GeneratedArticle> {
  const userPrompt = `
News item to write about:
Title: ${item.title}
Summary: ${item.contentSnippet}
Source: ${item.link}

Generate a blog post JSON with exactly these keys:
- slug: lowercase-hyphenated URL slug, max 60 chars, no dates
- title_en: SEO title in English, 50-60 chars
- title_fr: SEO title in French, 50-60 chars
- excerpt_en: 1-2 sentence summary in English, 120-160 chars
- excerpt_fr: 1-2 sentence summary in French, 120-160 chars
- content_en: Full article in English, 600-900 words, markdown with ## headings
- content_fr: Full article in French, 600-900 words, markdown with ## headings
- meta_desc_en: Meta description in English, 140-155 chars
- meta_desc_fr: Meta description in French, 140-155 chars
- unsplash_keyword: 2-3 word English phrase for image search (e.g. "canada passport")

Rules:
- Include primary keyword near the start of title and first paragraph
- Content must be accurate and helpful for immigrants to Canada
- Tone: professional, warm, helpful
- Do NOT mention IDLOGICE in the content
- Do NOT include any hyperlinks or URLs in the content — no markdown links, no bare URLs, no [text](url) syntax
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Groq returned empty response");

  const article = JSON.parse(raw) as GeneratedArticle;

  const required: (keyof GeneratedArticle)[] = [
    "slug", "title_en", "title_fr", "excerpt_en", "excerpt_fr",
    "content_en", "content_fr", "meta_desc_en", "meta_desc_fr", "unsplash_keyword",
  ];
  for (const field of required) {
    if (!article[field]) throw new Error(`Groq response missing field: ${field}`);
  }

  return article;
}
