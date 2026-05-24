import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { tryCreateServiceClient } from "@/lib/supabase/service";

export const revalidate = 3600;

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;

type Props = { params: Promise<{ locale: string }> };

function pick<T = string>(field: unknown, locale: string, fallback?: T): T {
  if (!field || typeof field !== "object") return fallback as T;
  const m = field as Record<string, T>;
  return m[locale] ?? m.en ?? (fallback as T);
}

type ClusterT = {
  id: string;
  slug_includes: string[];
  title: Record<string, string>;
  intro: Record<string, string>;
};

const CLUSTERS: ClusterT[] = [
  {
    id: "immigration",
    slug_includes: ["immigration-guide", "immigration-updates", "immigrate-", "immigration-process", "immigration-programs", "family-sponsorship"],
    title: { en: "Canada Immigration Programs", fr: "Programmes d'immigration au Canada", es: "Programas de inmigraciÃ³n a CanadÃ¡", ar: "Ø¨Ø±Ø§Ù…Ø¬ Ø§Ù„Ù‡Ø¬Ø±Ø© Ø¥Ù„Ù‰ ÙƒÙ†Ø¯Ø§" },
    intro: { en: "Permanent residence pathways for skilled workers, families and students â€” from Express Entry to provincial nomination and family sponsorship.", fr: "Voies de rÃ©sidence permanente pour travailleurs qualifiÃ©s, familles et Ã©tudiants â€” d'EntrÃ©e express au PCP et au parrainage familial.", es: "VÃ­as de residencia permanente: Express Entry, PNP y patrocinio familiar.", ar: "Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„Ø¥Ù‚Ø§Ù…Ø© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø© Ù„Ù„Ø¹Ù…Ø§Ù„ Ø§Ù„Ù…Ù‡Ø±Ø© ÙˆØ§Ù„Ø¹Ø§Ø¦Ù„Ø§Øª ÙˆØ§Ù„Ø·Ù„Ø§Ø¨." },
  },
  {
    id: "work",
    slug_includes: ["work-in-canada"],
    title: { en: "Work in Canada", fr: "Travailler au Canada", es: "Trabajar en CanadÃ¡", ar: "Ø§Ù„Ø¹Ù…Ù„ ÙÙŠ ÙƒÙ†Ø¯Ø§" },
    intro: { en: "Open and employer-specific work permits, LMIA-exempt pathways, in-demand occupations, and the best provinces for newcomers.", fr: "Permis de travail ouverts et liÃ©s Ã  un employeur, voies sans EIMT, professions en demande.", es: "Permisos de trabajo abiertos y especÃ­ficos, vÃ­as exentas de LMIA, ocupaciones en demanda.", ar: "ØªØµØ§Ø±ÙŠØ­ Ø§Ù„Ø¹Ù…Ù„ Ø§Ù„Ù…ÙØªÙˆØ­Ø© ÙˆØ§Ù„Ù…Ø­Ø¯Ø¯Ø©ØŒ ÙˆØ§Ù„Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„Ù…Ø¹ÙØ§Ø© Ù…Ù† LMIAØŒ ÙˆØ§Ù„Ù…Ù‡Ù† Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©." },
  },
  {
    id: "tourist",
    slug_includes: ["tourist-visa", "super-visa"],
    title: { en: "Canada Tourist Visa & Super Visa", fr: "Visa touriste et Super Visa Canada", es: "Visa de turista y Super Visa", ar: "ØªØ£Ø´ÙŠØ±Ø© Ø§Ù„Ø³Ø§Ø¦Ø­ ÙˆØ§Ù„ØªØ£Ø´ÙŠØ±Ø© Ø§Ù„Ù…Ù…ØªØ§Ø²Ø©" },
    intro: { en: "Step-by-step guides to securing a TRV, reapplying after refusal, and using the Super Visa for parents and grandparents.", fr: "Guides Ã©tape par Ã©tape pour obtenir un visa de rÃ©sident temporaire et utiliser le Super Visa.", es: "GuÃ­as paso a paso para obtener una visa de residente temporal y utilizar la Super Visa.", ar: "Ø£Ø¯Ù„Ø© Ø®Ø·ÙˆØ© Ø¨Ø®Ø·ÙˆØ© Ù„Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ ØªØ£Ø´ÙŠØ±Ø© Ø§Ù„Ø¥Ù‚Ø§Ù…Ø© Ø§Ù„Ù…Ø¤Ù‚ØªØ©." },
  },
  {
    id: "consultation",
    slug_includes: ["consultation", "rcic-vs-lawyer"],
    title: { en: "Canada Immigration Consultation", fr: "Consultation en immigration", es: "Consulta de inmigraciÃ³n", ar: "Ø§Ø³ØªØ´Ø§Ø±Ø© Ø§Ù„Ù‡Ø¬Ø±Ø© Ø§Ù„ÙƒÙ†Ø¯ÙŠØ©" },
    intro: { en: "Why a licensed RCIC matters, how a Canadian immigration lawyer differs, and what to expect during your first consultation.", fr: "Pourquoi un RCIC agrÃ©Ã© est important et Ã  quoi s'attendre lors de votre premiÃ¨re consultation.", es: "Por quÃ© importa un RCIC con licencia y quÃ© esperar en su primera consulta.", ar: "Ø£Ù‡Ù…ÙŠØ© Ù…Ø³ØªØ´Ø§Ø± RCIC Ù…Ø±Ø®Øµ ÙˆÙ…Ø§ ÙŠÙ…ÙƒÙ† ØªÙˆÙ‚Ø¹Ù‡ ÙÙŠ Ø§Ù„Ø§Ø³ØªØ´Ø§Ø±Ø© Ø§Ù„Ø£ÙˆÙ„Ù‰." },
  },
  {
    id: "evaluation",
    slug_includes: ["evaluation", "crs"],
    title: { en: "Free Canada Immigration Evaluation", fr: "Ã‰valuation gratuite d'immigration", es: "EvaluaciÃ³n gratuita de inmigraciÃ³n", ar: "ØªÙ‚ÙŠÙŠÙ… Ù…Ø¬Ø§Ù†ÙŠ Ù„Ù„Ù‡Ø¬Ø±Ø©" },
    intro: { en: "Tools to know if you qualify for Express Entry, PNP, or another pathway â€” including our CRS calculator and profile evaluation.", fr: "Outils gratuits pour savoir si vous Ãªtes admissible Ã  EntrÃ©e express, Ã  un PCP ou Ã  une autre voie.", es: "Herramientas gratuitas para saber si calificas para Express Entry, PNP u otra vÃ­a.", ar: "Ø£Ø¯ÙˆØ§Øª Ù…Ø¬Ø§Ù†ÙŠØ© Ù„Ù…Ø¹Ø±ÙØ© Ù…Ø§ Ø¥Ø°Ø§ ÙƒÙ†Øª Ù…Ø¤Ù‡Ù„Ø§Ù‹." },
  },
];

