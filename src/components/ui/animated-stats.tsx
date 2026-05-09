"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Stat { value: string; label: string; }

function parseStat(value: string) {
  const match = value.match(/^(\d+)(.*)$/);
  return match ? { num: parseInt(match[1], 10), suffix: match[2] } : { num: 0, suffix: value };
}

function AnimatedNumber({ value, trigger }: { value: string; trigger: boolean }) {
  const { num, suffix } = parseStat(value);
  const [display, setDisplay] = useState(num);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const steps = 60;
    const timer = setInterval(() => {
      start += num / steps;
      if (start >= num) { setDisplay(num); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 1400 / steps);
    return () => clearInterval(timer);
  }, [trigger, num]);

  return <span className="tabular-nums">{display}{suffix}</span>;
}

export function AnimatedStats({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); observer.disconnect(); } },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="bg-primary text-primary-foreground rounded-2xl overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={stat.label}
            className={cn(
              "flex flex-col items-center justify-center py-8 px-4 text-center border-primary-foreground/20",
              i < stats.length - 1 && "border-b md:border-b-0 md:border-r",
              i === 1 && "border-b md:border-b-0",
            )}>
            <p className="text-3xl md:text-4xl lg:text-5xl font-black mb-1 leading-none"
              style={{
                opacity: triggered ? 1 : 0,
                transform: triggered ? "scale(1) translateY(0)" : "scale(0.7) translateY(12px)",
                transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.12}s`,
              }}>
              <AnimatedNumber value={stat.value} trigger={triggered} />
            </p>
            <p className="text-sm font-medium opacity-80 leading-snug"
              style={{
                opacity: triggered ? 0.8 : 0,
                transition: `opacity 0.5s ease ${i * 0.12 + 0.3}s`,
              }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
