"use client";

import { type ReactNode } from "react";
import { VideoCarousel } from "@/components/ui/video-carousel";

interface VideoSectionBgProps {
  sources: string[];
  overlay?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Wraps any content with a cycling video background from a section folder.
 * All videos in `sources` play in order with crossfade.
 */
export function VideoSectionBg({
  sources,
  overlay = "bg-black/60",
  children,
  className = "",
}: VideoSectionBgProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <VideoCarousel sources={sources} />
      <div className={`absolute inset-0 z-[3] ${overlay}`} />
      <div className="relative text-white" style={{ zIndex: 4 }}>
        {children}
      </div>
    </div>
  );
}
