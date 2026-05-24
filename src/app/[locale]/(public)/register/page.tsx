import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: "Create Account — IDLOGICE Immigration",
    description: "Create your IDLOGICE account to track your Canadian immigration journey and book consultations.",
    alternates: generatePageAlternates(locale, "/register"),
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
  const nextParam = next ? `?next=${encodeURIComponent(next)}` : "";
  redirect(`/${locale}/login${nextParam}`);
}
