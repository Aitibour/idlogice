import { SITE_SOCIAL_IMAGE } from "@/lib/seo/social-image";
import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";

type Props = { params: Promise<{ locale: string }> };

const META: Record<string, { title: string; description: string }> = {
  en: { title: "CRS Score Calculator", description: "Calculate your Comprehensive Ranking System (CRS) score for Express Entry Canada. Free tool to estimate your profile points against recent draws." },
  fr: { title: "Calculateur de score CRS", description: "Calculez votre score du Système de classement global (SCG) pour l'Entrée express Canada. Outil gratuit pour estimer vos points." },
  es: { title: "Calculadora de puntuación CRS", description: "Calcule su puntaje del Sistema de Clasificación Integral (CRS) para Express Entry Canada. Herramienta gratuita para estimar sus puntos." },
  ar: { title: "حاسبة درجة CRS", description: "احسب درجة نظام التصنيف الشامل (CRS) الخاصة بك للدخول السريع إلى كندا. أداة مجانية لتقدير نقاط ملفك الشخصي." },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] ?? META.en;
  return {
    title: m.title,
    description: m.description,
    alternates: generatePageAlternates(locale, "/calculator"),
    openGraph: { images: [SITE_SOCIAL_IMAGE], title: m.title, description: m.description, type: "website" },
  };
}

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}