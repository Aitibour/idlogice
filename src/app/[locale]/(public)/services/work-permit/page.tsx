import { useTranslations } from "next-intl";
import { PageHero } from "@/components/sections/page-hero";
import { RequirementsSection } from "@/components/sections/requirements-section";
import { StepsSection } from "@/components/sections/steps-section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function WorkPermitPage() {
  const t = useTranslations("services");

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
      <PageHero
        badge={t("workPermit.hero.badge")}
        title={t("workPermit.hero.title")}
        subtitle={t("workPermit.hero.subtitle")}
        cta={{ label: t("workPermit.hero.cta"), href: "/evaluation" }}
        secondaryCta={{
          label: t("workPermit.hero.secondaryCta"),
          href: "/calculator",
        }}
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
          href: "/evaluation",
        }}
        secondaryCta={{
          label: t("workPermit.cta.secondary"),
          href: "/calculator",
        }}
      />
    </>
  );
}
