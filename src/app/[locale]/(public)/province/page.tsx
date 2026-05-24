import Link from "next/link";
import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { PROVINCES } from "@/data/immigration-provinces";

export const revalidate = false;

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;
type Locale = (typeof LOCALES)[number];
type Props = { params: Promise<{ locale: string }> };

const T = {
  title: {
    en: "Canada Provincial Immigration Programs (PNP) Guide",
    fr: "Guide des programmes d'immigration provinciaux du Canada (PNP)",
    es: "GuÃ­a de programas de inmigraciÃ³n provincial de CanadÃ¡ (PNP)",
    ar: "Ø¯Ù„ÙŠÙ„ Ø¨Ø±Ø§Ù…Ø¬ Ø§Ù„Ù‡Ø¬Ø±Ø© Ø§Ù„Ø¥Ù‚Ù„ÙŠÙ…ÙŠØ© Ø§Ù„ÙƒÙ†Ø¯ÙŠØ© (PNP)",
  },
  desc: {
    en: "Explore Provincial Nominee Programs (PNP) for all 10 Canadian provinces. Compare streams, minimum CRS scores, in-demand occupations and eligibility requirements.",
    fr: "Explorez les Programmes des candidats des provinces (PNP) pour les 10 provinces canadiennes. Comparez les voies, scores CRS minimaux et professions en demande.",
    es: "Explore los Programas de Nominados Provinciales (PNP) para las 10 provincias canadienses. Compare corrientes, puntajes CRS mÃ­nimos y ocupaciones en demanda.",
    ar: "Ø§Ø³ØªÙƒØ´Ù Ø¨Ø±Ø§Ù…Ø¬ Ø§Ù„Ù…Ø±Ø´Ø­ÙŠÙ† Ø§Ù„Ø¥Ù‚Ù„ÙŠÙ…ÙŠÙŠÙ† (PNP) Ù„Ù„Ù…Ù‚Ø§Ø·Ø¹Ø§Øª Ø§Ù„ÙƒÙ†Ø¯ÙŠØ© Ø§Ù„Ø¹Ø´Ø±. Ù‚Ø§Ø±Ù† Ø§Ù„Ù…Ø³Ø§Ø±Ø§Øª ÙˆØ§Ù„Ø­Ø¯ Ø§Ù„Ø£Ø¯Ù†Ù‰ Ù„Ø¯Ø±Ø¬Ø§Øª CRS ÙˆØ§Ù„Ù…Ù‡Ù† Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©.",
  },
  h1: {
    en: "Canadian Provincial Immigration Programs",
    fr: "Programmes d'immigration provinciaux canadiens",
    es: "Programas de inmigraciÃ³n provinciales canadienses",
    ar: "Ø¨Ø±Ø§Ù…Ø¬ Ø§Ù„Ù‡Ø¬Ø±Ø© Ø§Ù„Ø¥Ù‚Ù„ÙŠÙ…ÙŠØ© Ø§Ù„ÙƒÙ†Ø¯ÙŠØ©",
  },
  lead: {
    en: "Each Canadian province runs its own nomination program with targeted streams for skilled workers, entrepreneurs, and international graduates. Select a province to explore its specific pathways.",
    fr: "Chaque province canadienne gÃ¨re son propre programme de nomination avec des voies ciblÃ©es pour les travailleurs qualifiÃ©s, entrepreneurs et diplÃ´mÃ©s internationaux.",
    es: "Cada provincia canadiense gestiona su propio programa de nominaciÃ³n con corrientes dirigidas a trabajadores calificados, empresarios y graduados internacionales.",
    ar: "ØªØ¯ÙŠØ± ÙƒÙ„ Ù…Ù‚Ø§Ø·Ø¹Ø© ÙƒÙ†Ø¯ÙŠØ© Ø¨Ø±Ù†Ø§Ù…Ø¬ ØªØ±Ø´ÙŠØ­Ù‡Ø§ Ø§Ù„Ø®Ø§Øµ Ù…Ø¹ Ù…Ø³Ø§Ø±Ø§Øª Ù…Ø³ØªÙ‡Ø¯ÙØ© Ù„Ù„Ø¹Ù…Ø§Ù„ Ø§Ù„Ù…Ù‡Ø±Ø© ÙˆØ±Ø¬Ø§Ù„ Ø§Ù„Ø£Ø¹Ù…Ø§Ù„ ÙˆØ§Ù„Ø®Ø±ÙŠØ¬ÙŠÙ† Ø§Ù„Ø¯ÙˆÙ„ÙŠÙŠÙ†.",
  },
  pnpLabel: {
    en: "PNP",
    fr: "PNP",
    es: "PNP",
    ar: "PNP",
  },
  streamsLabel: {
    en: "streams",
    fr: "voies",
    es: "corrientes",
    ar: "Ù…Ø³Ø§Ø±Ø§Øª",
  },
  ctaQ: {
    en: "Not sure which province matches your profile?",
    fr: "Vous ne savez pas quelle province correspond Ã  votre profil ?",
    es: "Â¿No sabe quÃ© provincia se adapta a su perfil?",
    ar: "ØºÙŠØ± Ù…ØªØ£ÙƒØ¯ Ù…Ù† Ø£ÙŠ Ù…Ù‚Ø§Ø·Ø¹Ø© ØªÙ†Ø§Ø³Ø¨ Ù…Ù„ÙÙƒØŸ",
  },
  ctaBtn: { en: "Free Evaluation", fr: "Ã‰valuation gratuite", es: "EvaluaciÃ³n gratuita", ar: "ØªÙ‚ÙŠÙŠÙ… Ù…Ø¬Ø§Ù†ÙŠ" },
  breadHome: { en: "Home", fr: "Accueil", es: "Inicio", ar: "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©" },
} as const;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;
  const title = T.title[l];
  const description = T.desc[l];
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${l}/province`,
      languages: Object.fromEntries(LOCALES.map((loc) => [loc, `${BASE}/${loc}/province`])),
    },
    openGraph: { title, description, url: `${BASE}/${l}/province`, type: "website" },
  };
}

export default async function ProvinceIndexPage({ params }: Props) {
  const { locale } = await params;
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;

  return (
    <div dir={l === "ar" ? "rtl" : "ltr"} className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <nav aria-label="breadcrumb" className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1">
        <Link href={`/${l}`} className="hover:text-primary">{T.breadHome[l]}</Link>
        <span aria-hidden>/</span>
        <span className="text-gray-800 font-medium">{T.h1[l]}</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{T.h1[l]}</h1>
      <p className="text-lg text-gray-600 mb-10 max-w-2xl">{T.lead[l]}</p>

      <div className="grid sm:grid-cols-2 gap-3">
        {PROVINCES.map((p) => (
          <Link
            key={p.slug}
            href={`/${l}/province/${p.slug}`}
            className="flex items-center justify-between px-4 py-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-blue-50 transition-colors group"
          >
            <div className="min-w-0">
              <p className="font-medium text-gray-800 group-hover:text-primary text-sm">{p.name[l]}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {p.pnpName.en} &middot; {p.streams.length} {T.streamsLabel[l]}
              </p>
            </div>
            <span className="text-xs font-mono bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-primary px-2 py-0.5 rounded shrink-0 ml-3">
              {p.code}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-blue-900 text-white rounded-2xl p-8 text-center">
        <p className="text-lg font-medium mb-4">{T.ctaQ[l]}</p>
        <Link
          href={`/${l}/evaluation`}
          className="inline-block bg-white text-blue-900 font-semibold px-7 py-3 rounded-full hover:bg-blue-50 transition-colors"
        >
          {T.ctaBtn[l]}
        </Link>
      </div>
    </div>
  );
}


