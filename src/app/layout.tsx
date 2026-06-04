import type { Metadata } from "next";
import { geistSans } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const BASE = "https://idlogice.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "IDLOGICE — Canadian Immigration Consultants | Montréal",
    template: "%s | IDLOGICE",
  },
  description:
    "CICC-registered immigration consultants (RCICs) in Montréal. Expert guidance for Express Entry, PNP, work permits & family sponsorship. 95% success rate.",
  keywords: [
    "Canadian immigration consultant",
    "RCIC Montréal",
    "immigration consultant Montreal",
    "Express Entry Canada",
    "Provincial Nominee Program",
    "PNP Canada",
    "study permit Canada",
    "work permit Canada",
    "Canada permanent residence",
    "family sponsorship Canada",
    "CICC registered consultant",
    "Canada PR application",
    "CRS score calculator",
    "Canada visa consultant",
    "consultant en immigration Canada",
    "résidence permanente Canada",
    "permis d'études Canada",
    "permis de travail Canada",
  ],
  authors: [{ name: "IDLOGICE", url: BASE }],
  creator: "IDLOGICE",
  publisher: "IDLOGICE",
  category: "Immigration Services",
  openGraph: {
    type: "website",
    locale: "en_CA",
    alternateLocale: "fr_CA",
    url: BASE,
    siteName: "IDLOGICE",
    title: "IDLOGICE — Canadian Immigration Consultants | Montréal",
    description:
      "CICC-registered RCICs in Montréal. Expert guidance for Express Entry, PNP, work permits, study permits & family sponsorship. 95% success rate.",
    images: [
      {
        url: `${BASE}/images/cta-bg.jpg`,
        width: 1200,
        height: 630,
        alt: "IDLOGICE — Canadian Immigration Consultants Montréal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@idlogicecanada",
    creator: "@idlogicecanada",
    title: "IDLOGICE — Canadian Immigration Consultants | Montréal",
    description:
      "CICC-registered immigration consultants in Montréal. 95% success rate. Free profile evaluation.",
    images: [`${BASE}/images/cta-bg.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // To activate: paste each verification token via env vars.
    // Google:  https://search.google.com/search-console
    // Bing:    https://www.bing.com/webmasters
    // Yandex:  https://webmaster.yandex.com
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
      "yandex-verification": process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || "",
    },
  },
  alternates: {
    canonical: BASE,
    languages: {
      "en-CA": `${BASE}/en`,
      "fr-CA": `${BASE}/fr`,
      "es": `${BASE}/es`,
      "ar": `${BASE}/ar`,
      "x-default": `${BASE}/en`,
    },
  },
};

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE}#organization`,
      name: "IDLOGICE",
      url: BASE,
      logo: { "@type": "ImageObject", url: `${BASE}/logo.png`, width: 200, height: 60 },
      email: "contact@idlogice.com",
      telephone: "+1-581-634-0224",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-581-634-0224",
        contactType: "customer service",
        areaServed: "CA",
        availableLanguage: ["English", "French", "Spanish", "Arabic"],
      },
      knowsAbout: [
        "Canadian immigration",
        "Express Entry Canada",
        "Comprehensive Ranking System (CRS)",
        "Provincial Nominee Programs",
        "Canada work permits",
        "Canada study permits",
        "Family sponsorship Canada",
        "Francophone immigration to Canada",
      ],
      publishingPrinciples: `${BASE}/en/editorial-standards`,
      correctionsPolicy: `${BASE}/en/corrections-policy`,
      ethicsPolicy: `${BASE}/en/immigration-disclaimer`,
      subjectOf: [
        { "@type": "WebPage", name: "IDLOGICE Immigration Consultants", url: `${BASE}/en/team` },
        { "@type": "CollectionPage", name: "Official Canadian Immigration Resources", url: `${BASE}/en/official-resources` },
        { "@type": "FAQPage", name: "Canadian Immigration FAQ", url: `${BASE}/en/faq` },
      ],
      sameAs: [
        "https://www.linkedin.com/company/idlogice-immigration-canada",
        "https://www.tiktok.com/@idlogice.canada",
      ],
    },
    {
      "@type": "LocalBusiness",
      "@id": `${BASE}#organization`,
      name: "IDLOGICE — Canadian Immigration Consultants",
      image: `${BASE}/images/feature-consulting.jpg`,
      url: BASE,
      telephone: "+1-581-634-0224",
      email: "contact@idlogice.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "410 Saint-Catherine St",
        addressLocality: "Montreal",
        addressRegion: "QC",
        postalCode: "H3B 1A3",
        addressCountry: "CA",
      },
      geo: { "@type": "GeoCoordinates", latitude: 45.5017, longitude: -73.5673 },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      ],
      priceRange: "$$",
      description:
        "CICC-registered Canadian immigration consultants (RCICs) in Montréal. Expert guidance for Express Entry, PNP, study permits, work permits & family sponsorship.",
    },
  ],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const scriptProps = { type: "application/ld+json", __html: jsonLd };
  return (
    <html className={geistSans.variable} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="IDLOGICE LLM source map" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="IDLOGICE extended LLM source map" />
        <script type={scriptProps.type} {...{ dangerouslySetInnerHTML: { __html: scriptProps.__html } }} />
      </head>
      {children}
      <Analytics />
    </html>
  );
}
