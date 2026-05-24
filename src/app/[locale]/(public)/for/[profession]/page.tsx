import Link from "next/link";
import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { notFound } from "next/navigation";
import { PROFESSIONS, PROFESSION_MAP } from "@/data/immigration-professions";

export const revalidate = false;

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;
type Locale = (typeof LOCALES)[number];
type Props = { params: Promise<{ locale: string; profession: string }> };

const UI = {
  en: {
    breadHome: "Home",
    breadFor: "Immigration by Profession",
    nocLabel: "NOC Code",
    inDemandBadge: "In-Demand Occupation",
    topProgramsH: "Top Immigration Programs",
    requirementsH: "Key Requirements",
    pathwaysH: "Immigration Pathways",
    faqH: "Frequently Asked Questions",
    ctaH: "Start Your Canadian Journey",
    ctaTxt: "Our RCIC-certified consultants specialize in profession-based immigration pathways. Get a free profile evaluation tailored to your occupation and experience.",
    ctaBtn: "Get Free Evaluation",
    relatedH: "Other Professions",
    evalLink: "Free Evaluation",
    servicesLink: "Our Services",
    drawsLink: "Latest Draws",
  },
  fr: {
    breadHome: "Accueil",
    breadFor: "Immigration par profession",
    nocLabel: "Code CNP",
    inDemandBadge: "Profession en demande",
    topProgramsH: "Principaux programmes d'immigration",
    requirementsH: "Exigences cles",
    pathwaysH: "Voies d'immigration",
    faqH: "Questions frequentes",
    ctaH: "Commencez votre parcours canadien",
    ctaTxt: "Nos consultants certifies RCIC se specialisent dans les voies d'immigration basees sur la profession. Obtenez une evaluation gratuite de votre profil.",
    ctaBtn: "Evaluation gratuite",
    relatedH: "Autres professions",
    evalLink: "Evaluation gratuite",
    servicesLink: "Nos services",
    drawsLink: "Derniers tirages",
  },
  es: {
    breadHome: "Inicio",
    breadFor: "Inmigracion por profesion",
    nocLabel: "Codigo NOC",
    inDemandBadge: "Ocupacion en demanda",
    topProgramsH: "Principales programas de inmigracion",
    requirementsH: "Requisitos clave",
    pathwaysH: "Vias de inmigracion",
    faqH: "Preguntas frecuentes",
    ctaH: "Comience su viaje canadiense",
    ctaTxt: "Nuestros consultores certificados RCIC se especializan en vias de inmigracion basadas en la profesion. Obtenga una evaluacion gratuita de su perfil.",
    ctaBtn: "Evaluacion gratuita",
    relatedH: "Otras profesiones",
    evalLink: "Evaluacion gratuita",
    servicesLink: "Nuestros servicios",
    drawsLink: "Ultimos sorteos",
  },
  ar: {
    breadHome: "الرئيسية",
    breadFor: "الهجرة حسب المهنة",
    nocLabel: "رمز NOC",
    inDemandBadge: "مهنة مطلوبة",
    topProgramsH: "أهم برامج الهجرة",
    requirementsH: "المتطلبات الأساسية",
    pathwaysH: "مسارات الهجرة",
    faqH: "الأسئلة الشائعة",
    ctaH: "ابدأ رحلتك الكندية",
    ctaTxt: "يتخصص مستشارونا المعتمدون RCIC في مسارات الهجرة القائمة على المهنة. احصل على تقييم مجاني.",
    ctaBtn: "احصل على تقييم مجاني",
    relatedH: "مهن أخرى",
    evalLink: "تقييم مجاني",
    servicesLink: "خدماتنا",
    drawsLink: "أحدث السحوبات",
  },
} as const;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    PROFESSIONS.map((p) => ({ locale, profession: p.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, profession: slug } = await params;
  const p = PROFESSION_MAP[slug];
  if (!p) return {};
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;
  const name = p.name[l];

  const titles: Record<Locale, string> = {
    en: `Canada Immigration for ${name}s`,
    fr: `Immigration Canada pour les ${name}s`,
    es: `Inmigracion a Canada para ${name}s`,
    ar: `الهجرة إلى كندا لـ${name}`,
  };
  const descs: Record<Locale, string> = {
    en: `Complete guide to Canadian immigration for ${name}s. Explore NOC ${p.nocCode} pathways, Express Entry, PNP streams, and requirements. Free evaluation.`,
    fr: `Guide complet de l'immigration canadienne pour les ${name}s. Explorez les voies CNP ${p.nocCode}. Evaluation gratuite.`,
    es: `Guia completa de inmigracion canadiense para ${name}s. Explore vias NOC ${p.nocCode}. Evaluacion gratuita.`,
    ar: `الدليل الشامل للهجرة الكندية لـ${name}. استكشف مسارات NOC ${p.nocCode}. تقييم مجاني.`,
  };

  const title = titles[l];
  const rawDesc = descs[l];
  // Truncate description to 160 chars (NOC code + name can push it over)
  const description = rawDesc.length > 160 ? `${rawDesc.slice(0, 157)}…` : rawDesc;
  const url = `${BASE}/${l}/for/${slug}`;

  // Absolute title bypasses template — keeps under 60 chars for all professions
  // Worst case: "Data Scientist / AI Engineer: Canada Immigration | IDLOGICE" = 59 chars
  const seoSuffix: Record<Locale, string> = {
    en: "Canada Immigration",
    fr: "Immigration Canada",
    es: "Inmigracion Canada",
    ar: "Canada Immigration",
  };
  const seoTitle = `${name}: ${seoSuffix[l]} | IDLOGICE`;
  return {
    title: { absolute: seoTitle },
    description,
    alternates: generatePageAlternates(locale, `/for/${slug}`),
    openGraph: { title, description, url, type: "article", images: [{ url: `${BASE}/images/og-default.jpg`, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ForProfessionPage({ params }: Props) {
  const { locale, profession: slug } = await params;
  const p = PROFESSION_MAP[slug];
  if (!p) notFound();
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;
  const ui = UI[l];
  const name = p.name[l];
  const url = `${BASE}/${l}/for/${slug}`;

  // JSON-LD built from in-code constants only — no user input, XSS-safe
  const faqItems = p.faq[l === "fr" ? "fr" : "en"] ?? p.faq.en;
  const jsonLdStr = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `Canada Immigration for ${p.name.en}s`,
        description: `Guide to Canadian immigration for ${p.name.en}s. NOC ${p.nocCode} (${p.nocTeer}).`,
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
          { "@type": "ListItem", position: 2, name: ui.breadFor, item: `${BASE}/${l}/for` },
          { "@type": "ListItem", position: 3, name: name, item: url },
        ],
      },
    ],
  });

  const requirements = p.requirements[l];
  const pathways = p.pathways[l];
  const relatedProfessions = PROFESSIONS.filter((r) => r.slug !== slug).slice(0, 6);

  return (
    <>
      {/* JSON-LD from static constants only — no user input reaches __html */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdStr }} />
      <article dir={l === "ar" ? "rtl" : "ltr"} className="max-w-4xl mx-auto px-4 py-12 sm:py-16">

        <nav aria-label="breadcrumb" className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1">
          <Link href={`/${l}`} className="hover:text-primary">{ui.breadHome}</Link>
          <span aria-hidden>/</span>
          <Link href={`/${l}/for`} className="hover:text-primary">{ui.breadFor}</Link>
          <span aria-hidden>/</span>
          <span className="text-gray-800 font-medium">{name}</span>
        </nav>

        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {ui.nocLabel}: {p.nocCode} ({p.nocTeer})
            </span>
            {p.inDemand && (
              <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {ui.inDemandBadge}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {l === "en" && `Canada Immigration for ${name}s`}
            {l === "fr" && `Immigration Canada pour les ${name}s`}
            {l === "es" && `Inmigracion a Canada para ${name}s`}
            {l === "ar" && `الهجرة إلى كندا لـ${name}`}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">{p.lead[l]}</p>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{ui.topProgramsH}</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {p.topPrograms.map((prog) => (
              <li key={prog} className="flex items-start gap-2 bg-blue-50 rounded-lg px-4 py-3 text-sm font-medium text-blue-900">
                <span className="mt-0.5 text-blue-600 shrink-0">&#10003;</span>{prog}
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

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">{ui.pathwaysH}</h2>
          <div className="space-y-3">
            {pathways.map((path, i) => {
              const colonIdx = path.indexOf(": ");
              const title = colonIdx > -1 ? path.slice(0, colonIdx) : path;
              const detail = colonIdx > -1 ? path.slice(colonIdx + 2) : "";
              return (
                <div key={i} className="border border-gray-200 rounded-xl p-4">
                  <p className="font-semibold text-gray-900 mb-1">{title}</p>
                  {detail && <p className="text-sm text-gray-600">{detail}</p>}
                </div>
              );
            })}
          </div>
        </section>

        <aside className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold mb-3">{ui.ctaH}</h2>
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
          <Link href={`/${l}/evaluation`} className="text-sm font-medium text-primary hover:underline border border-primary/30 rounded-full px-4 py-1.5">
            {ui.evalLink}
          </Link>
          <Link href={`/${l}/services`} className="text-sm font-medium text-gray-600 hover:text-primary border border-gray-200 rounded-full px-4 py-1.5">
            {ui.servicesLink}
          </Link>
          <Link href={`/${l}/draws`} className="text-sm font-medium text-gray-600 hover:text-primary border border-gray-200 rounded-full px-4 py-1.5">
            {ui.drawsLink}
          </Link>
        </div>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{ui.relatedH}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {relatedProfessions.map((r) => (
              <Link
                key={r.slug}
                href={`/${l}/for/${r.slug}`}
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



