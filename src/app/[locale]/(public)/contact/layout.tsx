import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";

type Props = { params: Promise<{ locale: string }> };

const META: Record<string, { title: string; description: string }> = {
  en: { title: "Contact Us", description: "Contact IDLOGICE immigration consultants in Montreal. Call, email or visit us — free consultations for Express Entry, work permits & more." },
  fr: { title: "Contactez-nous", description: "Contactez les consultants en immigration IDLOGICE à Montréal. Appelez, écrivez ou venez nous voir. Consultations gratuites disponibles." },
  es: { title: "Contáctenos", description: "Contacte a los consultores de inmigración de IDLOGICE en Montreal. Llame, escriba o visítenos. Consultas gratuitas disponibles." },
  ar: { title: "اتصل بنا", description: "تواصل مع مستشاري الهجرة في IDLOGICE في مونتريال. اتصل أو راسلنا أو زُر مكتبنا. استشارات مجانية متاحة." },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] ?? META.en;
  return {
    title: m.title,
    description: m.description,
    alternates: generatePageAlternates(locale, "/contact"),
    openGraph: { title: m.title, description: m.description, type: "website" },
  };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}