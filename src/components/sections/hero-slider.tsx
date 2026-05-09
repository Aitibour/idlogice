"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export interface HeroSlide {
  videoSrc: string;
  poster?: string;
  badge?: string;
  title: string;
  subtitle: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function HeroSlider({ slides, cta, secondaryCta }: HeroSliderProps) {
  const t = useTranslations("slider");
  const [current, setCurrent] = useState(0);
  const [nextIdx, setNextIdx] = useState<number | null>(null);
  const [videoTransitioning, setVideoTransitioning] = useState(false);
  const [textVisible, setTextVisible] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const fadeDuration = 900;

  useEffect(() => {
    const el = videoRefs.current[current];
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(() => {});
  }, [current]);

  const goTo = useCallback(
    (idx: number) => {
      if (videoTransitioning || idx === current) return;
      setTextVisible(false);
      setTimeout(() => {
        setNextIdx(idx);
        setVideoTransitioning(true);
        setTimeout(() => {
          setCurrent(idx);
          setNextIdx(null);
          setVideoTransitioning(false);
          setTextVisible(true);
        }, fadeDuration);
      }, 300);
    },
    [current, videoTransitioning],
  );

  function handleEnded() {
    goTo((current + 1) % slides.length);
  }

  return (
    <section className="relative h-[88vh] min-h-[560px] max-h-[900px] flex items-center justify-center overflow-hidden">
      {/* ── Video layers ── */}
      {slides.map((slide, i) => {
        const isActive = i === current;
        const isNext = i === nextIdx;
        const opacity = isActive ? (videoTransitioning ? 0 : 1) : isNext ? 1 : 0;
        return (
          <video
            key={slide.videoSrc}
            ref={(el) => { videoRefs.current[i] = el; }}
            src={slide.videoSrc}
            poster={slide.poster}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              opacity,
              transition: videoTransitioning ? `opacity ${fadeDuration}ms ease-in-out` : "none",
              zIndex: isNext ? 2 : isActive ? 1 : 0,
            }}
            muted
            playsInline
            preload={i === 0 ? "auto" : "none"}
            onEnded={handleEnded}
          />
        );
      })}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65"
        style={{ zIndex: 3 }}
      />

      {/* ── Text content ── */}
      <div
        className="relative container mx-auto px-4 text-center text-white pb-10 pt-6"
        style={{
          zIndex: 4,
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.45s ease, transform 0.45s ease",
        }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-[1.08] drop-shadow-lg max-w-4xl mx-auto">
          {slides[current]?.title}
        </h1>
        <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto mb-8 leading-relaxed">
          {slides[current]?.subtitle}
        </p>

        {(cta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {cta && (
              <Link
                href={cta.href}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "btn-shimmer px-8 h-12 shadow-2xl font-semibold text-base gap-2 group",
                )}
              >
                {cta.label}
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center justify-center h-12 gap-1.5 px-8 rounded-lg border border-white/50 text-white hover:bg-white/12 hover:border-white/70 transition-all text-base font-medium backdrop-blur-sm"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* ── Slide indicators ── */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5"
        style={{ zIndex: 5 }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={t("goToSlide", { n: i + 1 })}
            className={cn(
              "rounded-full transition-all duration-300",
              i === current ? "bg-white w-7 h-1.5" : "bg-white/40 hover:bg-white/60 w-1.5 h-1.5",
            )}
          />
        ))}
      </div>

      {/* ── Arrows ── */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        aria-label={t("previousSlide")}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all"
        style={{ zIndex: 5 }}
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        aria-label={t("nextSlide")}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all"
        style={{ zIndex: 5 }}
      >
        <ChevronRight className="size-4" />
      </button>
    </section>
  );
}
