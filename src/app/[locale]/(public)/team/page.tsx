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
    en: "Our RCIC Immigration Consultants",
    fr: "Nos consultants en immigration RCIC",
    es: "Nuestros consultores de inmigraciÃ³n RCIC",
    ar: "Ù…Ø³ØªØ´Ø§Ø±Ùˆ Ø§Ù„Ù‡Ø¬Ø±Ø© Ø§Ù„Ù…Ø¹ØªÙ…Ø¯ÙˆÙ† RCIC",
  },
  desc: {
    en: "Meet the CICC-registered immigration consultants (RCICs) at IDLOGICE. Expert guidance for Express Entry, PNP, work permits, and family sponsorship.",
    fr: "Rencontrez les consultants en immigration inscrits au CICC (RCIC) chez IDLOGICE. Expertise en EntrÃ©e express, PNP, permis de travail et parrainage familial.",
    es: "Conozca a los consultores de inmigraciÃ³n registrados en CICC (RCIC) de IDLOGICE. Expertos en Express Entry, PNP, permisos de trabajo y patrocinio familiar.",
    ar: "ØªØ¹Ø±Ù Ø¹Ù„Ù‰ Ù…Ø³ØªØ´Ø§Ø±ÙŠ Ø§Ù„Ù‡Ø¬Ø±Ø© Ø§Ù„Ù…Ø³Ø¬Ù„ÙŠÙ† ÙÙŠ CICC (RCIC) ÙÙŠ IDLOGICE. Ø®Ø¨Ø±Ø§Ø¡ ÙÙŠ Express Entry ÙˆPNP ÙˆØªØµØ§Ø±ÙŠØ­ Ø§Ù„Ø¹Ù…Ù„ ÙˆØ§Ù„ØªÙƒÙÙ„ Ø§Ù„Ø¹Ø§Ø¦Ù„ÙŠ.",
  },
  h1: {
    en: "Meet Our Immigration Consultants",
    fr: "Rencontrez nos consultants en immigration",
    es: "Conozca a nuestros consultores de inmigraciÃ³n",
    ar: "ØªØ¹Ø±Ù Ø¹Ù„Ù‰ Ù…Ø³ØªØ´Ø§Ø±ÙŠ Ø§Ù„Ù‡Ø¬Ø±Ø© Ù„Ø¯ÙŠÙ†Ø§",
  },
  lead: {
    en: "Every IDLOGICE consultant is a Regulated Canadian Immigration Consultant (RCIC) registered with the College of Immigration and Citizenship Consultants (CICC). We operate under strict professional standards with full accountability to Canada's immigration regulatory body.",
    fr: "Chaque consultant IDLOGICE est un Consultant rÃ©glementÃ© en immigration canadienne (CRIC) inscrit au CollÃ¨ge des consultants en immigration et en citoyennetÃ© (CICC).",
    es: "Cada consultor de IDLOGICE es un Consultor Regulado de InmigraciÃ³n Canadiense (RCIC) registrado en el Colegio de Consultores de InmigraciÃ³n y CiudadanÃ­a (CICC).",
    ar: "ÙƒÙ„ Ù…Ø³ØªØ´Ø§Ø± ÙÙŠ IDLOGICE Ù‡Ùˆ Ù…Ø³ØªØ´Ø§Ø± Ù‡Ø¬Ø±Ø© ÙƒÙ†Ø¯ÙŠ Ù…Ø¹ØªÙ…Ø¯ (RCIC) Ù…Ø³Ø¬Ù„ ÙÙŠ ÙƒÙ„ÙŠØ© Ù…Ø³ØªØ´Ø§Ø±ÙŠ Ø§Ù„Ù‡Ø¬Ø±Ø© ÙˆØ§Ù„Ù…ÙˆØ§Ø·Ù†Ø© (CICC).",
  },
  ciccLabel: { en: "CICC Registration", fr: "Inscription CICC", es: "Registro CICC", ar: "ØªØ³Ø¬ÙŠÙ„ CICC" },
  specialtiesLabel: { en: "Specialties", fr: "SpÃ©cialitÃ©s", es: "Especialidades", ar: "Ø§Ù„ØªØ®ØµØµØ§Øª" },
  langLabel: { en: "Languages", fr: "Langues", es: "Idiomas", ar: "Ø§Ù„Ù„ØºØ§Øª" },
  bookBtn: { en: "Book a Consultation", fr: "Prendre rendez-vous", es: "Reservar consulta", ar: "Ø§Ø­Ø¬Ø² Ø§Ø³ØªØ´Ø§Ø±Ø©" },
  evalBtn: { en: "Free Evaluation", fr: "Ã‰valuation gratuite", es: "EvaluaciÃ³n gratuita", ar: "ØªÙ‚ÙŠÙŠÙ… Ù…Ø¬Ø§Ù†ÙŠ" },
  trustH: { en: "Why Work With a Regulated RCIC?", fr: "Pourquoi travailler avec un CRIC rÃ©glementÃ© ?", es: "Â¿Por quÃ© trabajar con un RCIC regulado?", ar: "Ù„Ù…Ø§Ø°Ø§ ØªØ¹Ù…Ù„ Ù…Ø¹ Ù…Ø³ØªØ´Ø§Ø± RCIC Ù…Ø¹ØªÙ…Ø¯ØŸ" },
  breadHome: { en: "Home", fr: "Accueil", es: "Inicio", ar: "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©" },
  breadAbout: { en: "About", fr: "Ã€ propos", es: "Acerca de", ar: "Ø¹Ù† Ø§Ù„Ø´Ø±ÙƒØ©" },
} as const;

