import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { Calculator, FileCheck, BookOpen, GraduationCap } from "lucide-react";
import { StepsSection } from "@/components/sections/steps-section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function HomePage() {
  const t = useTranslations();

  const features = [
    {
      icon: Calculator,
      title: t("features.calculator.title"),
      description: t("features.calculator.description"),
      href: "/calculator",
    },
    {
      icon: FileCheck,
      title: t("features.evaluation.title"),
      description: t("features.evaluation.description"),
      href: "/evaluation",
    },
    {
      icon: BookOpen,
      title: t("features.mockTests.title"),
      description: t("features.mockTests.description"),
      href: "/blog",
    },
    {
      icon: GraduationCap,
      title: t("features.coaching.title"),
      description: t("features.coaching.description"),
      href: "/pricing",
    },
  ];

  const howItWorksSteps = (
    t.raw("howItWorks.steps") as Array<{
      number: number;
      title: string;
      description: string;
    }>
  ).map((s) => ({ number: s.number, title: s.title, description: s.description }));

  const trustItems = (
    t.raw("trust.items") as Array<{ title: string; description: string }>
  ).map((item) => ({ title: item.title, description: item.description }));

  const statsData = [
    {
      value: t("stats.evaluations.value"),
      label: t("stats.evaluations.label"),
    },
    {
      value: t("stats.improvement.value"),
      label: t("stats.improvement.label"),
    },
    {
      value: t("stats.countries.value"),
      label: t("stats.countries.label"),
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/evaluation"
              className={cn(buttonVariants({ size: "lg" }), "text-lg px-8 py-6")}
            >
              {t("hero.cta")}
            </Link>
            <Link
              href="/calculator"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "text-lg px-8 py-6",
              )}
            >
              {t("hero.secondaryCta")}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            {statsData.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeatureGrid
        title={t("features.title")}
        columns={4}
        items={features}
      />

      {/* How It Works */}
      <StepsSection
        title={t("howItWorks.title")}
        subtitle={t("howItWorks.subtitle")}
        steps={howItWorksSteps}
      />

      {/* Trust Section */}
      <FeatureGrid
        title={t("trust.title")}
        columns={3}
        items={trustItems}
      />

      {/* CTA */}
      <CtaBanner
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        primaryCta={{ label: t("cta.freeEvaluation"), href: "/evaluation" }}
        secondaryCta={{
          label: t("cta.calculateCrs"),
          href: "/calculator",
        }}
      />
    </>
  );
}
