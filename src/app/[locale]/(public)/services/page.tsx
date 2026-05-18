export const revalidate = 86400;
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CtaBanner } from "@/components/sections/cta-banner";
import {
  ArrowRight, Star, GraduationCap, Briefcase, MapPin,
  Users, Plane, Zap,
} from "lucide-react";

const SERVICE_META = [
  {
    href: "/services/express-entry",
    image: "/images/feature-immigration.jpg",
    icon: Zap,
    accent: "oklch(0.52 0.22 27)",
    tag: "Most Popular",
  },
  {
    href: "/services/study-permit",
    image: "/images/feature-language.jpg",
    icon: GraduationCap,
    accent: "oklch(0.45 0.18 250)",
    tag: null,
  },
  {
    href: "/services/work-permit",
    image: "/images/feature-consulting.jpg",
    icon: Briefcase,
    accent: "oklch(0.42 0.16 160)",
    tag: null,
  },
  {
    href: "/services/pnp",
    image: "/images/feature-evaluation.jpg",
    icon: MapPin,
    accent: "oklch(0.48 0.18 290)",
    tag: "600 CRS Points",
  },
  {
    href: "/services/family-sponsorship",
    image: "/images/feature-family.jpg",
    icon: Users,
    accent: "oklch(0.50 0.20 15)",
    tag: null,
  },
  {
    href: "/services/tourist-visa",
    image: "/images/feature-consulting.jpg",
    icon: Plane,
    accent: "oklch(0.44 0.15 200)",
    tag: null,
  },
];

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });

  const serviceItems = (
    t.raw("overview.grid.items") as Array<{ title: string; description: string }>
  ).map((item, i) => ({
    ...item,
    ...SERVICE_META[i],
  }));

  return (
    <>
      {/* â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative overflow-hidden min-h-[480px] flex items-end pb-28">
        <Image
          src="/images/feature-immigration.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/30" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />

        <div className="relative z-10 container mx-auto px-4 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Our Services</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05] mb-4">
              {t("overview.hero.title")}
            </h1>
            <p className="text-white/70 text-lg max-w-xl leading-relaxed">
              {t("overview.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* â”€â”€ SERVICE CARDS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="bg-white pb-24 -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">

            {/* Section label */}
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground px-2">
                {t("overview.grid.title")}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {serviceItems.map((service, i) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={i}
                    href={service.href}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white hover:shadow-xl hover:shadow-black/8 hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Tag */}
                      {service.tag && (
                        <span
                          className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
                          style={{ background: service.accent }}
                        >
                          {service.tag}
                        </span>
                      )}

                      {/* Icon badge */}
                      <div
                        className="absolute bottom-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                        style={{ background: service.accent }}
                      >
                        <Icon className="size-5 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-primary">
                        Learn More
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>

                    {/* Bottom accent line */}
                    <div
                      className="h-[3px] w-0 group-hover:w-full transition-all duration-300"
                      style={{ background: service.accent }}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Trust bar */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "95%",  label: "Success Rate" },
                { value: "10+",  label: "Years Experience" },
                { value: "50+",  label: "Countries Served" },
                { value: "500+", label: "Cases Handled" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center p-5 rounded-2xl bg-secondary/40 border border-border/50">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="size-3 text-primary fill-primary" />
                    <span className="text-2xl font-black text-foreground">{value}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground text-center">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <CtaBanner
        title={t("overview.cta.title")}
        subtitle={t("overview.cta.subtitle")}
        primaryCta={{ label: t("overview.cta.primary"), href: "/calculator" }}
        secondaryCta={{ label: t("overview.cta.secondary"), href: "/calculator" }}
        bgImage="/images/cta-bg.jpg"
      />
    </>
  );
}

