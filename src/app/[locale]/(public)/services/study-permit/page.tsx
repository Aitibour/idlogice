import { useTranslations } from "next-intl";
import { PageHero } from "@/components/sections/page-hero";
import { RequirementsSection } from "@/components/sections/requirements-section";
import { StepsSection } from "@/components/sections/steps-section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function StudyPermitPage() {
  const t = useTranslations("services");

  const qualifications = t.raw(
    "studyPermit.requirements.qualifications",
  ) as string[];

  const facts = t.raw("studyPermit.requirements.facts") as Array<{
    label: string;
    value: string;
  }>;

  const steps = (
    t.raw("studyPermit.steps.items") as Array<{
      number: number;
      title: string;
      description: string;
    }>
  ).map((s) => ({ number: s.number, title: s.title, description: s.description }));

  const factItems = (
    t.raw("studyPermit.facts.items") as Array<{
      title: string;
      description: string;
    }>
  ).map((item) => ({ title: item.title, description: item.description }));

  return (
    <>
      <PageHero
        badge={t("studyPermit.hero.badge")}
        title={t("studyPermit.hero.title")}
        subtitle={t("studyPermit.hero.subtitle")}
        cta={{ label: t("studyPermit.hero.cta"), href: "/evaluation" }}
        secondaryCta={{
          label: t("studyPermit.hero.secondaryCta"),
          href: "/calculator",
        }}
      />

      <RequirementsSection
        title={t("studyPermit.requirements.title")}
        qualifications={qualifications}
        facts={facts}
      />

      <StepsSection
        title={t("studyPermit.steps.title")}
        steps={steps}
      />

      <FeatureGrid
        title={t("studyPermit.facts.title")}
        columns={3}
        items={factItems}
      />

      <CtaBanner
        title={t("studyPermit.cta.title")}
        subtitle={t("studyPermit.cta.subtitle")}
        primaryCta={{
          label: t("studyPermit.cta.primary"),
          href: "/evaluation",
        }}
        secondaryCta={{
          label: t("studyPermit.cta.secondary"),
          href: "/calculator",
        }}
      />
    </>
  );
}
