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
    es: "EstadÃ­sticas de inmigraciÃ³n a CanadÃ¡ 2026",
    ar: "Ø¥Ø­ØµØ§Ø¦ÙŠØ§Øª Ø§Ù„Ù‡Ø¬Ø±Ø© Ø¥Ù„Ù‰ ÙƒÙ†Ø¯Ø§ 2026",
  },
  desc: {
    en: "Key Canada immigration statistics for 2026: Express Entry draws, PNP nominations, PR targets, top source countries, CRS cut-offs, and processing times.",
    fr: "Statistiques clÃ©s de l'immigration canadienne 2026 : tirages EntrÃ©e express, nominations PNP, cibles RP, principaux pays sources, seuils CRS et dÃ©lais de traitement.",
    es: "EstadÃ­sticas clave de inmigraciÃ³n canadiense 2026: sorteos Express Entry, nominaciones PNP, objetivos RP, principales paÃ­ses de origen, umbrales CRS y tiempos de procesamiento.",
    ar: "Ø¥Ø­ØµØ§Ø¦ÙŠØ§Øª Ø§Ù„Ù‡Ø¬Ø±Ø© Ø§Ù„ÙƒÙ†Ø¯ÙŠØ© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ© Ù„Ø¹Ø§Ù… 2026: Ø³Ø­ÙˆØ¨Ø§Øª Express Entry ÙˆÙ…Ù†Ø­ PNP ÙˆØ£Ù‡Ø¯Ø§Ù Ø§Ù„Ø¥Ù‚Ø§Ù…Ø© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø© ÙˆØ£Ø¨Ø±Ø² Ø¯ÙˆÙ„ Ø§Ù„Ù…ØµØ¯Ø± ÙˆØ­Ø¯ÙˆØ¯ CRS ÙˆØ£ÙˆÙ‚Ø§Øª Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©.",
  },
  h1: { en: "Canada Immigration Statistics 2026", fr: "Statistiques d'immigration Canada 2026", es: "EstadÃ­sticas de inmigraciÃ³n CanadÃ¡ 2026", ar: "Ø¥Ø­ØµØ§Ø¦ÙŠØ§Øª Ø§Ù„Ù‡Ø¬Ø±Ø© Ø¥Ù„Ù‰ ÙƒÙ†Ø¯Ø§ 2026" },
  lead: {
    en: "Canada welcomed 485,000 new permanent residents in 2025 and targets 500,000 in 2026. Here are the key data points every immigration applicant should know.",
    fr: "Le Canada a accueilli 485 000 nouveaux rÃ©sidents permanents en 2025 et vise 500 000 en 2026. Voici les donnÃ©es clÃ©s que tout demandeur doit connaÃ®tre.",
    es: "CanadÃ¡ recibiÃ³ 485 000 nuevos residentes permanentes en 2025 y apunta a 500 000 en 2026. AquÃ­ estÃ¡n los datos clave que todo solicitante debe conocer.",
    ar: "Ø§Ø³ØªÙ‚Ø¨Ù„Øª ÙƒÙ†Ø¯Ø§ 485,000 Ù…Ù‚ÙŠÙ… Ø¯Ø§Ø¦Ù… Ø¬Ø¯ÙŠØ¯ ÙÙŠ 2025 ÙˆØªØ³ØªÙ‡Ø¯Ù 500,000 ÙÙŠ 2026. Ø¥Ù„ÙŠÙƒ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ© Ø§Ù„ØªÙŠ ÙŠØ¬Ø¨ Ø¹Ù„Ù‰ ÙƒÙ„ Ù…Ù‚Ø¯Ù… Ø·Ù„Ø¨ Ù…Ø¹Ø±ÙØªÙ‡Ø§.",
  },
  sourceNote: {
    en: "Sources: IRCC, Statistics Canada, Government of Canada Immigration Levels Plan 2024â€“2026",
    fr: "Sources : IRCC, Statistique Canada, Plan des niveaux d'immigration du Canada 2024-2026",
    es: "Fuentes: IRCC, Statistics Canada, Plan de Niveles de InmigraciÃ³n de CanadÃ¡ 2024-2026",
    ar: "Ø§Ù„Ù…ØµØ§Ø¯Ø±: IRCC ÙˆØ¥Ø­ØµØ§Ø¡Ø§Øª ÙƒÙ†Ø¯Ø§ ÙˆØ®Ø·Ø© Ù…Ø³ØªÙˆÙŠØ§Øª Ø§Ù„Ù‡Ø¬Ø±Ø© Ø§Ù„ÙƒÙ†Ø¯ÙŠØ© 2024-2026",
  },
  evalCta: { en: "Check Your Eligibility", fr: "VÃ©rifiez votre Ã©ligibilitÃ©", es: "Verifique su elegibilidad", ar: "ØªØ­Ù‚Ù‚ Ù…Ù† Ø£Ù‡Ù„ÙŠØªÙƒ" },
  breadHome: { en: "Home", fr: "Accueil", es: "Inicio", ar: "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©" },
} as const;

