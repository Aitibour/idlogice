"use client";

import { useEffect, useRef, useState } from "react";

interface VideoCarouselProps {
  sources: string[];
  className?: string;
  /** ms to crossfade between clips (default 800) */
  fadeDuration?: number;
}

/**
 * Plays a playlist of videos in order, crossfading between each clip.
 * Designed to be used as a background layer inside a `relative overflow-hidden` container.
 */
export function VideoCarousel({
  sources,
  className = "",
  fadeDuration = 800,
}: VideoCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  // Keep refs array sized to sources
  refs.current = refs.current.slice(0, sources.length);

  // Play the current video when index changes
  useEffect(() => {
    const el = refs.current[current];
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(() => {});
  }, [current]);

  // Preload the next video
  useEffect(() => {
    const nextIdx = (current + 1) % sources.length;
    const el = refs.current[nextIdx];
    if (el) {
      el.load();
    }
  }, [current, sources.length]);

  function advance() {
    if (transitioning || sources.length < 2) return;
    const nextIdx = (current + 1) % sources.length;
    setNext(nextIdx);
    setTransitioning(true);

    // After fade completes, swap active video
    setTimeout(() => {
      setCurrent(nextIdx);
      setNext(null);
      setTransitioning(false);
    }, fadeDuration);
  }

  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden="true">
      {sources.map((src, i) => {
        const isActive = i === current;
        const isNext = i === next;
        const opacity = isActive
          ? transitioning
            ? 0 // fade out the current
            : 1
          : isNext
            ? 1 // fade in the next
            : 0;

        return (
          <video
            key={src}
            ref={(el) => { refs.current[i] = el; }}
            src={src}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              opacity,
              transition: transitioning ? `opacity ${fadeDuration}ms ease-in-out` : "none",
              zIndex: isNext ? 2 : isActive ? 1 : 0,
            }}
            muted
            playsInline
            preload={i === 0 ? "auto" : "none"}
            onEnded={advance}
            // If only one source, loop it
            loop={sources.length === 1}
          />
        );
      })}
    </div>
  );
}
