import { PageHero } from "@/components/sections/page-hero";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your personal information."
      />
      <article className="container mx-auto px-4 py-12 max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-sm font-medium text-foreground">
          Last updated: April 2026
        </p>
        <p>
          <strong className="text-foreground">Placeholder — legal copy to be added before launch.</strong>{" "}
          This page will contain the full Privacy Policy for IDLOGICE in accordance
          with PIPEDA and applicable Canadian privacy law. It will describe what
          personal data we collect, why we collect it, how it is stored, who has
          access, and how you can exercise your rights (access, export, deletion).
        </p>
        <p>
          For questions about our privacy practices, contact us at{" "}
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
