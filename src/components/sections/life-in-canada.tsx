"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface LifeInCanadaProps {
  sources: string[];
  title: string;
  subtitle: string;
}

export function LifeInCanada({ sources, title, subtitle }: LifeInCanadaProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const mainRef = useRef<HTMLVideoElement | null>(null);

  // Sync playback state with main video
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    el.src = sources[activeIdx];
    el.load();
    if (playing) el.play().catch(() => {});
  }, [activeIdx, playing, sources]);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    if (playing) el.play().catch(() => {});
    else el.pause();
  }, [playing]);

  useEffect(() => {
    if (mainRef.current) mainRef.current.muted = muted;
  }, [muted]);

  return (
    <section className="py-20 bg-zinc-950 overflow-hidden">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-10 text-white">
          <h2 className="mb-3 text-white">{title}</h2>
          <p className="text-white/55 max-w-xl mx-auto text-base">{subtitle}</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {/* ── Main large player (left 2/3) ── */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden bg-zinc-900 aspect-video group">
              <video
                ref={mainRef}
                src={sources[0]}
                className="w-full h-full object-cover"
                muted={muted}
                loop
                playsInline
                preload="metadata"
                onEnded={() => setActiveIdx((i) => (i + 1) % sources.length)}
              />

              {/* Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Controls bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
                </button>
                <button
                  onClick={() => setMuted((m) => !m)}
                  className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                </button>
              </div>

              {/* Clip index badge */}
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium border border-white/15">
                {activeIdx + 1} / {sources.length}
              </div>
            </div>
          </div>

          {/* ── Thumbnail strip (right 1/3) ── */}
          <div className="flex flex-row lg:flex-col gap-3">
            {sources.map((src, i) => (
              <button
                key={src}
                onClick={() => { setActiveIdx(i); setPlaying(true); }}
                className={`relative overflow-hidden rounded-xl flex-1 lg:flex-none lg:h-36 aspect-video lg:aspect-auto transition-all duration-200 ${
                  i === activeIdx
                    ? "ring-2 ring-primary shadow-lg shadow-primary/20 scale-[1.02]"
                    : "opacity-60 hover:opacity-85 hover:scale-[1.01]"
                }`}
              >
                <video
                  src={src}
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-black/20" />
                {i === activeIdx && (
                  <div className="absolute bottom-2 left-2">
                    <div className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="size-2.5 text-black ml-0.5" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
