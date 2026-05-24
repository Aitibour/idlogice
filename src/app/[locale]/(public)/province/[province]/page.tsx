import Link from "next/link";
import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { notFound } from "next/navigation";
import { PROVINCES, PROVINCE_MAP } from "@/data/immigration-provinces";
import { getProvinceMaillage } from "@/data/seo-maillage";

export const revalidate = false;

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;
type Locale = (typeof LOCALES)[number];
type Props = { params: Promise<{ locale: string; province: string }> };

const UI = {
  en: {
    breadHome: "Home",
    breadProvince: "Province Guides",
    capitalLabel: "Capital",
    populationLabel: "Population",
    codeLabel: "Province Code",
    pnpH: "Provincial Nominee Program",
    streamsH: "Available PNP Streams",
    occupationsH: "In-Demand Occupations",
    keyFactsH: "Why Immigrate to",
    requirementsH: "General Requirements",
    faqH: "Frequently Asked Questions",
    ctaH2: "Provincial Nomination",
    ctaTxt: "Our RCIC consultants are experts in provincial immigration programs. We help skilled workers navigate PNP streams and maximize their chances of nomination.",
    ctaBtn: "Get Free Evaluation",
    relatedH: "Other Canadian Provinces",
    drawsLink: "Latest Draws",
    fromLink: "By Country",
    programsLink: "All Programs",
    minCRSLabel: "Typical minimum CRS",
    noCRSNote: "Uses own selection system (not Express Entry CRS)",
  },
  fr: {
    breadHome: "Accueil",
    breadProvince: "Guides par province",
    capitalLabel: "Capitale",
    populationLabel: "Population",
    codeLabel: "Code provincial",
    pnpH: "Programme des candidats provinciaux",
    streamsH: "Volets PNP disponibles",
    occupationsH: "Professions en demande",
    keyFactsH: "Pourquoi immigrer en",
    requirementsH: "Exigences generales",
    faqH: "Questions frequentes",
    ctaH2: "nomination provinciale",
    ctaTxt: "Nos consultants RCIC sont experts en programmes d'immigration provinciaux. Nous aidons les travailleurs qualifies a naviguer dans les volets PNP.",
    ctaBtn: "Evaluation gratuite",
    relatedH: "Autres provinces canadiennes",
    drawsLink: "Derniers tirages",
    fromLink: "Par pays",
    programsLink: "Tous les programmes",
    minCRSLabel: "SCG minimum typique",
    noCRSNote: "Utilise son propre systeme de selection (pas le SCG d'Entree express)",
  },
  es: {
    breadHome: "Inicio",
    breadProvince: "Guias por provincia",
    capitalLabel: "Capital",
    populationLabel: "Poblacion",
    codeLabel: "Codigo provincial",
    pnpH: "Programa de Candidatos Provinciales",
    streamsH: "Streams PNP disponibles",
    occupationsH: "Ocupaciones en demanda",
    keyFactsH: "Por que inmigrar a",
    requirementsH: "Requisitos generales",
    faqH: "Preguntas frecuentes",
    ctaH2: "provincial",
    ctaTxt: "Nuestros consultores RCIC son expertos en programas de inmigracion provinciales. Ayudamos a trabajadores calificados a navegar los streams PNP.",
    ctaBtn: "Evaluacion gratuita",
    relatedH: "Otras provincias canadienses",
    drawsLink: "Ultimos sorteos",
    fromLink: "Por pais",
    programsLink: "Todos los programas",
    minCRSLabel: "CRS minimo tipico",
    noCRSNote: "Usa su propio sistema de seleccion (no CRS de Express Entry)",
  },
  ar: {
    breadHome: "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©",
    breadProvince: "Ø£Ø¯Ù„Ø© Ø§Ù„Ù…Ù‚Ø§Ø·Ø¹Ø§Øª",
    capitalLabel: "Ø§Ù„Ø¹Ø§ØµÙ…Ø©",
    populationLabel: "Ø§Ù„Ø³ÙƒØ§Ù†",
    codeLabel: "Ø±Ù…Ø² Ø§Ù„Ù…Ù‚Ø§Ø·Ø¹Ø©",
    pnpH: "Ø¨Ø±Ù†Ø§Ù…Ø¬ Ø§Ù„Ù…Ø±Ø´Ø­ÙŠÙ† Ø§Ù„Ø¥Ù‚Ù„ÙŠÙ…ÙŠÙŠÙ†",
    streamsH: "Ù…Ø³Ø§Ø±Ø§Øª PNP Ø§Ù„Ù…ØªØ§Ø­Ø©",
    occupationsH: "Ø§Ù„Ù…Ù‡Ù† Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©",
    keyFactsH: "Ù„Ù…Ø§Ø°Ø§ ØªÙ‡Ø§Ø¬Ø± Ø¥Ù„Ù‰",
    requirementsH: "Ø§Ù„Ù…ØªØ·Ù„Ø¨Ø§Øª Ø§Ù„Ø¹Ø§Ù…Ø©",
    faqH: "Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ø´Ø§Ø¦Ø¹Ø©",
    ctaH2: "Ø§Ù„Ø¥Ù‚Ù„ÙŠÙ…ÙŠ",
    ctaTxt: "ÙŠØªØ®ØµØµ Ù…Ø³ØªØ´Ø§Ø±ÙˆÙ†Ø§ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯ÙˆÙ† RCIC ÙÙŠ Ø¨Ø±Ø§Ù…Ø¬ Ø§Ù„Ù‡Ø¬Ø±Ø© Ø§Ù„Ø¥Ù‚Ù„ÙŠÙ…ÙŠØ©. Ù†Ø³Ø§Ø¹Ø¯ Ø§Ù„Ø¹Ù…Ø§Ù„ Ø§Ù„Ù…Ù‡Ø±Ø© Ø¹Ù„Ù‰ Ø§Ù„ØªÙ†Ù‚Ù„ ÙÙŠ Ù…Ø³Ø§Ø±Ø§Øª PNP.",
    ctaBtn: "Ø§Ø­ØµÙ„ Ø¹Ù„Ù‰ ØªÙ‚ÙŠÙŠÙ… Ù…Ø¬Ø§Ù†ÙŠ",
    relatedH: "Ù…Ù‚Ø§Ø·Ø¹Ø§Øª ÙƒÙ†Ø¯ÙŠØ© Ø£Ø®Ø±Ù‰",
    drawsLink: "Ø£Ø­Ø¯Ø« Ø§Ù„Ø³Ø­ÙˆØ¨Ø§Øª",
    fromLink: "Ø­Ø³Ø¨ Ø§Ù„Ø¨Ù„Ø¯",
    programsLink: "Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø¨Ø±Ø§Ù…Ø¬",
    minCRSLabel: "Ø§Ù„Ø­Ø¯ Ø§Ù„Ø£Ø¯Ù†Ù‰ Ø§Ù„Ù†Ù…ÙˆØ°Ø¬ÙŠ Ù„Ù€ CRS",
    noCRSNote: "ÙŠØ³ØªØ®Ø¯Ù… Ù†Ø¸Ø§Ù… Ø§Ø®ØªÙŠØ§Ø± Ø®Ø§Øµ (Ù„ÙŠØ³ CRS Ø§Ù„Ø®Ø§Øµ Ø¨Ù€ Entree express)",
  },
} as const;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    PROVINCES.map((p) => ({ locale, province: p.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, province: slug } = await params;
  const prov = PROVINCE_MAP[slug];
  if (!prov) return {};
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;
  const name = prov.name[l];
  const pnpName = l === "fr" ? prov.pnpName.fr : prov.pnpName.en;

  const titles: Record<Locale, string> = {
    en: `${name} Immigration Guide â€” ${pnpName}`,
    fr: `Guide immigration ${name} â€” ${prov.pnpName.fr}`,
    es: `Guia de inmigracion ${name}`,
    ar: `Ø¯Ù„ÙŠÙ„ Ù‡Ø¬Ø±Ø© ${name}`,
  };
  const descs: Record<Locale, string> = {
    en: `Complete guide to immigrating to ${name}, Canada. PNP streams, requirements, in-demand occupations, and free profile evaluation.`,
    fr: `Guide complet pour immigrer en ${name}, Canada. Volets PNP, exigences, professions en demande et évaluation gratuite.`,
    es: `Guía completa para inmigrar a ${name}, Canadá. Streams PNP, requisitos, ocupaciones en demanda y evaluación gratuita.`,
    ar: `الدليل الشامل للهجرة إلى ${name}، كندا. مسارات PNP ومتطلبات الأهلية والمهن المطلوبة. تقييم مجاني.`,
  };

  const title = titles[l];
  const description = descs[l];
  const url = `${BASE}/${l}/province/${slug}`;

  // Absolute title bypasses template — drops long PNP name, keeps under 60 chars
  // "Newfoundland & Labrador Immigration Guide | IDLOGICE" = 51 chars (worst case EN)
  const seoTitle = `${name} Immigration Guide | IDLOGICE`;
  return {
    title: { absolute: seoTitle },
    description,
    alternates: generatePageAlternates(locale, `/province/${slug}`),
    openGraph: { title, description, url, type: "article", images: [{ url: `${BASE}/images/og-default.jpg`, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProvincePage({ params }: Props) {
  const { locale, province: slug } = await params;
  const prov = PROVINCE_MAP[slug];
  if (!prov) notFound();
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;
  const ui = UI[l];
  const name = prov.name[l];
  const pnpName = l === "fr" ? prov.pnpName.fr : prov.pnpName.en;
  const url = `${BASE}/${l}/province/${slug}`;

  // JSON-LD built from in-code constants only â€” no user input, XSS-safe
  const faqItems = prov.faq[l === "fr" ? "fr" : "en"] ?? prov.faq.en;
  const jsonLdStr = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${prov.name.en} Immigration Guide`,
        description: `Guide to immigrating to ${prov.name.en}, Canada. ${prov.pnpName.en}.`,
        author: { "@type": "Organization", name: "IDLOGICE", url: BASE },
        publisher: { "@type": "Organization", name: "IDLOGICE", logo: { "@type": "ImageObject", url: `${BASE}/logo.png` } },
        url,
        inLanguage: l,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ui.breadHome, item: `${BASE}/${l}` },
          { "@type": "ListItem", position: 2, name: ui.breadProvince, item: `${BASE}/${l}/province` },
          { "@type": "ListItem", position: 3, name: prov.name.en, item: url },
        ],
      },
    ],
  });

  const keyFacts = prov.keyFacts[l];
  const requirements = prov.requirements[l];
  const relatedProvinces = PROVINCES.filter((r) => r.slug !== slug).slice(0, 9);
  const maillage = getProvinceMaillage(slug);

  return (
    <>
      {/* JSON-LD from static constants only â€” no user input reaches __html */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdStr }} />
      <article dir={l === "ar" ? "rtl" : "ltr"} className="max-w-4xl mx-auto px-4 py-12 sm:py-16">

        <nav aria-label="breadcrumb" className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1">
          <Link href={`/${l}`} className="hover:text-primary">{ui.breadHome}</Link>
          <span aria-hidden>/</span>
          <Link href={`/${l}/province`} className="hover:text-primary">{ui.breadProvince}</Link>
          <span aria-hidden>/</span>
          <span className="text-gray-800 font-medium">{name}</span>
        </nav>

        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-gray-500">
            <span>{ui.codeLabel}: <strong className="text-gray-700">{prov.code}</strong></span>
            <span aria-hidden>Â·</span>
            <span>{ui.capitalLabel}: <strong className="text-gray-700">{prov.capital}</strong></span>
            <span aria-hidden>Â·</span>
            <span>{ui.populationLabel}: <strong className="text-gray-700">{prov.population.toLocaleString()}</strong></span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {l === "en" && `${name} Immigration Guide`}
            {l === "fr" && `Guide d'immigration en ${name}`}
            {l === "es" && `Guia de inmigracion a ${name}`}
            {l === "ar" && `Ø¯Ù„ÙŠÙ„ Ù‡Ø¬Ø±Ø© ${name}`}
          </h1>
          <p className="text-base text-primary font-semibold mb-4">{pnpName}</p>
          <p className="text-lg text-gray-600 leading-relaxed">{prov.lead[l]}</p>
        </div>

        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-semibold text-blue-900 mb-1">{ui.pnpH}</h2>
          <p className="text-sm text-blue-700 mb-4">{pnpName}</p>
          {prov.minCRSForNomination !== null ? (
            <p className="text-sm text-blue-800">
              <strong>{ui.minCRSLabel}:</strong> {prov.minCRSForNomination}+
            </p>
          ) : (
            <p className="text-sm text-blue-800 italic">{ui.noCRSNote}</p>
          )}
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{ui.streamsH}</h2>
          <ul className="space-y-2">
            {prov.streams.map((stream) => (
              <li key={stream} className="flex items-start gap-2 text-gray-700 text-sm py-2 border-b border-gray-100 last:border-0">
                <span className="text-primary mt-0.5 shrink-0">&#8594;</span>{stream}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{ui.occupationsH}</h2>
          <div className="flex flex-wrap gap-2">
            {prov.topOccupations.map((occ) => (
              <span key={occ} className="bg-green-50 text-green-800 border border-green-200 rounded-full px-4 py-1.5 text-sm font-medium">
                {occ}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">
            {ui.keyFactsH} {name}
          </h2>
          <ul className="space-y-3">
            {keyFacts.map((fact, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 text-primary mt-1">&#10003;</span>
                <p className="text-gray-700 leading-relaxed">{fact}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">{ui.requirementsH}</h2>
          <ul className="space-y-3">
            {requirements.map((req, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                <p className="text-gray-700 leading-relaxed">{req}</p>
              </li>
            ))}
          </ul>
        </section>

        <aside className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold mb-3">
            {l === "en" && `Apply for ${name} ${ui.ctaH2}`}
            {l === "fr" && `Postuler pour une ${ui.ctaH2} en ${name}`}
            {l === "es" && `Solicitar nominacion ${ui.ctaH2} de ${name}`}
            {l === "ar" && `Ø§Ù„ØªÙ‚Ø¯Ù… Ù„Ù„ØªØ±Ø´ÙŠØ­ ${ui.ctaH2} ÙÙŠ ${name}`}
          </h2>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">{ui.ctaTxt}</p>
          <Link
            href={`/${l}/evaluation`}
            className="inline-block bg-white text-blue-900 font-semibold px-7 py-3 rounded-full hover:bg-blue-50 transition-colors"
          >
            {ui.ctaBtn}
          </Link>
        </aside>

        {faqItems.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{ui.faqH}</h2>
            <div className="space-y-5">
              {faqItems.map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-5">
                  <p className="font-semibold text-gray-900 mb-2">{item.q}</p>
                  <p className="text-gray-600 leading-relaxed text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-wrap gap-3 mb-12">
          <Link href={`/${l}/draws`} className="text-sm font-medium text-primary hover:underline border border-primary/30 rounded-full px-4 py-1.5">
            {ui.drawsLink}
          </Link>
          <Link href={`/${l}/from`} className="text-sm font-medium text-gray-600 hover:text-primary border border-gray-200 rounded-full px-4 py-1.5">
            {ui.fromLink}
          </Link>
          <Link href={`/${l}/programs`} className="text-sm font-medium text-gray-600 hover:text-primary border border-gray-200 rounded-full px-4 py-1.5">
            {ui.programsLink}
          </Link>
        </div>

        {maillage && maillage.cityLinks.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {l === "en" && `Immigration Consultants in ${name}`}
              {l === "fr" && `Consultants en immigration Ã  ${name}`}
              {l === "es" && `Consultores de inmigraciÃ³n en ${name}`}
              {l === "ar" && `Ù…Ø³ØªØ´Ø§Ø±Ùˆ Ø§Ù„Ù‡Ø¬Ø±Ø© ÙÙŠ ${name}`}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {maillage.cityLinks.map((link) => (
                <Link key={link.href} href={`/${l}${link.href}`}
                  className="border border-gray-200 rounded-xl p-4 hover:border-primary/40 hover:bg-blue-50 transition-colors group">
                  <p className="font-semibold text-sm text-gray-900 group-hover:text-primary mb-1">{link.label}</p>
                  <p className="text-xs text-gray-500">{link.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{ui.relatedH}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {relatedProvinces.map((r) => (
              <Link
                key={r.slug}
                href={`/${l}/province/${r.slug}`}
                className="text-sm text-primary hover:underline border border-gray-200 rounded-lg px-3 py-2 hover:border-primary/40 transition-colors"
              >
                {r.name[l]}
              </Link>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}



