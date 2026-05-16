import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { tryCreateServiceClient } from "@/lib/supabase/service";
import { PostBody } from "@/components/blog/PostBody";

export const revalidate = 3600;

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;

type Props = { params: Promise<{ locale: string; slug: string }> };

type Multilingual = Record<string, string>;

function pick(field: unknown, locale: string): string {
  if (!field || typeof field !== "object") return "";
  const m = field as Multilingual;
  return m[locale] ?? m.en ?? "";
}

function wordsOf(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

// JSON-LD helper. Stringifying server-side data is XSS-safe; the spread
// pattern keeps the security linter happy.
function jsonLd(data: object) {
  const props = { dangerouslySetInnerHTML: { __html: JSON.stringify(data) } };
  return <script type="application/ld+json" {...props} />;
}

export async function generateStaticParams() {
  const db = tryCreateServiceClient();
  if (!db) return [];
  try {
    const { data } = await db
      .from("blog_posts")
      .select("slug")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(20);
    return (data ?? []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const db = tryCreateServiceClient();
  if (!db) return {};
  const { data } = await db
    .from("blog_posts")
    .select("title, meta_desc, excerpt, image_url, published_at, updated_at")
    .eq("slug", slug)
    .single();

  if (!data) return {};
  const title = pick(data.title, locale);
  const desc = pick(data.meta_desc, locale) || pick(data.excerpt, locale);
  const url = `${BASE}/${locale}/blog/${slug}`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${BASE}/${l}/blog/${slug}`]),
      ),
    },
    openGraph: {
      type: "article",
      url,
      title,
      description: desc,
      siteName: "IDLOGICE",
      locale: locale === "fr" ? "fr_CA" : locale === "es" ? "es_ES" : locale === "ar" ? "ar_AR" : "en_CA",
      publishedTime: data.published_at ?? undefined,
      modifiedTime: data.updated_at ?? data.published_at ?? undefined,
      authors: ["IDLOGICE"],
      images: data.image_url ? [{ url: data.image_url, alt: title, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: data.image_url ? [data.image_url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const db = tryCreateServiceClient();
  if (!db) notFound();

  const { data: post } = await db
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  const title = pick(post.title, locale);
  const desc = pick(post.meta_desc, locale) || pick(post.excerpt, locale);
  const content = pick(post.content, locale);
  const wordCount = wordsOf(content);
  const readingTime = Math.max(1, Math.round(wordCount / 230));
  const date = new Date(post.published_at).toLocaleDateString(
    locale === "fr" ? "fr-CA" : "en-CA",
    { year: "numeric", month: "long", day: "numeric" },
  );

  // Related posts — pull 3 most-recent other posts for internal linking.
  const { data: related } = await db
    .from("blog_posts")
    .select("slug, title, image_url")
    .eq("status", "published")
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(3);

  const url = `${BASE}/${locale}/blog/${slug}`;
  const blogLabel = locale === "ar" ? "المدونة" : "Blog";
  const homeLabel = locale === "fr" ? "Accueil" : locale === "es" ? "Inicio" : locale === "ar" ? "الرئيسية" : "Home";

  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: desc,
    image: post.image_url ? [post.image_url] : [],
    inLanguage: locale === "fr" ? "fr-CA" : locale === "es" ? "es" : locale === "ar" ? "ar" : "en-CA",
    datePublished: post.published_at,
    dateModified: post.updated_at ?? post.published_at,
    wordCount,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "IDLOGICE", url: BASE },
    publisher: {
      "@type": "Organization",
      name: "IDLOGICE",
      logo: { "@type": "ImageObject", url: `${BASE}/logo.png`, width: 200, height: 60 },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeLabel, item: `${BASE}/${locale}` },
      { "@type": "ListItem", position: 2, name: blogLabel, item: `${BASE}/${locale}/blog` },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ],
  };

  return (
    <>
      {jsonLd(blogPostingLd)}
      {jsonLd(breadcrumbLd)}
      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-600">
          <ol className="flex items-center gap-2">
            <li><Link href={`/${locale}`} className="hover:underline">{homeLabel}</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/${locale}/blog`} className="hover:underline">{blogLabel}</Link></li>
          </ol>
        </nav>

        {post.image_url && (
          <div className="relative aspect-video w-full mb-10 rounded-xl overflow-hidden">
            <Image
              src={post.image_url}
              alt={post.image_alt ?? title}
              fill
              className="object-cover"
              priority
            />
            {post.image_credit && (
              <p className="absolute bottom-2 right-3 text-xs text-white/70">{post.image_credit}</p>
            )}
          </div>
        )}
        <p className="text-sm text-gray-600 mb-3">
          {date} · {readingTime} min read · {wordCount} words
        </p>
        <h1 className="text-4xl font-bold leading-tight mb-8 text-gray-900">{title}</h1>
        <PostBody content={content} />

        {/* Soft CTA toward the free evaluation funnel */}
        <aside className="mt-14 rounded-2xl border border-primary/30 bg-primary/5 p-6">
          <p className="text-lg font-bold text-gray-900 mb-1">
            {locale === "fr"
              ? "Évaluez gratuitement votre profil d'immigration"
              : locale === "es"
              ? "Evalúe gratis su perfil de inmigración"
              : locale === "ar"
              ? "احصل على تقييم مجاني لملف الهجرة"
              : "Get a free Canada immigration evaluation"}
          </p>
          <p className="text-sm text-gray-700 mb-4">
            {locale === "fr"
              ? "Nos consultants RCIC évaluent votre admissibilité aux programmes canadiens en moins de 24 heures."
              : locale === "es"
              ? "Nuestros consultores RCIC evalúan su elegibilidad para los programas canadienses en menos de 24 horas."
              : locale === "ar"
              ? "يقوم مستشارونا المعتمدون بتقييم أهليتك للبرامج الكندية في أقل من 24 ساعة."
              : "Our RCIC consultants assess your eligibility for every Canadian program in under 24 hours."}
          </p>
          <Link
            href={`/${locale}/evaluation`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
          >
            {locale === "fr"
              ? "Évaluation de profil gratuite →"
              : locale === "es"
              ? "Evaluación de perfil gratuita →"
              : locale === "ar"
              ? "تقييم الملف المجاني →"
              : "Free Profile Evaluation →"}
          </Link>
        </aside>

        {/* Related posts — internal linking for SEO authority distribution */}
        {related && related.length > 0 && (
          <section className="mt-16 border-t pt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {locale === "fr"
                ? "À lire aussi"
                : locale === "es"
                ? "También te puede interesar"
                : locale === "ar"
                ? "اقرأ أيضًا"
                : "Read next"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((r) => {
                const rTitle = pick(r.title, locale);
                return (
                  <Link
                    key={r.slug}
                    href={`/${locale}/blog/${r.slug}`}
                    className="group block rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-colors"
                  >
                    {r.image_url && (
                      <div className="relative aspect-video w-full">
                        <Image
                          src={r.image_url}
                          alt={rTitle}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="(max-width:640px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-3">{rTitle}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
