"use client";

import { useRef } from "react";
import { Star, Quote } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface Testimonial {
  name: string;
  origin: string;
  text: string;
  result: string;
  rating: number;
}

interface TestimonialsMarqueeProps {
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
}

function Card({ t }: { t: Testimonial }) {
  return (
    <div className="flex-shrink-0 w-64 bg-white border border-border rounded-xl p-4 flex flex-col gap-2 shadow-sm">
      <Quote className="size-4 text-primary/30 flex-shrink-0" />
      <p className="text-xs leading-relaxed line-clamp-3 flex-1" style={{ color: "#374151" }}>
        {t.text}
      </p>
      <div className="pt-2 border-t border-border flex items-center justify-between">
        <div>
          <p className="font-semibold text-xs" style={{ color: "#111827" }}>{t.name}</p>
          <p className="text-[10px]" style={{ color: "#9ca3af" }}>{t.origin}</p>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: Math.min(t.rating, 5) }).map((_, i) => (
            <Star key={i} className="size-2.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TestimonialsMarquee({
  title,
  testimonials,
}: TestimonialsMarqueeProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-12 bg-white border-y border-border/40 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <ScrollReveal className="text-center">
          <h2 className="mb-1" style={{ color: "#111827" }}>{title}</h2>
        </ScrollReveal>
      </div>

      {/* Single row marquee */}
      <div
        ref={rowRef}
        className="flex gap-3 w-max"
        style={{ animation: "marquee-left 50s linear infinite" }}
        onMouseEnter={() => {
          if (rowRef.current) rowRef.current.style.animationPlayState = "paused";
        }}
        onMouseLeave={() => {
          if (rowRef.current) rowRef.current.style.animationPlayState = "running";
        }}
      >
        {[...testimonials, ...testimonials].map((t, i) => (
          <Card key={i} t={t} />
        ))}
      </div>
    </section>
  );
}
