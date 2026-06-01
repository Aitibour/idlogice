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
      "from",
      "for",
      "in",
      "province",
      "draws",
      "news",
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
      "editorial-standards",
      "author",
    ];
    const nonLocaleRedirects = nonLocalePaths.map((p) => ({
      source: `/${p}`,
      destination: `/en/${p}`,
      permanent: true,
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
      permanent: true,
    }));

    return [
      // Canonical redirects
      { source: "/:locale/pricing", destination: "/:locale/book-consultation", permanent: true },
      { source: "/pricing", destination: "/en/book-consultation", permanent: true },
      // Renamed service pages — visitor-visa & super-visa → tourist-visa
      { source: "/:locale/services/visitor-visa", destination: "/:locale/services/tourist-visa", permanent: true },
      { source: "/services/visitor-visa", destination: "/en/services/tourist-visa", permanent: true },
      { source: "/:locale/services/super-visa", destination: "/:locale/services/tourist-visa", permanent: true },
      { source: "/services/super-visa", destination: "/en/services/tourist-visa", permanent: true },
      // /guides without slug → canonical guide
      { source: "/:locale/guides", destination: "/:locale/guides/canada-immigration", permanent: true },
      { source: "/guides", destination: "/en/guides/canada-immigration", permanent: true },
      { source: "/:locale/services/program", destination: "/:locale/programs", permanent: true },
      { source: "/:locale/services/programme", destination: "/:locale/programs", permanent: true },
      { source: "/services/program", destination: "/en/programs", permanent: true },
      { source: "/services/programme", destination: "/en/programs", permanent: true },
      // Catch-all /services/permit (typo in blog content → work-permit)
      { source: "/services/permit", destination: "/en/services/work-permit", permanent: true },
      { source: "/:locale/services/permit", destination: "/:locale/services/work-permit", permanent: true },
      // Catch-all bare /blog/:slug paths → /en/blog/:slug
      { source: "/blog/:slug", destination: "/en/blog/:slug", permanent: true },
      // Wildcard catch-all for deep non-locale paths (e.g. /from/morocco/express-entry → /en/from/...)
      { source: "/from/:path*", destination: "/en/from/:path*", permanent: true },
      { source: "/for/:path*", destination: "/en/for/:path*", permanent: true },
      { source: "/in/:path*", destination: "/en/in/:path*", permanent: true },
      { source: "/province/:path*", destination: "/en/province/:path*", permanent: true },
      { source: "/programs/:path*", destination: "/en/programs/:path*", permanent: true },
      { source: "/author/:path*", destination: "/en/author/:path*", permanent: true },
      // Non-locale path redirects
      ...nonLocaleRedirects,
      ...serviceRedirects,
    ];
  },
};

export default withNextIntl(nextConfig);
