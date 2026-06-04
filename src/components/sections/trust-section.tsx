"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CheckCircle, ChevronRight } from "lucide-react";

interface TrustItem {
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
}

interface TrustSectionProps {
  title: string;
  items: TrustItem[];
}

export function TrustSection({ title, items }: TrustSectionProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  // Pre-defined stats for the 3 trust cards
  const stats = ["4", "10+", "50+"];
  const statLabels = ["Service Languages", "Years Experience", "Countries Served"];
  const accents = [
    "from-rose-500/20 to-rose-600/5",
    "from-blue-500/20 to-blue-600/5",
    "from-emerald-500/20 to-emerald-600/5",
  ];
  const borders = ["hover:border-rose-500/30", "hover:border-blue-500/30", "hover:border-emerald-500/30"];
  const statColors = ["text-rose-500", "text-blue-500", "text-emerald-500"];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-14">
          <h2 className="mb-3">{title}</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map((item, i) => (
            <ScrollReveal key={i} delay={i * 120}>
              <div
                className={`group relative rounded-2xl border border-border bg-card p-8 cursor-default transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl ${borders[i]}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${accents[i]} opacity-0 group-hover:opacity-100 transition-opacity duration-400`}
                />

                <div className="relative z-10">
                  {/* Stat counter */}
                  <div className="mb-6">
                    <span
                      className={`text-5xl font-black tabular-nums transition-colors duration-300 ${
                        hovered === i ? statColors[i] : "text-foreground"
                      }`}
                    >
                      {stats[i]}
                    </span>
                    <span className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-1">
                      {statLabels[i]}
                    </span>
                  </div>

                  {/* Check icon */}
                  <div className="mb-4">
                    <CheckCircle
                      className={`size-6 transition-colors duration-300 ${
                        hovered === i ? statColors[i] : "text-muted-foreground"
                      }`}
                    />
                  </div>

                  <h3 className="font-bold text-lg mb-3 leading-snug">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>

                  {/* Arrow hint */}
                  <div
                    className="mt-5 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
                    style={{ color: hovered === i ? undefined : "inherit" }}
                  >
                    <span className={statColors[i]}>Learn more</span>
                    <ChevronRight className={`size-3 ${statColors[i]}`} />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
