// Sitemap is revalidated hourly so newly published blog posts appear
// without a full redeploy.
export const revalidate = 3600;
import type { MetadataRoute } from "next";
import { tryCreateServiceClient } from "@/lib/supabase/service";
import { COUNTRIES } from "@/data/immigration-countries";
import { PROGRAMS } from "@/data/immigration-programs";

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
  { path: "/guides/canada-immigration",   priority: TOP,      changeFreq: "weekly" },
  { path: "/contact",                     priority: STANDARD, changeFreq: "monthly" },
  { path: "/book-consultation",           priority: TOP,      changeFreq: "weekly" },
  { path: "/draws",                       priority: TOOLS,    changeFreq: "daily" },
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = ROUTES.flatMap(
    ({ path, priority, changeFreq }) =>
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

  // Pull every published blog post and emit per-locale URLs with hreflang
  // alternates. Falls back to no blog entries if Supabase is unreachable
  // (e.g. during a build where the service role key isn't scoped).
  const db = tryCreateServiceClient();
  if (!db) return staticEntries;

  const { data: posts } = await db
    .from("blog_posts")
    .select("slug, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const blogEntries: MetadataRoute.Sitemap = (posts ?? []).flatMap((post) =>
    LOCALES.map((locale) => ({
      url: `${BASE}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.published_at ?? now),
      changeFrequency: "weekly" as const,
      priority: CONTENT,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE}/${l}/blog/${post.slug}`]),
        ),
      },
    })),
  );

  // /from index pages — 4 locales
  const fromIndexEntries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${BASE}/${locale}/from`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: TOP,
    alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}/from`])) },
  }));

  // Programmatic country pages — /from/[country] for 39 source countries × 4 locales
  const countryEntries: MetadataRoute.Sitemap = COUNTRIES.flatMap((country) =>
    LOCALES.map((locale) => ({
      url: `${BASE}/${locale}/from/${country.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: CONTENT,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE}/${l}/from/${country.slug}`]),
        ),
      },
    })),
  );

  // /programs index — 4 locales
  const programsIndexEntries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${BASE}/${locale}/programs`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: TOP,
    alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}/programs`])) },
  }));

  // /programs/[program] — 6 programs × 4 locales = 24 pages
  const programEntries: MetadataRoute.Sitemap = PROGRAMS.flatMap((program) =>
    LOCALES.map((locale) => ({
      url: `${BASE}/${locale}/programs/${program.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: SERVICE,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE}/${l}/programs/${program.slug}`]),
        ),
      },
    })),
  );

  // /from/[country]/[program] cross-pages — 39 countries × 6 programs × 4 locales = 936 pages
  const countryProgramEntries: MetadataRoute.Sitemap = COUNTRIES.flatMap((country) =>
    PROGRAMS.flatMap((program) =>
      LOCALES.map((locale) => ({
        url: `${BASE}/${locale}/from/${country.slug}/${program.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: STANDARD,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${BASE}/${l}/from/${country.slug}/${program.slug}`]),
          ),
        },
      })),
    ),
  );

  return [...staticEntries, ...fromIndexEntries, ...blogEntries, ...countryEntries, ...programsIndexEntries, ...programEntries, ...countryProgramEntries];
}
