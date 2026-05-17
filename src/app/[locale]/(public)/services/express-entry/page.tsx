export const revalidate = 86400;
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Express Entry Canada â€” Federal Skilled Worker Program",
  description: "Apply to Canada through Express Entry. Our CICC-registered consultants help you optimise your CRS score and submit a winning application for Canadian permanent residence.",
  alternates: { canonical: "https://idlogice.com/services/express-entry" },
  openGraph: { title: "Express Entry Canada | IDLOGICE Immigration", description: "Fastest route to Canadian permanent residence. Expert CRS optimization by certified RCICs.", url: "https://idlogice.com/services/express-entry" },
};

import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { RequirementsSection } from "@/components/sections/requirements-section";
import { StepsSection } from "@/components/sections/steps-section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ServiceJsonLd } from "@/components/seo/structured-data";

export default async function ExpressEntryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });

  const qualifications = t.raw(
    "expressEntry.requirements.qualifications",
  ) as string[];

  const facts = t.raw("expressEntry.requirements.facts") as Array<{
    label: string;
    value: string;
  }>;

  const steps = (
    t.raw("expressEntry.steps.items") as Array<{
      number: number;
      title: string;
      description: string;
    }>
  ).map((s) => ({ number: s.number, title: s.title, description: s.description }));

  const streams = (
    t.raw("expressEntry.streams.items") as Array<{
      title: string;
      description: string;
    }>
  ).map((item) => ({ title: item.title, description: item.description }));

  return (
    <>
      <ServiceJsonLd
        name="Express Entry Canada"
        description="Apply to Canada through Express Entry. Our CICC-registered consultants help you optimise your CRS score and submit a winning application for Canadian permanent residence."
        url={`https://idlogice.com/${locale}/services/express-entry`}
      />
      <PageHero
        badge={t("expressEntry.hero.badge")}
        title={t("expressEntry.hero.title")}
        subtitle={t("expressEntry.hero.subtitle")}
        cta={{ label: t("expressEntry.hero.cta"), href: "/calculator" }}
        secondaryCta={{
          label: t("expressEntry.hero.secondaryCta"),
          href: "/book-consultation",
        }}
        bgImage="/images/feature-immigration.jpg"
      />

      <RequirementsSection
        title={t("expressEntry.requirements.title")}
        qualifications={qualifications}
        facts={facts}
      />

      <StepsSection
        title={t("expressEntry.steps.title")}
        subtitle={t("expressEntry.steps.subtitle")}
        steps={steps}
      />

      <FeatureGrid
        title={t("expressEntry.streams.title")}
        columns={3}
        items={streams}
      />

      <CtaBanner
        title={t("expressEntry.cta.title")}
        subtitle={t("expressEntry.cta.subtitle")}
        primaryCta={{
          label: t("expressEntry.cta.primary"),
          href: "/calculator",
        }}
        secondaryCta={{
          label: t("expressEntry.cta.secondary"),
          href: "/book-consultation",
        }}
      />
    </>
  );
}

