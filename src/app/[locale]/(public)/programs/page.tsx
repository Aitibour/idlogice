import { SITE_SOCIAL_IMAGE } from "@/lib/seo/social-image";
import type { Metadata } from "next";
import Link from "next/link";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { PROGRAMS } from "@/data/immigration-programs";
import { BreadcrumbJsonLd } from "@/components/seo/structured-data";

export const revalidate = false;

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;

type Props = { params: Promise<{ locale: string }> };

const pageTitle: Record<string, string> = {
  en: "Canada Immigration Programs 2026 — Complete Guide",
  fr: "Programmes d'immigration au Canada 2026 — Guide complet",
  es: "Programas de Inmigración a Canadá 2026 — Guía completa",
  ar: "برامج الهجرة إلى كندا 2026 — دليل شامل",
};

const pageDesc: Record<string, string> = {
  en: "Explore Canadian immigration pathways: Express Entry, PNP, work permits, study permits, family sponsorship, and visitor visas. Find the right program.",
  fr: "Explorez les voies d'immigration canadiennes : Entrée express, PCP, permis de travail, parrainage familial et visas de visiteur. Trouvez votre programme.",
  es: "Explore las vías de inmigración canadiense: Express Entry, PNP, permisos de trabajo, patrocinio familiar y visas de visitante. Encuentre su programa.",
  ar: "استكشف كل مسارات الهجرة الكندية — الدخول السريع وبرامج المقاطعات وتصاريح العمل والدراسة والكفالة الأسرية وتأشيرات الزيارة. اعثر على البرنامج الذي يناسب ملفك.",
};

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const url = `${BASE}/${locale}/programs`;
  return {
    title: pageTitle[locale] ?? pageTitle.en,
    description: pageDesc[locale] ?? pageDesc.en,
    alternates: generatePageAlternates(locale, "/programs"),
    openGraph: {
      images: [SITE_SOCIAL_IMAGE],
      type: "website",
      url,
      title: pageTitle[locale] ?? pageTitle.en,
      description: pageDesc[locale] ?? pageDesc.en,
      siteName: "IDLOGICE",
    },
  };
}

const headings: Record<string, { h1: string; sub: string; cta: string; eval: string }> = {
  en: {
    h1: "Canada Immigration Programs",
    sub: "Find the pathway that matches your profile — from skilled workers to students, families, and visitors.",
    cta: "Not sure which program fits you?",
    eval: "Book a consultation →",
  },
  fr: {
    h1: "Programmes d'immigration au Canada",
    sub: "Trouvez la voie qui correspond à votre profil — des travailleurs qualifiés aux étudiants, familles et visiteurs.",
    cta: "Vous ne savez pas quel programme vous convient ?",
    eval: "Obtenir une évaluation gratuite →",
  },
  es: {
    h1: "Programas de Inmigración a Canadá",
    sub: "Encuentre la vía que coincide con su perfil — desde trabajadores calificados hasta estudiantes, familias y visitantes.",
    cta: "¿No está seguro de qué programa le conviene?",
    eval: "Obtener evaluación gratuita →",
  },
  ar: {
    h1: "برامج الهجرة إلى كندا",
    sub: "اعثر على المسار الذي يناسب ملفك — من العمال المهرة إلى الطلاب والعائلات والزوار.",
    cta: "لست متأكداً من البرنامج المناسب لك؟",
    eval: "احصل على تقييم مجاني →",
  },
};

const processingLabel: Record<string, string> = {
  en: "Processing",
  fr: "Traitement",
  es: "Tramitación",
  ar: "المعالجة",
};

const weeksLabel: Record<string, string> = {
  en: "weeks",
  fr: "semaines",
  es: "semanas",
  ar: "أسابيع",
};

const learnMoreLabel: Record<string, string> = {
  en: "Learn more →",
  fr: "En savoir plus →",
  es: "Más información →",
  ar: "اعرف المزيد →",
};

export default async function ProgramsIndexPage({ params }: Props) {
  const { locale } = await params;
  const h = headings[locale] ?? headings.en;
  const url = `${BASE}/${locale}/programs`;
  const homeLabel = locale === "fr" ? "Accueil" : locale === "es" ? "Inicio" : locale === "ar" ? "الرئيسية" : "Home";
  const programsLabel = locale === "fr" ? "Programmes" : locale === "es" ? "Programas" : locale === "ar" ? "البرامج" : "Programs";

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: homeLabel, url: `${BASE}/${locale}` },
          { name: programsLabel, url },
        ]}
      />
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
          <ol className="flex items-center gap-2">
            <li><Link href={`/${locale}`} className="hover:underline">{homeLabel}</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900 font-medium">{programsLabel}</li>
          </ol>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{h.h1}</h1>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl">{h.sub}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {PROGRAMS.map((program) => {
            const name = program.name[locale] ?? program.name.en;
            const desc = program.description[locale] ?? program.description.en;
            return (
              <Link
                key={program.slug}
                href={`/${locale}/programs/${program.slug}`}
                className="group block rounded-2xl border border-border p-6 hover:border-primary/50 hover:shadow-md transition-all bg-white"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {name}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{desc}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {processingLabel[locale] ?? processingLabel.en}: {program.processingWeeks.min}–{program.processingWeeks.max} {weeksLabel[locale] ?? weeksLabel.en}
                  </span>
                  <span className="text-primary font-semibold group-hover:underline">
                    {learnMoreLabel[locale] ?? learnMoreLabel.en}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <aside className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
          <p className="text-xl font-bold text-gray-900 mb-2">{h.cta}</p>
          <Link
            href={`/${locale}/book-consultation`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity mt-4"
          >
            {h.eval}
          </Link>
        </aside>
      </div>
    </>
  );
}
