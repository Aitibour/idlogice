export const revalidate = 86400;
import { generatePageAlternates } from "@/lib/seo/alternates";

const WP_META: Record<string, { title: string; description: string }> = {
  en: { title: "Canada Work Permit — LMIA & Open Work Permits", description: "Get your Canadian work permit with expert RCIC consultants. LMIA applications, open work permits, and employer-specific permit guidance." },
  fr: { title: "Permis de travail Canada — EIMT & permis ouverts", description: "Obtenez votre permis de travail canadien avec des consultants RCIC experts. Demandes EIMT, permis ouverts et guidance spécifique à l'employeur." },
  es: { title: "Permiso de trabajo Canadá — LMIA y permisos abiertos", description: "Obtenga su permiso de trabajo canadiense con consultores RCIC expertos. Solicitudes LMIA, permisos abiertos y orientación específica por empleador." },
  ar: { title: "تصريح العمل الكندي — LMIA وتصاريح العمل المفتوحة", description: "احصل على تصريح العمل الكندي مع مستشاري RCIC الخبراء. طلبات LMIA وتصاريح العمل المفتوحة والتوجيه الخاص بصاحب العمل." },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const m = WP_META[locale] ?? WP_META.en;
  return {
    title: m.title,
    description: m.description,
    alternates: generatePageAlternates(locale, "/services/work-permit"),
    openGraph: { title: m.title, description: m.description, url: `https://idlogice.com/${locale}/services/work-permit` },
  };
}

import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { RequirementsSection } from "@/components/sections/requirements-section";
import { StepsSection } from "@/components/sections/steps-section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ServiceJsonLd } from "@/components/seo/structured-data";

export default async function WorkPermitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });

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
      <ServiceJsonLd
        name="Work Permit Canada"
        description="Apply for a Canadian work permit with certified RCIC guidance. LMIA-based, open work permits, intra-company transfers, and CUSMA pathways covered."
        url={`https://idlogice.com/${locale}/services/work-permit`}
      />
      <PageHero
        badge={t("workPermit.hero.badge")}
        title={t("workPermit.hero.title")}
        subtitle={t("workPermit.hero.subtitle")}
        cta={{ label: t("workPermit.hero.cta"), href: "/calculator" }}
        secondaryCta={{
          label: t("workPermit.hero.secondaryCta"),
          href: "/calculator",
        }}
        bgImage="/images/feature-consulting.jpg"
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
          href: "/calculator",
        }}
        secondaryCta={{
          label: t("workPermit.cta.secondary"),
          href: "/calculator",
        }}
      />
    </>
  );
}


