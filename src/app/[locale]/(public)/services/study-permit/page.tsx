export const revalidate = 86400;
import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";

const SP_META: Record<string, { title: string; description: string }> = {
  en: { title: "Canada Study Permit — Student Visa Application", description: "Get your Canadian study permit with CICC-registered consultants. Guidance through DLI selection, application, and PR pathway via PGWP." },
  fr: { title: "Permis d'études Canada — Visa étudiant", description: "Obtenez votre permis d'études canadien avec des consultants CICC. Guidage pour le choix DLI, la demande et la voie RP via PGWP." },
  es: { title: "Permiso de estudio Canadá — Visa de estudiante", description: "Obtenga su permiso de estudio canadiense con consultores CICC. Orientación para DLI, solicitud y vía a la residencia permanente via PGWP." },
  ar: { title: "تصريح الدراسة الكندي — طلب تأشيرة الطالب", description: "احصل على تصريح دراستك الكندي مع مستشاري CICC. توجيه في اختيار DLI والتقديم ومسار الإقامة الدائمة عبر PGWP." },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const m = SP_META[locale] ?? SP_META.en;
  return {
    title: m.title,
    description: m.description,
    alternates: generatePageAlternates(locale, "/services/study-permit"),
    openGraph: { title: m.title, description: m.description, url: `https://idlogice.com/${locale}/services/study-permit` },
  };
}

import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { RequirementsSection } from "@/components/sections/requirements-section";
import { StepsSection } from "@/components/sections/steps-section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ServiceJsonLd } from "@/components/seo/structured-data";

export default async function StudyPermitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });

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
      <ServiceJsonLd
        name="Canada Study Permit"
        description="Get your Canadian study permit with expert help from CICC-registered consultants. We guide you through DLI selection, application, and the path to permanent residence via PGWP."
        url={`https://idlogice.com/${locale}/services/study-permit`}
      />
      <PageHero
        badge={t("studyPermit.hero.badge")}
        title={t("studyPermit.hero.title")}
        subtitle={t("studyPermit.hero.subtitle")}
        cta={{ label: t("studyPermit.hero.cta"), href: "/calculator" }}
        secondaryCta={{
          label: t("studyPermit.hero.secondaryCta"),
          href: "/calculator",
        }}
        bgImage="/images/feature-language.jpg"
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
          href: "/calculator",
        }}
        secondaryCta={{
          label: t("studyPermit.cta.secondary"),
          href: "/calculator",
        }}
      />
    </>
  );
}


