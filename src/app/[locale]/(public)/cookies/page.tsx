import { PageHero } from "@/components/sections/page-hero";

export default function CookiesPage() {
  return (
    <>
      <PageHero
        title="Cookie Policy"
        subtitle="How we use cookies and similar tracking technologies."
      />
      <article className="container mx-auto px-4 py-12 max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-sm font-medium text-foreground">
          Last updated: April 2026
        </p>
        <p>
          <strong className="text-foreground">Placeholder — legal copy to be added before launch.</strong>{" "}
          This page will describe the cookies IDLOGICE uses, their purpose
          (necessary, analytics, marketing), their duration, and how you can
          manage your preferences.
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
