import { SITE_SOCIAL_IMAGE } from "@/lib/seo/social-image";
export const revalidate = 86400;
import { generatePageAlternates } from "@/lib/seo/alternates";

const PNP_META: Record<string, { title: string; description: string }> = {
  en: { title: "Provincial Nominee Program (PNP) Canada", description: "Get a provincial nomination and add 600 CRS points. CICC-registered consultants identify your best PNP stream and guide your application." },
  fr: { title: "Programme des candidats provinciaux (PCP) Canada", description: "Obtenez une nomination provinciale et ajoutez 600 points SCG. Nos consultants CICC identifient votre meilleur volet PCP et guident votre demande." },
  es: { title: "Programa de Candidatos Provinciales (PNP) Canadá", description: "Obtenga una nominación provincial y sume 600 puntos CRS. Consultores CICC identifican su mejor stream PNP y guían su solicitud." },
  ar: { title: "برنامج المرشحين الإقليميين (PNP) كندا", description: "احصل على ترشيح إقليمي وأضف 600 نقطة CRS. مستشارو CICC يحددون أفضل مسار PNP ويرشدون طلبك." },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const m = PNP_META[locale] ?? PNP_META.en;
  return {
    title: m.title,
    description: m.description,
    alternates: generatePageAlternates(locale, "/services/pnp"),
    openGraph: { images: [SITE_SOCIAL_IMAGE], title: m.title, description: m.description, url: `https://idlogice.com/${locale}/services/pnp` },
  };
}

import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { RequirementsSection } from "@/components/sections/requirements-section";
import { StepsSection } from "@/components/sections/steps-section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ServiceJsonLd } from "@/components/seo/structured-data";

export default async function PnpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });

  const qualifications = t.raw("pnp.requirements.qualifications") as string[];

  const facts = t.raw("pnp.requirements.facts") as Array<{
    label: string;
    value: string;
  }>;

  const steps = (
    t.raw("pnp.steps.items") as Array<{
      number: number;
      title: string;
      description: string;
    }>
  ).map((s) => ({ number: s.number, title: s.title, description: s.description }));

  const provinces = (
    t.raw("pnp.provinces.items") as Array<{
      title: string;
      description: string;
    }>
  ).map((item) => ({ title: item.title, description: item.description }));

  return (
    <>
      <ServiceJsonLd
        name="Provincial Nominee Program (PNP) Canada"
        description="Get nominated by a Canadian province and receive 600 additional CRS points. Our RCICs identify the best PNP stream for your profile across all provinces."
        url={`https://idlogice.com/${locale}/services/pnp`}
      />
      <PageHero
        badge={t("pnp.hero.badge")}
        title={t("pnp.hero.title")}
        subtitle={t("pnp.hero.subtitle")}
        cta={{ label: t("pnp.hero.cta"), href: "/calculator" }}
        secondaryCta={{ label: t("pnp.hero.secondaryCta"), href: "/calculator" }}
        bgImage="/images/feature-evaluation.jpg"
      />

      <RequirementsSection
        title={t("pnp.requirements.title")}
        qualifications={qualifications}
        facts={facts}
      />

      <StepsSection
        title={t("pnp.steps.title")}
        steps={steps}
      />

      <FeatureGrid
        title={t("pnp.provinces.title")}
        columns={3}
        items={provinces}
      />

      <CtaBanner
        title={t("pnp.cta.title")}
        subtitle={t("pnp.cta.subtitle")}
        primaryCta={{ label: t("pnp.cta.primary"), href: "/calculator" }}
        secondaryCta={{ label: t("pnp.cta.secondary"), href: "/calculator" }}
      />
    </>
  );
}



