import Link from "next/link";
import type { Metadata } from "next";
import { ServiceJsonLd } from "@/components/seo/structured-data";

export const revalidate = false;

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;
type Locale = (typeof LOCALES)[number];
type Props = { params: Promise<{ locale: string }> };

const T = {
  title: {
    en: "Canadian Permanent Residency Pathways",
    fr: "Voies vers la rÃ©sidence permanente au Canada",
    es: "VÃ­as hacia la residencia permanente en CanadÃ¡",
    ar: "Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„Ø¥Ù‚Ø§Ù…Ø© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø© Ø§Ù„ÙƒÙ†Ø¯ÙŠØ©",
  },
  desc: {
    en: "Explore all Canadian permanent residency pathways: Express Entry, PNP, work experience, study, Francophone, and family routes. Free profile evaluation.",
    fr: "Explorez toutes les voies vers la rÃ©sidence permanente canadienne : EntrÃ©e express, PNP, expÃ©rience de travail, Ã©tudes, francophone. Ã‰valuation gratuite.",
    es: "Explore todas las vÃ­as de residencia permanente canadiense: Express Entry, PNP, experiencia laboral, estudios, francofonÃ­a. EvaluaciÃ³n gratuita.",
    ar: "Ø§Ø³ØªÙƒØ´Ù Ø¬Ù…ÙŠØ¹ Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„Ø¥Ù‚Ø§Ù…Ø© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø© Ø§Ù„ÙƒÙ†Ø¯ÙŠØ©: Express Entry ÙˆPNP ÙˆØ§Ù„Ø¹Ù…Ù„ ÙˆØ§Ù„Ø¯Ø±Ø§Ø³Ø©. ØªÙ‚ÙŠÙŠÙ… Ù…Ø¬Ø§Ù†ÙŠ.",
  },
  h1: {
    en: "Canadian PR Pathways",
    fr: "Voies vers la RP canadienne",
    es: "VÃ­as hacia la RP canadiense",
    ar: "Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„Ø¥Ù‚Ø§Ù…Ø© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø© Ø§Ù„ÙƒÙ†Ø¯ÙŠØ©",
  },
  lead: {
    en: "Canada offers over 100 pathways to permanent residency. Our RCIC-certified consultants help you identify the fastest, most accessible route based on your profile, work experience, and language skills.",
    fr: "Le Canada offre plus de 100 voies vers la rÃ©sidence permanente. Nos consultants certifiÃ©s RCIC vous aident Ã  identifier le chemin le plus rapide selon votre profil.",
    es: "CanadÃ¡ ofrece mÃ¡s de 100 vÃ­as hacia la residencia permanente. Nuestros consultores certificados RCIC le ayudan a identificar el camino mÃ¡s rÃ¡pido segÃºn su perfil.",
    ar: "ØªÙ‚Ø¯Ù… ÙƒÙ†Ø¯Ø§ Ø£ÙƒØ«Ø± Ù…Ù† 100 Ù…Ø³Ø§Ø± Ù„Ù„Ø¥Ù‚Ø§Ù…Ø© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø©. ÙŠØ³Ø§Ø¹Ø¯Ùƒ Ù…Ø³ØªØ´Ø§Ø±ÙˆÙ†Ø§ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯ÙˆÙ† RCIC ÙÙŠ ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ø£Ø³Ø±Ø¹ ÙˆØ§Ù„Ø£ÙƒØ«Ø± Ø³Ù‡ÙˆÙ„Ø© ÙˆÙÙ‚Ø§Ù‹ Ù„Ù…Ù„ÙÙƒ.",
  },
  pathwaysH: {
    en: "PR Pathways at a Glance",
    fr: "AperÃ§u des voies vers la RP",
    es: "VÃ­as hacia la RP de un vistazo",
    ar: "Ù†Ø¸Ø±Ø© Ø¹Ø§Ù…Ø© Ø¹Ù„Ù‰ Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„Ø¥Ù‚Ø§Ù…Ø© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø©",
  },
  requirementsH: {
    en: "General Eligibility Requirements",
    fr: "Conditions gÃ©nÃ©rales d'admissibilitÃ©",
    es: "Requisitos generales de elegibilidad",
    ar: "Ù…ØªØ·Ù„Ø¨Ø§Øª Ø§Ù„Ø£Ù‡Ù„ÙŠØ© Ø§Ù„Ø¹Ø§Ù…Ø©",
  },
  ctaH: {
    en: "Find Your PR Pathway",
    fr: "Trouvez votre voie vers la RP",
    es: "Encuentre su vÃ­a hacia la RP",
    ar: "Ø§Ø¨Ø­Ø« Ø¹Ù† Ù…Ø³Ø§Ø± Ø§Ù„Ø¥Ù‚Ø§Ù…Ø© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø© Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ",
  },
  ctaTxt: {
    en: "Not sure which pathway suits you? Our RCIC consultants assess your profile across all available programs and recommend the fastest route to Canadian permanent residency.",
    fr: "Vous ne savez pas quelle voie vous convient ? Nos consultants RCIC Ã©valuent votre profil et recommandent le chemin le plus rapide vers la rÃ©sidence permanente.",
    es: "Â¿No sabe quÃ© vÃ­a le conviene? Nuestros consultores RCIC evalÃºan su perfil y recomiendan el camino mÃ¡s rÃ¡pido hacia la residencia permanente.",
    ar: "ØºÙŠØ± Ù…ØªØ£ÙƒØ¯ Ù…Ù† Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ù…Ù†Ø§Ø³Ø¨ Ù„ÙƒØŸ ÙŠÙ‚ÙŠÙ‘Ù… Ù…Ø³ØªØ´Ø§Ø±ÙˆÙ†Ø§ RCIC Ù…Ù„ÙÙƒ Ø¹Ø¨Ø± Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø¨Ø±Ø§Ù…Ø¬ Ø§Ù„Ù…ØªØ§Ø­Ø© ÙˆÙŠÙˆØµÙˆÙ† Ø¨Ø£Ø³Ø±Ø¹ Ø·Ø±ÙŠÙ‚ Ù„Ù„Ø¥Ù‚Ø§Ù…Ø© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø©.",
  },
  ctaBtn: {
    en: "Get Free PR Assessment",
    fr: "Ã‰valuation RP gratuite",
    es: "EvaluaciÃ³n de RP gratuita",
    ar: "ØªÙ‚ÙŠÙŠÙ… Ø§Ù„Ø¥Ù‚Ø§Ù…Ø© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø© Ø§Ù„Ù…Ø¬Ø§Ù†ÙŠ",
  },
  breadHome: { en: "Home", fr: "Accueil", es: "Inicio", ar: "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©" },
  breadServices: { en: "Services", fr: "Services", es: "Servicios", ar: "Ø§Ù„Ø®Ø¯Ù…Ø§Øª" },
} as const;

