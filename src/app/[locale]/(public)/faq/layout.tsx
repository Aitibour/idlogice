import { SITE_SOCIAL_IMAGE } from "@/lib/seo/social-image";
import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";

type Props = { params: Promise<{ locale: string }> };

const META: Record<string, { title: string; description: string }> = {
  en: { title: "FAQ — Canadian Immigration Questions", description: "Answers to frequently asked questions about Canadian immigration, Express Entry, work permits, study permits, and permanent residence." },
  fr: { title: "FAQ — Questions sur l'immigration canadienne", description: "Réponses aux questions fréquentes sur l'immigration canadienne, l'Entrée express, les permis de travail, d'études et la résidence permanente." },
  es: { title: "Preguntas frecuentes sobre inmigración canadiense", description: "Respuestas a preguntas frecuentes sobre inmigración canadiense, Express Entry, permisos de trabajo, estudio y residencia permanente." },
  ar: { title: "الأسئلة الشائعة — الهجرة الكندية", description: "إجابات على الأسئلة الشائعة حول الهجرة الكندية والدخول السريع وتصاريح العمل والدراسة والإقامة الدائمة." },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] ?? META.en;
  return {
    title: m.title,
    description: m.description,
    alternates: generatePageAlternates(locale, "/faq"),
    openGraph: { images: [SITE_SOCIAL_IMAGE], title: m.title, description: m.description, type: "website" },
  };
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}