import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { generateCoverImage } from "../src/lib/blog/openai-image";
import { publishToLinkedIn } from "../src/lib/blog/linkedin";

const article = {
  title: "Manitoba Skilled Workers: Strategic Recruitment Initiative",
  summary: "Manitoba has launched its 10th draw of the year under a strategic recruitment initiative, targeting skilled workers in key sectors. The draw issued invitations to Express Entry candidates with profiles matching provincial labour market needs.",
  slug: "manitoba-skilled-workers",
};

console.log("Generating DALL-E cover image...");
const coverImage = await generateCoverImage(article.title, "Manitoba immigration skilled workers Canada");
console.log("Cover image:", coverImage ? `${coverImage.length} bytes` : "null (billing limit)");

console.log("Publishing to LinkedIn...");
const ok = await publishToLinkedIn({ ...article, locale: "en", coverImage });
console.log("LinkedIn result:", ok ? "✅ Posted" : "❌ Failed");
