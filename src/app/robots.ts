export const dynamic = "force-static";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "Google-Extended",
          "ClaudeBot",
          "Claude-User",
          "anthropic-ai",
          "PerplexityBot",
          "Perplexity-User",
          "cohere-ai",
        ],
        allow: "/",
        disallow: ["/api/", "/auth/", "/dashboard/", "/checkout/"],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/dashboard/", "/checkout/"],
      },
    ],
    sitemap: "https://idlogice.com/sitemap.xml",
    host: "https://idlogice.com",
  };
}
