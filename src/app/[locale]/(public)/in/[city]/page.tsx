import Link from "next/link";
import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { notFound } from "next/navigation";
import { CITIES, CITY_MAP } from "@/data/immigration-cities";
import { getCityMaillage } from "@/data/seo-maillage";

export const revalidate = false;

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;
type Locale = (typeof LOCALES)[number];
type Props = { params: Promise<{ locale: string; city: string }> };

const UI = {
  en: {
    breadHome: "Home",
    breadIn: "Immigration by City",
    provinceLabel: "Province",
    populationLabel: "Population",
    topProgramsH: "Top Immigration Programs",
    industriesH: "Major Industries and Job Sectors",
    statsH: "Immigration Statistics",
    immigrantsLabel: "Newcomers per year",
    topCountriesLabel: "Top source countries",
    unemploymentLabel: "Unemployment rate",
    ctaTxt: "Our RCIC-certified immigration consultants provide personalized guidance for professionals targeting this city. Get a free profile evaluation.",
    ctaBtn: "Get Free Evaluation",
    relatedH: "Other Canadian Cities",
    neighborhoodsH: "Surrounding Communities",
    evalLink: "Free Evaluation",
    fromLink: "Immigration by Country",
    programsLink: "All Programs",
  },
  fr: {
    breadHome: "Accueil",
    breadIn: "Immigration par ville",
    provinceLabel: "Province",
    populationLabel: "Population",
    topProgramsH: "Principaux programmes d'immigration",
    industriesH: "Principales industries et secteurs d'emploi",
    statsH: "Statistiques d'immigration",
    immigrantsLabel: "Nouveaux arrivants par an",
    topCountriesLabel: "Principaux pays sources",
    unemploymentLabel: "Taux de chomage",
    ctaTxt: "Nos consultants en immigration certifies RCIC offrent des conseils personnalises pour les professionnels ciblant cette ville. Evaluation gratuite.",
    ctaBtn: "Evaluation gratuite",
    relatedH: "Autres villes canadiennes",
    neighborhoodsH: "Communautes environnantes",
    evalLink: "Evaluation gratuite",
    fromLink: "Immigration par pays",
    programsLink: "Tous les programmes",
  },
  es: {
    breadHome: "Inicio",
    breadIn: "Inmigracion por ciudad",
    provinceLabel: "Provincia",
    populationLabel: "Poblacion",
    topProgramsH: "Principales programas de inmigracion",
    industriesH: "Principales industrias y sectores de empleo",
    statsH: "Estadisticas de inmigracion",
    immigrantsLabel: "Recien llegados por ano",
    topCountriesLabel: "Principales paises de origen",
    unemploymentLabel: "Tasa de desempleo",
    ctaTxt: "Nuestros consultores de inmigracion certificados RCIC brindan orientacion personalizada para profesionales que apuntan a esta ciudad. Evaluacion gratuita.",
    ctaBtn: "Evaluacion gratuita",
    relatedH: "Otras ciudades canadienses",
    neighborhoodsH: "Comunidades circundantes",
    evalLink: "Evaluacion gratuita",
    fromLink: "Inmigracion por pais",
    programsLink: "Todos los programas",
  },
  ar: {
    breadHome: "الرئيسية",
    breadIn: "الهجرة حسب المدينة",
    provinceLabel: "المقاطعة",
    populationLabel: "السكان",
    topProgramsH: "أهم برامج الهجرة",
    industriesH: "الصناعات الرئيسية وقطاعات العمل",
    statsH: "إحصائيات الهجرة",
    immigrantsLabel: "الوافدون الجدد سنويًا",
    topCountriesLabel: "أهم دول المصدر",
    unemploymentLabel: "معدل البطالة",
    ctaTxt: "يقدم مستشارونا المعتمدون RCIC توجيهًا شخصيًا للمهنيين المستهدفين لهذه المدينة. احصل على تقييم مجاني.",
    ctaBtn: "احصل على تقييم مجاني",
    relatedH: "مدن كندية أخرى",
    neighborhoodsH: "المجتمعات المجاورة",
    evalLink: "تقييم مجاني",
    fromLink: "الهجرة حسب البلد",
    programsLink: "جميع البرامج",
  },
} as const;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    CITIES.map((c) => ({ locale, city: c.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, city: slug } = await params;
  const c = CITY_MAP[slug];
  if (!c) return {};
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;
  const name = c.name[l];

  const titles: Record<Locale, string> = {
    en: `Immigration Consultant ${name}`,
    fr: `Consultant en immigration ${name}`,
    es: `Consultor de inmigracion ${name}`,
    ar: `مستشار الهجرة في ${name}`,
  };
  const descs: Record<Locale, string> = {
    en: `Find an RCIC-certified immigration consultant in ${name}, ${c.province}. Express Entry, ${c.provinceCode} PNP, work permits and more. Free profile evaluation.`,
    fr: `Trouvez un consultant en immigration certifie RCIC a ${name}, ${c.province}. Entree express, PNP ${c.provinceCode}. Evaluation gratuite.`,
    es: `Encuentre un consultor de inmigracion certificado RCIC en ${name}, ${c.province}. Express Entry, PNP ${c.provinceCode}. Evaluacion gratuita.`,
    ar: `ابحث عن مستشار هجرة معتمد RCIC في ${name}. تقييم مجاني.`,
  };

  const title = titles[l];
  const description = descs[l];
  const url = `${BASE}/${l}/in/${slug}`;

  // Locale-specific absolute title — bypasses template, keeps under 60 chars
  const seoTitles: Record<Locale, string> = {
    en: `Immigration Consultant: ${name} | IDLOGICE`,
    fr: `Consultant en immigration: ${name} | IDLOGICE`,
    es: `Consultor de Inmigración: ${name} | IDLOGICE`,
    ar: `مستشار الهجرة: ${name} | IDLOGICE`,
  };
  const seoTitle = seoTitles[l] ?? seoTitles.en;
  return {
    title: { absolute: seoTitle },
    description,
    alternates: generatePageAlternates(locale, `/in/${slug}`),
    openGraph: { title, description, url, type: "article", images: [{ url: `${BASE}/images/cta-bg.jpg`, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function InCityPage({ params }: Props) {
  const { locale, city: slug } = await params;
  const c = CITY_MAP[slug];
  if (!c) notFound();
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;
  const ui = UI[l];
  const name = c.name[l];
  const url = `${BASE}/${l}/in/${slug}`;

  // JSON-LD built from in-code constants only — no user input, XSS-safe
  const jsonLdStr = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${BASE}#organization`,
        name: "IDLOGICE Immigration Consulting",
        url: BASE,
        telephone: "+1-581-634-0224",
        email: "contact@idlogice.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "410 Saint-Catherine St",
          addressLocality: "Montreal",
          addressRegion: "QC",
          addressCountry: "CA",
        },
        areaServed: [
          { "@type": "City", name: c.name.en },
          { "@type": "AdministrativeArea", name: c.province },
          { "@type": "Country", name: "Canada" },
        ],
        description: `RCIC-certified immigration consultants serving clients targeting ${c.name.en}, ${c.province}.`,
      },
      {
        "@type": "Article",
        headline: `Immigration Consultant ${c.name.en}`,
        url,
        inLanguage: l,
        author: { "@type": "Organization", name: "IDLOGICE", url: BASE },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ui.breadHome, item: `${BASE}/${l}` },
          { "@type": "ListItem", position: 2, name: ui.breadIn, item: `${BASE}/${l}/in` },
          { "@type": "ListItem", position: 3, name: c.name.en, item: url },
        ],
      },
    ],
  });

  const relatedCities = CITIES.filter((r) => r.slug !== slug).slice(0, 8);
  const maillage = getCityMaillage(slug);

  return (
    <>
      {/* JSON-LD from static constants only — no user input reaches __html */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdStr }} />
      <article dir={l === "ar" ? "rtl" : "ltr"} className="max-w-4xl mx-auto px-4 py-12 sm:py-16">

        <nav aria-label="breadcrumb" className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1">
          <Link href={`/${l}`} className="hover:text-primary">{ui.breadHome}</Link>
          <span aria-hidden>/</span>
          <Link href={`/${l}/in`} className="hover:text-primary">{ui.breadIn}</Link>
          <span aria-hidden>/</span>
          <span className="text-gray-800 font-medium">{name}</span>
        </nav>

        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-gray-500">
            <span>{ui.provinceLabel}: <strong className="text-gray-700">{c.province}</strong></span>
            <span aria-hidden>·</span>
            <span>{ui.populationLabel}: <strong className="text-gray-700">{c.population.toLocaleString()}</strong></span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {l === "en" && `Immigration Consultant ${name}`}
            {l === "fr" && `Consultant en immigration a ${name}`}
            {l === "es" && `Consultor de inmigracion en ${name}`}
            {l === "ar" && `مستشار الهجرة في ${name}`}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">{c.lead[l]}</p>
        </div>

        <section className="bg-gray-50 rounded-2xl p-6 mb-10 grid sm:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{c.stats.immigrantsPerYear}</p>
            <p className="text-xs text-gray-500 mt-1">{ui.immigrantsLabel}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{c.stats.topSourceCountries.slice(0, 3).join(", ")}</p>
            <p className="text-xs text-gray-500 mt-1">{ui.topCountriesLabel}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{c.stats.unemploymentRate}</p>
            <p className="text-xs text-gray-500 mt-1">{ui.unemploymentLabel}</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{ui.topProgramsH}</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {c.topPrograms.map((prog) => (
              <li key={prog} className="flex items-start gap-2 bg-blue-50 rounded-lg px-4 py-3 text-sm font-medium text-blue-900">
                <span className="mt-0.5 text-blue-600 shrink-0">&#10003;</span>{prog}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{ui.industriesH}</h2>
          <div className="flex flex-wrap gap-2">
            {c.majorIndustries.map((industry) => (
              <span key={industry} className="bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-700 font-medium">
                {industry}
              </span>
            ))}
          </div>
        </section>

        <aside className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold mb-3">
            {l === "en" && `Immigrate to ${name}`}
            {l === "fr" && `Immigrez a ${name}`}
            {l === "es" && `Inmigrarse a ${name}`}
            {l === "ar" && `الهجرة إلى ${name}`}
          </h2>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">{ui.ctaTxt}</p>
          <Link
            href={`/${l}/evaluation`}
            className="inline-block bg-white text-blue-900 font-semibold px-7 py-3 rounded-full hover:bg-blue-50 transition-colors"
          >
            {ui.ctaBtn}
          </Link>
        </aside>

        {c.neighborhoods.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">{ui.neighborhoodsH}</h2>
            <div className="flex flex-wrap gap-2">
              {c.neighborhoods.map((n) => (
                <span key={n} className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-sm">{n}</span>
              ))}
            </div>
          </section>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-10 text-sm text-amber-900">
          <Link href={`/${l}/province/${c.provinceSlug}`} className="font-semibold hover:underline">
            {l === "en" && `View ${c.province} immigration programs`}
            {l === "fr" && `Voir les programmes d'immigration de la ${c.province}`}
            {l === "es" && `Ver programas de inmigracion de ${c.province}`}
            {l === "ar" && `عرض برامج هجرة ${c.province}`}
            {" "}&#8594;
          </Link>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          <Link href={`/${l}/evaluation`} className="text-sm font-medium text-primary hover:underline border border-primary/30 rounded-full px-4 py-1.5">
            {ui.evalLink}
          </Link>
          <Link href={`/${l}/from`} className="text-sm font-medium text-gray-600 hover:text-primary border border-gray-200 rounded-full px-4 py-1.5">
            {ui.fromLink}
          </Link>
          <Link href={`/${l}/programs`} className="text-sm font-medium text-gray-600 hover:text-primary border border-gray-200 rounded-full px-4 py-1.5">
            {ui.programsLink}
          </Link>
        </div>

        {maillage && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {l === "en" && `Immigration Programs for ${name}`}
              {l === "fr" && `Programmes d'immigration pour ${name}`}
              {l === "es" && `Programas de inmigración para ${name}`}
              {l === "ar" && `برامج الهجرة إلى ${name}`}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {maillage.programLinks.map((link) => (
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {relatedCities.map((r) => (
              <Link
                key={r.slug}
                href={`/${l}/in/${r.slug}`}
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



