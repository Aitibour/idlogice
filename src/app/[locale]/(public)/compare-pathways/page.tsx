import type { Metadata } from "next";
import Link from "next/link";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { PageHero } from "@/components/sections/page-hero";

const BASE = "https://idlogice.com";

type Props = { params: Promise<{ locale: string }> };

const pathways = [
  {
    name: "Express Entry",
    bestFor: "Skilled workers with strong language scores, education, skilled work experience, and competitive CRS potential.",
    strengths: ["Fast federal PR pathway", "No job offer required for many candidates", "Strong fit for skilled professionals"],
    watchouts: ["CRS cutoffs change", "Proof of funds may apply", "Documents must be complete after ITA"],
    href: "/programs/express-entry",
  },
  {
    name: "Provincial Nominee Program (PNP)",
    bestFor: "Applicants with lower CRS scores, in-demand occupations, province ties, job offers, or targeted provincial fit.",
    strengths: ["Can add 600 CRS points", "Province-specific opportunities", "Helpful for targeted occupations"],
    watchouts: ["Streams open and close", "Criteria vary by province", "Some streams require job offers"],
    href: "/province",
  },
  {
    name: "Work Permit",
    bestFor: "Applicants with Canadian job offers, employer support, LMIA options, or LMIA-exempt pathways.",
    strengths: ["Can create Canadian work experience", "May support future PR", "Several LMIA-exempt options exist"],
    watchouts: ["Employer compliance matters", "LMIA may be required", "Temporary status is not PR"],
    href: "/services/work-permit",
  },
  {
    name: "Study Permit",
    bestFor: "Students planning Canadian education, PGWP-eligible programs, and future PR pathways.",
    strengths: ["Canadian credential", "Possible PGWP pathway", "Can support long-term PR strategy"],
    watchouts: ["Study plan must be credible", "Financial proof matters", "Not every program is PGWP-eligible"],
    href: "/services/study-permit",
  },
  {
    name: "Family Sponsorship",
    bestFor: "Eligible spouses, partners, parents, grandparents, and qualifying relatives with a Canadian sponsor.",
    strengths: ["Family reunification pathway", "Strong option when eligibility is met", "Inland and outland options may exist"],
    watchouts: ["Relationship evidence is critical", "Sponsor eligibility matters", "Processing and requirements vary"],
    href: "/services/family-sponsorship",
  },
];

const decisionRules = [
  "If your CRS score is strong, start with Express Entry.",
  "If your CRS is low, investigate PNP and French-language strategies.",
  "If you have a Canadian employer, compare LMIA and LMIA-exempt work permit options.",
  "If your long-term plan includes Canadian education, verify DLI and PGWP eligibility before applying.",
  "If you have a Canadian spouse, partner, parent, child, or eligible sponsor, review family sponsorship first.",
];

function jsonLd(data: object) {
  const props = { dangerouslySetInnerHTML: { __html: JSON.stringify(data) } };
  return <script type="application/ld+json" {...props} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = "Compare Canada Immigration Pathways | Express Entry vs PNP";
  const description = "Compare Express Entry, PNP, work permits, study permits, and family sponsorship to understand which Canadian immigration pathway may fit your profile.";

  return {
    title,
    description,
    alternates: generatePageAlternates(locale, "/compare-pathways"),
    openGraph: {
      type: "website",
      url: `${BASE}/${locale}/compare-pathways`,
      title,
      description,
      siteName: "IDLOGICE",
    },
  };
}

export default async function ComparePathwaysPage({ params }: Props) {
  const { locale } = await params;
  const url = `${BASE}/${locale}/compare-pathways`;
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Canada Immigration Pathway Comparison",
    description: "Comparison of major Canadian immigration pathways.",
    url,
    itemListElement: pathways.map((pathway, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: pathway.name,
      url: `${BASE}/${locale}${pathway.href}`,
      description: pathway.bestFor,
    })),
  };

  return (
    <>
      {jsonLd(itemListLd)}
      <PageHero
        title="Compare Canada Immigration Pathways"
        subtitle="Express Entry, PNP, work permits, study permits, and family sponsorship explained side by side."
      />
      <main className="container mx-auto max-w-6xl px-4 py-12">
        <section className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-xl font-bold text-foreground">Find the Pathway That Fits Your Profile</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            There is no single best immigration pathway for everyone. Your strongest option depends on your age, education, language results, work experience, job offer, province ties, family situation, and long-term plan.
          </p>
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-white">
          <div className="grid grid-cols-1 border-b border-border bg-gray-50 px-5 py-3 text-sm font-bold text-foreground md:grid-cols-[1fr_1.4fr_1fr]">
            <span>Pathway</span>
            <span>Best fit</span>
            <span>Next step</span>
          </div>
          {pathways.map((pathway) => (
            <article key={pathway.name} className="grid gap-4 border-b border-border px-5 py-6 last:border-b-0 md:grid-cols-[1fr_1.4fr_1fr]">
              <div>
                <h2 className="text-lg font-bold text-foreground">{pathway.name}</h2>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-primary">Compare option</p>
              </div>
              <div>
                <p className="text-sm leading-relaxed text-muted-foreground">{pathway.bestFor}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground">Strengths</p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {pathway.strengths.map((item) => <li key={item}>- {item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground">Watchouts</p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {pathway.watchouts.map((item) => <li key={item}>- {item}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <Link
                  href={`/${locale}${pathway.href}`}
                  className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-bold text-white hover:opacity-90"
                >
                  View guide
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-xl border border-border bg-white p-6">
            <h2 className="text-xl font-bold text-foreground">Quick Decision Rules</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {decisionRules.map((rule) => <li key={rule}>- {rule}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="text-xl font-bold text-foreground">Still Unsure?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Start with a free eligibility check or book a consultation so IDLOGICE can compare your options against your real profile.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`/${locale}/evaluation`} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:opacity-90">
                Free Eligibility Check
              </Link>
              <Link href={`/${locale}/book-consultation`} className="rounded-full border border-border bg-white px-5 py-2.5 text-sm font-bold text-foreground hover:border-primary hover:text-primary">
                Book Consultation
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