const HEADLINE_STATS = [
  { value: "500,000", label: { en: "PR target 2026", fr: "Cible RP 2026", es: "Objetivo RP 2026", ar: "Ù‡Ø¯Ù Ø§Ù„Ø¥Ù‚Ø§Ù…Ø© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø© 2026" } },
  { value: "485,000", label: { en: "PRs admitted 2025", fr: "RP admis 2025", es: "RP admitidos 2025", ar: "Ù…Ù‚ÙŠÙ… Ø¯Ø§Ø¦Ù… 2025" } },
  { value: "100+", label: { en: "Immigration pathways", fr: "Voies d'immigration", es: "VÃ­as de inmigraciÃ³n", ar: "Ù…Ø³Ø§Ø± Ù‡Ø¬Ø±Ø©" } },
  { value: "6 months", label: { en: "Average Express Entry processing", fr: "DÃ©lai moy. EntrÃ©e express", es: "Procesamiento EE promedio", ar: "Ù…ØªÙˆØ³Ø· Ù…Ø¹Ø§Ù„Ø¬Ø© Express Entry" } },
];

const SECTIONS = [
  {
    id: "ee",
    heading: { en: "Express Entry", fr: "EntrÃ©e express", es: "Express Entry", ar: "Express Entry" },
    rows: [
      { label: { en: "Draws held in 2025", fr: "Tirages en 2025", es: "Sorteos en 2025", ar: "Ø³Ø­ÙˆØ¨Ø§Øª ÙÙŠ 2025" }, value: "26" },
      { label: { en: "Invitations issued 2025", fr: "Invitations Ã©mises 2025", es: "Invitaciones emitidas 2025", ar: "Ø¯Ø¹ÙˆØ§Øª ØµØ¯Ø±Øª 2025" }, value: "~110,000" },
      { label: { en: "Lowest CRS score (all-program 2025)", fr: "Score CRS le plus bas (tous prog. 2025)", es: "Puntaje CRS mÃ¡s bajo (todos los prog. 2025)", ar: "Ø£Ø¯Ù†Ù‰ Ø¯Ø±Ø¬Ø© CRS (Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø¨Ø±Ø§Ù…Ø¬ 2025)" }, value: "481" },
      { label: { en: "Average processing time (EE)", fr: "DÃ©lai de traitement moyen (EE)", es: "Tiempo de procesamiento promedio (EE)", ar: "Ù…ØªÙˆØ³Ø· ÙˆÙ‚Øª Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø© (EE)" }, value: "6 months" },
      { label: { en: "Category-based draws (STEM, Trade, French)", fr: "Tirages par catÃ©gorie (STIM, MÃ©tiers, FranÃ§ais)", es: "Sorteos por categorÃ­a (STEM, Oficios, FrancÃ©s)", ar: "Ø³Ø­ÙˆØ¨Ø§Øª Ù‚Ø§Ø¦Ù…Ø© Ø¹Ù„Ù‰ Ø§Ù„ÙØ¦Ø© (STEMØŒ Ø§Ù„Ø­Ø±ÙØŒ Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©)" }, value: "Active" },
    ],
    href: "/programs/express-entry",
  },
  {
    id: "pnp",
    heading: { en: "Provincial Nominee Programs (PNP)", fr: "Programmes des candidats des provinces (PCP)", es: "Programas de Nominados Provinciales (PNP)", ar: "Ø¨Ø±Ø§Ù…Ø¬ Ø§Ù„Ù…Ø±Ø´Ø­ÙŠÙ† Ø§Ù„Ø¥Ù‚Ù„ÙŠÙ…ÙŠÙŠÙ† (PNP)" },
    rows: [
      { label: { en: "PNP nominations target 2026", fr: "Cible nominations PNP 2026", es: "Objetivo de nominaciones PNP 2026", ar: "Ù‡Ø¯Ù ØªØ±Ø´ÙŠØ­Ø§Øª PNP 2026" }, value: "110,000" },
      { label: { en: "Provinces with active PNP", fr: "Provinces avec PNP actif", es: "Provincias con PNP activo", ar: "Ù…Ù‚Ø§Ø·Ø¹Ø§Øª Ø¨Ù€ PNP Ù†Ø´Ø·" }, value: "10" },
      { label: { en: "Number of PNP streams (approx.)", fr: "Nombre de voies PNP (approx.)", es: "NÃºmero de corrientes PNP (aprox.)", ar: "Ø¹Ø¯Ø¯ Ù…Ø³Ø§Ø±Ø§Øª PNP (ØªÙ‚Ø±ÙŠØ¨Ø§Ù‹)" }, value: "80+" },
      { label: { en: "CRS bonus for EE-linked PNP", fr: "Bonus CRS pour PNP liÃ© Ã  EE", es: "Bono CRS para PNP vinculado a EE", ar: "Ù…ÙƒØ§ÙØ£Ø© CRS Ù„Ù€ PNP Ø§Ù„Ù…Ø±ØªØ¨Ø· Ø¨Ù€ EE" }, value: "+600 pts" },
    ],
    href: "/programs/provincial-nominee-program",
  },
  {
    id: "sources",
    heading: { en: "Top Source Countries (2025)", fr: "Principaux pays sources (2025)", es: "Principales paÃ­ses de origen (2025)", ar: "Ø£Ø¨Ø±Ø² Ø¯ÙˆÙ„ Ø§Ù„Ù…ØµØ¯Ø± (2025)" },
    rows: [
      { label: { en: "India", fr: "Inde", es: "India", ar: "Ø§Ù„Ù‡Ù†Ø¯" }, value: "#1 â€” ~100,000" },
      { label: { en: "Philippines", fr: "Philippines", es: "Filipinas", ar: "Ø§Ù„ÙÙ„Ø¨ÙŠÙ†" }, value: "#2 â€” ~35,000" },
      { label: { en: "China", fr: "Chine", es: "China", ar: "Ø§Ù„ØµÙŠÙ†" }, value: "#3 â€” ~25,000" },
      { label: { en: "Nigeria", fr: "Nigeria", es: "Nigeria", ar: "Ù†ÙŠØ¬ÙŠØ±ÙŠØ§" }, value: "#4 â€” ~15,000" },
      { label: { en: "France", fr: "France", es: "Francia", ar: "ÙØ±Ù†Ø³Ø§" }, value: "#5 â€” ~13,000" },
      { label: { en: "Morocco", fr: "Maroc", es: "Marruecos", ar: "Ø§Ù„Ù…ØºØ±Ø¨" }, value: "Top 15" },
    ],
    href: "/from",
  },
  {
    id: "languages",
    heading: { en: "Language & Immigration", fr: "Langue et immigration", es: "Idioma e inmigraciÃ³n", ar: "Ø§Ù„Ù„ØºØ© ÙˆØ§Ù„Ù‡Ø¬Ø±Ø©" },
    rows: [
      { label: { en: "French-language draws held 2025", fr: "Tirages en franÃ§ais 2025", es: "Sorteos en francÃ©s 2025", ar: "Ø³Ø­ÙˆØ¨Ø§Øª Ø¨Ø§Ù„Ù„ØºØ© Ø§Ù„ÙØ±Ù†Ø³ÙŠØ© 2025" }, value: "8+" },
      { label: { en: "Francophone PR target 2026 (outside QC)", fr: "Cible RP francophones 2026 (hors QC)", es: "Objetivo RP francÃ³fono 2026 (fuera de QC)", ar: "Ù‡Ø¯Ù Ø§Ù„Ø¥Ù‚Ø§Ù…Ø© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø© Ø§Ù„Ù†Ø§Ø·Ù‚ Ø¨Ø§Ù„ÙØ±Ù†Ø³ÙŠØ© 2026 (Ø®Ø§Ø±Ø¬ QC)" }, value: "6%" },
      { label: { en: "CRS bonus for CLB 7 French (bilinguals)", fr: "Bonus CRS pour CLB 7 franÃ§ais (bilingues)", es: "Bono CRS por CLB 7 francÃ©s (bilingÃ¼e)", ar: "Ù…ÙƒØ§ÙØ£Ø© CRS Ù„Ù…Ø³ØªÙˆÙ‰ CLB 7 ÙØ±Ù†Ø³ÙŠ (Ø«Ù†Ø§Ø¦ÙŠÙˆ Ø§Ù„Ù„ØºØ©)" }, value: "+50 pts" },
      { label: { en: "LMIA-exempt Francophone Mobility permits 2025", fr: "Permis MobilitÃ© francophone sans EIMT 2025", es: "Permisos Movilidad FrancÃ³fona sin LMIA 2025", ar: "ØªØµØ§Ø±ÙŠØ­ Ø§Ù„ØªÙ†Ù‚Ù„ Ø§Ù„ÙØ±Ù†ÙƒÙˆÙÙˆÙ†ÙŠ Ø§Ù„Ù…Ø¹ÙØ§Ø© Ù…Ù† LMIA 2025" }, value: "~10,000" },
    ],
    href: "/programs/francophone-mobility",
  },
  {
    id: "processing",
    heading: { en: "Processing Times (2025 avg)", fr: "DÃ©lais de traitement (moy. 2025)", es: "Tiempos de procesamiento (prom. 2025)", ar: "Ø£ÙˆÙ‚Ø§Øª Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø© (Ù…ØªÙˆØ³Ø· 2025)" },
    rows: [
      { label: { en: "Express Entry (ITA to PR)", fr: "EntrÃ©e express (LAI Ã  RP)", es: "Express Entry (ITA a RP)", ar: "Express Entry (Ù…Ù† Ø§Ù„Ø¯Ø¹ÙˆØ© Ø¥Ù„Ù‰ Ø§Ù„Ø¥Ù‚Ø§Ù…Ø© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø©)" }, value: "~6 months" },
      { label: { en: "Spousal sponsorship (inland)", fr: "Parrainage conjoint (intÃ©rieur)", es: "Patrocinio conyugal (interior)", ar: "Ø§Ù„ØªÙƒÙÙ„ Ø§Ù„Ø²ÙˆØ¬ÙŠ (Ø¯Ø§Ø®Ù„ÙŠ)" }, value: "~12 months" },
      { label: { en: "Work permit (online application)", fr: "Permis de travail (demande en ligne)", es: "Permiso de trabajo (solicitud en lÃ­nea)", ar: "ØªØµØ±ÙŠØ­ Ø¹Ù…Ù„ (Ø·Ù„Ø¨ Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ)" }, value: "~8 weeks" },
      { label: { en: "Study permit (SDS)", fr: "Permis d'Ã©tudes (SPE)", es: "Permiso de estudios (SDS)", ar: "ØªØµØ±ÙŠØ­ Ø§Ù„Ø¯Ø±Ø§Ø³Ø© (SDS)" }, value: "~8 weeks" },
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
                {l === "en" ? "Learn more" : l === "fr" ? "En savoir plus" : l === "es" ? "MÃ¡s info" : "Ø§Ø¹Ø±Ù Ø§Ù„Ù…Ø²ÙŠØ¯"} &#8594;
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
          {l === "fr" && "OÃ¹ vous situez-vous ?"}
          {l === "es" && "Â¿DÃ³nde encaja usted?"}
          {l === "ar" && "Ø£ÙŠÙ† ØªÙ‚Ø¹ ÙÙŠ Ù‡Ø°Ù‡ Ø§Ù„Ø¥Ø­ØµØ§Ø¦ÙŠØ§ØªØŸ"}
        </h2>
        <p className="text-blue-100 mb-5 text-sm max-w-md mx-auto">
          {l === "en" && "Get a free profile assessment from a CICC-registered RCIC to find your best PR pathway."}
          {l === "fr" && "Obtenez une Ã©valuation gratuite de votre profil par un CRIC inscrit au CICC pour trouver votre meilleure voie vers la RP."}
          {l === "es" && "Obtenga una evaluaciÃ³n gratuita de su perfil de un RCIC registrado en CICC para encontrar su mejor vÃ­a hacia la RP."}
          {l === "ar" && "Ø§Ø­ØµÙ„ Ø¹Ù„Ù‰ ØªÙ‚ÙŠÙŠÙ… Ù…Ø¬Ø§Ù†ÙŠ Ù„Ù…Ù„ÙÙƒ Ù…Ù† Ù…Ø³ØªØ´Ø§Ø± RCIC Ù…Ø³Ø¬Ù„ ÙÙŠ CICC Ù„Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ø£ÙØ¶Ù„ Ù…Ø³Ø§Ø± Ù„Ù„Ø¥Ù‚Ø§Ù…Ø© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø©."}
        </p>
        <Link href={`/${l}/evaluation`}
          className="inline-block bg-white text-blue-900 font-semibold px-7 py-3 rounded-full hover:bg-blue-50 transition-colors text-sm">
          {T.evalCta[l]}
        </Link>
      </div>
    </div>
  );
}


