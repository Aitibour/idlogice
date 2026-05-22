"use client";

import dynamic from "next/dynamic";

const NewsletterPopup = dynamic(
  () => import("@/components/shared/newsletter-popup").then((mod) => mod.NewsletterPopup),
  { ssr: false },
);

const StickyConsultCta = dynamic(
  () => import("@/components/shared/sticky-consult-cta").then((mod) => mod.StickyConsultCta),
  { ssr: false },
);

const CookieConsent = dynamic(
  () => import("@/components/shared/cookie-consent").then((mod) => mod.CookieConsent),
  { ssr: false },
);

export function LazyEngagementWidgets() {
  return (
    <>
      <NewsletterPopup />
      <StickyConsultCta />
      <CookieConsent />
    </>
  );
}
