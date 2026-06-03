export const revalidate = 86400;
import { generatePageAlternates } from "@/lib/seo/alternates";

const EE_META: Record<string, { title: string; description: string }> = {
  en: { title: "Express Entry Canada — Federal Skilled Worker", description: "Apply to Canada through Express Entry. CICC-registered consultants help optimise your CRS score and submit a winning permanent residence application." },
  fr: { title: "Entrée express Canada — Travailleur qualifié fédéral", description: "Immigrez au Canada via Entrée express. Nos consultants CICC optimisent votre score SCG et soumettent une demande de résidence permanente gagnante." },
  es: { title: "Express Entry Canadá — Trabajador Calificado Federal", description: "Inmigrade a Canadá por Express Entry. Consultores CICC optimizan su puntaje CRS y presentan una solicitud de residencia permanente ganadora." },
  ar: { title: "Express Entry كندا — برنامج العمال المهرة الفيدرالي", description: "قدّم إلى كندا عبر Express Entry. مستشارو CICC يحسّنون درجة CRS الخاصة بك ويقدمون طلب إقامة دائمة ناجحاً." },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const m = EE_META[locale] ?? EE_META.en;
  return {
    title: m.title,
    description: m.description,
    alternates: generatePageAlternates(locale, "/services/express-entry"),
    openGraph: { title: m.title, description: m.description, url: `https://idlogice.com/${locale}/services/express-entry` },
  };
}

import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { RequirementsSection } from "@/components/sections/requirements-section";
import { StepsSection } from "@/components/sections/steps-section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ServiceJsonLd } from "@/components/seo/structured-data";

export default async function ExpressEntryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });

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
      <ServiceJsonLd
        name="Express Entry Canada"
        description="Apply to Canada through Express Entry. Our CICC-registered consultants help you optimise your CRS score and submit a winning application for Canadian permanent residence."
        url={`https://idlogice.com/${locale}/services/express-entry`}
      />
      <PageHero
        badge={t("expressEntry.hero.badge")}
        title={t("expressEntry.hero.title")}
        subtitle={t("expressEntry.hero.subtitle")}
        cta={{ label: t("expressEntry.hero.cta"), href: "/calculator" }}
        secondaryCta={{
          label: t("expressEntry.hero.secondaryCta"),
          href: "/calculator",
        }}
        bgImage="/images/feature-immigration.jpg"
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
          href: "/book-consultation",
        }}
      />
    </>
  );
}


