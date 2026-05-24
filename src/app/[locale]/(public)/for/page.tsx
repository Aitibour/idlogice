import Link from "next/link";
import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { PROFESSIONS } from "@/data/immigration-professions";

export const revalidate = false;

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;
type Locale = (typeof LOCALES)[number];
type Props = { params: Promise<{ locale: string }> };

const T = {
  title: {
    en: "Canada Immigration by Profession",
    fr: "Immigration au Canada par profession",
    es: "InmigraciÃ³n a CanadÃ¡ por profesiÃ³n",
    ar: "Ø§Ù„Ù‡Ø¬Ø±Ø© Ø¥Ù„Ù‰ ÙƒÙ†Ø¯Ø§ Ø­Ø³Ø¨ Ø§Ù„Ù…Ù‡Ù†Ø©",
  },
  desc: {
    en: "Find your profession-specific Canada immigration guide. NOC codes, Express Entry CRS scores, PNP streams and pathways for 12+ in-demand occupations.",
    fr: "Trouvez le guide d'immigration canadienne spÃ©cifique Ã  votre profession. Codes CNP, scores CRS, voies PNP pour 12+ professions en demande.",
    es: "Encuentre la guÃ­a de inmigraciÃ³n canadiense especÃ­fica para su profesiÃ³n. CÃ³digos NOC, puntajes CRS, vÃ­as PNP para 12+ ocupaciones en demanda.",
    ar: "ابحث عن دليل الهجرة الكندي لمهنتك. رموز NOC ودرجات CRS ومسارات PNP لأكثر من 12 مهنة مطلوبة.",
  },
  h1: {
    en: "Canada Immigration by Profession",
    fr: "Immigration au Canada par profession",
    es: "InmigraciÃ³n a CanadÃ¡ por profesiÃ³n",
    ar: "Ø§Ù„Ù‡Ø¬Ø±Ø© Ø¥Ù„Ù‰ ÙƒÙ†Ø¯Ø§ Ø­Ø³Ø¨ Ø§Ù„Ù…Ù‡Ù†Ø©",
  },
  lead: {
    en: "Select your occupation for a tailored guide covering eligible immigration programs, NOC classification, CRS scoring tips, and PNP streams that target your field.",
    fr: "SÃ©lectionnez votre profession pour un guide personnalisÃ© couvrant les programmes Ã©ligibles, la classification CNP, les conseils CRS et les voies PNP pour votre domaine.",
    es: "Seleccione su ocupaciÃ³n para una guÃ­a personalizada que cubre programas elegibles, clasificaciÃ³n NOC, consejos de puntuaciÃ³n CRS y vÃ­as PNP para su campo.",
    ar: "Ø§Ø®ØªØ± Ù…Ù‡Ù†ØªÙƒ Ù„Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ø¯Ù„ÙŠÙ„ Ù…Ø®ØµØµ ÙŠØºØ·ÙŠ Ø¨Ø±Ø§Ù…Ø¬ Ø§Ù„Ù‡Ø¬Ø±Ø© Ø§Ù„Ù…Ø¤Ù‡Ù„Ø© ÙˆØªØµÙ†ÙŠÙ NOC ÙˆÙ†ØµØ§Ø¦Ø­ Ø¯Ø±Ø¬Ø§Øª CRS ÙˆÙ…Ø³Ø§Ø±Ø§Øª PNP Ù„Ù…Ø¬Ø§Ù„Ùƒ.",
  },
  inDemand: {
    en: "In Demand",
    fr: "En demande",
    es: "En demanda",
    ar: "Ù…Ø·Ù„ÙˆØ¨",
  },
  nocLabel: {
    en: "NOC",
    fr: "CNP",
    es: "NOC",
    ar: "NOC",
  },
  ctaQ: {
    en: "Not sure which pathway fits you?",
    fr: "Vous ne savez pas quelle voie vous convient ?",
    es: "Â¿No sabe quÃ© vÃ­a le conviene?",
    ar: "ØºÙŠØ± Ù…ØªØ£ÙƒØ¯ Ù…Ù† Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ù…Ù†Ø§Ø³Ø¨ Ù„ÙƒØŸ",
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
      canonical: `${BASE}/${l}/for`,
      languages: Object.fromEntries(LOCALES.map((loc) => [loc, `${BASE}/${loc}/for`])),
    },
    openGraph: { title, description, url: `${BASE}/${l}/for`, type: "website" },
  };
}

export default async function ForIndexPage({ params }: Props) {
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

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {PROFESSIONS.map((p) => (
          <Link
            key={p.slug}
            href={`/${l}/for/${p.slug}`}
            className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:border-primary hover:bg-blue-50 transition-colors group"
          >
            <div className="min-w-0">
              <p className="font-medium text-gray-800 group-hover:text-primary text-sm truncate">{p.name[l]}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {T.nocLabel[l]} {p.nocCode}
                {p.inDemand && (
                  <span className="ml-2 text-green-700 font-semibold">{T.inDemand[l]}</span>
                )}
              </p>
            </div>
            <span className="text-xs text-gray-400 group-hover:text-primary shrink-0 ml-2">&#8594;</span>
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


