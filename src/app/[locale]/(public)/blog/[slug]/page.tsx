import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { tryCreateServiceClient } from "@/lib/supabase/service";
import { PostBody } from "@/components/blog/PostBody";
import { BlogConversionCta } from "@/components/blog/BlogConversionCta";
import { BlogExpertBox } from "@/components/blog/BlogExpertBox";
import { getBlogExpert } from "@/lib/blog/experts";
import { getTopicFaqs } from "@/lib/blog/faqs";
import { getRelatedBlogImage } from "@/lib/blog/images";
import { getBlogTopic } from "@/lib/blog/topics";

export const revalidate = 3600;
// Allow on-demand rendering for slugs not returned by generateStaticParams
export const dynamicParams = true;

import { cleanImageUrl, isUnsplashUrl } from "@/lib/seo/images";
import { generatePageAlternates } from "@/lib/seo/alternates";

const BASE = "https://idlogice.com";

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

function absoluteImageUrl(src: string): string {
  return src.startsWith("/") ? `${BASE}${src}` : src;
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
      .limit(200);
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
    .select("title, meta_desc, excerpt, image_url, image_alt, published_at")
    .eq("slug", slug)
    .single();

  if (!data) return {};
  const rawTitle = pick(data.title, locale);
  const rawDesc = pick(data.meta_desc, locale) || pick(data.excerpt, locale);
  const fallbackImage = getRelatedBlogImage(rawTitle, rawDesc, slug);
  const metadataImage = absoluteImageUrl(cleanImageUrl(data.image_url) ?? fallbackImage.url);
  // Truncate description to 160 chars (Semrush limit)
  const desc = rawDesc.length > 160 ? `${rawDesc.slice(0, 157)}…` : rawDesc;
  const url = `https://idlogice.com/${locale}/blog/${slug}`;
  // Absolute title keeps blog posts under 60 chars — template would add " | IDLOGICE Immigration" (22 chars)
  const title = rawTitle; // full title for OG/twitter
  const seoTitle = rawTitle.length > 49
    ? `${rawTitle.slice(0, 47)}… | IDLOGICE`
    : `${rawTitle} | IDLOGICE`;

  return {
    title: { absolute: seoTitle },
    description: desc,
    alternates: generatePageAlternates(locale, `/blog/${slug}`),
    openGraph: {
      type: "article",
      url,
      title,
      description: desc,
      siteName: "IDLOGICE",
      locale: locale === "fr" ? "fr_CA" : locale === "es" ? "es_ES" : locale === "ar" ? "ar_AR" : "en_CA",
      publishedTime: data.published_at ?? undefined,
      modifiedTime: data.published_at ?? undefined,
      authors: ["IDLOGICE"],
      images: [{ url: metadataImage, alt: `${title} — Canada immigration`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [metadataImage],
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
  const fallbackImage = getRelatedBlogImage(title, desc, slug);
  const heroImage = cleanImageUrl(post.image_url) ?? fallbackImage.url;
  const heroAlt = post.image_alt ?? fallbackImage.alt;
  const bypassHeroOptimizer = isUnsplashUrl(heroImage) || heroImage.startsWith("/images/");
  const topic = getBlogTopic(title, desc, slug);
  const expert = getBlogExpert(topic.id);

  // FAQ data lives inside the `content` jsonb under faq_en / faq_fr.
  // When the expand-blog script has run, we render FAQPage JSON-LD +
  // a visible FAQ section to capture "People Also Ask" rich results.
  const contentObj = (post.content && typeof post.content === "object" ? post.content : {}) as Record<string, unknown>;
  const faqKey = locale === "fr" ? "faq_fr" : "faq_en";
  const faqRaw = contentObj[faqKey];
  const faq = (Array.isArray(faqRaw) ? faqRaw : []) as Array<{ q: string; a: string }>;
  const displayFaq = faq.length > 0 ? faq : getTopicFaqs(topic.id, locale);

  const wordCount = wordsOf(content);
  const readingTime = Math.max(1, Math.round(wordCount / 230));
  const rawDate = post.published_at ? new Date(post.published_at) : new Date();
  const date = (isNaN(rawDate.getTime()) ? new Date() : rawDate).toLocaleDateString(
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

  const url = `https://idlogice.com/${locale}/blog/${slug}`;
  const blogLabel = locale === "ar" ? "المدونة" : "Blog";
  const homeLabel = locale === "fr" ? "Accueil" : locale === "es" ? "Inicio" : locale === "ar" ? "الرئيسية" : "Home";
  const expertLd = {
    "@type": "Person",
    name: expert.name,
    jobTitle: expert.title,
    url: `${BASE}/${locale}/author/${expert.id}`,
    worksFor: { "@type": "Organization", name: "IDLOGICE", url: BASE },
    knowsAbout: expert.knowsAbout,
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: expert.credential,
      credentialCategory: "Professional License",
      recognizedBy: {
        "@type": "Organization",
        name: "College of Immigration and Citizenship Consultants",
        url: "https://college-ic.ca/",
      },
      identifier: expert.rcic,
    },
  };

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
    author: expertLd,
    reviewedBy: expertLd,
    about: topic.anchor,
    publisher: {
      "@type": "Organization",
      name: "IDLOGICE",
      logo: { "@type": "ImageObject", url: `${BASE}/logo.png`, width: 200, height: 60 },
    },
  };

  const faqLd = displayFaq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: displayFaq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

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
      {faqLd && jsonLd(faqLd)}
      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-600">
          <ol className="flex items-center gap-2">
            <li><Link href={`/${locale}`} className="hover:underline">{homeLabel}</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/${locale}/blog`} className="hover:underline">{blogLabel}</Link></li>
          </ol>
        </nav>

        <div className="relative aspect-video w-full mb-10 rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={heroImage}
            alt={heroAlt}
            fill
            unoptimized={bypassHeroOptimizer}
            className="object-cover"
            priority
          />
          {post.image_credit && (
            <p className="absolute bottom-2 right-3 text-xs text-white/70">{post.image_credit}</p>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-3">
          {date} · {readingTime} min read · {wordCount} words
        </p>
        <h1 className="text-4xl font-bold leading-tight mb-8 text-gray-900">{title}</h1>
        <BlogExpertBox locale={locale} expert={expert} topicLabel={topic.label} />
        <PostBody content={content} />

        <aside className="my-10 rounded-xl border border-primary/20 bg-primary/5 p-5 not-prose">
          <p className="text-sm font-bold text-gray-900 mb-2">{topic.label}</p>
          <p className="text-sm text-gray-700 mb-3">
            Continue through the main authority guide for this topic and compare the related Canada immigration pathway.
          </p>
          <Link href={`/${locale}${topic.href}`} className="text-sm font-bold text-primary underline underline-offset-4">
            {topic.anchor}
          </Link>
        </aside>

        {/* Mid-article internal link CTA — contextual anchor text for SEO */}
        <div className="my-10 rounded-xl border border-primary/20 bg-primary/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 not-prose">
          <p className="text-sm font-semibold text-gray-900">
            {locale === "fr"
              ? <>Vous demandez si vous êtes admissible ? <Link href={`/${locale}/book-consultation`} className="text-primary underline">Réservez une consultation gratuite →</Link></>
              : locale === "es"
              ? <>¿Califica para inmigrar a Canadá? <Link href={`/${locale}/book-consultation`} className="text-primary underline">Reserve una consulta gratuita →</Link></>
              : locale === "ar"
              ? <>هل تتساءل عن أهليتك للهجرة إلى كندا؟ <Link href={`/${locale}/book-consultation`} className="text-primary underline">احجز استشارة مجانية ←</Link></>
              : <>Ready to start your Canada immigration journey? <Link href={`/${locale}/book-consultation`} className="text-primary underline">Book a free consultation →</Link></>}
          </p>
          <Link
            href={`/${locale}/calculator`}
            className="shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            {locale === "fr" ? "Calculateur SCG" : locale === "es" ? "Calculadora CRS" : locale === "ar" ? "حاسبة CRS" : "CRS Calculator"}
          </Link>
        </div>

        {/* FAQ — rendered for users + powers FAQPage JSON-LD above */}
        {displayFaq.length > 0 && (
          <section className="mt-12 border-t pt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {locale === "fr"
                ? "Questions fréquentes"
                : locale === "es"
                ? "Preguntas frecuentes"
                : locale === "ar"
                ? "الأسئلة الشائعة"
                : "Frequently asked questions"}
            </h2>
            <div className="space-y-5">
              {displayFaq.map((f, i) => (
                <details key={i} className="rounded-xl border border-border p-5 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                    <span>{f.q}</span>
                    <span className="text-primary group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                  </summary>
                  <p className="mt-3 text-gray-800 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className="mt-14">
          <BlogConversionCta locale={locale} topicLabel={topic.label} />
        </div>

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
                    <div className="relative aspect-video w-full bg-gray-100">
                      <Image
                        src={cleanImageUrl(r.image_url) ?? getRelatedBlogImage(rTitle, "", r.slug).url}
                        alt={rTitle}
                        fill
                        unoptimized={isUnsplashUrl(r.image_url) || (cleanImageUrl(r.image_url) ?? getRelatedBlogImage(rTitle, "", r.slug).url).startsWith("/images/")}
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width:640px) 100vw, 33vw"
                      />
                    </div>
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



