"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ServiceItem {
  title: string;
  description: string;
  image: string;
  href: string;
  ctaLabel: string;
}

interface ServicesAlternatingProps {
  eyebrow: string;
  title: string;
  services: ServiceItem[];
}

function ServiceCard({
  service,
  index,
  visible,
}: {
  service: ServiceItem;
  index: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 0.1}s`,
      }}
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={service.href}
        className="block rounded-2xl overflow-hidden relative bg-zinc-900 shadow-md"
        style={{ height: 280 }}
      >
        {/* Background image — zooms on hover */}
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
          style={{
            transform: hovered ? "scale(1.08)" : "scale(1)",
            transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}
        />

        {/* Base gradient (always visible) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

        {/* Hover accent overlay */}
        <div
          className="absolute inset-0 bg-primary/20"
          style={{
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        />

        {/* Service number — top right */}
        <span
          className="absolute top-4 right-4 text-[11px] font-bold tracking-widest text-white/50 uppercase"
          style={{
            opacity: hovered ? 0.8 : 0.4,
            transition: "opacity 0.3s ease",
          }}
        >
          {num}
        </span>

        {/* Content — slides up on hover */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3
            className="text-white font-bold text-lg leading-tight mb-0 transition-all duration-300"
            style={{ marginBottom: hovered ? 8 : 0 }}
          >
            {service.title}
          </h3>

          {/* Description — reveals on hover */}
          <div
            style={{
              maxHeight: hovered ? "80px" : "0px",
              opacity: hovered ? 1 : 0,
              overflow: "hidden",
              transition: "max-height 0.4s ease, opacity 0.35s ease",
            }}
          >
            <p className="text-white/75 text-xs leading-relaxed line-clamp-2">
              {service.description}
            </p>
          </div>

          {/* Read more link */}
          <div
            className="flex items-center gap-1 text-white/90 text-xs font-semibold mt-2"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateX(0)" : "translateX(-8px)",
              transition: "opacity 0.3s ease 0.05s, transform 0.3s ease 0.05s",
            }}
          >
            {service.ctaLabel}
            <ArrowRight className="size-3" />
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 h-[3px] bg-primary"
          style={{
            width: hovered ? "100%" : "0%",
            transition: "width 0.45s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </Link>
    </div>
  );
}

export function ServicesAlternating({
  eyebrow,
  title,
  services,
}: ServicesAlternatingProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 bg-secondary/30" ref={sectionRef}>
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <div className="flex items-center justify-center gap-4 mb-3">
            <div
              className="h-px bg-primary"
              style={{
                width: visible ? 48 : 0,
                transition: "width 0.6s ease 0.2s",
              }}
            />
            <span className="text-primary text-xs font-semibold uppercase tracking-widest whitespace-nowrap">
              {eyebrow}
            </span>
            <div
              className="h-px bg-primary"
              style={{
                width: visible ? 48 : 0,
                transition: "width 0.6s ease 0.2s",
              }}
            />
          </div>
          <h2 className="text-center mb-10">{title}</h2>
        </div>

        {/* Card grid — 2 cols on md, 3 on lg, last row centered if odd */}
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",
            services.length % 3 === 2 && "lg:[&>*:last-child]:col-start-2",
            services.length % 3 === 1 && "lg:[&>*:last-child]:col-start-2",
          )}
        >
          {services.map((service, i) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
