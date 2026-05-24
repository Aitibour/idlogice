import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    // Non-locale routes found returning 403 in site audit — redirect to /en/*
    // (middleware handles locale detection for real users, but legacy links
    //  and crawlers may hit bare paths).
    const nonLocalePaths = [
      "book-consultation",
      "draws",
      "jobs",
      "calculator",
      "evaluation",
      "about",
      "contact",
      "blog",
      "programs",
      "services",
      "faq",
      "testimonials",
      "guides",
      "stats",
      "team",
    ];
    const nonLocaleRedirects = nonLocalePaths.map((p) => ({
      source: `/${p}`,
      destination: `/en/${p}`,
      permanent: false,
    }));

    // Service sub-pages without locale prefix
    const serviceSubPages = [
      "family-sponsorship",
      "express-entry",
      "study-permit",
      "work-permit",
      "pnp",
      "tourist-visa",
    ];
    const serviceRedirects = serviceSubPages.map((p) => ({
      source: `/services/${p}`,
      destination: `/en/services/${p}`,
      permanent: false,
    }));

    return [
      // Canonical redirects
      { source: "/:locale/pricing", destination: "/:locale/book-consultation", permanent: true },
      { source: "/pricing", destination: "/en/book-consultation", permanent: true },
      { source: "/:locale/services/program", destination: "/:locale/programs", permanent: true },
      { source: "/:locale/services/programme", destination: "/:locale/programs", permanent: true },
      { source: "/services/program", destination: "/en/programs", permanent: true },
      { source: "/services/programme", destination: "/en/programs", permanent: true },
      // Non-locale path redirects
      ...nonLocaleRedirects,
      ...serviceRedirects,
    ];
  },
};

export default withNextIntl(nextConfig);
