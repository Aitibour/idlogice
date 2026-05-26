import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";

type Props = { params: Promise<{ locale: string }> };

const META: Record<string, { title: string; description: string }> = {
  en: { title: "Free Immigration Evaluation", description: "Get a free Canadian immigration profile evaluation from IDLOGICE. Find out which programs you qualify for — Express Entry, PNP, work permits & more." },
  fr: { title: "Évaluation d'immigration gratuite", description: "Obtenez une évaluation gratuite de votre profil d'immigration canadienne avec IDLOGICE. Découvrez les programmes auxquels vous êtes admissible." },
  es: { title: "Evaluación de inmigración gratuita", description: "Obtenga una evaluación gratuita de su perfil de inmigración canadiense con IDLOGICE. Descubra para qué programas califica." },
  ar: { title: "تقييم مجاني للهجرة", description: "احصل على تقييم مجاني لملف هجرتك الكندية مع IDLOGICE. اكتشف البرامج التي تستوفي شروطها." },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] ?? META.en;
  return {
    title: m.title,
    description: m.description,
    alternates: generatePageAlternates(locale, "/evaluation"),
    openGraph: { title: m.title, description: m.description, type: "website" },
  };
}

export default function EvaluationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}