const PATHWAYS = [
  {
    title: { en: "Express Entry (Federal)", fr: "EntrÃ©e express (fÃ©dÃ©ral)", es: "Express Entry (federal)", ar: "Express Entry (ÙÙŠØ¯Ø±Ø§Ù„ÙŠ)" },
    desc: { en: "The fastest federal pathway for skilled workers. CRS-based ranking with typical processing under 6 months.", fr: "La voie fÃ©dÃ©rale la plus rapide pour les travailleurs qualifiÃ©s. Classement basÃ© sur le CRS.", es: "La vÃ­a federal mÃ¡s rÃ¡pida para trabajadores calificados. ClasificaciÃ³n basada en CRS.", ar: "Ø£Ø³Ø±Ø¹ Ù…Ø³Ø§Ø± ÙÙŠØ¯Ø±Ø§Ù„ÙŠ Ù„Ù„Ø¹Ù…Ø§Ù„ Ø§Ù„Ù…Ù‡Ø±Ø©. ØªØµÙ†ÙŠÙ Ù‚Ø§Ø¦Ù… Ø¹Ù„Ù‰ CRS Ù…Ø¹ Ù…Ø¹Ø§Ù„Ø¬Ø© ØªØ­Øª 6 Ø£Ø´Ù‡Ø±." },
    href: "/programs/express-entry",
    tags: { en: ["6 months avg", "No job offer required", "All provinces"], fr: ["Moy. 6 mois", "Pas d'offre d'emploi requise", "Toutes provinces"], es: ["Promedio 6 meses", "Sin oferta de trabajo", "Todas las provincias"], ar: ["Ù…ØªÙˆØ³Ø· 6 Ø£Ø´Ù‡Ø±", "Ù„Ø§ ÙŠØ´ØªØ±Ø· Ø¹Ø±Ø¶ Ø¹Ù…Ù„", "Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù…Ù‚Ø§Ø·Ø¹Ø§Øª"] },
  },
  {
    title: { en: "Provincial Nominee Program (PNP)", fr: "Programme des candidats des provinces (PCP)", es: "Programa de Nominados Provinciales (PNP)", ar: "Ø¨Ø±Ù†Ø§Ù…Ø¬ Ø§Ù„Ù…Ø±Ø´Ø­ÙŠÙ† Ø§Ù„Ø¥Ù‚Ù„ÙŠÙ…ÙŠÙŠÙ† (PNP)" },
    desc: { en: "Each province nominates workers for their specific labour needs. Adds 600 CRS points when done via Express Entry.", fr: "Chaque province nomme des travailleurs selon ses besoins. Ajoute 600 points CRS via EntrÃ©e express.", es: "Cada provincia nomina trabajadores segÃºn sus necesidades. AÃ±ade 600 puntos CRS vÃ­a Express Entry.", ar: "ÙƒÙ„ Ù…Ù‚Ø§Ø·Ø¹Ø© ØªØ±Ø´Ø­ Ø¹Ù…Ø§Ù„Ø§Ù‹ Ù„Ø§Ø­ØªÙŠØ§Ø¬Ø§ØªÙ‡Ø§. ÙŠØ¶ÙŠÙ 600 Ù†Ù‚Ø·Ø© CRS Ø¹Ø¨Ø± Express Entry." },
    href: "/programs/provincial-nominee-program",
    tags: { en: ["600 CRS bonus", "Province-specific", "50+ streams"], fr: ["Bonus 600 CRS", "SpÃ©cifique Ã  la province", "50+ voies"], es: ["Bono 600 CRS", "EspecÃ­fico por provincia", "50+ corrientes"], ar: ["Ù…ÙƒØ§ÙØ£Ø© 600 CRS", "Ø®Ø§Øµ Ø¨Ø§Ù„Ù…Ù‚Ø§Ø·Ø¹Ø©", "50+ Ù…Ø³Ø§Ø±"] },
  },
  {
    title: { en: "PR Through Work Experience", fr: "RP via expÃ©rience de travail", es: "RP a travÃ©s de experiencia laboral", ar: "Ø§Ù„Ø¥Ù‚Ø§Ù…Ø© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø© Ø¹Ø¨Ø± Ø§Ù„Ø®Ø¨Ø±Ø© Ø§Ù„Ø¹Ù…Ù„ÙŠØ©" },
    desc: { en: "Canadian Caregiver Program, Home Support Worker, and Aging-in-Place pilots offer PR after 2 years of Canadian work experience.", fr: "Le Programme des aides familiaux et les projets pilotes offrent la RP aprÃ¨s 2 ans d'expÃ©rience canadienne.", es: "El Programa de Cuidadores y proyectos piloto ofrecen RP tras 2 aÃ±os de experiencia canadiense.", ar: "Ø¨Ø±Ù†Ø§Ù…Ø¬ Ù…Ù‚Ø¯Ù…ÙŠ Ø§Ù„Ø±Ø¹Ø§ÙŠØ© ÙˆÙ…Ø´Ø§Ø±ÙŠØ¹ ØªØ¬Ø±ÙŠØ¨ÙŠØ© ØªÙ‚Ø¯Ù… Ø§Ù„Ø¥Ù‚Ø§Ù…Ø© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø© Ø¨Ø¹Ø¯ Ø³Ù†ØªÙŠÙ† Ù…Ù† Ø§Ù„Ø¹Ù…Ù„ ÙÙŠ ÙƒÙ†Ø¯Ø§." },
    href: "/services/work-permit",
    tags: { en: ["2 yrs Canadian work exp", "In-demand occupations", "LMIA-exempt paths"], fr: ["2 ans expÃ©rience canadienne", "Professions en demande", "Chemins sans EIMT"], es: ["2 aÃ±os exp. canadiense", "Ocupaciones en demanda", "VÃ­as sin LMIA"], ar: ["Ø³Ù†ØªØ§Ù† Ø®Ø¨Ø±Ø© ÙƒÙ†Ø¯ÙŠØ©", "Ù…Ù‡Ù† Ù…Ø·Ù„ÙˆØ¨Ø©", "Ù…Ø³Ø§Ø±Ø§Øª Ù…Ø¹ÙØ§Ø© Ù…Ù† LMIA"] },
  },
  {
    title: { en: "PR Through Study", fr: "RP via Ã©tudes", es: "RP a travÃ©s de estudios", ar: "Ø§Ù„Ø¥Ù‚Ø§Ù…Ø© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø© Ø¹Ø¨Ø± Ø§Ù„Ø¯Ø±Ø§Ø³Ø©" },
    desc: { en: "International graduates can use PGWP work experience to qualify for Express Entry or PNP streams targeting Canadian graduates.", fr: "Les diplÃ´mÃ©s internationaux peuvent utiliser le PTPD pour se qualifier Ã  l'EntrÃ©e express ou aux voies PNP.", es: "Los graduados internacionales pueden usar la PGWP para calificar a Express Entry o corrientes PNP.", ar: "ÙŠÙ…ÙƒÙ† Ù„Ù„Ø®Ø±ÙŠØ¬ÙŠÙ† Ø§Ù„Ø¯ÙˆÙ„ÙŠÙŠÙ† Ø§Ø³ØªØ®Ø¯Ø§Ù… ØªØµØ±ÙŠØ­ Ø§Ù„Ø¹Ù…Ù„ Ø¨Ø¹Ø¯ Ø§Ù„ØªØ®Ø±Ø¬ Ù„Ù„ØªØ£Ù‡Ù„ Ù„Ù€ Express Entry Ø£Ùˆ PNP." },
    href: "/services/study-permit",
    tags: { en: ["PGWP eligible", "CEC pathway", "Provincial graduate streams"], fr: ["Ã‰ligible au PTPD", "Voie ECC", "Voies diplÃ´mÃ©s provinciaux"], es: ["Elegible PGWP", "VÃ­a CEC", "Corrientes graduados provinciales"], ar: ["Ù…Ø¤Ù‡Ù„ Ù„Ù€ PGWP", "Ù…Ø³Ø§Ø± CEC", "Ù…Ø³Ø§Ø±Ø§Øª Ø®Ø±ÙŠØ¬ÙŠ Ø§Ù„Ù…Ù‚Ø§Ø·Ø¹Ø§Øª"] },
  },
  {
    title: { en: "Francophone Immigration", fr: "Immigration francophone", es: "InmigraciÃ³n francÃ³fona", ar: "Ø§Ù„Ù‡Ø¬Ø±Ø© Ø§Ù„Ù†Ø§Ø·Ù‚Ø© Ø¨Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©" },
    desc: { en: "French speakers get CRS bonus points, dedicated draws, and access to LMIA-exempt MobilitÃ© Francophone work permits outside Quebec.", fr: "Les francophones obtiennent des points CRS supplÃ©mentaires, des tirages dÃ©diÃ©s et le Programme MobilitÃ© francophone.", es: "Los francÃ³fonos obtienen puntos CRS adicionales, sorteos dedicados y permisos de trabajo sin LMIA.", ar: "ÙŠØ­ØµÙ„ Ø§Ù„Ù†Ø§Ø·Ù‚ÙˆÙ† Ø¨Ø§Ù„ÙØ±Ù†Ø³ÙŠØ© Ø¹Ù„Ù‰ Ù†Ù‚Ø§Ø· CRS Ø¥Ø¶Ø§ÙÙŠØ© ÙˆØ³Ø­ÙˆØ¨Ø§Øª Ù…Ø®ØµØµØ© ÙˆØªØµØ§Ø±ÙŠØ­ Ø¹Ù…Ù„ Ù…Ø¹ÙØ§Ø© Ù…Ù† LMIA." },
    href: "/programs/francophone-mobility",
    tags: { en: ["CRS French bonus", "Dedicated draws", "LMIA-exempt work permit"], fr: ["Bonus CRS franÃ§ais", "Tirages dÃ©diÃ©s", "Permis sans EIMT"], es: ["Bono CRS francÃ©s", "Sorteos dedicados", "Permiso sin LMIA"], ar: ["Ù…ÙƒØ§ÙØ£Ø© CRS Ù„Ù„ÙØ±Ù†Ø³ÙŠØ©", "Ø³Ø­ÙˆØ¨Ø§Øª Ù…Ø®ØµØµØ©", "ØªØµØ±ÙŠØ­ Ø¹Ù…Ù„ Ù…Ø¹ÙÙ‰"] },
  },
  {
    title: { en: "Family Sponsorship", fr: "Parrainage familial", es: "Patrocinio familiar", ar: "Ø§Ù„ØªÙƒÙÙ„ Ø§Ù„Ø¹Ø§Ø¦Ù„ÙŠ" },
    desc: { en: "Canadian PRs and citizens can sponsor spouses, parents, and dependent children for permanent residency.", fr: "Les RP et citoyens canadiens peuvent parrainer conjoints, parents et enfants Ã  charge pour la rÃ©sidence permanente.", es: "Los RP y ciudadanos canadienses pueden patrocinar cÃ³nyuges, padres e hijos dependientes.", ar: "ÙŠÙ…ÙƒÙ† Ù„Ø­Ø§Ù…Ù„ÙŠ Ø§Ù„Ø¥Ù‚Ø§Ù…Ø© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø© ÙˆØ§Ù„Ù…ÙˆØ§Ø·Ù†ÙŠÙ† Ø§Ù„ÙƒÙ†Ø¯ÙŠÙŠÙ† ÙƒÙØ§Ù„Ø© Ø§Ù„Ø£Ø²ÙˆØ§Ø¬ ÙˆØ§Ù„ÙˆØ§Ù„Ø¯ÙŠÙ† ÙˆØ§Ù„Ø£Ø·ÙØ§Ù„ Ø§Ù„ØªØ§Ø¨Ø¹ÙŠÙ†." },
    href: "/services/family-sponsorship",
    tags: { en: ["Spouse & common-law", "Parents & grandparents", "Dependent children"], fr: ["Ã‰poux et conjoint de fait", "Parents et grands-parents", "Enfants Ã  charge"], es: ["CÃ³nyuge y pareja de hecho", "Padres y abuelos", "Hijos dependientes"], ar: ["Ø§Ù„Ø²ÙˆØ¬ Ø£Ùˆ Ø§Ù„Ø´Ø±ÙŠÙƒ", "Ø§Ù„ÙˆØ§Ù„Ø¯Ø§Ù† ÙˆØ§Ù„Ø£Ø¬Ø¯Ø§Ø¯", "Ø§Ù„Ø£Ø·ÙØ§Ù„ Ø§Ù„ØªØ§Ø¨Ø¹ÙˆÙ†"] },
  },
];

