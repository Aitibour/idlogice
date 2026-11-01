import { SITE_SOCIAL_IMAGE } from "@/lib/seo/social-image";
import type { Metadata } from "next";
import Link from "next/link";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { PageHero } from "@/components/sections/page-hero";

const BASE = "https://idlogice.com";

type Props = { params: Promise<{ locale: string }> };

const sections = [
  {
    title: "Purpose",
    body: "IDLOGICE publishes Canadian immigration content to help applicants, families, students, workers, employers, and newcomers understand immigration pathways in plain language. Our content is educational and practical, but it is not a substitute for case-specific legal advice or licensed representation.",
  },
  {
    title: "Research Standards",
    body: "Our immigration guides, news updates, and FAQs are written with reference to official Canadian government sources where appropriate, including IRCC, provincial immigration programs, and public regulatory information. When policy details, forms, fees, draws, or processing times may change, we encourage users to verify the latest information through official sources.",
  },
  {
    title: "Expert Review",
    body: "Because Canadian immigration is a high-impact topic, IDLOGICE content is reviewed for clarity, accuracy, practical usefulness, and compliance awareness. Blog posts and guides may include named reviewer signals and author pages to help readers understand the expertise behind the content.",
  },
  {
    title: "No Approval Guarantees",
    body: "IDLOGICE does not guarantee immigration approvals, invitations, permits, visas, nominations, or processing outcomes. Immigration decisions depend on the applicant's complete profile, documents, program criteria, officer assessment, and current government policy.",
  },
  {
    title: "AI-Assisted Content",
    body: "IDLOGICE may use AI tools to support drafting, outlining, translation, content organization, or research preparation. AI-assisted content is reviewed before publication and must follow our standards for accuracy, usefulness, and compliance. We do not publish unchecked AI-generated immigration advice.",
  },
  {
    title: "Updates and Corrections",
    body: "Immigration policies can change quickly. We update high-value content when new information affects users, especially Express Entry, PNP, work permit, study permit, processing-time, and IRCC news content. If you identify an error, contact us with the page URL and supporting information.",
  },
  {
    title: "Commercial Integrity",
    body: "Our content may link to IDLOGICE services such as consultations, eligibility reviews, or immigration support. Calls to action do not change our obligation to keep educational content realistic, transparent, and useful.",
  },
];

function jsonLd(data: object) {
  const props = { dangerouslySetInnerHTML: { __html: JSON.stringify(data) } };
  return <script type="application/ld+json" {...props} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = "Editorial Standards | IDLOGICE Immigration";
  const description = "How IDLOGICE researches, reviews, updates, and publishes Canadian immigration content with compliance, accuracy, and transparency.";

  return {
    title,
    description,
    alternates: generatePageAlternates(locale, "/editorial-standards"),
    openGraph: {
      images: [SITE_SOCIAL_IMAGE],
      type: "website",
      url: `${BASE}/${locale}/editorial-standards`,
      title,
      description,
      siteName: "IDLOGICE",
    },
  };
}

export default async function EditorialStandardsPage({ params }: Props) {
  const { locale } = await params;
  const url = `${BASE}/${locale}/editorial-standards`;
  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Editorial Standards",
    description: "IDLOGICE editorial standards for Canadian immigration content.",
    url,
    publisher: { "@type": "Organization", name: "IDLOGICE", url: BASE },
    about: [
      "Canadian immigration content",
      "Editorial standards",
      "Immigration compliance",
      "AI-assisted content review",
      "IRCC source verification",
    ],
  };

  return (
    <>
      {jsonLd(pageLd)}
      <PageHero
        title="Editorial Standards"
        subtitle="How IDLOGICE researches, reviews, updates, and publishes Canadian immigration content."
      />
      <main className="container mx-auto max-w-4xl px-4 py-12">
        <p className="mb-8 text-sm font-medium text-foreground">Last updated: June 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          {sections.map((section, index) => (
            <section key={section.title} className="rounded-xl border border-border bg-white p-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
              <p className="mt-3">{section.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-xl font-bold text-foreground">Contact for Corrections</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            To request a correction or flag an outdated immigration page, email{" "}
            <a href="mailto:contact@idlogice.com" className="text-primary underline underline-offset-4">
              contact@idlogice.com
            </a>{" "}
            with the page URL, the issue, and any supporting official source.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/${locale}/team`} className="rounded-full border border-border bg-white px-5 py-2.5 text-sm font-bold text-foreground hover:border-primary hover:text-primary">
              Meet Our Consultants
            </Link>
            <Link href={`/${locale}/blog`} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:opacity-90">
              Read Immigration Blog
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
