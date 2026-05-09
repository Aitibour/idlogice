"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface VideoShowcaseProps {
  sources: string[];
  title?: string;
  subtitle?: string;
}

/**
 * Shows videos from a section folder displayed in a grid/duo layout,
 * all playing simultaneously (muted autoplay). Click to toggle sound on any clip.
 */
export function VideoShowcase({ sources, title, subtitle }: VideoShowcaseProps) {
  const [active, setActive] = useState<number | null>(null);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    refs.current.forEach((el) => {
      if (el) el.play().catch(() => {});
    });
  }, []);

  function toggleSound(i: number) {
    if (active === i) {
      // mute this one
      refs.current.forEach((el) => { if (el) el.muted = true; });
      setActive(null);
    } else {
      refs.current.forEach((el, j) => {
        if (el) el.muted = j !== i;
      });
      setActive(i);
    }
  }

  const gridClass =
    sources.length === 2
      ? "grid-cols-1 md:grid-cols-2"
      : sources.length === 3
        ? "grid-cols-1 md:grid-cols-3"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

  return (
    <section className="py-16 bg-slate-950">
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <ScrollReveal className="text-center mb-10 text-white">
            {title && <h2 className="text-2xl md:text-3xl font-bold mb-3">{title}</h2>}
            {subtitle && <p className="text-white/60 max-w-xl mx-auto">{subtitle}</p>}
          </ScrollReveal>
        )}

        <div className={`grid ${gridClass} gap-3`}>
          {sources.map((src, i) => (
            <ScrollReveal key={src} delay={i * 120}>
              <div
                className="relative overflow-hidden rounded-2xl aspect-video cursor-pointer group"
                onClick={() => toggleSound(i)}
              >
                <video
                  ref={(el) => { refs.current[i] = el; }}
                  src={src}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                {/* Sound indicator */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    {active === i ? "🔊 Click to mute" : "🔇 Click for sound"}
                  </span>
                </div>
                {/* Active border glow */}
                {active === i && (
                  <div className="absolute inset-0 ring-2 ring-white/50 rounded-2xl pointer-events-none" />
                )}
                {/* Subtle dark vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none rounded-2xl" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
