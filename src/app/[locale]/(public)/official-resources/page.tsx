import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { PageHero } from "@/components/sections/page-hero";

const BASE = "https://idlogice.com";

type Props = { params: Promise<{ locale: string }> };

const resourceGroups = [
  {
    title: "Government of Canada",
    intro: "Primary federal sources for immigration programs, forms, fees, processing times, and application updates.",
    links: [
      { label: "Immigration, Refugees and Citizenship Canada (IRCC)", href: "https://www.canada.ca/en/immigration-refugees-citizenship.html" },
      { label: "IRCC application forms and guides", href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/application.html" },
      { label: "Check processing times", href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html" },
      { label: "Find application fees", href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/fees.html" },
    ],
  },
  {
    title: "Express Entry and PR",
    intro: "Official tools and program pages for permanent residence, Express Entry, CRS, and skilled worker pathways.",
    links: [
      { label: "Express Entry overview", href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html" },
      { label: "Comprehensive Ranking System (CRS)", href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/criteria-comprehensive-ranking-system/grid.html" },
      { label: "Proof of funds", href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/proof-funds.html" },
      { label: "Permanent residence programs", href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada.html" },
    ],
  },
  {
    title: "Work, Study, and Visit",
    intro: "Official sources for temporary residents, workers, international students, visitors, and family visits.",
    links: [
      { label: "Work in Canada", href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada.html" },
      { label: "Study in Canada", href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html" },
      { label: "Visit Canada", href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html" },
      { label: "Super visa", href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/parent-grandparent-super-visa.html" },
    ],
  },
  {
    title: "Professional Regulation",
    intro: "Sources for checking immigration consultant regulation and professional status.",
    links: [
      { label: "College of Immigration and Citizenship Consultants (CICC)", href: "https://college-ic.ca/" },
      { label: "Find an immigration consultant", href: "https://college-ic.ca/protecting-the-public/find-an-immigration-consultant" },
      { label: "Immigration representatives", href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigration-citizenship-representative.html" },
    ],
  },
  {
    title: "Settlement and Newcomers",
    intro: "Helpful official resources for preparing to live, work, study, and settle in Canada.",
    links: [
      { label: "Prepare for life in Canada", href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/prepare-life-canada.html" },
      { label: "Find free newcomer services", href: "https://ircc.canada.ca/english/newcomers/services/index.asp" },
      { label: "Learn about Canada", href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/learn-about-canada.html" },
    ],
  },
];

function jsonLd(data: object) {
  const props = { dangerouslySetInnerHTML: { __html: JSON.stringify(data) } };
  return <script type="application/ld+json" {...props} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = "Official Canadian Immigration Resources | IDLOGICE";
  const description = "Official IRCC, CICC, Express Entry, work permit, study permit, processing time, fee, and newcomer resources for Canadian immigration research.";

  return {
    title,
    description,
    alternates: generatePageAlternates(locale, "/official-resources"),
    openGraph: {
      type: "website",
      url: `${BASE}/${locale}/official-resources`,
      title,
      description,
      siteName: "IDLOGICE",
    },
  };
}

export default async function OfficialResourcesPage({ params }: Props) {
  const { locale } = await params;
  const url = `${BASE}/${locale}/official-resources`;
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Official Canadian Immigration Resources",
    description: "Official Canadian immigration resources curated by IDLOGICE.",
    url,
    publisher: { "@type": "Organization", name: "IDLOGICE", url: BASE },
    hasPart: resourceGroups.flatMap((group) =>
      group.links.map((link) => ({
        "@type": "WebPage",
        name: link.label,
        url: link.href,
      })),
    ),
  };

  return (
    <>
      {jsonLd(collectionLd)}
      <PageHero
        title="Official Canadian Immigration Resources"
        subtitle="Trusted government and regulatory sources for immigration research, verification, and planning."
      />
      <main className="container mx-auto max-w-5xl px-4 py-12">
        <section className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-xl font-bold text-foreground">Why This Page Exists</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Immigration policies, forms, fees, draws, and processing times can change. IDLOGICE uses official sources where appropriate and encourages users to verify important decisions directly with government and regulatory resources.
          </p>
        </section>

        <div className="grid gap-6">
          {resourceGroups.map((group) => (
            <section key={group.title} className="rounded-xl border border-border bg-white p-6">
              <h2 className="text-2xl font-bold text-foreground">{group.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{group.intro}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {group.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start justify-between gap-3 rounded-lg border border-border p-4 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-xl border border-border bg-white p-6">
          <h2 className="text-xl font-bold text-foreground">Need Help Interpreting Requirements?</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Official sources explain the rules. IDLOGICE can help you understand how those rules may apply to your profile and documents.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/${locale}/book-consultation`} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:opacity-90">
              Book Consultation
            </Link>
            <Link href={`/${locale}/immigration-disclaimer`} className="rounded-full border border-border px-5 py-2.5 text-sm font-bold text-foreground hover:border-primary hover:text-primary">
              Immigration Disclaimer
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
