export const dynamic = "force-static";
import type { MetadataRoute } from "next";

const BASE = "https://idlogice.com";

const staticRoutes = [
  "/",
  "/about",
  "/contact",
  "/book-consultation",
  "/services",
  "/services/express-entry",
  "/services/study-permit",
  "/services/work-permit",
  "/services/pnp",
  "/services/family-sponsorship",
  "/services/tourist-visa",
  "/privacy",
  "/terms",
  "/cookies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["en", "fr"];

  return staticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${BASE}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "/" ? 1 : route.startsWith("/services/") ? 0.8 : 0.6,
      alternates: {
        languages: {
          en: `${BASE}/en${route}`,
          fr: `${BASE}/fr${route}`,
        },
      },
    })),
  );
}
