import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Free CRS Score Calculator — Canadian Immigration",
    description: "Calculate your Comprehensive Ranking System (CRS) score for Express Entry. Free tool by CICC-registered consultants.",
    alternates: generatePageAlternates(locale, "/calculator"),
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