const CONSULTANTS = [
  {
    name: "Sarah Benali",
    title: { en: "Senior Immigration Consultant", fr: "Consultante principale en immigration", es: "Consultora principal de inmigraciÃ³n", ar: "Ù…Ø³ØªØ´Ø§Ø±Ø© Ù‡Ø¬Ø±Ø© Ø£ÙˆÙ„Ù‰" },
    rcic: "R123456",
    bio: {
      en: "Sarah has 8+ years of experience guiding clients through Express Entry and PNP programs. Fluent in English, French, and Arabic, she specializes in Francophone immigration and North African applicant profiles.",
      fr: "Sarah a plus de 8 ans d'expÃ©rience dans l'EntrÃ©e express et les programmes PNP. SpÃ©cialisÃ©e en immigration francophone et profils maghrÃ©bins.",
      es: "Sarah tiene mÃ¡s de 8 aÃ±os de experiencia guiando clientes a travÃ©s de Express Entry y programas PNP. Especialista en inmigraciÃ³n francÃ³fona.",
      ar: "ØªØªÙ…ØªØ¹ Ø³Ø§Ø±Ø© Ø¨Ø®Ø¨Ø±Ø© ØªØ²ÙŠØ¯ Ø¹Ù„Ù‰ 8 Ø³Ù†ÙˆØ§Øª ÙÙŠ ØªÙˆØ¬ÙŠÙ‡ Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø¹Ø¨Ø± Ø¨Ø±Ø§Ù…Ø¬ Express Entry ÙˆPNP. Ù…ØªØ®ØµØµØ© ÙÙŠ Ø§Ù„Ù‡Ø¬Ø±Ø© Ø§Ù„Ù†Ø§Ø·Ù‚Ø© Ø¨Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©.",
    },
    specialties: {
      en: ["Express Entry", "PNP Programs", "Francophone Immigration", "Work Permits"],
      fr: ["EntrÃ©e express", "Programmes PNP", "Immigration francophone", "Permis de travail"],
      es: ["Express Entry", "Programas PNP", "InmigraciÃ³n francÃ³fona", "Permisos de trabajo"],
      ar: ["Express Entry", "Ø¨Ø±Ø§Ù…Ø¬ PNP", "Ø§Ù„Ù‡Ø¬Ø±Ø© Ø§Ù„Ù†Ø§Ø·Ù‚Ø© Ø¨Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©", "ØªØµØ§Ø±ÙŠØ­ Ø§Ù„Ø¹Ù…Ù„"],
    },
    languages: { en: ["English", "French", "Arabic"], fr: ["Anglais", "FranÃ§ais", "Arabe"], es: ["InglÃ©s", "FrancÃ©s", "Ãrabe"], ar: ["Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©", "Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©", "Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©"] },
    successRate: "97%",
    casesHandled: "300+",
  },
  {
    name: "Mohamed Ait Ibour",
    title: { en: "Founder & Lead Immigration Consultant", fr: "Fondateur et consultant principal en immigration", es: "Fundador y consultor principal de inmigraciÃ³n", ar: "Ø§Ù„Ù…Ø¤Ø³Ø³ ÙˆØ§Ù„Ù…Ø³ØªØ´Ø§Ø± Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ Ù„Ù„Ù‡Ø¬Ø±Ø©" },
    rcic: "R789012",
    bio: {
      en: "Mohamed founded IDLOGICE to bring transparent, expert immigration consulting to clients from 50+ countries. He specializes in complex cases including inadmissibility, refusals, and skilled trades immigration.",
      fr: "Mohamed a fondÃ© IDLOGICE pour apporter une consultation en immigration transparente et experte Ã  des clients de 50+ pays. SpÃ©cialisÃ© dans les cas complexes.",
      es: "Mohamed fundÃ³ IDLOGICE para brindar consultorÃ­a de inmigraciÃ³n transparente a clientes de 50+ paÃ­ses. Especializado en casos complejos.",
      ar: "Ø£Ø³Ø³ Ù…Ø­Ù…Ø¯ IDLOGICE Ù„ØªÙ‚Ø¯ÙŠÙ… Ø§Ø³ØªØ´Ø§Ø±Ø§Øª Ù‡Ø¬Ø±Ø© Ø´ÙØ§ÙØ© ÙˆÙ…ØªØ®ØµØµØ© Ù„Ø¹Ù…Ù„Ø§Ø¡ Ù…Ù† Ø£ÙƒØ«Ø± Ù…Ù† 50 Ø¯ÙˆÙ„Ø©. Ù…ØªØ®ØµØµ ÙÙŠ Ø§Ù„Ø­Ø§Ù„Ø§Øª Ø§Ù„Ù…Ø¹Ù‚Ø¯Ø©.",
    },
    specialties: {
      en: ["Skilled Trades Immigration", "Refusal Appeals", "Study Permits", "Family Sponsorship"],
      fr: ["Immigration des mÃ©tiers", "Appels de refus", "Permis d'Ã©tudes", "Parrainage familial"],
      es: ["InmigraciÃ³n de oficios", "Apelaciones de rechazo", "Permisos de estudio", "Patrocinio familiar"],
      ar: ["Ù‡Ø¬Ø±Ø© Ø§Ù„Ù…Ù‡Ù† Ø§Ù„Ø­Ø±ÙÙŠØ©", "Ø§Ø³ØªØ¦Ù†Ø§Ù Ø±ÙØ¶ Ø§Ù„Ø·Ù„Ø¨Ø§Øª", "ØªØµØ§Ø±ÙŠØ­ Ø§Ù„Ø¯Ø±Ø§Ø³Ø©", "Ø§Ù„ØªÙƒÙÙ„ Ø§Ù„Ø¹Ø§Ø¦Ù„ÙŠ"],
    },
    languages: { en: ["English", "French", "Arabic", "Spanish"], fr: ["Anglais", "FranÃ§ais", "Arabe", "Espagnol"], es: ["InglÃ©s", "FrancÃ©s", "Ãrabe", "EspaÃ±ol"], ar: ["Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©", "Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©", "Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©", "Ø§Ù„Ø¥Ø³Ø¨Ø§Ù†ÙŠØ©"] },
    successRate: "95%",
    casesHandled: "500+",
  },
];

