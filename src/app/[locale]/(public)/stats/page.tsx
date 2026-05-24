import Link from "next/link";
import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";

export const revalidate = false;

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;
type Locale = (typeof LOCALES)[number];
type Props = { params: Promise<{ locale: string }> };

const T = {
  title: {
    en: "Canada Immigration Statistics 2026",
    fr: "Statistiques d'immigration au Canada 2026",
    es: "Estadísticas de inmigración a Canadá 2026",
    ar: "إحصائيات الهجرة إلى كندا 2026",
  },
  desc: {
    en: "Key Canada immigration statistics for 2026: Express Entry draws, PNP nominations, PR targets, top source countries, CRS cut-offs, and processing times.",
    fr: "Statistiques immigration Canada 2026 : tirages Entrée express, nominations PNP, cibles RP, seuils CRS et délais de traitement.",
    es: "Estadísticas de inmigración Canadá 2026: sorteos Express Entry, nominaciones PNP, objetivos RP, umbrales CRS y tiempos de procesamiento.",
    ar: "إحصائيات هجرة كندا 2026: سحوبات Express Entry، منح PNP، أهداف الإقامة الدائمة، حدود CRS وأوقات المعالجة.",
  },
  h1: { en: "Canada Immigration Statistics 2026", fr: "Statistiques d'immigration Canada 2026", es: "Estadísticas de inmigración Canadá 2026", ar: "إحصائيات الهجرة إلى كندا 2026" },
  lead: {
    en: "Canada welcomed 485,000 new permanent residents in 2025 and targets 500,000 in 2026. Here are the key data points every immigration applicant should know.",
    fr: "Le Canada a accueilli 485 000 nouveaux résidents permanents en 2025 et vise 500 000 en 2026. Voici les données clés que tout demandeur doit connaître.",
    es: "Canadá recibió 485 000 nuevos residentes permanentes en 2025 y apunta a 500 000 en 2026. Aquí están los datos clave que todo solicitante debe conocer.",
    ar: "استقبلت كندا 485,000 مقيم دائم جديد في 2025 وتستهدف 500,000 في 2026. إليك البيانات الرئيسية التي يجب على كل مقدم طلب معرفتها.",
  },
  sourceNote: {
    en: "Sources: IRCC, Statistics Canada, Government of Canada Immigration Levels Plan 2024–2026",
    fr: "Sources : IRCC, Statistique Canada, Plan des niveaux d'immigration du Canada 2024-2026",
    es: "Fuentes: IRCC, Statistics Canada, Plan de Niveles de Inmigración de Canadá 2024-2026",
    ar: "المصادر: IRCC وإحصاءات كندا وخطة مستويات الهجرة الكندية 2024-2026",
  },
  evalCta: { en: "Check Your Eligibility", fr: "Vérifiez votre éligibilité", es: "Verifique su elegibilidad", ar: "تحقق من أهليتك" },
  breadHome: { en: "Home", fr: "Accueil", es: "Inicio", ar: "الرئيسية" },
} as const;

const HEADLINE_STATS = [
  { value: "500,000", label: { en: "PR target 2026", fr: "Cible RP 2026", es: "Objetivo RP 2026", ar: "هدف الإقامة الدائمة 2026" } },
  { value: "485,000", label: { en: "PRs admitted 2025", fr: "RP admis 2025", es: "RP admitidos 2025", ar: "مقيم دائم 2025" } },
  { value: "100+", label: { en: "Immigration pathways", fr: "Voies d'immigration", es: "Vías de inmigración", ar: "مسار هجرة" } },
  { value: "6 months", label: { en: "Average Express Entry processing", fr: "Délai moy. Entrée express", es: "Procesamiento EE promedio", ar: "متوسط معالجة Express Entry" } },
];

