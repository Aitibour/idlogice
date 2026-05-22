import Link from "next/link";
import type { Metadata } from "next";
import { PROFESSIONS } from "@/data/immigration-professions";

export const revalidate = false;

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;
type Locale = (typeof LOCALES)[number];
type Props = { params: Promise<{ locale: string }> };

const T = {
  title: {
    en: "Canada Immigration by Profession | IDLOGICE",
    fr: "Immigration au Canada par profession | IDLOGICE",
    es: "Inmigración a Canadá por profesión | IDLOGICE",
    ar: "الهجرة إلى كندا حسب المهنة | IDLOGICE",
  },
  desc: {
    en: "Find your profession-specific Canada immigration guide. NOC codes, Express Entry CRS scores, PNP streams, and step-by-step pathways for 12+ in-demand occupations.",
    fr: "Trouvez le guide d'immigration canadienne spécifique à votre profession. Codes CNP, scores CRS, voies PNP pour 12+ professions en demande.",
    es: "Encuentre la guía de inmigración canadiense específica para su profesión. Códigos NOC, puntajes CRS, vías PNP para 12+ ocupaciones en demanda.",
    ar: "ابحث عن دليل الهجرة الكندية الخاص بمهنتك. رموز NOC ودرجات CRS ومسارات PNP لأكثر من 12 مهنة مطلوبة.",
  },
  h1: {
    en: "Canada Immigration by Profession",
    fr: "Immigration au Canada par profession",
    es: "Inmigración a Canadá por profesión",
    ar: "الهجرة إلى كندا حسب المهنة",
  },
  lead: {
    en: "Select your occupation for a tailored guide covering eligible immigration programs, NOC classification, CRS scoring tips, and PNP streams that target your field.",
    fr: "Sélectionnez votre profession pour un guide personnalisé couvrant les programmes éligibles, la classification CNP, les conseils CRS et les voies PNP pour votre domaine.",
    es: "Seleccione su ocupación para una guía personalizada que cubre programas elegibles, clasificación NOC, consejos de puntuación CRS y vías PNP para su campo.",
    ar: "اختر مهنتك للحصول على دليل مخصص يغطي برامج الهجرة المؤهلة وتصنيف NOC ونصائح درجات CRS ومسارات PNP لمجالك.",
  },
  inDemand: {
    en: "In Demand",
    fr: "En demande",
    es: "En demanda",
    ar: "مطلوب",
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
    es: "¿No sabe qué vía le conviene?",
    ar: "غير متأكد من المسار المناسب لك؟",
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
