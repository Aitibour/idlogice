import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }, { locale: "es" }, { locale: "ar" }];
}
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { GoogleAnalytics } from "@next/third-parties/google";
import { WebsiteJsonLd } from "@/components/seo/structured-data";
import { LazyEngagementWidgets } from "@/components/shared/lazy-engagement-widgets";

// Layout-level metadata only sets alternates for the HOME page (path = "").
// Every other page sets its own alternates via generatePageAlternates(locale, "/path")
// in its own generateMetadata export. This avoids SSG builds producing wrong hreflang
// (headers() is unavailable at build time, causing all pages to point to the homepage).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // Locale home page — correct to point to /<locale>
  return {
    alternates: generatePageAlternates(locale, ""),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = ["ar", "fa", "he"].includes(locale) ? "rtl" : "ltr";

  return (
    <div
      lang={locale}
      dir={dir}
      className="min-h-screen flex flex-col antialiased"
      style={{ colorScheme: "light" }}
    >
      <WebsiteJsonLd />
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#ffffff", color: "#111111" }}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
          <LazyEngagementWidgets />
        </NextIntlClientProvider>
      </div>
      <GoogleAnalytics gaId="G-PRM3TSY3FL" />
    </div>
  );
}
