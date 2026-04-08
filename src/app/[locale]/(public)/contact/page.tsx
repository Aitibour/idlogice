import { useTranslations } from "next-intl";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ContactForm } from "@/components/forms/contact-form";

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <>
      <PageHero
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Form */}
            <ContactForm />

            {/* Contact Info */}
            <div>
              <h2 className="text-xl font-semibold mb-6">{t("info.heading")}</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground mb-1">
                    {t("info.emailLabel")}
                  </dt>
                  <dd className="font-medium">{t("info.emailValue")}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground mb-1">
                    {t("info.responseLabel")}
                  </dt>
                  <dd className="font-medium">{t("info.responseValue")}</dd>
                </div>
              </dl>
              <p className="mt-8 text-sm text-muted-foreground leading-relaxed border-l-2 border-muted pl-4">
                {t("info.disclaimer")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
        primaryCta={{ label: t("cta.primary"), href: "/help" }}
        secondaryCta={{ label: t("cta.secondary"), href: "/evaluation" }}
      />
    </>
  );
}
