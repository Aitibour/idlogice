import Image from "next/image";
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

/**
 * Light-themed hero. If `bgImage` is provided it appears as a soft
 * decorative panel on the right (desktop) / behind a white veil
 * (mobile) — never as a dark full-bleed overlay. All text stays dark
 * on light for readability.
 */
export function PageHero({
  badge,
  title,
  subtitle,
  cta,
  secondaryCta,
  bgImage,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-white border-b border-border/40">
      {bgImage && (
        <>
          {/* Image panel on the right (desktop) — next/image for optimized LCP */}
          <div aria-hidden="true" className="hidden md:block absolute inset-y-0 right-0 w-1/2">
            <Image
              src={bgImage}
              alt={title}
              fill
              className="object-cover object-center"
              priority
              sizes="50vw"
              unoptimized
            />
          </div>
          <div
            aria-hidden="true"
            className="hidden md:block absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/40"
          />
          {/* Mobile: full-width faded image */}
          <div aria-hidden="true" className="md:hidden absolute inset-0 opacity-25">
            <Image
              src={bgImage}
              alt={title}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
              unoptimized
            />
          </div>
          <div
            aria-hidden="true"
            className="md:hidden absolute inset-0 bg-gradient-to-b from-white/90 via-white/85 to-white/95"
          />
        </>
      )}

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-2xl">
          {badge && (
            <span className="inline-flex items-center mb-4 px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full uppercase tracking-wide">
              {badge}
            </span>
          )}
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
            style={{ color: "#111827" }}
          >
            {title}
          </h1>
          <p
            className="text-base md:text-lg mb-7 leading-relaxed max-w-xl"
            style={{ color: "#374151" }}
          >
            {subtitle}
          </p>
          {(cta || secondaryCta) && (
            <div className="flex flex-col sm:flex-row gap-3">
              {cta && (
                <Link
                  href={cta.href}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "btn-shimmer font-semibold px-6 gap-2",
                  )}
                >
                  {cta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "font-medium px-6",
                  )}
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
