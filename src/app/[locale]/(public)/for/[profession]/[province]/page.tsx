import Link from "next/link";
import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { notFound } from "next/navigation";
import { PROFESSIONS, PROFESSION_MAP } from "@/data/immigration-professions";
import { PROVINCES, PROVINCE_MAP } from "@/data/immigration-provinces";

export const revalidate = false;

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;
type Locale = (typeof LOCALES)[number];
type Props = { params: Promise<{ locale: string; profession: string; province: string }> };

const TOP_PROFESSION_SLUGS = [
  "software-engineer", "nurse", "truck-driver", "accountant",
  "electrician", "data-scientist", "doctor", "civil-engineer",
];
const TOP_PROVINCE_SLUGS = [
  "ontario", "british-columbia", "alberta", "quebec", "nova-scotia",
];

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    TOP_PROFESSION_SLUGS.flatMap((profession) =>
      TOP_PROVINCE_SLUGS.map((province) => ({ locale, profession, province }))
    )
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, profession: profSlug, province: provSlug } = await params;
  const prof = PROFESSION_MAP[profSlug];
  const prov = PROVINCE_MAP[provSlug];
  if (!prof || !prov) return {};
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;

  const titles: Record<Locale, string> = {
    en: `${prof.name.en} Immigration ${prov.name.en}`,
    fr: `Immigration ${prof.name.fr} ${prov.name.fr}`,
    es: `Inmigracion de ${prof.name.es} a ${prov.name.es}`,
    ar: `هجرة ${prof.name.ar} إلى ${prov.name.ar}`,
  };
  const descs: Record<Locale, string> = {
    en: `How ${prof.name.en}s can immigrate to ${prov.name.en}, Canada. NOC ${prof.nocCode}, ${prov.pnpName.en} streams, Express Entry pathways. Free profile evaluation.`,
    fr: `Comment les ${prof.name.fr}s peuvent immigrer en ${prov.name.fr}. CNP ${prof.nocCode}, voies ${prov.pnpName.fr}. Evaluation gratuite.`,
    es: `Como los ${prof.name.es}s pueden immigrar a ${prov.name.es}, Canada. NOC ${prof.nocCode}. Evaluacion gratuita.`,
    ar: `كيف يمكن لـ${prof.name.ar} الهجرة إلى ${prov.name.ar}، كندا. NOC ${prof.nocCode}. تقييم مجاني.`,
  };

  const url = `${BASE}/${l}/for/${profSlug}/${provSlug}`;
  // Absolute title bypasses template — keeps under 60 chars for all profession+province combos
  // "Data Scientist / AI Engineer: NL, Canada | IDLOGICE" = 51 chars (worst case EN)
  const seoTitle = `${prof.name.en}: ${prov.code}, Canada | IDLOGICE`;
  return {
    title: { absolute: seoTitle },
    description: descs[l],
    alternates: generatePageAlternates(locale, `/for/${profSlug}/${provSlug}`),
    openGraph: { title: titles[l], description: descs[l], url, type: "article" },
  };
}

