import Link from "next/link";
import type { Metadata } from "next";
import { CITIES } from "@/data/immigration-cities";

export const revalidate = false;

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;
type Locale = (typeof LOCALES)[number];
type Props = { params: Promise<{ locale: string }> };

const T = {
  title: {
    en: "Immigration Consultant by City in Canada | IDLOGICE",
    fr: "Consultant en immigration par ville au Canada | IDLOGICE",
    es: "Consultor de inmigración por ciudad en Canadá | IDLOGICE",
    ar: "مستشار الهجرة حسب المدينة في كندا | IDLOGICE",
  },
  desc: {
    en: "Find an RCIC-certified immigration consultant for your target Canadian city. Local programs, job market data, and PNP streams for 12 major cities.",
    fr: "Trouvez un consultant en immigration certifié RCIC pour votre ville canadienne cible. Programmes locaux, données du marché du travail et voies PNP pour 12 grandes villes.",
    es: "Encuentre un consultor de inmigración certificado RCIC para su ciudad canadiense objetivo. Programas locales, datos del mercado laboral y vías PNP para 12 ciudades principales.",
    ar: "ابحث عن مستشار هجرة معتمد RCIC لمدينتك الكندية المستهدفة. برامج محلية وبيانات سوق العمل ومسارات PNP لـ 12 مدينة رئيسية.",
  },
  h1: {
    en: "Immigration Consultant by Canadian City",
    fr: "Consultant en immigration par ville canadienne",
    es: "Consultor de inmigración por ciudad canadiense",
    ar: "مستشار الهجرة حسب المدينة الكندية",
  },
  lead: {
    en: "Select your destination city to explore local immigration programs, job market conditions, PNP streams, and connect with RCIC-certified consultants who specialize in that region.",
    fr: "Sélectionnez votre ville de destination pour explorer les programmes d'immigration locaux, les conditions du marché du travail, les voies PNP et les consultants RCIC spécialisés.",
    es: "Seleccione su ciudad de destino para explorar programas de inmigración locales, condiciones del mercado laboral, vías PNP y consultores RCIC especializados en esa región.",
    ar: "اختر مدينة وجهتك لاستكشاف برامج الهجرة المحلية وظروف سوق العمل ومسارات PNP والمستشارين المعتمدين RCIC.",
  },
  provinceLabel: {
    en: "Province",
    fr: "Province",
    es: "Provincia",
    ar: "المقاطعة",
  },
  ctaQ: {
    en: "Not sure which city suits your profile?",
    fr: "Vous ne savez pas quelle ville correspond à votre profil ?",
    es: "¿No sabe qué ciudad se adapta a su perfil?",
    ar: "غير متأكد من أي مدينة تناسب ملفك؟",
  },
  ctaBtn: { en: "Free Evaluation", fr: "Évaluation gratuite", es: "Evaluación gratuita", ar: "تقييم مجاني" },
  breadHome: { en: "Home", fr: "Accueil", es: "Inicio", ar: "الرئيسية" },
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