const TRUST_POINTS = {
  en: [
    "RCICs are legally authorized to provide Canadian immigration advice and representation",
    "Regulated by the College of Immigration and Citizenship Consultants (CICC)",
    "Bound by a Code of Professional Conduct with strict accountability",
    "Carry mandatory professional liability insurance",
    "Required to maintain current knowledge of Canadian immigration law",
    "Unauthorized representatives cannot legally charge fees for immigration advice",
  ],
  fr: [
    "Les CRIC sont lÃ©galement autorisÃ©s Ã  fournir des conseils en immigration canadienne",
    "RÃ©glementÃ©s par le CollÃ¨ge des consultants en immigration et en citoyennetÃ© (CICC)",
    "Soumis Ã  un Code de conduite professionnelle strict",
    "Doivent souscrire une assurance responsabilitÃ© professionnelle",
    "Doivent maintenir leurs connaissances Ã  jour du droit de l'immigration canadienne",
    "Les reprÃ©sentants non autorisÃ©s ne peuvent pas lÃ©galement facturer des honoraires",
  ],
  es: [
    "Los RCIC estÃ¡n legalmente autorizados para brindar asesoramiento en inmigraciÃ³n canadiense",
    "Regulados por el Colegio de Consultores de InmigraciÃ³n y CiudadanÃ­a (CICC)",
    "Sujetos a un CÃ³digo de Conducta Profesional estricto",
    "Deben tener seguro de responsabilidad profesional obligatorio",
    "Deben mantener conocimientos actualizados de la ley de inmigraciÃ³n canadiense",
    "Los representantes no autorizados no pueden cobrar honorarios legalmente",
  ],
  ar: [
    "Ù…Ø³ØªØ´Ø§Ø±Ùˆ RCIC Ù…Ø®ÙˆÙ„ÙˆÙ† Ù‚Ø§Ù†ÙˆÙ†ÙŠØ§Ù‹ Ø¨ØªÙ‚Ø¯ÙŠÙ… Ø§Ù„Ù…Ø´ÙˆØ±Ø© ÙÙŠ Ù…Ø¬Ø§Ù„ Ø§Ù„Ù‡Ø¬Ø±Ø© Ø§Ù„ÙƒÙ†Ø¯ÙŠØ©",
    "Ø®Ø§Ø¶Ø¹ÙˆÙ† Ù„ØªÙ†Ø¸ÙŠÙ… ÙƒÙ„ÙŠØ© Ù…Ø³ØªØ´Ø§Ø±ÙŠ Ø§Ù„Ù‡Ø¬Ø±Ø© ÙˆØ§Ù„Ù…ÙˆØ§Ø·Ù†Ø© (CICC)",
    "Ù…Ù„ØªØ²Ù…ÙˆÙ† Ø¨Ù…Ø¯ÙˆÙ†Ø© Ø³Ù„ÙˆÙƒ Ù…Ù‡Ù†ÙŠØ© ØµØ§Ø±Ù…Ø© Ù…Ø¹ Ù…Ø­Ø§Ø³Ø¨Ø© ÙƒØ§Ù…Ù„Ø©",
    "ÙŠØ¬Ø¨ Ø£Ù† ÙŠØ­Ù…Ù„ÙˆØ§ ØªØ£Ù…ÙŠÙ† Ø§Ù„Ù…Ø³Ø¤ÙˆÙ„ÙŠØ© Ø§Ù„Ù…Ù‡Ù†ÙŠØ© Ø§Ù„Ø¥Ù„Ø²Ø§Ù…ÙŠ",
    "Ù…Ø·Ø§Ù„Ø¨ÙˆÙ† Ø¨Ø§Ù„Ø­ÙØ§Ø¸ Ø¹Ù„Ù‰ Ù…Ø¹Ø±ÙØ© Ù…Ø­Ø¯Ø«Ø© Ø¨Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ù‡Ø¬Ø±Ø© Ø§Ù„ÙƒÙ†Ø¯ÙŠ",
    "Ù„Ø§ ÙŠØ­Ù‚ Ù„Ù„Ù…Ù…Ø«Ù„ÙŠÙ† ØºÙŠØ± Ø§Ù„Ù…Ø±Ø®ØµÙŠÙ† Ù‚Ø§Ù†ÙˆÙ†ÙŠØ§Ù‹ ØªØ­ØµÙŠÙ„ Ø±Ø³ÙˆÙ… Ù…Ù‚Ø§Ø¨Ù„ Ø§Ù„Ù…Ø´ÙˆØ±Ø©",
  ],
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;
  return {
    title: T.title[l],
    description: T.desc[l],
    alternates: generatePageAlternates(locale, "/team"),
    openGraph: { title: T.title[l], description: T.desc[l], url: `${BASE}/${l}/team`, type: "website" },
  };
}

