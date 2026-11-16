"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export interface HeroSlide {
  videoSrc: string;
  poster: string;
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
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const slide = slides[current];

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    function enableVideo() {
      if (!motion.matches && !connection?.saveData) setVideoEnabled(true);
    }

    function afterLoad() {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(enableVideo, { timeout: 1500 });
      } else {
        timeoutId = window.setTimeout(enableVideo, 300);
      }
    }

    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });

    return () => {
      window.removeEventListener("load", afterLoad);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  function goTo(index: number) {
    if (index === current) return;
    setVideoPlaying(false);
    setCurrent(index);
  }

  return (
    <section className="relative h-[88vh] min-h-[560px] max-h-[900px] flex items-center justify-center overflow-hidden bg-gray-900">
      {slide && (
        <Image
          src={slide.poster}
          alt=""
          fill
          unoptimized
          loading="eager"
          fetchPriority={current === 0 ? "high" : "auto"}
          className="object-cover"
        />
      )}
      {slide && videoEnabled && (
        <video
          key={slide.videoSrc}
          src={slide.videoSrc}
          className={cn(
            "absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-300",
            videoPlaying ? "opacity-100" : "opacity-0",
          )}
          aria-hidden="true"
          autoPlay
          muted
          playsInline
          onPlaying={() => setVideoPlaying(true)}
          onEnded={() => goTo((current + 1) % slides.length)}
        />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65"
        style={{ zIndex: 3 }}
      />

      {/* ── Text content ── */}
      <div
        className="relative container mx-auto px-4 text-center text-white pb-10 pt-6"
        style={{ zIndex: 4 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-[1.08] drop-shadow-lg max-w-4xl mx-auto text-white">
          {slide?.title}
        </h1>
        <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto mb-8 leading-relaxed">
          {slide?.subtitle}
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