const I18N = {
  heading: {
    en: "Canada Immigration: The Complete 2026 Guide",
    fr: "Immigration au Canada : Le guide complet 2026",
    es: "InmigraciÃ³n a CanadÃ¡: La guÃ­a completa 2026",
    ar: "Ø§Ù„Ù‡Ø¬Ø±Ø© Ø¥Ù„Ù‰ ÙƒÙ†Ø¯Ø§: Ø§Ù„Ø¯Ù„ÙŠÙ„ Ø§Ù„ÙƒØ§Ù…Ù„ 2026",
  },
  lead: {
    en: "Whether you're applying for permanent residence, planning a work or study term, organising a family visit, or simply trying to figure out where to start â€” this hub gathers every guide we publish on Canadian immigration.",
    fr: "Que vous demandiez la rÃ©sidence permanente, planifiiez un sÃ©jour de travail ou d'Ã©tudes, ou cherchiez simplement par oÃ¹ commencer â€” ce centre rassemble tous nos guides.",
    es: "Ya sea que estÃ© solicitando la residencia permanente o planeando un perÃ­odo de trabajo â€” este centro reÃºne todas las guÃ­as que publicamos.",
    ar: "Ø³ÙˆØ§Ø¡ ÙƒÙ†Øª ØªØªÙ‚Ø¯Ù… Ø¨Ø·Ù„Ø¨ Ù„Ù„Ø¥Ù‚Ø§Ù…Ø© Ø§Ù„Ø¯Ø§Ø¦Ù…Ø© Ø£Ùˆ ØªØ®Ø·Ø· Ù„ÙØªØ±Ø© Ø¹Ù…Ù„ Ø£Ùˆ Ø¯Ø±Ø§Ø³Ø© â€” ÙŠØ¬Ù…Ø¹ Ù‡Ø°Ø§ Ø§Ù„Ù…Ø±ÙƒØ² ÙƒÙ„ Ø£Ø¯Ù„ØªÙ†Ø§.",
  },
  evalCta: {
    en: "Free Profile Evaluation â†’",
    fr: "Ã‰valuation de profil gratuite â†’",
    es: "EvaluaciÃ³n de perfil gratuita â†’",
    ar: "ØªÙ‚ÙŠÙŠÙ… Ø§Ù„Ù…Ù„Ù Ø§Ù„Ù…Ø¬Ø§Ù†ÙŠ â†’",
  },
  hubLabel: {
    en: "Resource hub",
    fr: "Centre de ressources",
    es: "Centro de recursos",
    ar: "Ù…Ø±ÙƒØ² Ø§Ù„Ù…ÙˆØ§Ø±Ø¯",
  },
  metaTitle: {
    en: “Canada Immigration Guide — Express Entry, PNP & Work Permits”,
    fr: "Guide d'immigration au Canada â€” Programmes, visas, travail",
    es: "GuÃ­a de inmigraciÃ³n a CanadÃ¡ â€” Programas, visas, trabajo",
    ar: "Ø¯Ù„ÙŠÙ„ Ø§Ù„Ù‡Ø¬Ø±Ø© Ø¥Ù„Ù‰ ÙƒÙ†Ø¯Ø§ â€” Ø§Ù„Ø¨Ø±Ø§Ù…Ø¬ ÙˆØ§Ù„ØªØ£Ø´ÙŠØ±Ø§Øª",
  },
  metaDesc: {
    en: "The complete guide to Canadian immigration: Express Entry, PNP, work permits, tourist visa, RCIC consultation and free profile evaluation. Updated 2026.",
    fr: "Le guide complet sur l'immigration au Canada. Express Entry, PCP, permis de travail, visa touristique, RCIC. Mis Ã  jour 2026.",
    es: "La guÃ­a completa sobre la inmigraciÃ³n a CanadÃ¡. Express Entry, PNP, permisos de trabajo. Actualizado 2026.",
    ar: "Ø§Ù„Ø¯Ù„ÙŠÙ„ Ø§Ù„ÙƒØ§Ù…Ù„ Ù„Ù„Ù‡Ø¬Ø±Ø© Ø¥Ù„Ù‰ ÙƒÙ†Ø¯Ø§. Express Entry ÙˆPNP ÙˆØªØµØ§Ø±ÙŠØ­ Ø§Ù„Ø¹Ù…Ù„ ÙˆØªØ£Ø´ÙŠØ±Ø© Ø§Ù„Ø³Ø§Ø¦Ø­. ØªØ­Ø¯ÙŠØ« 2026.",
  },
} as const;