export default async function TeamPage({ params }: Props) {
  const { locale } = await params;
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;

  // JSON-LD built from in-code constants only â€” no user input, XSS-safe
  const jsonLdStr = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": CONSULTANTS.map((c) => ({
      "@type": "Person",
      name: c.name,
      jobTitle: c.title.en,
      worksFor: { "@type": "Organization", name: "IDLOGICE Immigration Consulting", url: BASE },
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        name: "Regulated Canadian Immigration Consultant (RCIC)",
        credentialCategory: "Professional License",
        recognizedBy: { "@type": "Organization", name: "College of Immigration and Citizenship Consultants (CICC)" },
        identifier: c.rcic,
      },
      knowsLanguage: c.languages.en,
    })),
  });

  return (
    <>
      {/* JSON-LD from static constants only â€” no user input reaches __html */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdStr }} />
      <div dir={l === "ar" ? "rtl" : "ltr"} className="max-w-4xl mx-auto px-4 py-12 sm:py-16">

        <nav aria-label="breadcrumb" className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1">
          <Link href={`/${l}`} className="hover:text-primary">{T.breadHome[l]}</Link>
          <span aria-hidden>/</span>
          <Link href={`/${l}/about`} className="hover:text-primary">{T.breadAbout[l]}</Link>
          <span aria-hidden>/</span>
          <span className="text-gray-800 font-medium">{T.h1[l]}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{T.h1[l]}</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-12 max-w-2xl">{T.lead[l]}</p>

        <div className="space-y-8 mb-16">
          {CONSULTANTS.map((c) => (
            <div key={c.rcic} className="border border-gray-200 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-6 mb-5">
                <div className="shrink-0">
                  <div className="w-20 h-20 rounded-full bg-blue-100 border-2 border-primary/20 flex items-center justify-center">
                    <svg className="w-12 h-12 text-blue-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{c.name}</h2>
                  <p className="text-primary font-medium text-sm mb-2">{c.title[l]}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-0.5 rounded font-mono">{T.ciccLabel[l]}: {c.rcic}</span>
                    <span className="bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded">{c.successRate} success rate</span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{c.casesHandled} cases</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed text-sm mb-5">{c.bio[l]}</p>

              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{T.specialtiesLabel[l]}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.specialties[l].map((s) => (
                      <span key={s} className="text-xs bg-blue-50 text-blue-800 font-medium px-2.5 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{T.langLabel[l]}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.languages[l].map((lang) => (
                      <span key={lang} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">{lang}</span>
                    ))}
                  </div>
                </div>
              </div>

              <Link href={`/${l}/book-consultation`}
                className="inline-block text-sm font-semibold text-white bg-primary hover:bg-primary/90 px-5 py-2 rounded-full transition-colors">
                {T.bookBtn[l]}
              </Link>
            </div>
          ))}
        </div>

        <section className="bg-gray-50 rounded-2xl p-6 sm:p-8 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">{T.trustH[l]}</h2>
          <ul className="space-y-3">
            {TRUST_POINTS[l].map((point, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span className="text-green-600 shrink-0 mt-0.5">&#10003;</span>
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-gray-500">
            {l === "en" && <>Verify any RCIC registration at <a href="https://college-ic.ca" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">college-ic.ca</a></>}
            {l === "fr" && <>VÃ©rifiez toute inscription CRIC sur <a href="https://college-ic.ca" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">college-ic.ca</a></>}
            {l === "es" && <>Verifique cualquier registro RCIC en <a href="https://college-ic.ca" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">college-ic.ca</a></>}
            {l === "ar" && <>ØªØ­Ù‚Ù‚ Ù…Ù† Ø£ÙŠ ØªØ³Ø¬ÙŠÙ„ RCIC Ø¹Ù„Ù‰ <a href="https://college-ic.ca" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">college-ic.ca</a></>}
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href={`/${l}/evaluation`} className="text-sm font-medium text-primary hover:underline border border-primary/30 rounded-full px-4 py-1.5">
            {T.evalBtn[l]}
          </Link>
          <Link href={`/${l}/about`} className="text-sm font-medium text-gray-600 hover:text-primary border border-gray-200 rounded-full px-4 py-1.5">
            {T.breadAbout[l]}
          </Link>
          <Link href={`/${l}/book-consultation`} className="text-sm font-medium text-gray-600 hover:text-primary border border-gray-200 rounded-full px-4 py-1.5">
            {T.bookBtn[l]}
          </Link>
        </div>
      </div>
    </>
  );
}


