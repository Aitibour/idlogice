import Image from "next/image";
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

/**
 * Light-themed CTA banner. The optional bgImage is shown faintly
 * behind a strong white veil so all copy stays dark and readable.
 */
export function CtaBanner({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  bgImage,
}: CtaBannerProps) {
  return (
    <section className="relative py-20 overflow-hidden bg-white border-y border-border/50">
      {bgImage && (
        <>
          <div aria-hidden="true" className="absolute inset-0 opacity-15">
            {/* unoptimized: bypasses /_next/image for local paths — prevents SEO crawler &amp; 400 errors */}
            <Image src={bgImage} alt={title} fill className="object-cover object-center" sizes="100vw" unoptimized />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/90 to-white"
          />
        </>
      )}

      <div className="relative z-10 container mx-auto px-4 text-center">
        <ScrollReveal>
          <h2 className="mb-4" style={{ color: "#111827" }}>{title}</h2>
          {subtitle && (
            <p
              className="text-lg max-w-xl mx-auto mb-8 leading-relaxed"
              style={{ color: "#374151" }}
            >
              {subtitle}
            </p>
          )}
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <div className="flex flex-col items-center gap-4">
            <Link
              href={primaryCta.href}
              className={cn(
                buttonVariants({ size: "lg" }),
                "btn-shimmer font-bold shadow-xl text-base px-12 py-4 h-auto rounded-full",
              )}
            >
              {primaryCta.label}
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="text-sm font-semibold underline underline-offset-4 hover:text-primary transition-colors"
                style={{ color: "#374151" }}
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