const REQUIREMENTS = {
  en: ["Valid passport and travel history", "Language test results (IELTS/TEF/CELPIP)", "Educational Credential Assessment (ECA) if applicable", "Proof of work experience (reference letters, pay stubs)", "Police clearance certificates", "Medical examination by IRCC-designated physician"],
  fr: ["Passeport valide et historique de voyages", "RÃ©sultats de test de langue (IELTS/TEF/CELPIP)", "Ã‰valuation des diplÃ´mes (EDE) si applicable", "Preuve d'expÃ©rience de travail (lettres de rÃ©fÃ©rence)", "Certificats de police", "Examen mÃ©dical par un mÃ©decin dÃ©signÃ© IRCC"],
  es: ["Pasaporte vÃ¡lido e historial de viajes", "Resultados de prueba de idioma (IELTS/TEF/CELPIP)", "EvaluaciÃ³n de credenciales educativas (ECA)", "Prueba de experiencia laboral (cartas de referencia)", "Certificados de antecedentes penales", "Examen mÃ©dico por mÃ©dico designado IRCC"],
  ar: ["Ø¬ÙˆØ§Ø² Ø³ÙØ± Ø³Ø§Ø±ÙŠ ÙˆØªØ§Ø±ÙŠØ® Ø§Ù„Ø³ÙØ±", "Ù†ØªØ§Ø¦Ø¬ Ø§Ø®ØªØ¨Ø§Ø± Ø§Ù„Ù„ØºØ© (IELTS/TEF/CELPIP)", "ØªÙ‚ÙŠÙŠÙ… Ø§Ù„Ø´Ù‡Ø§Ø¯Ø§Øª Ø§Ù„ØªØ¹Ù„ÙŠÙ…ÙŠØ© (ECA) Ø¥Ù† Ù„Ø²Ù…", "Ø¥Ø«Ø¨Ø§Øª Ø§Ù„Ø®Ø¨Ø±Ø© Ø§Ù„Ø¹Ù…Ù„ÙŠØ© (Ø®Ø·Ø§Ø¨Ø§Øª Ù…Ø±Ø¬Ø¹ÙŠØ©)", "Ø´Ù‡Ø§Ø¯Ø§Øª Ø­Ø³Ù† Ø§Ù„Ø³ÙŠØ±Ø© ÙˆØ§Ù„Ø³Ù„ÙˆÙƒ", "Ø§Ù„ÙØ­Øµ Ø§Ù„Ø·Ø¨ÙŠ Ù…Ù† Ù‚Ø¨Ù„ Ø·Ø¨ÙŠØ¨ Ù…Ø¹ÙŠÙ† Ù…Ù† IRCC"],
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
    alternates: {
      canonical: `${BASE}/${l}/services/pr-pathways`,
      languages: Object.fromEntries(LOCALES.map((loc) => [loc, `${BASE}/${loc}/services/pr-pathways`])),
    },
    openGraph: { title: T.title[l], description: T.desc[l], url: `${BASE}/${l}/services/pr-pathways`, type: "website" },
  };
}

