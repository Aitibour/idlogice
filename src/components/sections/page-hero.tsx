import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  badge?: string;
  title: string;
  subtitle: string;
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function PageHero({
  badge,
  title,
  subtitle,
  cta,
  secondaryCta,
}: PageHeroProps) {
  return (
    <section className="py-16 bg-muted/30 border-b">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        {badge && (
          <span className="inline-block mb-4 px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
            {badge}
          </span>
        )}
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground mb-8">{subtitle}</p>
        {(cta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {cta && (
              <Link
                href={cta.href}
                className={cn(buttonVariants({ size: "lg" }))}
              >
                {cta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
