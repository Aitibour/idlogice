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
    fr: "Programmes d'immigration provinciaux du Canada (PNP)",
    es: "Guía de programas de inmigración provincial de Canadá (PNP)",
    ar: "دليل برامج الهجرة الإقليمية الكندية (PNP)",
  },
  desc: {
    en: "Explore Provincial Nominee Programs (PNP) for all 10 Canadian provinces. Compare streams, CRS scores, in-demand occupations and eligibility requirements.",
    fr: "Explorez les Programmes des candidats (PNP) pour les 10 provinces canadiennes. Comparez voies, scores CRS minimaux et professions en demande.",
    es: "Explore los Programas de Nominados Provinciales (PNP) para las 10 provincias canadienses. Compare corrientes, puntajes CRS mínimos y ocupaciones en demanda.",
    ar: "استكشف برامج المرشحين الإقليميين (PNP) للمقاطعات الكندية العشر. قارن المسارات وشروط الأهلية وأبرز المهن المطلوبة.",
  },
  h1: {
    en: "Canadian Provincial Immigration Programs",
    fr: "Programmes d'immigration provinciaux canadiens",
    es: "Programas de inmigración provinciales canadienses",
    ar: "برامج الهجرة الإقليمية الكندية",
  },
  lead: {
    en: "Each Canadian province runs its own nomination program with targeted streams for skilled workers, entrepreneurs, and international graduates. Select a province to explore its specific pathways.",
    fr: "Chaque province canadienne gère son propre programme de nomination avec des voies ciblées pour les travailleurs qualifiés, entrepreneurs et diplômés internationaux.",
    es: "Cada provincia canadiense gestiona su propio programa de nominación con corrientes dirigidas a trabajadores calificados, empresarios y graduados internacionales.",
    ar: "تدير كل مقاطعة كندية برنامج ترشيحها الخاص مع مسارات مستهدفة للعمال المهرة ورجال الأعمال والخريجين الدوليين.",
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
    ar: "مسارات",
  },
  ctaQ: {
    en: "Not sure which province matches your profile?",
    fr: "Vous ne savez pas quelle province correspond à votre profil ?",
    es: "¿No sabe qué provincia se adapta a su perfil?",
    ar: "غير متأكد من أي مقاطعة تناسب ملفك؟",
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
    alternates: generatePageAlternates(locale, "/province"),
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


