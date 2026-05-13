export const dynamic = "force-static";
import type { MetadataRoute } from "next";

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;

const HIGH = 1.0;
const TOP = 0.9;
const SERVICE = 0.8;
const TOOLS = 0.75;
const CONTENT = 0.7;
const STANDARD = 0.6;
const LEGAL = 0.3;

type Route = {
  path: string;
  priority: number;
  changeFreq: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const ROUTES: Route[] = [
  { path: "",                             priority: HIGH,     changeFreq: "weekly" },
  { path: "/about",                       priority: STANDARD, changeFreq: "monthly" },
  { path: "/blog",                        priority: STANDARD, changeFreq: "daily" },
  { path: "/contact",                     priority: STANDARD, changeFreq: "monthly" },
  { path: "/book-consultation",           priority: TOP,      changeFreq: "weekly" },
  { path: "/calculator",                  priority: TOOLS,    changeFreq: "weekly" },
  { path: "/evaluation",                  priority: TOOLS,    changeFreq: "weekly" },
  { path: "/services",                    priority: TOP,      changeFreq: "monthly" },
  { path: "/services/express-entry",      priority: SERVICE,  changeFreq: "monthly" },
  { path: "/services/study-permit",       priority: SERVICE,  changeFreq: "monthly" },
  { path: "/services/work-permit",        priority: SERVICE,  changeFreq: "monthly" },
  { path: "/services/pnp",                priority: SERVICE,  changeFreq: "monthly" },
  { path: "/services/family-sponsorship", priority: SERVICE,  changeFreq: "monthly" },
  { path: "/services/tourist-visa",       priority: SERVICE,  changeFreq: "monthly" },
  { path: "/testimonials",                priority: CONTENT,  changeFreq: "weekly" },
  { path: "/faq",                         priority: CONTENT,  changeFreq: "monthly" },
  { path: "/jobs",                        priority: CONTENT,  changeFreq: "weekly" },
  { path: "/privacy",                     priority: LEGAL,    changeFreq: "yearly" },
  { path: "/terms",                       priority: LEGAL,    changeFreq: "yearly" },
  { path: "/cookies",                     priority: LEGAL,    changeFreq: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.flatMap(({ path, priority, changeFreq }) =>
    LOCALES.map((locale) => ({
      url: `${BASE}/${locale}${path}`,
      lastModified: now,
      changeFrequency: changeFreq,
      priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE}/${l}${path}`]),
        ),
      },
    })),
  );
}
