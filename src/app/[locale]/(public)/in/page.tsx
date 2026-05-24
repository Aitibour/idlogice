import Link from "next/link";
import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { CITIES } from "@/data/immigration-cities";

export const revalidate = false;

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;
type Locale = (typeof LOCALES)[number];
type Props = { params: Promise<{ locale: string }> };

const T = {
  title: {
    en: "Immigration Consultant by City in Canada",
    fr: "Consultant en immigration par ville au Canada",
    es: "Consultor de inmigraciÃ³n por ciudad en CanadÃ¡",
    ar: "Ù…Ø³ØªØ´Ø§Ø± Ø§Ù„Ù‡Ø¬Ø±Ø© Ø­Ø³Ø¨ Ø§Ù„Ù…Ø¯ÙŠÙ†Ø© ÙÙŠ ÙƒÙ†Ø¯Ø§",
  },
  desc: {
    en: "Find an RCIC-certified immigration consultant for your target Canadian city. Local programs, job market data, and PNP streams for 12 major cities.",
    fr: "Trouvez un consultant RCIC pour votre ville au Canada. Programmes locaux, marché du travail et voies PNP pour 12 grandes villes.",
    es: "Encuentre un consultor RCIC para su ciudad en Canadá. Programas locales, mercado laboral y vías PNP para 12 ciudades principales.",
    ar: "ابحث عن مستشار هجرة RCIC لمدينتك في كندا. برامج محلية وبيانات سوق العمل ومسارات PNP لـ 12 مدينة رئيسية.",
  },
  h1: {
    en: "Immigration Consultant by Canadian City",
    fr: "Consultant en immigration par ville canadienne",
    es: "Consultor de inmigraciÃ³n por ciudad canadiense",
    ar: "Ù…Ø³ØªØ´Ø§Ø± Ø§Ù„Ù‡Ø¬Ø±Ø© Ø­Ø³Ø¨ Ø§Ù„Ù…Ø¯ÙŠÙ†Ø© Ø§Ù„ÙƒÙ†Ø¯ÙŠØ©",
  },
  lead: {
    en: "Select your destination city to explore local immigration programs, job market conditions, PNP streams, and connect with RCIC-certified consultants who specialize in that region.",
    fr: "SÃ©lectionnez votre ville de destination pour explorer les programmes d'immigration locaux, les conditions du marchÃ© du travail, les voies PNP et les consultants RCIC spÃ©cialisÃ©s.",
    es: "Seleccione su ciudad de destino para explorar programas de inmigraciÃ³n locales, condiciones del mercado laboral, vÃ­as PNP y consultores RCIC especializados en esa regiÃ³n.",
    ar: "Ø§Ø®ØªØ± Ù…Ø¯ÙŠÙ†Ø© ÙˆØ¬Ù‡ØªÙƒ Ù„Ø§Ø³ØªÙƒØ´Ø§Ù Ø¨Ø±Ø§Ù…Ø¬ Ø§Ù„Ù‡Ø¬Ø±Ø© Ø§Ù„Ù…Ø­Ù„ÙŠØ© ÙˆØ¸Ø±ÙˆÙ Ø³ÙˆÙ‚ Ø§Ù„Ø¹Ù…Ù„ ÙˆÙ…Ø³Ø§Ø±Ø§Øª PNP ÙˆØ§Ù„Ù…Ø³ØªØ´Ø§Ø±ÙŠÙ† Ø§Ù„Ù…Ø¹ØªÙ…Ø¯ÙŠÙ† RCIC.",
  },
  provinceLabel: {
    en: "Province",
    fr: "Province",
    es: "Provincia",
    ar: "Ø§Ù„Ù…Ù‚Ø§Ø·Ø¹Ø©",
  },
  ctaQ: {
    en: "Not sure which city suits your profile?",
    fr: "Vous ne savez pas quelle ville correspond Ã  votre profil ?",
    es: "Â¿No sabe quÃ© ciudad se adapta a su perfil?",
    ar: "ØºÙŠØ± Ù…ØªØ£ÙƒØ¯ Ù…Ù† Ø£ÙŠ Ù…Ø¯ÙŠÙ†Ø© ØªÙ†Ø§Ø³Ø¨ Ù…Ù„ÙÙƒØŸ",
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
      canonical: `${BASE}/${l}/in`,
      languages: Object.fromEntries(LOCALES.map((loc) => [loc, `${BASE}/${loc}/in`])),
    },
    openGraph: { title, description, url: `${BASE}/${l}/in`, type: "website" },
  };
}

export default async function InIndexPage({ params }: Props) {
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
        {CITIES.map((c) => (
          <Link
            key={c.slug}
            href={`/${l}/in/${c.slug}`}
            className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:border-primary hover:bg-blue-50 transition-colors group"
          >
            <div className="min-w-0">
              <p className="font-medium text-gray-800 group-hover:text-primary text-sm truncate">{c.name[l]}</p>
              <p className="text-xs text-gray-400 mt-0.5">{T.provinceLabel[l]}: {c.province}</p>
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


