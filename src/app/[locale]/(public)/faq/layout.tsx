import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Canadian Immigration FAQ — Common Questions Answered",
    description: "Frequently asked questions about Canadian immigration. Expert answers on Express Entry, PNP, work permits, and family sponsorship.",
    alternates: generatePageAlternates(locale, "/faq"),
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
