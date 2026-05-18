import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/:locale/pricing", destination: "/:locale/book-consultation", permanent: true },
      { source: "/pricing", destination: "/book-consultation", permanent: true },
      { source: "/:locale/services/program", destination: "/:locale/programs", permanent: true },
      { source: "/:locale/services/programme", destination: "/:locale/programs", permanent: true },
      { source: "/services/program", destination: "/en/programs", permanent: true },
      { source: "/services/programme", destination: "/en/programs", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
