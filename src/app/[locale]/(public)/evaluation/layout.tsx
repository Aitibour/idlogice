import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Free Immigration Profile Evaluation — IDLOGICE",
    description: "Get a free profile evaluation from CICC-registered consultants. Find your best Canadian immigration pathway.",
    alternates: generatePageAlternates(locale, "/evaluation"),
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
