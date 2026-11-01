import { SITE_SOCIAL_IMAGE } from "@/lib/seo/social-image";
import type { Metadata } from "next";
import Link from "next/link";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { PageHero } from "@/components/sections/page-hero";

const BASE = "https://idlogice.com";

type Props = { params: Promise<{ locale: string }> };

const disclaimers = [
  {
    title: "Educational Information Only",
    body: "Website articles, calculators, FAQs, guides, AI-assisted content, and general explanations on IDLOGICE are provided for educational purposes. They are not legal advice, immigration representation, or a substitute for a complete case review.",
  },
  {
    title: "No Approval Guarantees",
    body: "IDLOGICE does not guarantee approvals, invitations to apply, provincial nominations, visas, permits, permanent residence, citizenship outcomes, processing times, or immigration decisions. Final decisions are made by Canadian immigration authorities.",
  },
  {
    title: "Rules Can Change",
    body: "Canadian immigration rules, fees, forms, CRS cutoffs, draws, processing times, and provincial program criteria can change without notice. Always verify current requirements through official government sources before making decisions.",
  },
  {
    title: "Case-Specific Advice Requires Review",
    body: "Your options depend on your full personal profile, documents, history, admissibility, timing, and program requirements. For case-specific strategy, book a consultation with IDLOGICE or another licensed immigration professional.",
  },
  {
    title: "AI and Automated Tools",
    body: "Any AI assistant, calculator, eligibility tool, or automated content on IDLOGICE is intended to support understanding and preparation. Automated outputs may be incomplete or outdated and should be reviewed before being relied on.",
  },
  {
    title: "External Links",
    body: "IDLOGICE may link to official or third-party websites for convenience. We are not responsible for external website content, policy changes, or third-party interpretations.",
  },
];

function jsonLd(data: object) {
  const props = { dangerouslySetInnerHTML: { __html: JSON.stringify(data) } };
  return <script type="application/ld+json" {...props} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = "Immigration Disclaimer | IDLOGICE";
  const description = "Important disclaimer about IDLOGICE Canadian immigration content, educational information, legal advice limits, AI tools, and no approval guarantees.";

  return {
    title,
    description,
    alternates: generatePageAlternates(locale, "/immigration-disclaimer"),
    openGraph: {
      images: [SITE_SOCIAL_IMAGE],
      type: "website",
      url: `${BASE}/${locale}/immigration-disclaimer`,
      title,
      description,
      siteName: "IDLOGICE",
    },
  };
}

export default async function ImmigrationDisclaimerPage({ params }: Props) {
  const { locale } = await params;
  const url = `${BASE}/${locale}/immigration-disclaimer`;
  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Immigration Disclaimer",
    description: "Important disclaimer for IDLOGICE Canadian immigration educational content and tools.",
    url,
    publisher: { "@type": "Organization", name: "IDLOGICE", url: BASE },
    isPartOf: { "@type": "WebSite", name: "IDLOGICE", url: BASE },
  };

  return (
    <>
      {jsonLd(pageLd)}
      <PageHero
        title="Immigration Disclaimer"
        subtitle="Important limits on educational immigration content, AI tools, and case-specific advice."
      />
      <main className="container mx-auto max-w-4xl px-4 py-12">
        <p className="mb-8 text-sm font-medium text-foreground">Last updated: June 2026</p>

        <section className="rounded-xl border border-border bg-white p-6 text-muted-foreground leading-relaxed">
          <h2 className="text-xl font-bold text-foreground">Please Read Before Using IDLOGICE Content</h2>
          <p className="mt-3">
            IDLOGICE publishes Canadian immigration information to help users understand programs, requirements, and preparation steps. Immigration decisions are high-impact and depend on complete facts, current law, official instructions, and officer assessment.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          {disclaimers.map((item, index) => (
            <article key={item.title} className="rounded-xl border border-border bg-white p-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="text-lg font-bold text-foreground">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-xl font-bold text-foreground">Need Case-Specific Guidance?</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            If you are making an immigration decision, preparing an application, responding to a refusal, or dealing with a deadline, speak with IDLOGICE or another licensed immigration professional.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/${locale}/book-consultation`} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:opacity-90">
              Book Consultation
            </Link>
            <Link href={`/${locale}/editorial-standards`} className="rounded-full border border-border bg-white px-5 py-2.5 text-sm font-bold text-foreground hover:border-primary hover:text-primary">
              Editorial Standards
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
