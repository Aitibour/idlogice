import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";

const TERMS_META: Record<string, { title: string; description: string }> = {
  en: { title: "Terms & Conditions — IDLOGICE Immigration", description: "Terms and conditions for using IDLOGICE immigration consulting services. Read our service agreement and user guidelines." },
  fr: { title: "Conditions générales — IDLOGICE Immigration", description: "Conditions générales d'utilisation des services de consultation en immigration d'IDLOGICE. Lisez notre accord de service." },
  es: { title: "Términos y Condiciones — IDLOGICE Inmigración", description: "Términos y condiciones para usar los servicios de consultoría de inmigración de IDLOGICE. Lea nuestro acuerdo de servicio." },
  ar: { title: "الشروط والأحكام — IDLOGICE", description: "شروط وأحكام استخدام خدمات استشارات الهجرة من IDLOGICE. اقرأ اتفاقية الخدمة وإرشادات المستخدم." },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const m = TERMS_META[locale] ?? TERMS_META.en;
  return {
    title: m.title,
    description: m.description,
    alternates: generatePageAlternates(locale, "/terms"),
  } satisfies Metadata;
}
import { PageHero } from "@/components/sections/page-hero";

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms of Service"
        subtitle="The rules and conditions governing your use of IDLOGICE."
      />
      <article className="container mx-auto px-4 py-12 max-w-3xl space-y-8 text-muted-foreground leading-relaxed">
        <p className="text-sm font-medium text-foreground">Last updated: April 2026</p>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">1. Agreement to Terms</h2>
          <p>
            By accessing or using the IDLOGICE website and platform (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree, do not use the Service. These Terms constitute a binding agreement between you and IDLOGICE Inc. (&ldquo;IDLOGICE&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), a corporation registered in Canada with offices at 410 Saint-Catherine Street, Montréal, Québec.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">2. Services Provided</h2>
          <p>
            IDLOGICE provides Canadian immigration consulting services through Regulated Canadian Immigration Consultants (RCICs) registered with the College of Immigration and Citizenship Consultants (CICC). Our platform also offers informational tools including Express Entry score calculators, draw trackers, and eligibility estimators for educational purposes.
          </p>
          <p>
            Immigration consulting services are provided under a separate Retainer Agreement signed with your assigned RCIC. These Terms govern your use of the website and digital platform; the Retainer Agreement governs the professional services relationship.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">3. Accounts</h2>
          <p>
            To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. You must be at least 18 years old to create an account. Notify us immediately at <a href="mailto:support@idlogice.com" className="text-primary underline">support@idlogice.com</a> if you suspect unauthorized access to your account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">4. Fees and Payments</h2>
          <p>
            Consulting fees are set out in your Retainer Agreement. Platform subscription fees, if applicable, are displayed at the time of purchase. All fees are in Canadian dollars unless stated otherwise. Payments are processed securely through our third-party payment provider. Fees are non-refundable except as provided in Section 5.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">5. Refund Policy</h2>
          <p>
            Consultation booking fees are refundable in full if cancelled at least 48 hours before the scheduled appointment. Cancellations within 48 hours forfeit the booking fee. Retainer fees are governed by the terms of your Retainer Agreement and applicable CICC regulations. Fees for completed work are non-refundable. To request a refund, contact <a href="mailto:support@idlogice.com" className="text-primary underline">support@idlogice.com</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">6. Immigration Disclaimer</h2>
          <div className="border-l-4 border-primary/40 pl-4 space-y-2">
            <p>
              Immigration law and policy change frequently. While our RCICs provide professional advice, IDLOGICE does not guarantee any specific immigration outcome. Eligibility tools and calculators on this platform provide estimates based on publicly available criteria and are for informational purposes only — they do not constitute legal advice.
            </p>
            <p>
              Only your assigned RCIC, acting under a signed Retainer Agreement, provides professional immigration advice governed by CICC regulations. For official immigration information, refer to <a href="https://www.canada.ca/en/immigration-refugees-citizenship.html" className="text-primary underline" target="_blank" rel="noopener noreferrer">Immigration, Refugees and Citizenship Canada (IRCC)</a>.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">7. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide false, misleading, or fraudulent information in connection with any immigration application or on this platform</li>
            <li>Use the Service for any unlawful purpose or in violation of any applicable law</li>
            <li>Attempt to gain unauthorized access to any part of the Service or its infrastructure</li>
            <li>Reproduce, copy, or resell any part of the Service without our express written permission</li>
            <li>Upload or transmit viruses, malware, or other harmful code</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">8. Intellectual Property</h2>
          <p>
            All content on the IDLOGICE platform — including text, graphics, logos, software, and tools — is owned by IDLOGICE Inc. or its licensors and is protected by Canadian copyright law. You may not reproduce or distribute any content without prior written consent, except for personal, non-commercial use.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, IDLOGICE and its directors, employees, RCICs, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service or any immigration outcome, even if we have been advised of the possibility of such damages. Our total liability to you for any claim arising from these Terms shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">10. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the Province of Québec and the federal laws of Canada applicable therein. Any disputes shall be resolved in the courts of Montréal, Québec, unless otherwise required by applicable consumer protection law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">11. Changes to These Terms</h2>
          <p>
            We may update these Terms at any time. We will provide at least 14 days&rsquo; notice of material changes by email or in-app notification. Continued use of the Service after the effective date of changes constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">12. Contact</h2>
          <address className="not-italic space-y-1">
            <p><strong className="text-foreground">IDLOGICE Inc.</strong></p>
            <p>410 Saint-Catherine Street, Montréal, Québec, Canada</p>
            <p>Email: <a href="mailto:support@idlogice.com" className="text-primary underline">support@idlogice.com</a></p>
            <p>Phone: <a href="tel:+15816340224" className="text-primary underline">+1 581-634-0224</a></p>
          </address>
        </section>
      </article>
    </>
  );
}
