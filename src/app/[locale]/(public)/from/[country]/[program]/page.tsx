import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { COUNTRIES, COUNTRY_MAP } from "@/data/immigration-countries";
import { PROGRAMS, PROGRAM_MAP } from "@/data/immigration-programs";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/seo/structured-data";

export const revalidate = false;

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;

type Props = { params: Promise<{ locale: string; country: string; program: string }> };

export function generateStaticParams() {
  return COUNTRIES.flatMap((c) =>
    PROGRAMS.flatMap((p) =>
      LOCALES.map((locale) => ({ locale, country: c.slug, program: p.slug })),
    ),
  );
}

type LocaleKey = "en" | "fr" | "es" | "ar";
function l(locale: string): LocaleKey {
  return (["en", "fr", "es", "ar"].includes(locale) ? locale : "en") as LocaleKey;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, country: countrySlug, program: programSlug } = await params;
  const country = COUNTRY_MAP[countrySlug];
  const program = PROGRAM_MAP[programSlug];
  if (!country || !program) return {};

  const loc = l(locale);
  const countryName = country.name[loc] ?? country.name.en;
  const programName = program.shortName[loc] ?? program.shortName.en;
  const url = `${BASE}/${locale}/from/${countrySlug}/${programSlug}`;

  const titles: Record<LocaleKey, string> = {
    en: `Canada ${programName} from ${countryName} 2025 — How to Apply`,
    fr: `${programName} Canada depuis ${countryName} 2025 — Comment postuler`,
    es: `${programName} Canadá desde ${countryName} 2025 — Cómo aplicar`,
    ar: `${programName} كندا من ${countryName} 2025 — كيفية التقديم`,
  };

  const descs: Record<LocaleKey, string> = {
    en: `Complete guide to Canada ${programName} for ${countryName} nationals. Eligibility, processing times, steps, and expert RCIC support from IDLOGICE.`,
    fr: `Guide complet de ${programName} Canada pour les ressortissants de ${countryName}. Admissibilité, délais, étapes et accompagnement RCIC expert par IDLOGICE.`,
    es: `Guía completa de ${programName} Canadá para ciudadanos de ${countryName}. Elegibilidad, tiempos, pasos y apoyo experto RCIC de IDLOGICE.`,
    ar: `دليل شامل لـ ${programName} كندا لمواطني ${countryName}. الأهلية والمعالجة والخطوات ودعم RCIC من IDLOGICE.`,
  };

  return {
    title: titles[loc],
    description: descs[loc],
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${BASE}/${l}/from/${countrySlug}/${programSlug}`]),
      ),
    },
    openGraph: {
      type: "article",
      url,
      title: titles[loc],
      description: descs[loc],
      siteName: "IDLOGICE",
    },
  };
}

const ui: Record<LocaleKey, {
  home: string; from: string; programs: string;
  processingTime: string; weeks: string;
  requirements: string; steps: string; faq: string;
  ctaTitle: string; ctaBtn: string; otherPrograms: string;
  countryNote: string;
}> = {
  en: {
    home: "Home", from: "Immigrate by Country", programs: "Programs",
    processingTime: "Typical processing", weeks: "weeks",
    requirements: "Eligibility requirements", steps: "How to apply",
    faq: "Frequently asked questions",
    ctaTitle: "Book a free immigration consultation",
    ctaBtn: "Book a consultation →",
    otherPrograms: "Other programs for",
    countryNote: "Important for",
  },
  fr: {
    home: "Accueil", from: "Immigrer par pays", programs: "Programmes",
    processingTime: "Délai de traitement typique", weeks: "semaines",
    requirements: "Conditions d'admissibilité", steps: "Comment postuler",
    faq: "Questions fréquentes",
    ctaTitle: "Réservez une consultation d'immigration gratuite",
    ctaBtn: "Réserver une consultation →",
    otherPrograms: "Autres programmes pour",
    countryNote: "Important pour",
  },
  es: {
    home: "Inicio", from: "Inmigrar por país", programs: "Programas",
    processingTime: "Tramitación típica", weeks: "semanas",
    requirements: "Requisitos de elegibilidad", steps: "Cómo aplicar",
    faq: "Preguntas frecuentes",
    ctaTitle: "Reserve una consulta de inmigración gratuita",
    ctaBtn: "Reservar una consulta →",
    otherPrograms: "Otros programas para",
    countryNote: "Importante para",
  },
  ar: {
    home: "الرئيسية", from: "الهجرة حسب البلد", programs: "البرامج",
    processingTime: "وقت المعالجة المعتاد", weeks: "أسابيع",
    requirements: "متطلبات الأهلية", steps: "كيفية التقديم",
    faq: "الأسئلة الشائعة",
    ctaTitle: "احجز استشارة هجرة مجانية",
    ctaBtn: "احجز استشارة →",
    otherPrograms: "برامج أخرى لـ",
    countryNote: "مهم لـ",
  },
};

const englishNoteText: Record<LocaleKey, string> = {
  en: "English or French is required for most Canadian immigration programs. IELTS and CELPIP are accepted for English; TEF Canada and TCF Canada for French.",
  fr: "L'anglais ou le français est requis pour la plupart des programmes d'immigration canadiens. IELTS et CELPIP sont acceptés pour l'anglais ; TEF Canada et TCF Canada pour le français.",
  es: "El inglés o francés es requerido para la mayoría de los programas de inmigración canadienses. IELTS y CELPIP se aceptan para inglés; TEF Canada y TCF Canada para francés.",
  ar: "يُشترط اللغة الإنجليزية أو الفرنسية لمعظم برامج الهجرة الكندية. IELTS وCELPIP مقبولان للإنجليزية؛ TEF Canada وTCF Canada للفرنسية.",
};

export default async function CountryProgramPage({ params }: Props) {
  const { locale, country: countrySlug, program: programSlug } = await params;
  const country = COUNTRY_MAP[countrySlug];
  const program = PROGRAM_MAP[programSlug];
  if (!country || !program) notFound();

  const loc = l(locale);
  const t = ui[loc] ?? ui.en;
  const countryName = country.name[loc] ?? country.name.en;
  const programName = program.name[loc] ?? program.name.en;
  const programShort = program.shortName[loc] ?? program.shortName.en;
  const programDesc = program.description[loc] ?? program.description.en;
  const eligibility = (program.eligibility[loc] ?? program.eligibility.en) as string[];
  const steps = (program.steps[loc] ?? program.steps.en) as string[];
  const faqKey = locale === "fr" ? "fr" : "en";
  const faq = (program.faq[faqKey] ?? program.faq.en) as Array<{ q: string; a: string }>;

  const url = `${BASE}/${locale}/from/${countrySlug}/${programSlug}`;

  const pageTitle =
    locale === "fr" ? `${programShort} Canada depuis ${countryName}` :
    locale === "es" ? `${programShort} Canadá desde ${countryName}` :
    locale === "ar" ? `${programShort} كندا من ${countryName}` :
    `Canada ${programShort} from ${countryName}`;

  const otherPrograms = PROGRAMS.filter((p) => p.slug !== programSlug).slice(0, 3);

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: t.home, url: `${BASE}/${locale}` },
        { name: t.from, url: `${BASE}/${locale}/from` },
        { name: countryName, url: `${BASE}/${locale}/from/${countrySlug}` },
        { name: programShort, url },
      ]} />
      <ServiceJsonLd
        name={`${programName} — ${countryName} to Canada`}
        description={programDesc.slice(0, 160)}
        url={url}
      />

      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href={`/${locale}`} className="hover:underline">{t.home}</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/${locale}/from`} className="hover:underline">{t.from}</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/${locale}/from/${countrySlug}`} className="hover:underline">{countryName}</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900 font-medium">{programShort}</li>
          </ol>
        </nav>

        <div className="text-sm text-primary font-semibold uppercase tracking-wide mb-2">
          {t.processingTime}: {program.processingWeeks.min}–{program.processingWeeks.max} {t.weeks}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{pageTitle} 2025</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-10">{programDesc}</p>

        {/* English note for countries where primary language isn't English */}
        {country.primaryLang !== "en" && country.primaryLang !== "fr" && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-10 text-sm text-amber-900">
            <strong>{t.countryNote} {countryName}:</strong>{" "}
            {englishNoteText[loc] ?? englishNoteText.en}
          </div>
        )}

        {/* Eligibility */}
        <section className="mb-12 rounded-2xl bg-gray-50 p-6 border border-border">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">{t.requirements}</h2>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.steps}</h2>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.faq}</h2>
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
          <p className="text-xl font-bold text-gray-900 mb-5">{t.ctaTitle}</p>
          <Link
            href={`/${locale}/book-consultation`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity"
          >
            {t.ctaBtn}
          </Link>
        </aside>

        {/* Other programs */}
        <section className="border-t pt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            {t.otherPrograms} {countryName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherPrograms.map((pr) => (
              <Link
                key={pr.slug}
                href={`/${locale}/from/${countrySlug}/${pr.slug}`}
                className="group block rounded-xl border border-border p-4 hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <p className="font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors">
                  {pr.shortName[locale] ?? pr.shortName.en}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {pr.processingWeeks.min}–{pr.processingWeeks.max} {t.weeks}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
