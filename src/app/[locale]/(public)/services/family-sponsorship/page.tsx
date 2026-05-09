import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Family Sponsorship Canada — Reunite With Your Family",
  description: "Sponsor your spouse, children, parents or grandparents for Canadian permanent residence. Our certified RCICs handle the complete sponsorship application process.",
  alternates: { canonical: "https://idlogice.com/services/family-sponsorship" },
  openGraph: { title: "Family Sponsorship Canada | IDLOGICE Immigration", description: "Reunite with loved ones in Canada. Expert guidance for spousal, parental and family sponsorship applications.", url: "https://idlogice.com/services/family-sponsorship" },
};

import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { RequirementsSection } from "@/components/sections/requirements-section";
import { StepsSection } from "@/components/sections/steps-section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export default async function FamilySponsorshipPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });

  const qualifications = t.raw(
    "familySponsorship.requirements.qualifications",
  ) as string[];

  const facts = t.raw("familySponsorship.requirements.facts") as Array<{
    label: string;
    value: string;
  }>;

  const steps = (
    t.raw("familySponsorship.steps.items") as Array<{
      number: number;
      title: string;
      description: string;
    }>
  ).map((s) => ({ number: s.number, title: s.title, description: s.description }));

  const categories = (
    t.raw("familySponsorship.categories.items") as Array<{
      title: string;
      description: string;
    }>
  ).map((item) => ({ title: item.title, description: item.description }));

  return (
    <>
      <PageHero
        badge={t("familySponsorship.hero.badge")}
        title={t("familySponsorship.hero.title")}
        subtitle={t("familySponsorship.hero.subtitle")}
        cta={{ label: t("familySponsorship.hero.cta"), href: "/contact" }}
        secondaryCta={{
          label: t("familySponsorship.hero.secondaryCta"),
          href: "/contact",
        }}
        bgImage="/images/feature-family.jpg"
      />

      <RequirementsSection
        title={t("familySponsorship.requirements.title")}
        qualifications={qualifications}
        facts={facts}
      />

      <StepsSection
        title={t("familySponsorship.steps.title")}
        steps={steps}
      />

      <FeatureGrid
        title={t("familySponsorship.categories.title")}
        columns={3}
        items={categories}
      />

      <CtaBanner
        title={t("familySponsorship.cta.title")}
        subtitle={t("familySponsorship.cta.subtitle")}
        primaryCta={{
          label: t("familySponsorship.cta.primary"),
          href: "/contact",
        }}
        secondaryCta={{
          label: t("familySponsorship.cta.secondary"),
          href: "/contact",
        }}
      />
    </>
  );
}