export const revalidate = 86400;
import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: "About IDLOGICE — Canadian Immigration Consultants",
    description: "IDLOGICE — CICC-registered Canadian Immigration Consultants (RCICs) in Montréal. 95% success rate. Serving clients from 50+ countries.",
    alternates: generatePageAlternates(locale, "/about"),
    openGraph: { title: "About IDLOGICE — Canadian Immigration Consultants", description: "CICC-registered RCICs helping clients from 50+ countries achieve their Canadian dream.", url: `https://idlogice.com/${locale}/about` },
  };
}

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
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <ScrollReveal>
            <h2 className="text-xl font-bold mb-4" style={{ color: "#111827" }}>{t("mission.heading")}</h2>
            <p className="leading-relaxed text-base" style={{ color: "#374151" }}>
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