function t(key: keyof typeof I18N, locale: string): string {
  const m = I18N[key] as Record<string, string>;
  return m[locale] ?? m.en;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = t("metaTitle", locale);
  const desc = t("metaDesc", locale);
  const url = `${BASE}/${locale}/guides/canada-immigration`;
  return {
    title,
    description: desc,
    alternates: generatePageAlternates(locale, "/guides/canada-immigration"),
    openGraph: { type: "article", url, title, description: desc, siteName: "IDLOGICE" },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

function LdScript({ data }: { data: object }) {
  const html = JSON.stringify(data);
  const props = { type: "application/ld+json", ...{ dangerouslySetInnerHTML: { __html: html } } };
  return <script {...props} />;
}

export default async function CanadaImmigrationHub({ params }: Props) {
  const { locale } = await params;
  const db = tryCreateServiceClient();
  const { data: posts } = db
    ? await db
        .from("blog_posts")
        .select("slug, title, excerpt, image_url, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
    : { data: [] };

  const allPosts = posts ?? [];
  const grouped = CLUSTERS.map((c) => ({
    ...c,
    posts: allPosts.filter((p) => c.slug_includes.some((needle) => p.slug.includes(needle))),
  }));

  const url = `${BASE}/${locale}/guides/canada-immigration`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t("heading", locale),
    description: t("lead", locale),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: locale === "fr" ? "fr-CA" : locale === "es" ? "es" : locale === "ar" ? "ar" : "en-CA",
    author: { "@type": "Organization", name: "IDLOGICE", url: BASE },
    publisher: {
      "@type": "Organization",
      name: "IDLOGICE",
      logo: { "@type": "ImageObject", url: `${BASE}/logo.png`, width: 200, height: 60 },
    },
  };
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: allPosts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE}/${locale}/blog/${p.slug}`,
      name: pick<string>(p.title, locale, p.slug),
    })),
  };

  return (
    <>
      <LdScript data={articleLd} />
      <LdScript data={itemListLd} />
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <header className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            {t("hubLabel", locale)}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
            {t("heading", locale)}
          </h1>
          <p className="text-gray-800 text-lg max-w-3xl mx-auto leading-relaxed">
            {t("lead", locale)}
          </p>
          <Link
            href={`/${locale}/book-consultation`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity"
          >
            {t("evalCta", locale)}
          </Link>
        </header>

        {grouped.map((c) => (
          <section key={c.id} className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {pick<string>(c.title, locale)}
            </h2>
            <p className="text-gray-800 mb-6 max-w-3xl">{pick<string>(c.intro, locale)}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {c.posts.map((p) => {
                const pTitle = pick<string>(p.title, locale, p.slug);
                const pExc = pick<string>(p.excerpt, locale, "");
                return (
                  <Link
                    key={p.slug}
                    href={`/${locale}/blog/${p.slug}`}
                    className="group block rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-colors bg-white"
                  >
                    {p.image_url && (
                      <div className="relative aspect-video w-full">
                        <Image
                          src={p.image_url}
                          alt={pTitle}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="(max-width:768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-sm font-bold text-gray-900 leading-snug mb-1.5 line-clamp-3">
                        {pTitle}
                      </p>
                      {pExc && <p className="text-xs text-gray-700 line-clamp-3">{pExc}</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}