export default async function ProfessionProvincePage({ params }: Props) {
  const { locale, profession: profSlug, province: provSlug } = await params;
  const prof = PROFESSION_MAP[profSlug];
  const prov = PROVINCE_MAP[provSlug];
  if (!prof || !prov) notFound();

  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;
  const profName = prof.name[l];
  const provName = prov.name[l];

  // JSON-LD built from in-code constants only - no user input, XSS-safe
  const jsonLdStr = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${prof.name.en} Immigration to ${prov.name.en}`,
        author: { "@type": "Organization", name: "IDLOGICE", url: BASE },
        url: `${BASE}/${l}/for/${profSlug}/${provSlug}`,
        inLanguage: l,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/${l}` },
          { "@type": "ListItem", position: 2, name: "By Profession", item: `${BASE}/${l}/for` },
          { "@type": "ListItem", position: 3, name: profName, item: `${BASE}/${l}/for/${profSlug}` },
          { "@type": "ListItem", position: 4, name: provName, item: `${BASE}/${l}/for/${profSlug}/${provSlug}` },
        ],
      },
    ],
  });

  const relevantStreams = prov.streams.slice(0, 4);
  const relatedProfessions = PROFESSIONS.filter((p) => p.slug !== profSlug).slice(0, 4);
  const relatedProvinces = PROVINCES.filter((p) => p.slug !== provSlug).slice(0, 4);

  return (
    <>
      {/* JSON-LD from static constants only - no user input reaches __html */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdStr }} />
      <article dir={l === "ar" ? "rtl" : "ltr"} className="max-w-4xl mx-auto px-4 py-12 sm:py-16">

        <nav aria-label="breadcrumb" className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1">
          <Link href={`/${l}`} className="hover:text-primary">{l === "en" ? "Home" : l === "fr" ? "Accueil" : l === "es" ? "Inicio" : "الرئيسية"}</Link>
          <span aria-hidden>/</span>
          <Link href={`/${l}/for`} className="hover:text-primary">{l === "en" ? "By Profession" : l === "fr" ? "Par profession" : l === "es" ? "Por profesion" : "حسب المهنة"}</Link>
          <span aria-hidden>/</span>
          <Link href={`/${l}/for/${profSlug}`} className="hover:text-primary">{profName}</Link>
          <span aria-hidden>/</span>
          <span className="text-gray-800 font-medium">{provName}</span>
        </nav>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">NOC {prof.nocCode} &middot; {prof.nocTeer}</span>
            {prof.inDemand && <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {l === "en" ? "In-Demand" : l === "fr" ? "En demande" : l === "es" ? "En demanda" : "مطلوب"}
            </span>}
            <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2 py-1 rounded">{prov.code}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {l === "en" && `${profName} Immigration to ${provName}`}
            {l === "fr" && `Immigration des ${profName}s en ${provName}`}
            {l === "es" && `Inmigracion de ${profName}s a ${provName}`}
            {l === "ar" && `هجرة ${profName} إلى ${provName}`}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">{prof.lead[l]}</p>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {l === "en" && `${prov.pnpName.en} Streams`}
            {l === "fr" && `Voies ${prov.pnpName.fr}`}
            {l === "es" && `Corrientes ${prov.pnpName.en}`}
            {l === "ar" && `مسارات ${prov.pnpName.en}`}
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {relevantStreams.map((stream) => (
              <li key={stream} className="flex items-start gap-2 bg-blue-50 rounded-lg px-4 py-3 text-sm font-medium text-blue-900">
                <span className="mt-0.5 text-blue-600 shrink-0">&#10003;</span>{stream}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {l === "en" && `Top Programs for ${profName}s`}
            {l === "fr" && `Principaux programmes pour les ${profName}s`}
            {l === "es" && `Principales programas para ${profName}s`}
            {l === "ar" && `أهم البرامج لـ${profName}`}
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {prof.topPrograms.map((prog) => (
              <li key={prog} className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-800">
                <span className="mt-0.5 text-primary shrink-0">&#10003;</span>{prog}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            {l === "en" && `Why ${provName}?`}
            {l === "fr" && `Pourquoi la ${provName} ?`}
            {l === "es" && `Por que ${provName}?`}
            {l === "ar" && `لماذا ${provName}؟`}
          </h2>
          <ul className="space-y-2">
            {prov.keyFacts[l].slice(0, 4).map((fact, i) => (
              <li key={i} className="text-sm text-amber-900 flex gap-2">
                <span className="shrink-0">&#8594;</span>{fact}
              </li>
            ))}
          </ul>
        </section>

        <aside className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold mb-3">
            {l === "en" && `Immigrate to ${provName} as a ${profName}`}
            {l === "fr" && `Immigrez en ${provName} en tant que ${profName}`}
            {l === "es" && `Inmigrarse a ${provName} como ${profName}`}
            {l === "ar" && `الهجرة إلى ${provName} بوصفك ${profName}`}
          </h2>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto text-sm">
            {l === "en" && `Get a free profile assessment from our RCIC consultants specialized in ${provName} pathways for ${profName}s.`}
            {l === "fr" && `Obtenez une evaluation gratuite de nos consultants RCIC specialises dans les voies de la ${provName} pour les ${profName}s.`}
            {l === "es" && `Obtenga una evaluacion gratuita de nuestros consultores RCIC especializados en las vias de ${provName} para ${profName}s.`}
            {l === "ar" && `احصل على تقييم مجاني من مستشارينا المعتمدين RCIC المتخصصين في مسارات ${provName} لـ${profName}.`}
          </p>
          <Link href={`/${l}/evaluation`}
            className="inline-block bg-white text-blue-900 font-semibold px-7 py-3 rounded-full hover:bg-blue-50 transition-colors">
            {l === "en" ? "Get Free Evaluation" : l === "fr" ? "Evaluation gratuite" : l === "es" ? "Evaluacion gratuita" : "تقييم مجاني"}
          </Link>
        </aside>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              {l === "en" ? `Other provinces for ${profName}s` : l === "fr" ? `Autres provinces` : l === "es" ? `Otras provincias` : `مقاطعات اخرى`}
            </p>
            <div className="flex flex-col gap-2">
              {relatedProvinces.map((p) => (
                <Link key={p.slug} href={`/${l}/for/${profSlug}/${p.slug}`}
                  className="text-sm text-primary hover:underline border border-gray-200 rounded-lg px-3 py-2 hover:border-primary/40 transition-colors">
                  {prof.name[l]} &#8594; {p.name[l]}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              {l === "en" ? `Other professions in ${provName}` : l === "fr" ? `Autres professions` : l === "es" ? `Otras profesiones` : `مهن اخرى`}
            </p>
            <div className="flex flex-col gap-2">
              {relatedProfessions.map((p) => (
                <Link key={p.slug} href={`/${l}/for/${p.slug}/${provSlug}`}
                  className="text-sm text-primary hover:underline border border-gray-200 rounded-lg px-3 py-2 hover:border-primary/40 transition-colors">
                  {p.name[l]} &#8594; {provName}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href={`/${l}/for/${profSlug}`} className="text-sm font-medium text-primary hover:underline border border-primary/30 rounded-full px-4 py-1.5">
            {l === "en" ? `All ${profName} pathways` : l === "fr" ? `Toutes les voies ${profName}` : l === "es" ? `Todas las vias` : `جميع المسارات`}
          </Link>
          <Link href={`/${l}/province/${provSlug}`} className="text-sm font-medium text-gray-600 hover:text-primary border border-gray-200 rounded-full px-4 py-1.5">
            {provName}
          </Link>
          <Link href={`/${l}/draws`} className="text-sm font-medium text-gray-600 hover:text-primary border border-gray-200 rounded-full px-4 py-1.5">
            {l === "en" ? "Latest Draws" : l === "fr" ? "Derniers tirages" : l === "es" ? "Ultimos sorteos" : "السحوبات"}
          </Link>
        </div>
      </article>
    </>
  );
}



