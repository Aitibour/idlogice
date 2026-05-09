import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — CICC-Registered Immigration Consultants",
  description: "Learn about IDLOGICE — a team of CICC-registered Canadian Immigration Consultants (RCICs) based in Montréal with a 95% success rate across 500+ cases from 50+ countries.",
  alternates: { canonical: "https://idlogice.com/about" },
  openGraph: { title: "About IDLOGICE — Canadian Immigration Consultants in Montréal", description: "CICC-registered RCICs helping clients from 50+ countries achieve their Canadian dream.", url: "https://idlogice.com/about" },
};

import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  const values = (
    t.raw("values.items") as Array<{ title: string; description: string }>
  ).map((item) => ({ title: item.title, description: item.description }));

  return (
    <>
      <PageHero
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        cta={{ label: t("hero.cta"), href: "/contact" }}
        secondaryCta={{ label: t("hero.secondaryCta"), href: "/services" }}
        bgImage="/images/feature-consulting.jpg"
      />

      {/* Mission */}
      <section className="py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <ScrollReveal>
            <h2 className="text-xl font-bold mb-3">{t("mission.heading")}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("mission.body")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <FeatureGrid title={t("values.title")} columns={3} items={values} />

      <CtaBanner
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
        primaryCta={{ label: t("cta.primary"), href: "/contact" }}
        secondaryCta={{ label: t("cta.secondary"), href: "/services" }}
      />
    </>
  );
}
