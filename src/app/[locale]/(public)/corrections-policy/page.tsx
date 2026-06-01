import type { Metadata } from "next";
import Link from "next/link";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { PageHero } from "@/components/sections/page-hero";

const BASE = "https://idlogice.com";

type Props = { params: Promise<{ locale: string }> };

const steps = [
  {
    title: "Submit the issue",
    body: "Send us the page URL, the specific sentence or claim you believe is inaccurate or outdated, and any supporting official source or document.",
  },
  {
    title: "Editorial review",
    body: "Our team reviews the report against available source material, current public guidance, and the purpose of the page.",
  },
  {
    title: "Correction or update",
    body: "If a correction is needed, we update the page as soon as practical and prioritize immigration content that could affect user decisions.",
  },
  {
    title: "Clarification when needed",
    body: "If content is accurate but could be misunderstood, we may clarify wording, add context, or point readers to official sources.",
  },
];

function jsonLd(data: object) {
  const props = { dangerouslySetInnerHTML: { __html: JSON.stringify(data) } };
  return <script type="application/ld+json" {...props} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = "Corrections Policy | IDLOGICE Immigration";
  const description = "How IDLOGICE reviews, corrects, and updates Canadian immigration content when readers report errors or outdated information.";

  return {
    title,
    description,
    alternates: generatePageAlternates(locale, "/corrections-policy"),
    openGraph: {
      type: "website",
      url: `${BASE}/${locale}/corrections-policy`,
      title,
      description,
      siteName: "IDLOGICE",
    },
  };
}

export default async function CorrectionsPolicyPage({ params }: Props) {
  const { locale } = await params;
  const url = `${BASE}/${locale}/corrections-policy`;
  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Corrections Policy",
    description: "IDLOGICE corrections policy for Canadian immigration content.",
    url,
    publisher: { "@type": "Organization", name: "IDLOGICE", url: BASE },
    isPartOf: { "@type": "WebSite", name: "IDLOGICE", url: BASE },
  };

  return (
    <>
      {jsonLd(pageLd)}
      <PageHero
        title="Corrections Policy"
        subtitle="How IDLOGICE reviews and updates immigration content when readers report errors or outdated information."
      />
      <main className="container mx-auto max-w-4xl px-4 py-12">
        <p className="mb-8 text-sm font-medium text-foreground">Last updated: June 2026</p>

        <section className="rounded-xl border border-border bg-white p-6 text-muted-foreground leading-relaxed">
          <h2 className="text-xl font-bold text-foreground">Our Commitment</h2>
          <p className="mt-3">
            Canadian immigration rules, forms, fees, draws, processing times, and provincial program criteria can change quickly. IDLOGICE is committed to correcting material errors and updating high-impact immigration content when new information affects readers.
          </p>
          <p className="mt-3">
            Our content is educational and does not replace official IRCC guidance or case-specific advice from a licensed immigration professional.
          </p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-xl border border-border bg-white p-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                Step {index + 1}
              </p>
              <h2 className="text-lg font-bold text-foreground">{step.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-xl font-bold text-foreground">How to Request a Correction</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Email{" "}
            <a href="mailto:contact@idlogice.com" className="text-primary underline underline-offset-4">
              contact@idlogice.com
            </a>{" "}
            with the subject line <strong className="text-foreground">Correction Request</strong>. Include the page URL, the disputed text, why you believe it needs correction, and any supporting source.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            We prioritize reports involving eligibility, official requirements, deadlines, government fees, processing times, and application risks.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/${locale}/editorial-standards`} className="rounded-full border border-border bg-white px-5 py-2.5 text-sm font-bold text-foreground hover:border-primary hover:text-primary">
              Editorial Standards
            </Link>
            <Link href={`/${locale}/contact`} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:opacity-90">
              Contact IDLOGICE
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
