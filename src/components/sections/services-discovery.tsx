"use client";

import { useRef, useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight, TrendingUp, Briefcase, GraduationCap, Users, MapPin } from "lucide-react";

export interface DiscoveryService {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

const DEFAULT_SERVICES: DiscoveryService[] = [
  {
    title: "Express Entry",
    description: "A competitive pathway to Canadian permanent residence. Understand your CRS score and invitation options.",
    href: "/services/express-entry",
    icon: TrendingUp,
  },
  {
    title: "Work Permit",
    description: "Access Canada's thriving job market with employer-specific or open work permits, including LMIA guidance.",
    href: "/services/work-permit",
    icon: Briefcase,
  },
  {
    title: "Study Permit",
    description: "Study at world-class Canadian institutions. We handle your permit and advise on Post-Graduate Work Permits.",
    href: "/services/study-permit",
    icon: GraduationCap,
  },
  {
    title: "Family Sponsorship",
    description: "Reunite with your loved ones in Canada. We assist with sponsoring spouses, children, and parents.",
    href: "/services/family-sponsorship",
    icon: Users,
  },
  {
    title: "Provincial Nominee Program",
    description: "Each province targets specific skills and profiles. We match you with the right PNP stream.",
    href: "/services/pnp",
    icon: MapPin,
  },
];

interface ServicesDiscoveryProps {
  title?: string;
  subtitle?: string;
  services?: DiscoveryService[];
}

export function ServicesDiscovery({
  title = "Discover our services",
  subtitle = "Expert guidance across every Canadian immigration pathway — tailored to your unique profile.",
  services = DEFAULT_SERVICES,
}: ServicesDiscoveryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-20 px-4" style={{ backgroundColor: "#F4F6FF" }} ref={ref}>
      <div className="container mx-auto max-w-5xl">

        {/* Header */}
        <div className="text-center mb-12"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
          <h2 className="text-2xl font-bold mb-3">{title}</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{subtitle}</p>
        </div>

        {/* Card grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.title}
                className="bg-white rounded-2xl border border-border/40 p-6 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateY(32px)",
                  transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s, box-shadow 0.2s, translate 0.2s`,
                }}
              >
                {/* Icon circle */}
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <Icon className="size-5 text-primary" />
                </div>

                <h3 className="font-bold text-base mb-2 leading-snug">{svc.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">{svc.description}</p>

                <Link
                  href={svc.href}
                  className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold group"
                >
                  Read more
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
