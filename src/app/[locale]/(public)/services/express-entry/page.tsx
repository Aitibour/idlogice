import { useTranslations } from "next-intl";
import { PageHero } from "@/components/sections/page-hero";
import { RequirementsSection } from "@/components/sections/requirements-section";
import { StepsSection } from "@/components/sections/steps-section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function ExpressEntryPage() {
  const t = useTranslations("services");

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
      <PageHero
        badge={t("expressEntry.hero.badge")}
        title={t("expressEntry.hero.title")}
        subtitle={t("expressEntry.hero.subtitle")}
        cta={{ label: t("expressEntry.hero.cta"), href: "/calculator" }}
        secondaryCta={{
          label: t("expressEntry.hero.secondaryCta"),
          href: "/evaluation",
        }}
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
          href: "/evaluation",
        }}
      />
    </>
  );
}