export default async function PRPathwaysPage({ params }: Props) {
  const { locale } = await params;
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;

  return (
    <>
      <ServiceJsonLd
        name="Canadian Permanent Residency Pathways"
        description="RCIC-certified immigration consultants helping clients achieve Canadian permanent residency through Express Entry, PNP, work, study, and family sponsorship routes."
        url={`${BASE}/${l}/services/pr-pathways`}
      />
      <article dir={l === "ar" ? "rtl" : "ltr"} className="max-w-4xl mx-auto px-4 py-12 sm:py-16">

        <nav aria-label="breadcrumb" className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1">
          <Link href={`/${l}`} className="hover:text-primary">{T.breadHome[l]}</Link>
          <span aria-hidden>/</span>
          <Link href={`/${l}/services`} className="hover:text-primary">{T.breadServices[l]}</Link>
          <span aria-hidden>/</span>
          <span className="text-gray-800 font-medium">{T.h1[l]}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{T.h1[l]}</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-10">{T.lead[l]}</p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{T.pathwaysH[l]}</h2>
          <div className="space-y-5">
            {PATHWAYS.map((p, i) => (
              <Link key={i} href={`/${l}${p.href}`}
                className="block border border-gray-200 rounded-2xl p-6 hover:border-primary/40 hover:shadow-sm transition-all group">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <p className="font-bold text-gray-900 group-hover:text-primary text-lg">{p.title[l]}</p>
                  <span className="text-primary shrink-0 mt-1">&#8594;</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{p.desc[l]}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags[l].map((tag) => (
                    <span key={tag} className="text-xs bg-blue-50 text-blue-700 font-medium px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">{T.requirementsH[l]}</h2>
          <ul className="space-y-3">
            {REQUIREMENTS[l].map((req, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                <p className="text-gray-700 leading-relaxed">{req}</p>
              </li>
            ))}
          </ul>
        </section>

        <aside className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold mb-3">{T.ctaH[l]}</h2>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">{T.ctaTxt[l]}</p>
          <Link href={`/${l}/evaluation`}
            className="inline-block bg-white text-blue-900 font-semibold px-7 py-3 rounded-full hover:bg-blue-50 transition-colors">
            {T.ctaBtn[l]}
          </Link>
        </aside>

        <div className="flex flex-wrap gap-3">
          <Link href={`/${l}/programs`} className="text-sm font-medium text-gray-600 hover:text-primary border border-gray-200 rounded-full px-4 py-1.5">
            {l === "en" ? "All Programs" : l === "fr" ? "Tous les programmes" : l === "es" ? "Todos los programas" : "Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø¨Ø±Ø§Ù…Ø¬"}
          </Link>
          <Link href={`/${l}/calculator`} className="text-sm font-medium text-gray-600 hover:text-primary border border-gray-200 rounded-full px-4 py-1.5">
            {l === "en" ? "CRS Calculator" : l === "fr" ? "Calculateur CRS" : l === "es" ? "Calculadora CRS" : "Ø­Ø§Ø³Ø¨Ø© CRS"}
          </Link>
          <Link href={`/${l}/draws`} className="text-sm font-medium text-gray-600 hover:text-primary border border-gray-200 rounded-full px-4 py-1.5">
            {l === "en" ? "Latest Draws" : l === "fr" ? "Derniers tirages" : l === "es" ? "Ãšltimos sorteos" : "Ø£Ø­Ø¯Ø« Ø§Ù„Ø³Ø­ÙˆØ¨Ø§Øª"}
          </Link>
        </div>
      </article>
    </>
  );
}

