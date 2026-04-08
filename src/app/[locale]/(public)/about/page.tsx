import { useTranslations } from "next-intl";
import { PageHero } from "@/components/sections/page-hero";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function AboutPage() {
  const t = useTranslations("about");

  const values = (
    t.raw("values.items") as Array<{ title: string; description: string }>
  ).map((item) => ({ title: item.title, description: item.description }));

  return (
    <>
      <PageHero
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        cta={{ label: t("hero.cta"), href: "/evaluation" }}
        secondaryCta={{ label: t("hero.secondaryCta"), href: "/calculator" }}
      />

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">{t("mission.heading")}</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {t("mission.body")}
          </p>
        </div>
      </section>

      <FeatureGrid title={t("values.title")} columns={3} items={values} />

      <CtaBanner
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
        primaryCta={{ label: t("cta.primary"), href: "/evaluation" }}
        secondaryCta={{ label: t("cta.secondary"), href: "/calculator" }}
      />
    </>
  );
}