const SECTIONS = [
  {
    id: "ee",
    heading: { en: "Express Entry", fr: "Entrée express", es: "Express Entry", ar: "Express Entry" },
    rows: [
      { label: { en: "Draws held in 2025", fr: "Tirages en 2025", es: "Sorteos en 2025", ar: "سحوبات في 2025" }, value: "26" },
      { label: { en: "Invitations issued 2025", fr: "Invitations émises 2025", es: "Invitaciones emitidas 2025", ar: "دعوات صدرت 2025" }, value: "~110,000" },
      { label: { en: "Lowest CRS score (all-program 2025)", fr: "Score CRS le plus bas (tous prog. 2025)", es: "Puntaje CRS más bajo (todos los prog. 2025)", ar: "أدنى درجة CRS (جميع البرامج 2025)" }, value: "481" },
      { label: { en: "Average processing time (EE)", fr: "Délai de traitement moyen (EE)", es: "Tiempo de procesamiento promedio (EE)", ar: "متوسط وقت المعالجة (EE)" }, value: "6 months" },
      { label: { en: "Category-based draws (STEM, Trade, French)", fr: "Tirages par catégorie (STIM, Métiers, Français)", es: "Sorteos por categoría (STEM, Oficios, Francés)", ar: "سحوبات قائمة على الفئة (STEM، الحرف، الفرنسية)" }, value: "Active" },
    ],
    href: "/programs/express-entry",
  },
  {
    id: "pnp",
    heading: { en: "Provincial Nominee Programs (PNP)", fr: "Programmes des candidats des provinces (PCP)", es: "Programas de Nominados Provinciales (PNP)", ar: "برامج المرشحين الإقليميين (PNP)" },
    rows: [
      { label: { en: "PNP nominations target 2026", fr: "Cible nominations PNP 2026", es: "Objetivo de nominaciones PNP 2026", ar: "هدف ترشيحات PNP 2026" }, value: "110,000" },
      { label: { en: "Provinces with active PNP", fr: "Provinces avec PNP actif", es: "Provincias con PNP activo", ar: "مقاطعات بـ PNP نشط" }, value: "10" },
      { label: { en: "Number of PNP streams (approx.)", fr: "Nombre de voies PNP (approx.)", es: "Número de corrientes PNP (aprox.)", ar: "عدد مسارات PNP (تقريباً)" }, value: "80+" },
      { label: { en: "CRS bonus for EE-linked PNP", fr: "Bonus CRS pour PNP lié à EE", es: "Bono CRS para PNP vinculado a EE", ar: "مكافأة CRS لـ PNP المرتبط بـ EE" }, value: "+600 pts" },
    ],
    href: "/programs/provincial-nominee-program",
  },
  {
    id: "sources",
    heading: { en: "Top Source Countries (2025)", fr: "Principaux pays sources (2025)", es: "Principales países de origen (2025)", ar: "أبرز دول المصدر (2025)" },
    rows: [
      { label: { en: "India", fr: "Inde", es: "India", ar: "الهند" }, value: "#1 — ~100,000" },
      { label: { en: "Philippines", fr: "Philippines", es: "Filipinas", ar: "الفلبين" }, value: "#2 — ~35,000" },
      { label: { en: "China", fr: "Chine", es: "China", ar: "الصين" }, value: "#3 — ~25,000" },
      { label: { en: "Nigeria", fr: "Nigeria", es: "Nigeria", ar: "نيجيريا" }, value: "#4 — ~15,000" },
      { label: { en: "France", fr: "France", es: "Francia", ar: "فرنسا" }, value: "#5 — ~13,000" },
      { label: { en: "Morocco", fr: "Maroc", es: "Marruecos", ar: "المغرب" }, value: "Top 15" },
    ],
    href: "/from",
  },
  {
    id: "languages",
    heading: { en: "Language & Immigration", fr: "Langue et immigration", es: "Idioma e inmigración", ar: "اللغة والهجرة" },
    rows: [
      { label: { en: "French-language draws held 2025", fr: "Tirages en français 2025", es: "Sorteos en francés 2025", ar: "سحوبات باللغة الفرنسية 2025" }, value: "8+" },
      { label: { en: "Francophone PR target 2026 (outside QC)", fr: "Cible RP francophones 2026 (hors QC)", es: "Objetivo RP francófono 2026 (fuera de QC)", ar: "هدف الإقامة الدائمة الناطق بالفرنسية 2026 (خارج QC)" }, value: "6%" },
      { label: { en: "CRS bonus for CLB 7 French (bilinguals)", fr: "Bonus CRS pour CLB 7 français (bilingues)", es: "Bono CRS por CLB 7 francés (bilingüe)", ar: "مكافأة CRS لمستوى CLB 7 فرنسي (ثنائيو اللغة)" }, value: "+50 pts" },
      { label: { en: "LMIA-exempt Francophone Mobility permits 2025", fr: "Permis Mobilité francophone sans EIMT 2025", es: "Permisos Movilidad Francófona sin LMIA 2025", ar: "تصاريح التنقل الفرنكوفوني المعفاة من LMIA 2025" }, value: "~10,000" },
    ],
    href: "/programs/francophone-mobility",
  },
  {
    id: "processing",
    heading: { en: "Processing Times (2025 avg)", fr: "Délais de traitement (moy. 2025)", es: "Tiempos de procesamiento (prom. 2025)", ar: "أوقات المعالجة (متوسط 2025)" },
    rows: [
      { label: { en: "Express Entry (ITA to PR)", fr: "Entrée express (LAI à RP)", es: "Express Entry (ITA a RP)", ar: "Express Entry (من الدعوة إلى الإقامة الدائمة)" }, value: "~6 months" },
      { label: { en: "Spousal sponsorship (inland)", fr: "Parrainage conjoint (intérieur)", es: "Patrocinio conyugal (interior)", ar: "التكفل الزوجي (داخلي)" }, value: "~12 months" },
      { label: { en: "Work permit (online application)", fr: "Permis de travail (demande en ligne)", es: "Permiso de trabajo (solicitud en línea)", ar: "تصريح عمل (طلب إلكتروني)" }, value: "~8 weeks" },
      { label: { en: "Study permit (SDS)", fr: "Permis d'études (SPE)", es: "Permiso de estudios (SDS)", ar: "تصريح الدراسة (SDS)" }, value: "~8 weeks" },
    ],
    href: "/services",
  },
];

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;
  return {
    title: T.title[l],
    description: T.desc[l],
    alternates: generatePageAlternates(locale, "/stats"),
    openGraph: { title: T.title[l], description: T.desc[l], url: `${BASE}/${l}/stats`, type: "article" },
  };
}

