import { PageHero } from "@/components/sections/page-hero";

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms of Service"
        subtitle="The rules and conditions governing your use of IDLOGICE."
      />
      <article className="container mx-auto px-4 py-12 max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-sm font-medium text-foreground">
          Last updated: April 2026
        </p>
        <p>
          <strong className="text-foreground">Placeholder — legal copy to be added before launch.</strong>{" "}
          This page will contain the full Terms of Service for IDLOGICE, including
          usage rules, account responsibilities, the immigration disclaimer, payment
          terms, refund policy, and limitation of liability.
        </p>
        <p className="border-l-4 border-destructive/50 pl-4 text-sm">
          <strong className="text-foreground">Important Disclaimer:</strong> IDLOGICE
          provides immigration information and tools for educational purposes only.
          We are not licensed immigration consultants or lawyers. Our tools provide
          estimates based on publicly available criteria. For official immigration
          advice, consult a Regulated Canadian Immigration Consultant (RCIC) or a
          licensed immigration lawyer.
        </p>
        <p>
          For questions, contact us at{" "}
          <a
            href="mailto:support@idlogice.com"
            className="text-primary underline"
          >
            support@idlogice.com
          </a>
          .
        </p>
      </article>
    </>
  );
}
