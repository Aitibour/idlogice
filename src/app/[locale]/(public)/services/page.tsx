import { useTranslations } from "next-intl";
import { PageHero } from "@/components/sections/page-hero";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function ServicesPage() {
  const t = useTranslations("services");

  const serviceItems = (
    t.raw("overview.grid.items") as Array<{ title: string; description: string }>
  ).map((item, i) => ({
    title: item.title,
    description: item.description,
    href: [
      "/services/express-entry",
      "/services/study-permit",
      "/services/work-permit",
      "/services/pnp",
    ][i],
  }));

  return (
    <>
      <PageHero
        title={t("overview.hero.title")}
        subtitle={t("overview.hero.subtitle")}
      />

      <FeatureGrid
        title={t("overview.grid.title")}
        columns={2}
        items={serviceItems}
      />

      <CtaBanner
        title={t("overview.cta.title")}
        subtitle={t("overview.cta.subtitle")}
        primaryCta={{ label: t("overview.cta.primary"), href: "/evaluation" }}
        secondaryCta={{ label: t("overview.cta.secondary"), href: "/calculator" }}
      />
    </>
  );
}
