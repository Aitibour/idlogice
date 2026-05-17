import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Canada Work Permit — LMIA  Open Work Permits",
  description: "Apply for a Canadian work permit with certified RCIC guidance. LMIA-based, open work permits, intra-company transfers, and CUSMA pathways covered.",
  alternates: { canonical: "https://idlogice.com/services/work-permit" },
  openGraph: { title: "Canada Work Permit | IDLOGICE Immigration", description: "Work legally in Canada. Expert RCIC guidance for LMIA, open work permits and employer-specific permits.", url: "https://idlogice.com/services/work-permit" },
};

import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { RequirementsSection } from "@/components/sections/requirements-section";
import { StepsSection } from "@/components/sections/steps-section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ServiceJsonLd } from "@/components/seo/structured-data";

export default async function WorkPermitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });

  const qualifications = t.raw(
    "workPermit.requirements.qualifications",
  ) as string[];

  const facts = t.raw("workPermit.requirements.facts") as Array<{
    label: string;
    value: string;
  }>;

  const steps = (
    t.raw("workPermit.steps.items") as Array<{
      number: number;
      title: string;
      description: string;
    }>
  ).map((s) => ({ number: s.number, title: s.title, description: s.description }));

  const permitTypes = (
    t.raw("workPermit.permitTypes.items") as Array<{
      title: string;
      description: string;
    }>
  ).map((item) => ({ title: item.title, description: item.description }));

  return (
    <>
      <ServiceJsonLd
        name="Work Permit Canada"
        description="Apply for a Canadian work permit with certified RCIC guidance. LMIA-based, open work permits, intra-company transfers, and CUSMA pathways covered."
        url={`https://idlogice.com/${locale}/services/work-permit`}
      />
      <PageHero
        badge={t("workPermit.hero.badge")}
        title={t("workPermit.hero.title")}
        subtitle={t("workPermit.hero.subtitle")}
        cta={{ label: t("workPermit.hero.cta"), href: "/book-consultation" }}
        secondaryCta={{
          label: t("workPermit.hero.secondaryCta"),
          href: "/calculator",
        }}
        bgImage="/images/feature-consulting.jpg"
      />

      <RequirementsSection
        title={t("workPermit.requirements.title")}
        qualifications={qualifications}
        facts={facts}
      />

      <StepsSection
        title={t("workPermit.steps.title")}
        steps={steps}
      />

      <FeatureGrid
        title={t("workPermit.permitTypes.title")}
        columns={3}
        items={permitTypes}
      />

      <CtaBanner
        title={t("workPermit.cta.title")}
        subtitle={t("workPermit.cta.subtitle")}
        primaryCta={{
          label: t("workPermit.cta.primary"),
          href: "/book-consultation",
        }}
        secondaryCta={{
          label: t("workPermit.cta.secondary"),
          href: "/calculator",
        }}
      />
    </>
  );
}
