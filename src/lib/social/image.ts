import { createHash } from "node:crypto";

// Runtime API integration for unattended posts; generated assets are persisted before publishing.
export async function generateSocialImage(prompt: string) {
  const providers = [
    { key: process.env.OPENAI_API_KEY, base: process.env.OPENAI_BASE_URL ?? "https://api.openai.com" },
    { key: process.env.OPENAI_API_KEY_1, base: "https://api.openai.com" },
    { key: process.env.OPENAI_API_KEY_2, base: "https://api.openai.com" },
  ].filter((provider) => !!provider.key);
  if (!providers.length) throw new Error("Image generation API credentials are missing");
  for (const { key, base } of providers) {
    const endpoint = `${base.replace(/\/$/, "").replace(/\/v1$/, "")}/v1/images/generations`;
    const response = await fetch(endpoint, {
      method: "POST", signal: AbortSignal.timeout(240000),
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.SOCIAL_IMAGE_MODEL ?? "gpt-image-2", prompt, n: 1, size: "1024x1024", quality: "medium", output_format: "png" }),
    });
    if (!response.ok) {
      if ([401, 403, 429].includes(response.status)) continue;
      throw new Error(`Image generation failed (${response.status})`);
    }
    const result = await response.json() as { data?: { b64_json?: string }[] };
    const data = result.data?.[0]?.b64_json;
    if (!data) throw new Error("Image provider returned no image; post held");
    const bytes = Buffer.from(data, "base64");
    if (bytes.length < 1000 || bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") throw new Error("Image provider returned an invalid PNG");
    return { bytes, hash: createHash("sha256").update(bytes).digest("hex") };
  }
  throw new Error("All configured image credentials were rejected; post held");
}
