import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Contact IDLOGICE — Canadian Immigration Consultants",
    description: "Contact our CICC-registered immigration consultants in Montréal. Free profile evaluation for Express Entry, PNP, and more.",
    alternates: generatePageAlternates(locale, "/contact"),
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
