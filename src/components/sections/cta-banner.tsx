import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

interface CtaBannerProps {
  title: string;
  subtitle?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function CtaBanner({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: CtaBannerProps) {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
        {subtitle && (
          <p className="text-lg opacity-90 max-w-xl mx-auto mb-8">{subtitle}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={primaryCta.href}
            className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
          >
            {primaryCta.label}
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground",
              )}
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
