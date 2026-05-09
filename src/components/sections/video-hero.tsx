"use client";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { VideoCarousel } from "@/components/ui/video-carousel";

interface VideoHeroProps {
  /** Single src string OR array of srcs — multiple srcs cycle automatically */
  videoSrc: string | string[];
  badge?: string;
  title: string;
  subtitle: string;
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  overlay?: "dark" | "blue" | "gradient";
  height?: "full" | "large" | "medium";
}

export function VideoHero({
  videoSrc,
  badge,
  title,
  subtitle,
  cta,
  secondaryCta,
  overlay = "dark",
  height = "large",
}: VideoHeroProps) {
  const sources = Array.isArray(videoSrc) ? videoSrc : [videoSrc];

  const overlayClass =
    overlay === "blue"
      ? "bg-blue-950/70"
      : overlay === "gradient"
        ? "bg-gradient-to-b from-black/60 via-black/40 to-black/70"
        : "bg-black/55";

  const heightClass =
    height === "full"
      ? "min-h-screen"
      : height === "large"
        ? "min-h-[85vh]"
        : "min-h-[65vh]";

  return (
    <section className={cn("relative flex items-center justify-center overflow-hidden", heightClass)}>
      {/* Video background — single or carousel */}
      <VideoCarousel sources={sources} />

      {/* Overlay */}
      <div className={cn("absolute inset-0 z-[3]", overlayClass)} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white py-20" style={{ zIndex: 4 }}>
        {badge && (
          <div className="animate-fade-up mb-6">
            <span className="inline-block px-4 py-1.5 text-sm font-medium bg-white/15 border border-white/30 backdrop-blur-sm rounded-full">
              {badge}
            </span>
          </div>
        )}
        <h1 className="animate-fade-up delay-100 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight drop-shadow-lg">
          {title}
        </h1>
        <p className="animate-fade-up delay-200 text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
          {subtitle}
        </p>
        {(cta || secondaryCta) && (
          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center">
            {cta && (
              <Link
                href={cta.href}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-black hover:bg-white/90 text-lg px-8 py-6 shadow-xl",
                )}
              >
                {cta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className={cn(
                  "inline-flex items-center justify-center h-12 gap-1.5 px-8 rounded-lg border border-white/60 text-white hover:bg-white/15 transition-all text-lg font-medium",
                )}
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
