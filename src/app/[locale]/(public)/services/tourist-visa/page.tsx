export const revalidate = 86400;
import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";

const TRV_META: Record<string, { title: string; description: string }> = {
  en: { title: "Canada Tourist Visa (TRV) — Visitor Visa Application", description: "Maximise Canada tourist visa approval chances. CICC-registered consultants prepare your complete Temporary Resident Visa application." },
  fr: { title: "Visa touristique Canada (TRV) — Visa visiteur", description: "Maximisez vos chances d'approbation de visa touristique. Nos consultants CICC préparent votre demande de visa de résident temporaire." },
  es: { title: "Visa turista Canadá (TRV) — Solicitud de visa visitante", description: "Maximice las posibilidades de aprobación de su visa turista canadiense. Consultores CICC preparan su solicitud completa de visa de residente temporal." },
  ar: { title: "تأشيرة السياحة الكندية (TRV) — طلب تأشيرة زيارة", description: "زيادة فرص الموافقة على تأشيرة السياحة الكندية. مستشارو CICC يعدّون طلب الإقامة المؤقتة الخاص بك بالكامل." },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const m = TRV_META[locale] ?? TRV_META.en;
  return {
    title: m.title,
    description: m.description,
    alternates: generatePageAlternates(locale, "/services/tourist-visa"),
    openGraph: { title: m.title, description: m.description, url: `https://idlogice.com/${locale}/services/tourist-visa` },
  };
}

import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { RequirementsSection } from "@/components/sections/requirements-section";
import { StepsSection } from "@/components/sections/steps-section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ServiceJsonLd } from "@/components/seo/structured-data";

export default async function TouristVisaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });

  const qualifications = t.raw("touristVisa.requirements.qualifications") as string[];

  const facts = t.raw("touristVisa.requirements.facts") as Array<{
    label: string;
    value: string;
  }>;

  const steps = (
    t.raw("touristVisa.steps.items") as Array<{
      number: number;
      title: string;
      description: string;
    }>
  ).map((s) => ({ number: s.number, title: s.title, description: s.description }));

  const factItems = (
    t.raw("touristVisa.facts.items") as Array<{
      title: string;
      description: string;
    }>
  ).map((item) => ({ title: item.title, description: item.description }));

  return (
    <>
      <ServiceJsonLd
        name="Canada Tourist Visa (TRV)"
        description="Maximise your Canada tourist visa approval chances. Our CICC-registered consultants prepare a complete Temporary Resident Visa application with a compelling cover letter."
        url={`https://idlogice.com/${locale}/services/tourist-visa`}
      />
      <PageHero
        badge={t("touristVisa.hero.badge")}
        title={t("touristVisa.hero.title")}
        subtitle={t("touristVisa.hero.subtitle")}
        cta={{ label: t("touristVisa.hero.cta"), href: "/calculator" }}
        secondaryCta={{ label: t("touristVisa.hero.secondaryCta"), href: "/contact" }}
        bgImage="/images/feature-immigration.jpg"
      />

      <RequirementsSection
        title={t("touristVisa.requirements.title")}
        qualifications={qualifications}
        facts={facts}
      />

      <StepsSection
        title={t("touristVisa.steps.title")}
        steps={steps}
      />

      <FeatureGrid
        title={t("touristVisa.facts.title")}
        columns={3}
        items={factItems}
      />

      <CtaBanner
        title={t("touristVisa.cta.title")}
        subtitle={t("touristVisa.cta.subtitle")}
        primaryCta={{ label: t("touristVisa.cta.primary"), href: "/calculator" }}
        secondaryCta={{ label: t("touristVisa.cta.secondary"), href: "/contact" }}
      />
    </>
  );
}


