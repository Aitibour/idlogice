/**
 * Generates correct hreflang alternates for any page.
 * Call this in each page's generateMetadata to avoid the layout-level
 * alternates from incorrectly pointing all pages to the homepage.
 *
 * @param path - The locale-agnostic path, e.g. "" (homepage), "/blog/my-post", "/about"
 */

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;
type Locale = (typeof LOCALES)[number];

// BCP 47 language tags used in hreflang link elements
const HREFLANG_TAGS: Record<Locale, string> = {
  en: "en-CA",
  fr: "fr-CA",
  es: "es",
  ar: "ar",
};

export function generateAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[HREFLANG_TAGS[locale]] = `${BASE}/${locale}${path}`;
  }
  languages["x-default"] = `${BASE}/en${path}`;
  return { languages };
}

/**
 * Generates canonical + full hreflang alternates for a page.
 *
 * @param locale - Current locale (en, fr, es, ar)
 * @param path   - Path without locale prefix, e.g. "" | "/blog/my-post"
 */
export function generatePageAlternates(locale: string, path: string) {
  return {
    canonical: `${BASE}/${locale}${path}`,
    ...generateAlternates(path),
  };
}
