import type { Metadata } from "next";
import { headers } from "next/headers";
import { generatePageAlternates } from "@/lib/seo/alternates";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }, { locale: "es" }, { locale: "ar" }];
}
import { geistSans } from "@/lib/fonts";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { GoogleAnalytics } from "@next/third-parties/google";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/structured-data";
import { LazyEngagementWidgets } from "@/components/shared/lazy-engagement-widgets";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // Read the actual request pathname forwarded by middleware.
  // This allows the layout to emit correct per-page hreflang for EVERY route
  // (about, contact, blog posts…) without each page repeating the logic.
  const h = await headers();
  const pathname = h.get("x-pathname") ?? `/${locale}`;

  // Strip the locale prefix to get the locale-agnostic path segment.
  // e.g. "/en/blog/my-post" → "/blog/my-post", "/fr" → ""
  const path = pathname.replace(new RegExp(`^/(en|fr|es|ar)`), "") || "";

  return {
    alternates: generatePageAlternates(locale, path),
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
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} h-full antialiased`}
      style={{ colorScheme: "light" }}
    >
      <head>
        <meta name="color-scheme" content="light" />
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "#ffffff", color: "#111111" }}
      >
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
          <LazyEngagementWidgets />
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId="G-PRM3TSY3FL" />
    </html>
  );
}
