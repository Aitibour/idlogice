import { useTranslations } from "next-intl";
import { PageHero } from "@/components/sections/page-hero";
import { RequirementsSection } from "@/components/sections/requirements-section";
import { StepsSection } from "@/components/sections/steps-section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function PnpPage() {
  const t = useTranslations("services");

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
      <PageHero
        badge={t("pnp.hero.badge")}
        title={t("pnp.hero.title")}
        subtitle={t("pnp.hero.subtitle")}
        cta={{ label: t("pnp.hero.cta"), href: "/evaluation" }}
        secondaryCta={{ label: t("pnp.hero.secondaryCta"), href: "/calculator" }}
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
