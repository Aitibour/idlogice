export const revalidate = 3600;
import { setRequestLocale, getTranslations } from "next-intl/server";
import { HeroSlider } from "@/components/sections/hero-slider";
import { AboutSection } from "@/components/sections/about-section";
import { ServicesAlternating } from "@/components/sections/services-alternating";
import { TestimonialsMarquee } from "@/components/sections/testimonials-marquee";
import { ContactInline } from "@/components/sections/contact-inline";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Link } from "@/i18n/navigation";
import { BarChart2, Calculator } from "lucide-react";

const HERO_VIDEO_SOURCES = [
  { videoSrc: "/videos/12731031_3840_2160_24fps.mp4",       poster: "/posters/12731031_3840_2160_24fps.jpg" },
  { videoSrc: "/videos/17765268-uhd_3840_2160_30fps.mp4",   poster: "/posters/17765268-uhd_3840_2160_30fps.jpg" },
  { videoSrc: "/videos/5135877-uhd_3840_2160_25fps.mp4",    poster: "/posters/5135877-uhd_3840_2160_25fps.jpg" },
  { videoSrc: "/videos/7009788-uhd_3840_2160_25fps.mp4",    poster: "/posters/7009788-uhd_3840_2160_25fps.jpg" },
];

const SERVICE_IMAGES = [
  "/images/feature-immigration.jpg",
  "/images/feature-language.jpg",
  "/images/feature-consulting.jpg",
  "/images/feature-evaluation.jpg",
  "/images/feature-family.jpg",
  "/images/feature-consulting.jpg",
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const heroSlides = (t.raw("heroSlides") as Array<{ title: string; subtitle: string }>)
    .map((slide, i) => ({ ...slide, ...HERO_VIDEO_SOURCES[i] }));

  const aboutStats = t.raw("homeAbout.stats") as Array<{ value: string; label: string }>;

  const services = (t.raw("servicesSection.items") as Array<{ title: string; description: string; href: string }>)
    .map((item, i) => ({ ...item, image: SERVICE_IMAGES[i], ctaLabel: t("servicesSection.ctaLabel") }));

  const testimonials = t.raw("testimonials.items") as Array<{
    name: string; origin: string; text: string; result: string; rating: number;
  }>;

  return (
    <>
      {/* Preload first hero poster â€” fixes LCP fetchpriority hint */}
      {heroSlides[0]?.poster && (
        <link
          rel="preload"
          as="image"
          href={heroSlides[0].poster}
          // @ts-expect-error â€” fetchpriority is valid but not yet in React types
          fetchpriority="high"
        />
      )}
      <HeroSlider
        slides={heroSlides}
        cta={{ label: t("hero.cta"), href: "/evaluation" }}
        secondaryCta={{ label: t("hero.secondaryCta"), href: "/services" }}
      />
      <AboutSection
        eyebrow={t("homeAbout.eyebrow")}
        title={t("homeAbout.title")}
        paragraphs={[t("homeAbout.para1"), t("homeAbout.para2")]}
        ctaLabel={t("homeAbout.ctaLabel")}
        ctaHref="/about"
        stats={aboutStats}
      />
      <ServicesAlternating
        eyebrow={t("servicesSection.eyebrow")}
        title={t("servicesSection.title")}
        services={services}
      {/* Tools strip – Draw Tracker + CRS Calculator */}
      <section className="bg-white border-y border-border/50 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/draws"
              className="group flex items-start gap-4 rounded-2xl border border-border p-5 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BarChart2 className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900 mb-1 group-hover:text-primary transition-colors">Express Entry Draw Tracker</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Live CRS cutoffs, draw history and trends — updated automatically from IRCC.</p>
              </div>
            </Link>
            <Link
              href="/calculator"
              className="group flex items-start gap-4 rounded-2xl border border-border p-5 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calculator className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900 mb-1 group-hover:text-primary transition-colors">Free CRS Calculator</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Estimate your Comprehensive Ranking System score in under 2 minutes.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>      />
      <TestimonialsMarquee
        title={t("testimonials.title")}
        subtitle={t("testimonials.subtitle")}
        testimonials={testimonials}
      />
      <ContactInline
        eyebrow={t("contactSection.eyebrow")}
        title={t("contactSection.title")}
        address="410 Saint-Catherine St, Montreal, Canada"
        phone="+1 581-634-0224"
        email="contact@idlogice.com"
        hours="Mon â€“ Fri: 9:00 AM â€“ 6:00 PM EST"
      />
      <CtaBanner
        title={t("cta.bannerTitle")}
        subtitle={t("cta.bannerSubtitle")}
        primaryCta={{ label: t("cta.freeEvaluation"), href: "/evaluation" }}
        secondaryCta={{ label: t("cta.calculateCrs"), href: "/calculator" }}
        bgImage="/images/cta-bg.jpg"
      />
    </>
  );
}


