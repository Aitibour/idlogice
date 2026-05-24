import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Sign In — IDLOGICE Immigration",
    description: "Sign in to your IDLOGICE account to manage your Canadian immigration journey.",
    alternates: generatePageAlternates(locale, "/login"),
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
