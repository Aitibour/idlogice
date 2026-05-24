import Link from "next/link";
import type { Metadata } from "next";
import { COUNTRIES } from "@/data/immigration-countries";

export const revalidate = false;

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;
type Locale = (typeof LOCALES)[number];
type Props = { params: Promise<{ locale: string }> };

const T = {
  title: {
    en: "Canada Immigration by Country: Guides for Every Nationality",
    fr: "Immigration au Canada par pays : Guide par nationalité",
    es: "Inmigración a Canadá por país: Guía por nacionalidad",
    ar: "الهجرة إلى كندا حسب البلد: أدلة لجميع الجنسيات",
  },
  desc: {
    en: "Find your country-specific Canada immigration guide. Programs, processing times, and language requirements for 39 nationalities.",
    fr: "Trouvez le guide d'immigration canadienne spécifique à votre pays. Programmes, délais, conditions linguistiques pour les citoyens de 39 pays.",
    es: "Encuentre la guía de inmigración canadiense específica para su país. Programas, tiempos de procesamiento e instrucciones para ciudadanos de 39 países.",
    ar: "ابحث عن دليل الهجرة الكندية الخاص ببلدك. البرامج وأوقات المعالجة والمتطلبات لمواطني 39 دولة.",
  },
  h1: {
    en: "Canada Immigration by Country",
    fr: "Immigration au Canada par pays",
    es: "Inmigración a Canadá por país",
    ar: "الهجرة إلى كندا حسب البلد",
  },
  lead: {
    en: "Select your country for a tailored guide covering programs available to you, processing times, language requirements, and a step-by-step application roadmap.",
    fr: "Sélectionnez votre pays pour un guide personnalisé couvrant les programmes disponibles, les délais de traitement et la procédure de demande étape par étape.",
    es: "Seleccione su país para una guía personalizada que cubre los programas disponibles, tiempos de procesamiento y una hoja de ruta de solicitud paso a paso.",
    ar: "اختر بلدك للحصول على دليل مخصص يغطي البرامج المتاحة وأوقات المعالجة وخارطة طريق التقديم خطوة بخطوة.",
  },
  continents: {
    en: { Africa: "Africa", Americas: "Americas", Asia: "Asia", Europe: "Europe" },
    fr: { Africa: "Afrique", Americas: "Amériques", Asia: "Asie", Europe: "Europe" },
    es: { Africa: "África", Americas: "Américas", Asia: "Asia", Europe: "Europa" },
    ar: { Africa: "أفريقيا", Americas: "الأمريكتان", Asia: "آسيا", Europe: "أوروبا" },
  },
  ctaBtn: { en: "Free Evaluation →", fr: "Évaluation gratuite →", es: "Evaluación gratuita →", ar: "تقييم مجاني →" },
  breadHome: { en: "Home", fr: "Accueil", es: "Inicio", ar: "الرئيسية" },
} as const;

function tr(key: keyof typeof T, locale: Locale) {
  const s = T[key] as Record<Locale, unknown>;
  return s[locale] ?? s.en;
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;
  const title = tr("title", l) as string;
  const description = tr("desc", l) as string;
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${l}/from`,
      languages: Object.fromEntries(LOCALES.map((loc) => [`${loc}-CA`, `${BASE}/${loc}/from`])),
    },
    openGraph: { title, description, url: `${BASE}/${l}/from`, type: "website" },
  };
}

const CONTINENT_ORDER = ["Asia", "Africa", "Americas", "Europe"] as const;

export default async function FromIndexPage({ params }: Props) {
  const { locale } = await params;
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;

  const grouped = CONTINENT_ORDER.map((continent) => ({
    continent,
    label: (tr("continents", l) as Record<string, string>)[continent],
    countries: COUNTRIES.filter((c) => c.continent === continent),
  }));

  return (
    <div dir={l === "ar" ? "rtl" : "ltr"} className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1">
        <Link href={`/${l}`} className="hover:text-primary">{tr("breadHome", l) as string}</Link>
        <span aria-hidden>/</span>
        <span className="text-gray-800 font-medium">{tr("h1", l) as string}</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{tr("h1", l) as string}</h1>
      <p className="text-lg text-gray-600 mb-10 max-w-2xl">{tr("lead", l) as string}</p>

      {grouped.map(({ continent, label, countries }) => (
        <section key={continent} className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">{label}</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {countries.map((c) => (
              <Link
                key={c.slug}
                href={`/${l}/from/${c.slug}`}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:border-primary hover:bg-blue-50 transition-colors group"
              >
                <span className="font-medium text-gray-800 group-hover:text-primary text-sm">
                  {c.name[l]}
                </span>
                <span className="text-xs text-gray-400 group-hover:text-primary">→</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* CTA */}
      <div className="mt-12 bg-blue-900 text-white rounded-2xl p-8 text-center">
        <p className="text-lg font-medium mb-4">
          {l === "en" && "Not sure which program fits you?"}
          {l === "fr" && "Vous ne savez pas quel programme vous convient ?"}
          {l === "es" && "¿No sabe qué programa le conviene?"}
          {l === "ar" && "غير متأكد من البرنامج المناسب لك؟"}
        </p>
        <Link
          href={`/${l}/book-consultation`}
          className="inline-block bg-white text-blue-900 font-semibold px-7 py-3 rounded-full hover:bg-blue-50 transition-colors"
        >
          {tr("ctaBtn", l) as string}
        </Link>
      </div>
    </div>
  );
}