export const revalidate = 86400;
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Provincial Nominee Program (PNP) Canada â€” 600 CRS Points",
  description: "Get nominated by a Canadian province and receive 600 additional CRS points. Our RCICs identify the best PNP stream for your profile across all provinces.",
  alternates: { canonical: "https://idlogice.com/services/pnp" },
  openGraph: { title: "Provincial Nominee Program Canada | IDLOGICE", description: "PNP nomination gives 600 CRS bonus points â€” near-guaranteed invitation. Find your best provincial stream.", url: "https://idlogice.com/services/pnp" },
};

import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { RequirementsSection } from "@/components/sections/requirements-section";
import { StepsSection } from "@/components/sections/steps-section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ServiceJsonLd } from "@/components/seo/structured-data";

export default async function PnpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });

  const qualifications = t.raw("pnp.requirements.qualifications") as string[];

  const facts = t.raw("pnp.requirements.facts") as Array<{
    label: string;
    value: string;
  }>;

  const steps = (
    t.raw("pnp.steps.items") as Array<{
      number: number;
      title: string;
      description: string;
    }>
  ).map((s) => ({ number: s.number, title: s.title, description: s.description }));

  const provinces = (
    t.raw("pnp.provinces.items") as Array<{
      title: string;
      description: string;
    }>
  ).map((item) => ({ title: item.title, description: item.description }));

  return (
    <>
      <ServiceJsonLd
        name="Provincial Nominee Program (PNP) Canada"
        description="Get nominated by a Canadian province and receive 600 additional CRS points. Our RCICs identify the best PNP stream for your profile across all provinces."
        url={`https://idlogice.com/${locale}/services/pnp`}
      />
      <PageHero
        badge={t("pnp.hero.badge")}
        title={t("pnp.hero.title")}
        subtitle={t("pnp.hero.subtitle")}
        cta={{ label: t("pnp.hero.cta"), href: "/evaluation" }}
        secondaryCta={{ label: t("pnp.hero.secondaryCta"), href: "/calculator" }}
        bgImage="/images/feature-evaluation.jpg"
      />

      <RequirementsSection
        title={t("pnp.requirements.title")}
        qualifications={qualifications}
        facts={facts}
      />

      <StepsSection
        title={t("pnp.steps.title")}
        steps={steps}
      />

      <FeatureGrid
        title={t("pnp.provinces.title")}
        columns={3}
        items={provinces}
      />

      <CtaBanner
        title={t("pnp.cta.title")}
        subtitle={t("pnp.cta.subtitle")}
        primaryCta={{ label: t("pnp.cta.primary"), href: "/evaluation" }}
        secondaryCta={{ label: t("pnp.cta.secondary"), href: "/calculator" }}
      />
    </>
  );
}

