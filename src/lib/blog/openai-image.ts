/**
 * DALL-E 3 cover image generator for blog posts / LinkedIn.
 * Rotates between two API keys to spread quota usage.
 */

let keyIndex = 0;

function getApiKey(): string | null {
  const keys = [
    process.env.OPENAI_API_KEY_1,
    process.env.OPENAI_API_KEY_2,
  ].filter(Boolean) as string[];

  if (keys.length === 0) return null;
  const key = keys[keyIndex % keys.length];
  keyIndex++;
  return key;
}

/**
 * Generate a 1792×1024 cover image via DALL-E 3.
 * Returns the image as a Buffer (PNG), or null on failure.
 */
export async function generateCoverImage(
  title: string,
  keywords: string
): Promise<Buffer | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.log("No OpenAI API key configured — skipping image generation");
    return null;
  }

  const prompt = [
    `Professional editorial cover image for a Canadian immigration blog article.`,
    `Topic: "${title}".`,
    `Visual themes: ${keywords}, Canada, modern city skyline, clean design.`,
    `Style: photorealistic, wide-format editorial photography, warm natural light,`,
    `subtle Canadian flag accent, no text, no watermarks, 16:9 composition.`,
  ].join(" ");

  console.log("Generating DALL-E 3 cover image for:", title);

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1792x1024",
      quality: "standard",
      response_format: "url",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("DALL-E generation failed:", res.status, err);
    // Try the other key on failure
    const fallbackKey = getApiKey();
    if (fallbackKey && fallbackKey !== apiKey) {
      return retryWithKey(fallbackKey, prompt);
    }
    return null;
  }

  const data = (await res.json()) as { data: Array<{ url: string }> };
  const imageUrl = data.data[0]?.url;
  if (!imageUrl) return null;

  // Download the image as a buffer
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) return null;
  const arrayBuffer = await imgRes.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function retryWithKey(apiKey: string, prompt: string): Promise<Buffer | null> {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1792x1024",
      quality: "standard",
      response_format: "url",
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { data: Array<{ url: string }> };
  const imageUrl = data.data[0]?.url;
  if (!imageUrl) return null;

  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) return null;
  const arrayBuffer = await imgRes.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
