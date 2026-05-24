import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { PROGRAMS, PROGRAM_MAP } from "@/data/immigration-programs";
import { BreadcrumbJsonLd, FaqJsonLd, ServiceJsonLd } from "@/components/seo/structured-data";
import { InternalLinkGraph } from "@/components/seo/internal-link-graph";

export const revalidate = false;

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;

type Props = { params: Promise<{ locale: string; program: string }> };

export function generateStaticParams() {
  return PROGRAMS.flatMap((p) => LOCALES.map((locale) => ({ locale, program: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, program: slug } = await params;
  const p = PROGRAM_MAP[slug];
  if (!p) return {};

  const name = p.name[locale] ?? p.name.en;
  const desc = p.description[locale] ?? p.description.en;
  const url = `${BASE}/${locale}/programs/${slug}`;

  const titleMap: Record<string, string> = {
    en: `${name} Canada â€” How to Apply`,
    fr: `${name} Canada â€” Comment postuler`,
    es: `${name} CanadÃ¡ â€” CÃ³mo aplicar`,
    ar: `${name} ÙƒÙ†Ø¯Ø§ â€” ÙƒÙŠÙÙŠØ© Ø§Ù„ØªÙ‚Ø¯ÙŠÙ…`,
  };

  return {
    title: titleMap[locale] ?? titleMap.en,
    description: desc.slice(0, 160),
    alternates: generatePageAlternates(locale, `/programs/${slug}`),
    openGraph: {
      type: "article",
      url,
      title: titleMap[locale] ?? titleMap.en,
      description: desc.slice(0, 160),
      siteName: "IDLOGICE",
    },
  };
}

const uiStrings: Record<string, {
  home: string; programs: string; processingTime: string; weeks: string;
  highlights: string; eligibility: string; steps: string; faq: string;
  ctaTitle: string; ctaDesc: string; ctaBtn: string;
}> = {
  en: {
    home: "Home", programs: "Programs", processingTime: "Processing time", weeks: "weeks",
    highlights: "Program highlights", eligibility: "Eligibility requirements", steps: "How to apply",
    faq: "Frequently asked questions",
    ctaTitle: "Ready to start your Canadian journey?",
    ctaDesc: "Our RCIC consultants will assess your eligibility and build your strongest application.",
    ctaBtn: "Book a consultation â†’",
  },
  fr: {
    home: "Accueil", programs: "Programmes", processingTime: "DÃ©lai de traitement", weeks: "semaines",
    highlights: "Points forts du programme", eligibility: "Conditions d'admissibilitÃ©", steps: "Comment postuler",
    faq: "Questions frÃ©quentes",
    ctaTitle: "PrÃªt Ã  commencer votre parcours canadien ?",
    ctaDesc: "Nos consultants RCIC Ã©valueront votre admissibilitÃ© et prÃ©pareront votre meilleure demande.",
    ctaBtn: "RÃ©server une consultation â†’",
  },
  es: {
    home: "Inicio", programs: "Programas", processingTime: "Tiempo de tramitaciÃ³n", weeks: "semanas",
    highlights: "Aspectos destacados del programa", eligibility: "Requisitos de elegibilidad", steps: "CÃ³mo aplicar",
    faq: "Preguntas frecuentes",
    ctaTitle: "Â¿Listo para comenzar su viaje canadiense?",
    ctaDesc: "Nuestros consultores RCIC evaluarÃ¡n su elegibilidad y construirÃ¡n su solicitud mÃ¡s sÃ³lida.",
    ctaBtn: "Reservar una consulta â†’",
  },
  ar: {
    home: "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©", programs: "Ø§Ù„Ø¨Ø±Ø§Ù…Ø¬", processingTime: "ÙˆÙ‚Øª Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©", weeks: "Ø£Ø³Ø§Ø¨ÙŠØ¹",
    highlights: "Ø£Ø¨Ø±Ø² Ù…Ù…ÙŠØ²Ø§Øª Ø§Ù„Ø¨Ø±Ù†Ø§Ù…Ø¬", eligibility: "Ù…ØªØ·Ù„Ø¨Ø§Øª Ø§Ù„Ø£Ù‡Ù„ÙŠØ©", steps: "ÙƒÙŠÙÙŠØ© Ø§Ù„ØªÙ‚Ø¯ÙŠÙ…",
    faq: "Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ø´Ø§Ø¦Ø¹Ø©",
    ctaTitle: "Ù‡Ù„ Ø£Ù†Øª Ù…Ø³ØªØ¹Ø¯ Ù„Ø¨Ø¯Ø¡ Ø±Ø­Ù„ØªÙƒ Ø§Ù„ÙƒÙ†Ø¯ÙŠØ©ØŸ",
    ctaDesc: "Ø³ÙŠÙ‚ÙŠÙ‘Ù… Ù…Ø³ØªØ´Ø§Ø±ÙˆÙ†Ø§ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯ÙˆÙ† (RCIC) Ø£Ù‡Ù„ÙŠØªÙƒ ÙˆÙŠØ¨Ù†ÙˆÙ† Ù„Ùƒ Ø£Ù‚ÙˆÙ‰ Ø·Ù„Ø¨.",
    ctaBtn: "Ø§Ø­Ø¬Ø² Ø§Ø³ØªØ´Ø§Ø±Ø© â†’",
  },
};

export default async function ProgramPage({ params }: Props) {
  const { locale, program: slug } = await params;
  const p = PROGRAM_MAP[slug];
  if (!p) notFound();

  const ui = uiStrings[locale] ?? uiStrings.en;
  const name = p.name[locale] ?? p.name.en;
  const desc = p.description[locale] ?? p.description.en;
  const highlights = (p.highlights[locale] ?? p.highlights.en) as string[];
  const eligibility = (p.eligibility[locale] ?? p.eligibility.en) as string[];
  const steps = (p.steps[locale] ?? p.steps.en) as string[];
  const faqKey = locale === "fr" ? "fr" : "en";
  const faq = (p.faq[faqKey] ?? p.faq.en) as Array<{ q: string; a: string }>;

  const url = `${BASE}/${locale}/programs/${slug}`;

  const otherPrograms = PROGRAMS.filter((pr) => pr.slug !== slug).slice(0, 3);

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: ui.home, url: `${BASE}/${locale}` },
        { name: ui.programs, url: `${BASE}/${locale}/programs` },
        { name: name, url },
      ]} />
      <ServiceJsonLd name={name} description={desc} url={url} />
      {faq.length > 0 && (
        <FaqJsonLd items={faq.map((f) => ({ question: f.q, answer: f.a }))} />
      )}

      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href={`/${locale}`} className="hover:underline">{ui.home}</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/${locale}/programs`} className="hover:underline">{ui.programs}</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900 font-medium">{name}</li>
          </ol>
        </nav>

        <div className="mb-2 text-sm text-primary font-semibold uppercase tracking-wide">
          {ui.processingTime}: {p.processingWeeks.min}â€“{p.processingWeeks.max} {ui.weeks}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{name} â€” Canada 2025</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-12">{desc}</p>

        {/* Highlights */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">{ui.highlights}</h2>
          <ul className="space-y-3">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">{i + 1}</span>
                <span className="text-gray-800">{h}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Eligibility */}
        <section className="mb-12 rounded-2xl bg-gray-50 p-6 border border-border">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">{ui.eligibility}</h2>
          <ul className="space-y-2.5">
            {eligibility.map((e, i) => (
              <li key={i} className="flex items-start gap-2.5 text-gray-800">
                <svg className="size-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {e}
              </li>
            ))}
          </ul>
        </section>

        {/* Steps */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{ui.steps}</h2>
          <ol className="space-y-5">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <div className="size-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <p className="text-gray-800 pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        {faq.length > 0 && (
          <section className="mb-12 border-t pt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{ui.faq}</h2>
            <div className="space-y-4">
              {faq.map((f, i) => (
                <details key={i} className="rounded-xl border border-border p-5 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                    <span>{f.q}</span>
                    <span className="text-primary group-open:rotate-45 transition-transform text-xl leading-none ml-3">+</span>
                  </summary>
                  <p className="mt-3 text-gray-700 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <aside className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center mb-14">
          <p className="text-xl font-bold text-gray-900 mb-2">{ui.ctaTitle}</p>
          <p className="text-sm text-gray-600 mb-5">{ui.ctaDesc}</p>
          <Link
            href={`/${locale}/book-consultation`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity"
          >
            {ui.ctaBtn}
          </Link>
        </aside>

        <InternalLinkGraph locale={locale} programSlug={slug} />

        {/* Other programs */}
        {otherPrograms.length > 0 && (
          <section className="border-t pt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              {locale === "fr" ? "Autres programmes" : locale === "es" ? "Otros programas" : locale === "ar" ? "Ø¨Ø±Ø§Ù…Ø¬ Ø£Ø®Ø±Ù‰" : "Other programs"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherPrograms.map((pr) => (
                <Link
                  key={pr.slug}
                  href={`/${locale}/programs/${pr.slug}`}
                  className="group block rounded-xl border border-border p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <p className="font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors">
                    {pr.name[locale] ?? pr.name.en}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {pr.processingWeeks.min}â€“{pr.processingWeeks.max} {ui.weeks}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}



