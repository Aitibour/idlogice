import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface CtaBannerProps {
  title: string;
  subtitle?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  bgImage?: string;
}

export function CtaBanner({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  bgImage = "/images/cta-bg.jpg",
}: CtaBannerProps) {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* Dark overlay so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/65 to-black/50" />

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <ScrollReveal>
          <h2 className="mb-4 text-white drop-shadow-lg">{title}</h2>
          {subtitle && (
            <p className="text-white/80 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              {subtitle}
            </p>
          )}
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={primaryCta.href}
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-white text-black hover:bg-white/90 font-semibold shadow-xl",
              )}
            >
              {primaryCta.label}
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className={cn(
                  "inline-flex items-center justify-center h-10 px-6 rounded-lg border border-white/50 text-white hover:bg-white/10 hover:border-white transition-all font-medium text-sm",
                )}
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
