// Sitemap is revalidated hourly so newly published blog posts appear
// without a full redeploy.
export const revalidate = 3600;
import type { MetadataRoute } from "next";
import { tryCreateServiceClient } from "@/lib/supabase/service";
import { COUNTRIES } from "@/data/immigration-countries";
import { PROGRAMS } from "@/data/immigration-programs";
import { PROVINCES } from "@/data/immigration-provinces";
import { CITIES } from "@/data/immigration-cities";
import { PROFESSIONS } from "@/data/immigration-professions";
import { BLOG_EXPERTS } from "@/lib/blog/experts";
import { PUBLISHED_BLOG_SLUGS } from "@/data/blog-slugs";

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;
type Locale = (typeof LOCALES)[number];

/** BCP-47 hreflang values — must match page-level generatePageAlternates */
const HREFLANG: Record<Locale, string> = { en: "en-CA", fr: "fr-CA", es: "es", ar: "ar" };

/** Build correct hreflang alternates with x-default for a given path per locale */
function altLangs(pathFn: (l: Locale) => string) {
  return {
    ...Object.fromEntries(LOCALES.map((l) => [HREFLANG[l], pathFn(l)])),
    "x-default": pathFn("en"),
  };
}

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
  { path: "/news",                        priority: TOP,      changeFreq: "daily" },
  { path: "/guides/canada-immigration",   priority: TOP,      changeFreq: "weekly" },
  { path: "/compare-pathways",            priority: TOP,      changeFreq: "monthly" },
  { path: "/contact",                     priority: STANDARD, changeFreq: "monthly" },
  { path: "/book-consultation",           priority: TOP,      changeFreq: "weekly" },
  { path: "/draws",                       priority: TOOLS,    changeFreq: "daily" },
  { path: "/tools",                       priority: TOOLS,    changeFreq: "weekly" },
  { path: "/calculator",                  priority: TOOLS,    changeFreq: "weekly" },
  { path: "/evaluation",                  priority: TOOLS,    changeFreq: "weekly" },
  { path: "/services",                    priority: TOP,      changeFreq: "monthly" },
  { path: "/services/express-entry",      priority: SERVICE,  changeFreq: "monthly" },
  { path: "/services/study-permit",       priority: SERVICE,  changeFreq: "monthly" },
  { path: "/services/work-permit",        priority: SERVICE,  changeFreq: "monthly" },
  { path: "/services/pnp",               priority: SERVICE,  changeFreq: "monthly" },
  { path: "/services/family-sponsorship", priority: SERVICE,  changeFreq: "monthly" },
  { path: "/services/tourist-visa",       priority: SERVICE,  changeFreq: "monthly" },
  { path: "/services/pr-pathways",        priority: SERVICE,  changeFreq: "monthly" },
  { path: "/testimonials",                priority: CONTENT,  changeFreq: "weekly" },
  { path: "/faq",                         priority: CONTENT,  changeFreq: "monthly" },
  { path: "/glossary",                    priority: CONTENT,  changeFreq: "monthly" },
  { path: "/jobs",                        priority: CONTENT,  changeFreq: "weekly" },
  { path: "/stats",                       priority: CONTENT,  changeFreq: "monthly" },
  { path: "/team",                        priority: CONTENT,  changeFreq: "monthly" },
  { path: "/editorial-standards",         priority: CONTENT,  changeFreq: "monthly" },
  { path: "/corrections-policy",          priority: CONTENT,  changeFreq: "monthly" },
  { path: "/official-resources",          priority: CONTENT,  changeFreq: "monthly" },
  { path: "/immigration-disclaimer",      priority: LEGAL,    changeFreq: "yearly" },
  { path: "/privacy",                     priority: LEGAL,    changeFreq: "yearly" },
  { path: "/terms",                       priority: LEGAL,    changeFreq: "yearly" },
  { path: "/cookies",                     priority: LEGAL,    changeFreq: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = ROUTES.flatMap(
    ({ path, priority, changeFreq }) =>
      LOCALES.map((locale) => ({
        url: `${BASE}/${locale}${path}`,
        changeFrequency: changeFreq,
        priority,
        alternates: { languages: altLangs((l) => `${BASE}/${l}${path}`) },
      })),
  );

  // Pull every published blog post and emit per-locale URLs with hreflang alternates.
  const db = tryCreateServiceClient();
  let posts: Array<{ slug: string; published_at: string; updated_at: string | null }> = [];
  if (db) {
    try {
      const { data } = await db
        .from("blog_posts")
        .select("slug, published_at, updated_at")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      posts = data ?? [];
    } catch {
      // The static and programmatic sitemap must remain complete if the blog DB is unavailable.
    }
  }

  const postsBySlug = new Map(posts.map((post) => [post.slug, post]));
  const blogSlugs = [...new Set([...PUBLISHED_BLOG_SLUGS, ...postsBySlug.keys()])];
  const blogEntries: MetadataRoute.Sitemap = blogSlugs.flatMap((rawSlug) => {
    const post = postsBySlug.get(rawSlug);
    const changedAt = post?.updated_at ?? post?.published_at;
    const slug = encodeURIComponent(rawSlug);
    return LOCALES.map((locale) => ({
      url: `${BASE}/${locale}/blog/${slug}`,
      ...(changedAt ? { lastModified: new Date(changedAt) } : {}),
      changeFrequency: "weekly" as const,
      priority: CONTENT,
      alternates: { languages: altLangs((l) => `${BASE}/${l}/blog/${slug}`) },
    }));
  });

  // /from index — 4 locales
  const fromIndexEntries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${BASE}/${locale}/from`,
    changeFrequency: "monthly" as const,
    priority: TOP,
    alternates: { languages: altLangs((l) => `${BASE}/${l}/from`) },
  }));

  // /from/[country] — 39 countries × 4 locales
  const countryEntries: MetadataRoute.Sitemap = COUNTRIES.flatMap((country) =>
    LOCALES.map((locale) => ({
      url: `${BASE}/${locale}/from/${country.slug}`,
      changeFrequency: "monthly" as const,
      priority: CONTENT,
      alternates: { languages: altLangs((l) => `${BASE}/${l}/from/${country.slug}`) },
    })),
  );

  // /programs index — 4 locales
  const programsIndexEntries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${BASE}/${locale}/programs`,
    changeFrequency: "monthly" as const,
    priority: TOP,
    alternates: { languages: altLangs((l) => `${BASE}/${l}/programs`) },
  }));

  // /programs/[program] — 6 programs × 4 locales
  const programEntries: MetadataRoute.Sitemap = PROGRAMS.flatMap((program) =>
    LOCALES.map((locale) => ({
      url: `${BASE}/${locale}/programs/${program.slug}`,
      changeFrequency: "monthly" as const,
      priority: SERVICE,
      alternates: { languages: altLangs((l) => `${BASE}/${l}/programs/${program.slug}`) },
    })),
  );

  // /from/[country]/[program] — 39 × 6 × 4 = 936 pages
  const countryProgramEntries: MetadataRoute.Sitemap = COUNTRIES.flatMap((country) =>
    PROGRAMS.flatMap((program) =>
      LOCALES.map((locale) => ({
        url: `${BASE}/${locale}/from/${country.slug}/${program.slug}`,
        changeFrequency: "monthly" as const,
        priority: STANDARD,
        alternates: { languages: altLangs((l) => `${BASE}/${l}/from/${country.slug}/${program.slug}`) },
      })),
    ),
  );

  // /province hub + /province/[province] — 11 × 4 + 4
  const provinceIndexEntries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${BASE}/${locale}/province`,
    changeFrequency: "monthly" as const,
    priority: TOP,
    alternates: { languages: altLangs((l) => `${BASE}/${l}/province`) },
  }));
  const provinceEntries: MetadataRoute.Sitemap = PROVINCES.flatMap((province) =>
    LOCALES.map((locale) => ({
      url: `${BASE}/${locale}/province/${province.slug}`,
      changeFrequency: "monthly" as const,
      priority: SERVICE,
      alternates: { languages: altLangs((l) => `${BASE}/${l}/province/${province.slug}`) },
    })),
  );

  // /in hub + /in/[city] — 13 × 4 + 4
  const inIndexEntries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${BASE}/${locale}/in`,
    changeFrequency: "monthly" as const,
    priority: TOP,
    alternates: { languages: altLangs((l) => `${BASE}/${l}/in`) },
  }));
  const cityEntries: MetadataRoute.Sitemap = CITIES.flatMap((city) =>
    LOCALES.map((locale) => ({
      url: `${BASE}/${locale}/in/${city.slug}`,
      changeFrequency: "monthly" as const,
      priority: CONTENT,
      alternates: { languages: altLangs((l) => `${BASE}/${l}/in/${city.slug}`) },
    })),
  );

  // /for hub + /for/[profession] — 14 × 4 + 4
  const forIndexEntries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${BASE}/${locale}/for`,
    changeFrequency: "monthly" as const,
    priority: TOP,
    alternates: { languages: altLangs((l) => `${BASE}/${l}/for`) },
  }));
  const professionEntries: MetadataRoute.Sitemap = PROFESSIONS.flatMap((prof) =>
    LOCALES.map((locale) => ({
      url: `${BASE}/${locale}/for/${prof.slug}`,
      changeFrequency: "monthly" as const,
      priority: CONTENT,
      alternates: { languages: altLangs((l) => `${BASE}/${l}/for/${prof.slug}`) },
    })),
  );
  const professionProvinceEntries: MetadataRoute.Sitemap = PROFESSIONS.flatMap((prof) =>
    PROVINCES.flatMap((province) =>
      LOCALES.map((locale) => ({
        url: `${BASE}/${locale}/for/${prof.slug}/${province.slug}`,
        changeFrequency: "monthly" as const,
        priority: STANDARD,
        alternates: {
          languages: altLangs((l) => `${BASE}/${l}/for/${prof.slug}/${province.slug}`),
        },
      })),
    ),
  );

  const authorEntries: MetadataRoute.Sitemap = BLOG_EXPERTS.flatMap((expert) =>
    LOCALES.map((locale) => ({
      url: `${BASE}/${locale}/author/${expert.id}`,
      changeFrequency: "monthly" as const,
      priority: CONTENT,
      alternates: { languages: altLangs((l) => `${BASE}/${l}/author/${expert.id}`) },
    })),
  );

  return [
    ...staticEntries,
    ...authorEntries,
    ...fromIndexEntries,
    ...blogEntries,
    ...countryEntries,
    ...programsIndexEntries,
    ...programEntries,
    ...countryProgramEntries,
    ...provinceIndexEntries,
    ...provinceEntries,
    ...inIndexEntries,
    ...cityEntries,
    ...forIndexEntries,
    ...professionEntries,
    ...professionProvinceEntries,
  ];
}
