import { SITE_SOCIAL_IMAGE } from "@/lib/seo/social-image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_EXPERTS, getBlogExpertById } from "@/lib/blog/experts";
import { generatePageAlternates } from "@/lib/seo/alternates";

const BASE = "https://idlogice.com";

type Props = { params: Promise<{ locale: string; id: string }> };

function jsonLd(data: object) {
  const props = { dangerouslySetInnerHTML: { __html: JSON.stringify(data) } };
  return <script type="application/ld+json" {...props} />;
}

export function generateStaticParams() {
  return BLOG_EXPERTS.map((expert) => ({ id: expert.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const expert = getBlogExpertById(id);
  if (!expert) return {};

  const title = `${expert.name} | ${expert.title} at IDLOGICE`;
  const description = `${expert.name} reviews IDLOGICE Canada immigration content on ${expert.specialties.join(", ")}.`;

  return {
    title,
    description,
    alternates: generatePageAlternates(locale, `/author/${expert.id}`),
    openGraph: {
      images: [SITE_SOCIAL_IMAGE],
      type: "profile",
      url: `${BASE}/${locale}/author/${expert.id}`,
      title,
      description,
      siteName: "IDLOGICE",
      locale: locale === "fr" ? "fr_CA" : locale === "es" ? "es_ES" : locale === "ar" ? "ar_AR" : "en_CA",
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { locale, id } = await params;
  const expert = getBlogExpertById(id);
  if (!expert) notFound();

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: expert.name,
    jobTitle: expert.title,
    description: expert.bio,
    url: `${BASE}/${locale}/author/${expert.id}`,
    worksFor: { "@type": "Organization", name: "IDLOGICE", url: BASE },
    knowsLanguage: expert.languages,
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
    },
  };

  const labels = {
    reviewed: locale === "fr" ? "Contenu revu par" : locale === "es" ? "Contenido revisado por" : locale === "ar" ? "محتوى تمت مراجعته بواسطة" : "Content reviewed by",
    expertise: locale === "fr" ? "Expertise" : locale === "es" ? "Experiencia" : locale === "ar" ? "الخبرة" : "Expertise",
    languages: locale === "fr" ? "Langues" : locale === "es" ? "Idiomas" : locale === "ar" ? "اللغات" : "Languages",
    related: locale === "fr" ? "Guides lies" : locale === "es" ? "Guias relacionadas" : locale === "ar" ? "أدلة ذات صلة" : "Related guides",
    book: locale === "fr" ? "Reserver une consultation" : locale === "es" ? "Reservar consulta" : locale === "ar" ? "احجز استشارة" : "Book consultation",
    team: locale === "fr" ? "Voir toute l'equipe" : locale === "es" ? "Ver todo el equipo" : locale === "ar" ? "عرض الفريق" : "View full team",
  };

  return (
    <>
      {jsonLd(personLd)}
      <main className="bg-white">
        <section className="border-b border-gray-200">
          <div className="container mx-auto max-w-5xl px-4 py-16">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">{labels.reviewed}</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">{expert.name}</h1>
            <p className="mt-4 text-xl font-semibold text-gray-800">{expert.title}</p>
            <p className="mt-2 text-sm font-bold text-gray-700">{expert.credential}</p>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-700">{expert.bio}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/${locale}/book-consultation`} className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90">
                {labels.book}
              </Link>
              <Link href={`/${locale}/team`} className="rounded-full border border-gray-300 px-5 py-3 text-sm font-bold text-gray-900 transition-colors hover:border-primary hover:text-primary">
                {labels.team}
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold text-gray-950">{labels.expertise}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {expert.specialties.map((item) => (
                <span key={item} className="rounded-full border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-bold text-gray-800">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-950">{labels.languages}</h2>
            <p className="mt-5 text-gray-700">{expert.languages.join(", ")}</p>
          </div>
        </section>

        <section className="container mx-auto max-w-5xl px-4 pb-16">
          <h2 className="text-2xl font-bold text-gray-950">{labels.related}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {expert.knowsAbout.map((topic) => (
              <Link key={topic} href={`/${locale}/blog`} className="rounded-xl border border-gray-200 p-5 font-bold text-gray-900 transition-colors hover:border-primary hover:text-primary">
                {topic}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
