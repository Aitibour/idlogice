import type { Metadata } from "next";

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
import { NewsletterPopup } from "@/components/shared/newsletter-popup";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { GoogleAnalytics } from "@next/third-parties/google";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/structured-data";
import { StickyConsultCta } from "@/components/shared/sticky-consult-cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "en-CA": "/en",
        "fr-CA": "/fr",
        "es": "/es",
        "ar": "/ar",
        "x-default": "/en",
      },
    },
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
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <NewsletterPopup />
          <WhatsAppButton />
          <StickyConsultCta />
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId="G-PRM3TSY3FL" />
    </html>
  );
}
