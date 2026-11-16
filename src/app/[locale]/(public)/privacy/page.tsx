import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { generatePageAlternates } from "@/lib/seo/alternates";

const PRIVACY_META: Record<string, { title: string; description: string }> = {
  en: { title: "Privacy Policy — IDLOGICE Immigration", description: "Privacy policy for IDLOGICE. Learn how we collect and protect your personal data on our Canadian immigration consulting platform." },
  fr: { title: "Politique de confidentialité — IDLOGICE", description: "Politique de confidentialité d'IDLOGICE. Découvrez comment nous collectons et protégeons vos données personnelles." },
  es: { title: "Política de privacidad — IDLOGICE Inmigración", description: "Política de privacidad de IDLOGICE. Conozca cómo recopilamos y protegemos sus datos personales en nuestra plataforma." },
  ar: { title: "سياسة الخصوصية — IDLOGICE", description: "سياسة الخصوصية لـ IDLOGICE. تعرف على كيفية جمع وحماية بياناتك الشخصية على منصة استشارات الهجرة الكندية." },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const m = PRIVACY_META[locale] ?? PRIVACY_META.en;
  return {
    title: m.title,
    description: m.description,
    alternates: generatePageAlternates(locale, "/privacy"),
  } satisfies Metadata;
}
import { PageHero } from "@/components/sections/page-hero";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your personal information."
      />
      <article className="container mx-auto px-4 py-12 max-w-3xl space-y-8 text-muted-foreground leading-relaxed">
        <p className="text-sm font-medium text-foreground">Last updated: April 2026</p>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">1. Who We Are</h2>
          <p>
            IDLOGICE Inc. (&ldquo;IDLOGICE&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is a Canadian immigration consulting firm registered with the College of Immigration and Citizenship Consultants (CICC). Our registered office is located at 410 Saint-Catherine Street, Montréal, Québec, Canada. We provide immigration consulting services through Regulated Canadian Immigration Consultants (RCICs).
          </p>
          <p>
            This Privacy Policy explains how we collect, use, disclose, and protect personal information in accordance with the <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA) and applicable provincial privacy legislation, including Québec&rsquo;s <em>Act respecting the protection of personal information in the private sector</em> (Law 25).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">2. Information We Collect</h2>
          <p>We collect personal information only for the purposes identified in this policy. This may include:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong className="text-foreground">Identity information:</strong> full name, date of birth, nationality, passport details</li>
            <li><strong className="text-foreground">Contact information:</strong> email address, phone number, mailing address</li>
            <li><strong className="text-foreground">Immigration history:</strong> visa applications, travel history, immigration status</li>
            <li><strong className="text-foreground">Account credentials:</strong> email and hashed password if you create an account</li>
            <li><strong className="text-foreground">Financial information:</strong> payment data processed securely through our payment provider (we do not store card numbers)</li>
            <li><strong className="text-foreground">Usage data:</strong> pages visited, features used, IP address, browser type, and device identifiers</li>
            <li><strong className="text-foreground">Communications:</strong> messages you send us via email, contact forms, or consultations</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">3. Why We Collect Your Information</h2>
          <p>We use personal information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide immigration consulting services and process your applications</li>
            <li>Create and manage your client account</li>
            <li>Communicate with you about your file, appointments, and service updates</li>
            <li>Process payments and issue receipts</li>
            <li>Comply with CICC professional obligations and regulatory requirements</li>
            <li>Improve our platform and user experience through analytics</li>
            <li>Send you relevant immigration news or updates you have consented to receive</li>
            <li>Detect and prevent fraud or unauthorized access</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">4. Legal Basis for Processing</h2>
          <p>
            We collect and process your personal information on the basis of your consent, the performance of a contract (our service agreement with you), our legitimate interests as a regulated immigration consulting firm, and compliance with legal obligations under Canadian law and CICC regulations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">5. How We Share Your Information</h2>
          <p>
            We do not sell your personal information. We may share it only in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong className="text-foreground">Government authorities:</strong> IRCC, CBSA, and other Canadian or foreign immigration authorities as required to process your application</li>
            <li><strong className="text-foreground">Service providers:</strong> third-party vendors who assist us in delivering our services (e.g., cloud hosting, payment processing, email delivery), bound by confidentiality agreements</li>
            <li><strong className="text-foreground">Professional obligation:</strong> disclosure required by the CICC or applicable law</li>
            <li><strong className="text-foreground">Business transfer:</strong> in the event of a merger or acquisition, with advance notice to you</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">6. Data Retention</h2>
          <p>
            We retain client files for a minimum of seven (7) years following the completion of services, as required by CICC regulations. Account data is retained for as long as your account is active. You may request deletion of account data not subject to regulatory retention requirements at any time.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">7. Security</h2>
          <p>
            We implement technical and organizational measures appropriate to the sensitivity of your data, including encrypted data transmission (TLS), access controls, and secure cloud storage. However, no system is entirely secure, and we encourage you to use strong passwords and keep your account credentials confidential.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">8. Your Rights</h2>
          <p>Under PIPEDA and applicable provincial law, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong className="text-foreground">Access:</strong> request a copy of the personal information we hold about you</li>
            <li><strong className="text-foreground">Correction:</strong> request that inaccurate or incomplete information be corrected</li>
            <li><strong className="text-foreground">Withdrawal of consent:</strong> withdraw consent to certain uses of your information (subject to legal and regulatory limits)</li>
            <li><strong className="text-foreground">Deletion:</strong> request deletion of information we are not required to retain</li>
            <li><strong className="text-foreground">Portability:</strong> receive your data in a structured, machine-readable format (where applicable under provincial law)</li>
            <li><strong className="text-foreground">Complaint:</strong> file a complaint with the Office of the Privacy Commissioner of Canada at <a href="https://www.priv.gc.ca" className="text-primary underline" target="_blank" rel="noopener noreferrer">www.priv.gc.ca</a></li>
          </ul>
          <p>To exercise any of these rights, contact our Privacy Officer at <a href="mailto:support@idlogice.com" className="text-primary underline">support@idlogice.com</a>. We will respond within 30 days.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">9. Cookies</h2>
          <p>
            We use cookies and similar technologies to operate our website and improve your experience. For details on the types of cookies we use and how to manage your preferences, please read our <Link href="/cookies" className="text-primary underline">Cookie Policy</Link>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify registered users by email or in-app notification for material changes. The &ldquo;Last updated&rdquo; date at the top of this page reflects the most recent revision.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">11. Contact Us</h2>
          <p>
            For questions about this Privacy Policy or our privacy practices, contact our Privacy Officer:
          </p>
          <address className="not-italic space-y-1">
            <p><strong className="text-foreground">IDLOGICE Inc. — Privacy Officer</strong></p>
            <p>410 Saint-Catherine Street, Montréal, Québec, Canada</p>
            <p>Email: <a href="mailto:support@idlogice.com" className="text-primary underline">support@idlogice.com</a></p>
            <p>Phone: <a href="tel:+12899175372" className="text-primary underline">+1 2899175372</a></p>
          </address>
        </section>
      </article>
    </>
  );
}
