import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, BookOpen, Calculator, FileQuestion, Newspaper, SearchCheck } from "lucide-react";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { PageHero } from "@/components/sections/page-hero";

const BASE = "https://idlogice.com";

type Props = { params: Promise<{ locale: string }> };

const tools = [
  {
    title: "CRS Calculator",
    description: "Estimate your Express Entry CRS score and understand the factors that may improve your ranking.",
    href: "/calculator",
    icon: Calculator,
    tag: "Express Entry",
  },
  {
    title: "Free Eligibility Check",
    description: "Start a profile review and identify which Canadian immigration pathways may fit your situation.",
    href: "/evaluation",
    icon: SearchCheck,
    tag: "Profile Review",
  },
  {
    title: "Express Entry Draw Tracker",
    description: "Follow recent Express Entry draws, CRS cutoffs, invitations, and draw patterns.",
    href: "/draws",
    icon: BarChart3,
    tag: "Fresh Data",
  },
  {
    title: "Immigration Glossary",
    description: "Understand key terms like CRS, PNP, NOC, TEER, LMIA, ITA, ECA, DLI, PGWP, TRV, and RCIC.",
    href: "/glossary",
    icon: BookOpen,
    tag: "Definitions",
  },
  {
    title: "Official Resources",
    description: "Find official IRCC, CICC, processing time, fee, Express Entry, work, study, and newcomer links.",
    href: "/official-resources",
    icon: FileQuestion,
    tag: "Verification",
  },
  {
    title: "Canada Immigration News",
    description: "Read fresh IRCC, PNP, Express Entry, work permit, and study permit updates from IDLOGICE.",
    href: "/news",
    icon: Newspaper,
    tag: "Updates",
  },
];

function jsonLd(data: object) {
  const props = { dangerouslySetInnerHTML: { __html: JSON.stringify(data) } };
  return <script type="application/ld+json" {...props} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = "Canada Immigration Tools | CRS Calculator, Draws, Evaluation";
  const description = "IDLOGICE immigration tools: CRS calculator, free eligibility check, Express Entry draw tracker, glossary, official resources, and immigration news.";

  return {
    title,
    description,
    alternates: generatePageAlternates(locale, "/tools"),
    openGraph: {
      type: "website",
      url: `${BASE}/${locale}/tools`,
      title,
      description,
      siteName: "IDLOGICE",
    },
  };
}

export default async function ToolsPage({ params }: Props) {
  const { locale } = await params;
  const url = `${BASE}/${locale}/tools`;
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Canada Immigration Tools",
    description: "IDLOGICE tools and resources for Canadian immigration planning.",
    url,
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${BASE}/${locale}${tool.href}`,
      name: tool.title,
      description: tool.description,
    })),
  };

  return (
    <>
      {jsonLd(itemListLd)}
      <PageHero
        title="Canada Immigration Tools"
        subtitle="Calculators, trackers, resources, and guides to help you plan your Canadian immigration pathway."
      />
      <main className="container mx-auto max-w-6xl px-4 py-12">
        <section className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-xl font-bold text-foreground">Plan With Better Information</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Use these IDLOGICE tools to estimate, compare, verify, and prepare. For case-specific advice, book a consultation with a licensed immigration professional.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={`/${locale}${tool.href}`}
                className="group rounded-xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                    {tool.tag}
                  </span>
                </div>
                <h2 className="mt-5 text-xl font-bold text-foreground group-hover:text-primary">{tool.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
                <span className="mt-5 inline-flex text-sm font-bold text-primary underline-offset-4 group-hover:underline">
                  Open tool
                </span>
              </Link>
            );
          })}
        </section>

        <section className="mt-8 rounded-xl border border-border bg-white p-6">
          <h2 className="text-xl font-bold text-foreground">Not Sure Where to Start?</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            If you are unsure whether Express Entry, PNP, work, study, family sponsorship, or another pathway fits your profile, start with the free eligibility check.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/${locale}/evaluation`} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:opacity-90">
              Start Free Evaluation
            </Link>
            <Link href={`/${locale}/book-consultation`} className="rounded-full border border-border px-5 py-2.5 text-sm font-bold text-foreground hover:border-primary hover:text-primary">
              Book Consultation
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
