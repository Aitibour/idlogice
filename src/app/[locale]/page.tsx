import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calculator, FileCheck, BookOpen, GraduationCap } from "lucide-react";

export default function HomePage() {
  const t = useTranslations();

  const features = [
    {
      icon: Calculator,
      title: t("features.calculator.title"),
      description: t("features.calculator.description"),
      href: "/calculator" as const,
    },
    {
      icon: FileCheck,
      title: t("features.evaluation.title"),
      description: t("features.evaluation.description"),
      href: "/evaluation" as const,
    },
    {
      icon: BookOpen,
      title: t("features.mockTests.title"),
      description: t("features.mockTests.description"),
      href: "/blog" as const,
    },
    {
      icon: GraduationCap,
      title: t("features.coaching.title"),
      description: t("features.coaching.description"),
      href: "/pricing" as const,
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
              className={cn(
                buttonVariants({ size: "lg" }),
                "text-lg px-8 py-6",
              )}
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

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            {t("features.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="group rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow"
              >
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("hero.title")}
          </h2>
          <p className="text-lg opacity-90 max-w-xl mx-auto mb-8">
            {t("hero.subtitle")}
          </p>
          <Link
            href="/evaluation"
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "text-lg px-8 py-6",
            )}
          >
            {t("cta.freeEvaluation")}
          </Link>
        </div>
      </section>
    </>
  );
}
