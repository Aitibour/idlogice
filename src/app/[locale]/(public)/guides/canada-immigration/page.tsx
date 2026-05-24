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
    title: { en: "Canada Immigration Programs", fr: "Programmes d'immigration au Canada", es: "Programas de inmigración a Canadá", ar: "برامج الهجرة إلى كندا" },
    intro: { en: "Permanent residence pathways for skilled workers, families and students — from Express Entry to provincial nomination and family sponsorship.", fr: "Voies de résidence permanente pour travailleurs qualifiés, familles et étudiants — d'Entrée express au PCP et au parrainage familial.", es: "Vías de residencia permanente: Express Entry, PNP y patrocinio familiar.", ar: "مسارات الإقامة الدائمة للعمال المهرة والعائلات والطلاب." },
  },
  {
    id: "work",
    slug_includes: ["work-in-canada"],
    title: { en: "Work in Canada", fr: "Travailler au Canada", es: "Trabajar en Canadá", ar: "العمل في كندا" },
    intro: { en: "Open and employer-specific work permits, LMIA-exempt pathways, in-demand occupations, and the best provinces for newcomers.", fr: "Permis de travail ouverts et liés à un employeur, voies sans EIMT, professions en demande.", es: "Permisos de trabajo abiertos y específicos, vías exentas de LMIA, ocupaciones en demanda.", ar: "تصاريح العمل المفتوحة والمحددة، والمسارات المعفاة من LMIA، والمهن المطلوبة." },
  },
  {
    id: "tourist",
    slug_includes: ["tourist-visa", "super-visa"],
    title: { en: "Canada Tourist Visa & Super Visa", fr: "Visa touriste et Super Visa Canada", es: "Visa de turista y Super Visa", ar: "تأشيرة السائح والتأشيرة الممتازة" },
    intro: { en: "Step-by-step guides to securing a TRV, reapplying after refusal, and using the Super Visa for parents and grandparents.", fr: "Guides étape par étape pour obtenir un visa de résident temporaire et utiliser le Super Visa.", es: "Guías paso a paso para obtener una visa de residente temporal y utilizar la Super Visa.", ar: "أدلة خطوة بخطوة للحصول على تأشيرة الإقامة المؤقتة." },
  },
  {
    id: "consultation",
    slug_includes: ["consultation", "rcic-vs-lawyer"],
    title: { en: "Canada Immigration Consultation", fr: "Consultation en immigration", es: "Consulta de inmigración", ar: "استشارة الهجرة الكندية" },
    intro: { en: "Why a licensed RCIC matters, how a Canadian immigration lawyer differs, and what to expect during your first consultation.", fr: "Pourquoi un RCIC agréé est important et à quoi s'attendre lors de votre première consultation.", es: "Por qué importa un RCIC con licencia y qué esperar en su primera consulta.", ar: "أهمية مستشار RCIC مرخص وما يمكن توقعه في الاستشارة الأولى." },
  },
  {
    id: "evaluation",
    slug_includes: ["evaluation", "crs"],
    title: { en: "Free Canada Immigration Evaluation", fr: "Évaluation gratuite d'immigration", es: "Evaluación gratuita de inmigración", ar: "تقييم مجاني للهجرة" },
    intro: { en: "Tools to know if you qualify for Express Entry, PNP, or another pathway — including our CRS calculator and profile evaluation.", fr: "Outils gratuits pour savoir si vous êtes admissible à Entrée express, à un PCP ou à une autre voie.", es: "Herramientas gratuitas para saber si calificas para Express Entry, PNP u otra vía.", ar: "أدوات مجانية لمعرفة ما إذا كنت مؤهلاً." },
  },
];

const I18N = {
  heading: {
    en: "Canada Immigration: The Complete 2026 Guide",
    fr: "Immigration au Canada : Le guide complet 2026",
    es: "Inmigración a Canadá: La guía completa 2026",
    ar: "الهجرة إلى كندا: الدليل الكامل 2026",
  },
  lead: {
    en: "Whether you're applying for permanent residence, planning a work or study term, organising a family visit, or simply trying to figure out where to start — this hub gathers every guide we publish on Canadian immigration.",
    fr: "Que vous demandiez la résidence permanente, planifiiez un séjour de travail ou d'études, ou cherchiez simplement par où commencer — ce centre rassemble tous nos guides.",
    es: "Ya sea que esté solicitando la residencia permanente o planeando un período de trabajo — este centro reúne todas las guías que publicamos.",
    ar: "سواء كنت تتقدم بطلب للإقامة الدائمة أو تخطط لفترة عمل أو دراسة — يجمع هذا المركز كل أدلتنا.",
  },
  evalCta: {
    en: "Free Profile Evaluation →",
    fr: "Évaluation de profil gratuite →",
    es: "Evaluación de perfil gratuita →",
    ar: "تقييم الملف المجاني →",
  },
  hubLabel: {
    en: "Resource hub",
    fr: "Centre de ressources",
    es: "Centro de recursos",
    ar: "مركز الموارد",
  },
  metaTitle: {
    en: "Canada Immigration: Express Entry, PNP & Work Permits",
    fr: "Guide d'immigration au Canada — Programmes, visas, travail",
    es: "Guía de inmigración a Canadá — Programas, visas, trabajo",
    ar: "دليل الهجرة إلى كندا — البرامج والتأشيرات",
  },
  metaDesc: {
    en: "The complete guide to Canadian immigration: Express Entry, PNP, work permits, tourist visa, RCIC consultation and free profile evaluation. Updated 2026.",
    fr: "Le guide complet sur l'immigration au Canada. Express Entry, PCP, permis de travail, visa touristique, RCIC. Mis à jour 2026.",
    es: "La guía completa sobre la inmigración a Canadá. Express Entry, PNP, permisos de trabajo. Actualizado 2026.",
    ar: "الدليل الكامل للهجرة إلى كندا. Express Entry وPNP وتصاريح العمل وتأشيرة السائح. تحديث 2026.",
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

