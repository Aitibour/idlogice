export const dynamic = "force-static";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
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
