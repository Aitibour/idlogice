"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, TrendingUp, Briefcase, GraduationCap, Users, MapPin } from "lucide-react";
import { useState } from "react";

interface IntelixHeroProps {
  subtitle?: string;
  title: string;
  titleHighlight?: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

const BUBBLES = [
  { label: "Express Entry",      icon: TrendingUp,    top: "-4%",  left: "50%",   tx: "-50%" },
  { label: "Work Permit",        icon: Briefcase,     top: "22%",  left: "100%",  tx: "-100%" },
  { label: "Study Permit",       icon: GraduationCap, top: "70%",  left: "95%",   tx: "-90%" },
  { label: "Family Sponsorship", icon: Users,         top: "78%",  left: "8%",    tx: "0%" },
  { label: "PNP",                icon: MapPin,        top: "22%",  left: "0%",    tx: "0%" },
];

export function IntelixHero({
  subtitle = "Immigration Consulting",
  title,
  titleHighlight,
  description,
  primaryCta,
  secondaryCta,
}: IntelixHeroProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section className="bg-white py-16 lg:py-24 px-4 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: Text ── */}
          <div className="animate-fade-up">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-5">
              {subtitle}
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-5">
              {titleHighlight ? (
                <>
                  {title}<br />
                  <span className="text-primary">{titleHighlight}</span>
                </>
              ) : title}
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md">
              {description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm shadow-primary/20 btn-shimmer"
              >
                {primaryCta.label}
              </Link>
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-foreground/20 text-foreground text-sm font-semibold hover:bg-secondary/50 transition-colors"
              >
                {secondaryCta.label}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* ── Right: Image with floating service bubbles ── */}
          <div className="relative flex justify-center items-center animate-fade-up delay-200">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">

              {/* Outer dashed ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20" />
              {/* Mid ring */}
              <div className="absolute inset-5 rounded-full border border-primary/10" />

              {/* Main image circle */}
              <div className="absolute inset-10 rounded-full overflow-hidden shadow-2xl ring-4 ring-white">
                <Image
                  src="/images/feature-consulting.jpg"
                  alt="IDLOGICE immigration consultant"
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>

              {/* Floating service bubbles */}
              {BUBBLES.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.label}
                    className="absolute bg-white rounded-2xl shadow-lg border border-border/50 px-3 py-2 flex items-center gap-2 text-xs font-semibold whitespace-nowrap hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-default"
                    style={{ top: b.top, left: b.left, transform: `translateX(${b.tx})` }}
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="size-3.5 text-primary" />
                    </div>
                    {b.label}
                  </div>
                );
              })}
            </div>

            {/* Slider dots */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={
                    i === activeSlide
                      ? "w-7 h-1.5 rounded-full bg-primary transition-all"
                      : "w-1.5 h-1.5 rounded-full bg-border hover:bg-primary/40 transition-all"
                  }
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
