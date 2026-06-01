import type { Metadata } from "next";
import Link from "next/link";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { PageHero } from "@/components/sections/page-hero";

const BASE = "https://idlogice.com";

type Props = { params: Promise<{ locale: string }> };

const terms = [
  {
    term: "CRS",
    full: "Comprehensive Ranking System",
    definition: "The points system used to rank Express Entry candidates based on age, education, language ability, work experience, job offer, provincial nomination, and other factors.",
    link: "/calculator",
  },
  {
    term: "Express Entry",
    full: "Federal skilled immigration application system",
    definition: "Canada's online system for managing permanent residence applications from eligible skilled workers under programs such as Federal Skilled Worker, Canadian Experience Class, and Federal Skilled Trades.",
    link: "/programs/express-entry",
  },
  {
    term: "PNP",
    full: "Provincial Nominee Program",
    definition: "A pathway where Canadian provinces and territories nominate applicants who meet local labour market or settlement needs. Some nominations can add 600 CRS points.",
    link: "/province",
  },
  {
    term: "NOC",
    full: "National Occupational Classification",
    definition: "Canada's system for classifying occupations based on job duties, skill type, and responsibility level. NOC/TEER fit is important for many immigration programs.",
    link: "/for",
  },
  {
    term: "TEER",
    full: "Training, Education, Experience and Responsibilities",
    definition: "The NOC category structure used to classify jobs by the training, education, experience, and responsibilities usually required for the occupation.",
    link: "/for",
  },
  {
    term: "LMIA",
    full: "Labour Market Impact Assessment",
    definition: "A document an employer may need before hiring a foreign worker, showing that hiring the worker is expected to have a neutral or positive impact on Canada's labour market.",
    link: "/services/work-permit",
  },
  {
    term: "ITA",
    full: "Invitation to Apply",
    definition: "An invitation issued to selected Express Entry candidates, allowing them to submit a full permanent residence application within the required deadline.",
    link: "/programs/express-entry",
  },
  {
    term: "ECA",
    full: "Educational Credential Assessment",
    definition: "An assessment used to compare foreign education credentials to Canadian standards. It is commonly required for Express Entry applicants with foreign education.",
    link: "/services/pr-pathways",
  },
  {
    term: "DLI",
    full: "Designated Learning Institution",
    definition: "A Canadian school approved to host international students. Study permit applicants usually need an acceptance letter from a DLI.",
    link: "/services/study-permit",
  },
  {
    term: "PGWP",
    full: "Post-Graduation Work Permit",
    definition: "An open work permit that may be available to eligible graduates of qualifying Canadian programs and institutions.",
    link: "/services/study-permit",
  },
  {
    term: "TRV",
    full: "Temporary Resident Visa",
    definition: "A visa that allows eligible foreign nationals from visa-required countries to travel to Canada temporarily as visitors, students, or workers.",
    link: "/services/tourist-visa",
  },
  {
    term: "RCIC",
    full: "Regulated Canadian Immigration Consultant",
    definition: "A licensed immigration consultant regulated by the College of Immigration and Citizenship Consultants who can provide paid immigration advice and representation.",
    link: "/team",
  },
];

function jsonLd(data: object) {
  const props = { dangerouslySetInnerHTML: { __html: JSON.stringify(data) } };
  return <script type="application/ld+json" {...props} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = "Canadian Immigration Glossary | CRS, PNP, NOC, LMIA";
  const description = "Plain-language glossary of Canadian immigration terms including CRS, Express Entry, PNP, NOC, TEER, LMIA, ITA, ECA, DLI, PGWP, TRV, and RCIC.";

  return {
    title,
    description,
    alternates: generatePageAlternates(locale, "/glossary"),
    openGraph: {
      type: "website",
      url: `${BASE}/${locale}/glossary`,
      title,
      description,
      siteName: "IDLOGICE",
    },
  };
}

export default async function GlossaryPage({ params }: Props) {
  const { locale } = await params;
  const url = `${BASE}/${locale}/glossary`;
  const definedTermSetLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Canadian Immigration Glossary",
    description: "Plain-language definitions of common Canadian immigration terms.",
    url,
    publisher: { "@type": "Organization", name: "IDLOGICE", url: BASE },
    hasDefinedTerm: terms.map((item) => ({
      "@type": "DefinedTerm",
      name: item.term,
      alternateName: item.full,
      description: item.definition,
      inDefinedTermSet: url,
    })),
  };

  return (
    <>
      {jsonLd(definedTermSetLd)}
      <PageHero
        title="Canadian Immigration Glossary"
        subtitle="Plain-language definitions for the immigration terms applicants see most often."
      />
      <main className="container mx-auto max-w-5xl px-4 py-12">
        <section className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-xl font-bold text-foreground">Understand the Language Before You Apply</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Immigration forms, program pages, and news updates use technical terms. This glossary explains common Canadian immigration vocabulary and links each term to a related IDLOGICE guide or service page.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {terms.map((item) => (
            <article key={item.term} className="rounded-xl border border-border bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{item.term}</p>
              <h2 className="mt-2 text-xl font-bold text-foreground">{item.full}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.definition}</p>
              <Link
                href={`/${locale}${item.link}`}
                className="mt-4 inline-flex text-sm font-bold text-primary underline-offset-4 hover:underline"
              >
                Related IDLOGICE guide
              </Link>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-xl border border-border bg-white p-6">
          <h2 className="text-xl font-bold text-foreground">Need Help With Your Profile?</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Understanding the vocabulary is a first step. IDLOGICE can help you interpret how these terms apply to your immigration profile, documents, and pathway options.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/${locale}/evaluation`} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:opacity-90">
              Free Eligibility Check
            </Link>
            <Link href={`/${locale}/official-resources`} className="rounded-full border border-border px-5 py-2.5 text-sm font-bold text-foreground hover:border-primary hover:text-primary">
              Official Resources
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
