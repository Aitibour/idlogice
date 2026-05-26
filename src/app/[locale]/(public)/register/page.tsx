import { generatePageAlternates } from "@/lib/seo/alternates";

const REG_META: Record<string, { title: string; description: string }> = {
  en: { title: "Create Account — IDLOGICE Immigration", description: "Create your IDLOGICE account to track your Canadian immigration journey and book consultations." },
  fr: { title: "Créer un compte — IDLOGICE Immigration", description: "Créez votre compte IDLOGICE pour suivre votre parcours d'immigration canadienne et réserver des consultations." },
  es: { title: "Crear cuenta — IDLOGICE Inmigración", description: "Cree su cuenta de IDLOGICE para rastrear su proceso de inmigración canadiense y reservar consultas." },
  ar: { title: "إنشاء حساب — IDLOGICE", description: "أنشئ حسابك في IDLOGICE لتتبع رحلة الهجرة الكندية وحجز الاستشارات." },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const m = REG_META[locale] ?? REG_META.en;
  return {
    title: m.title,
    description: m.description,
    alternates: generatePageAlternates(locale, "/register"),
    robots: { index: false, follow: false },
  };
}

import { redirect } from "next/navigation";

export default async function RegisterRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { locale } = await params;
  const { next } = await searchParams;
  const paramsOut = new URLSearchParams({ mode: "signup" });
  if (next) paramsOut.set("next", next);
  redirect(`/${locale}/login?${paramsOut.toString()}`);
}