export default async function StatsPage({ params }: Props) {
  const { locale } = await params;
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;

  return (
    <div dir={l === "ar" ? "rtl" : "ltr"} className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <nav aria-label="breadcrumb" className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1">
        <Link href={`/${l}`} className="hover:text-primary">{T.breadHome[l]}</Link>
        <span aria-hidden>/</span>
        <span className="text-gray-800 font-medium">{T.h1[l]}</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{T.h1[l]}</h1>
      <p className="text-lg text-gray-600 mb-10 max-w-2xl">{T.lead[l]}</p>

      {/* Headline stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {HEADLINE_STATS.map((s, i) => (
          <div key={i} className="bg-blue-50 rounded-2xl p-5 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-primary">{s.value}</p>
            <p className="text-xs text-gray-600 mt-1 leading-snug">{s.label[l]}</p>
          </div>
        ))}
      </div>

      {/* Data sections */}
      <div className="space-y-10 mb-12">
        {SECTIONS.map((sec) => (
          <section key={sec.id}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{sec.heading[l]}</h2>
              <Link href={`/${l}${sec.href}`} className="text-xs text-primary hover:underline font-medium">
                {l === "en" ? "Learn more" : l === "fr" ? "En savoir plus" : l === "es" ? "Más info" : "اعرف المزيد"} &#8594;
              </Link>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {sec.rows.map((row, i) => (
                <div key={i} className={`flex justify-between items-center px-5 py-3 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <span className="text-gray-700">{row.label[l]}</span>
                  <span className="font-bold text-gray-900 shrink-0 ml-4">{row.value}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="text-xs text-gray-400 mb-10">{T.sourceNote[l]}</p>

      <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold mb-3">
          {l === "en" && "Where do you fit in?"}
          {l === "fr" && "Où vous situez-vous ?"}
          {l === "es" && "¿Dónde encaja usted?"}
          {l === "ar" && "أين تقع في هذه الإحصائيات؟"}
        </h2>
        <p className="text-blue-100 mb-5 text-sm max-w-md mx-auto">
          {l === "en" && "Get a free profile assessment from a CICC-registered RCIC to find your best PR pathway."}
          {l === "fr" && "Obtenez une évaluation gratuite de votre profil par un CRIC inscrit au CICC pour trouver votre meilleure voie vers la RP."}
          {l === "es" && "Obtenga una evaluación gratuita de su perfil de un RCIC registrado en CICC para encontrar su mejor vía hacia la RP."}
          {l === "ar" && "احصل على تقييم مجاني لملفك من مستشار RCIC مسجل في CICC للعثور على أفضل مسار للإقامة الدائمة."}
        </p>
        <Link href={`/${l}/evaluation`}
          className="inline-block bg-white text-blue-900 font-semibold px-7 py-3 rounded-full hover:bg-blue-50 transition-colors text-sm">
          {T.evalCta[l]}
        </Link>
      </div>
    </div>
  );
}


