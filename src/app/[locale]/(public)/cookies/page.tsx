import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";

const COOKIE_META: Record<string, { title: string; description: string }> = {
  en: { title: "Cookie Policy — IDLOGICE Immigration", description: "Cookie policy for IDLOGICE. Learn how we use cookies to improve your experience on our Canadian immigration platform." },
  fr: { title: "Politique de cookies — IDLOGICE Immigration", description: "Politique de cookies d'IDLOGICE. Découvrez comment nous utilisons les cookies pour améliorer votre expérience." },
  es: { title: "Política de cookies — IDLOGICE Inmigración", description: "Política de cookies de IDLOGICE. Conozca cómo usamos las cookies para mejorar su experiencia en nuestra plataforma." },
  ar: { title: "سياسة ملفات تعريف الارتباط — IDLOGICE", description: "سياسة ملفات تعريف الارتباط لـ IDLOGICE. تعرف على كيفية استخدامنا للكوكيز لتحسين تجربتك." },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const m = COOKIE_META[locale] ?? COOKIE_META.en;
  return {
    title: m.title,
    description: m.description,
    alternates: generatePageAlternates(locale, "/cookies"),
  } satisfies Metadata;
}
import { PageHero } from "@/components/sections/page-hero";

export default function CookiesPage() {
  return (
    <>
      <PageHero
        title="Cookie Policy"
        subtitle="How we use cookies and similar tracking technologies."
      />
      <article className="container mx-auto px-4 py-12 max-w-3xl space-y-8 text-muted-foreground leading-relaxed">
        <p className="text-sm font-medium text-foreground">Last updated: April 2026</p>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">1. What Are Cookies</h2>
          <p>
            Cookies are small text files placed on your device when you visit a website. They help the site remember your preferences, keep you logged in, and understand how you interact with content. We also use similar technologies such as local storage and session storage.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">2. Cookies We Use</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-foreground mb-1">Strictly Necessary</h3>
              <p>
                These cookies are required for the platform to function. They manage your session, maintain your login state, and protect against cross-site request forgery. You cannot opt out of these cookies while using the Service.
              </p>
              <p className="text-sm mt-1">Examples: <code className="text-xs bg-muted rounded px-1 py-0.5">session_token</code>, <code className="text-xs bg-muted rounded px-1 py-0.5">csrf_token</code>, <code className="text-xs bg-muted rounded px-1 py-0.5">locale</code></p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">Functional</h3>
              <p>
                These cookies remember your preferences such as language selection, theme, and form progress to improve your experience on return visits.
              </p>
              <p className="text-sm mt-1">Examples: <code className="text-xs bg-muted rounded px-1 py-0.5">preferred_lang</code>, <code className="text-xs bg-muted rounded px-1 py-0.5">theme</code></p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">Analytics</h3>
              <p>
                We use privacy-respecting analytics to understand how visitors use our platform — which pages are visited, how long sessions last, and where users encounter errors. This data is aggregated and cannot be used to identify you personally.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">Marketing</h3>
              <p>
                We do not use advertising cookies or share data with advertising networks. We do not sell your data to third parties.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">3. Cookie Duration</h2>
          <p>
            Session cookies expire when you close your browser. Persistent cookies remain on your device for a defined period: functional cookies last up to 12 months, analytics cookies up to 13 months. You can clear all cookies at any time through your browser settings.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">4. Managing Your Preferences</h2>
          <p>
            You can control cookies through your browser settings. Most browsers allow you to refuse new cookies, delete existing cookies, and set preferences per site. Disabling strictly necessary cookies will prevent you from logging in or using core features. For guidance on managing cookies in popular browsers:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li><a href="https://support.google.com/chrome/answer/95647" className="text-primary underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" className="text-primary underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/en-ca/guide/safari/sfri11471/mac" className="text-primary underline" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-primary underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">5. Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy when we add or remove cookies. The &ldquo;Last updated&rdquo; date at the top reflects the most recent revision.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">6. Contact</h2>
          <p>
            Questions about our use of cookies? Contact us at{" "}
            <a href="mailto:support@idlogice.com" className="text-primary underline">
              support@idlogice.com
            </a>
            .
          </p>
        </section>
      </article>
    </>
  );
}
