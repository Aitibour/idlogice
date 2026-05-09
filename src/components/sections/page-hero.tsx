import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  badge?: string;
  title: string;
  subtitle: string;
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  bgImage?: string;
}

export function PageHero({
  badge,
  title,
  subtitle,
  cta,
  secondaryCta,
  bgImage,
}: PageHeroProps) {
  if (bgImage) {
    return (
      <section className="relative py-16 overflow-hidden flex items-center min-h-[320px]">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/60 to-black/40" />

        <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl py-6">
          {badge && (
            <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold bg-white/15 text-white border border-white/25 rounded-full backdrop-blur-sm uppercase tracking-wide">
              {badge}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-white drop-shadow-lg">
            {title}
          </h1>
          <p className="text-base text-white/80 mb-6 leading-relaxed">{subtitle}</p>
          {(cta || secondaryCta) && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {cta && (
                <Link
                  href={cta.href}
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "btn-shimmer font-semibold px-6 gap-2",
                  )}
                >
                  {cta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center justify-center h-9 px-6 rounded-lg border border-white/50 text-white text-sm font-medium hover:bg-white/10 transition-all backdrop-blur-sm"
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

  /* Fallback: plain bg */
  return (
    <section className="py-12 bg-muted/30 border-b">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        {badge && (
          <span className="inline-block mb-3 px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
            {badge}
          </span>
        )}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{title}</h1>
        <p className="text-base text-muted-foreground mb-6">{subtitle}</p>
        {(cta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {cta && (
              <Link href={cta.href} className={cn(buttonVariants({ size: "sm" }))}>
                {cta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
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
