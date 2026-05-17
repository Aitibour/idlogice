export const revalidate = 3600;
import { setRequestLocale, getTranslations } from "next-intl/server";
import { HeroSlider } from "@/components/sections/hero-slider";
import { AboutSection } from "@/components/sections/about-section";
import { ServicesAlternating } from "@/components/sections/services-alternating";
import { TestimonialsMarquee } from "@/components/sections/testimonials-marquee";
import { ContactInline } from "@/components/sections/contact-inline";
import { CtaBanner } from "@/components/sections/cta-banner";

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
        cta={{ label: t("hero.cta"), href: "/book-consultation" }}
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
      />
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
        primaryCta={{ label: t("cta.freeEvaluation"), href: "/book-consultation" }}
        secondaryCta={{ label: t("cta.calculateCrs"), href: "/calculator" }}
        bgImage="/images/cta-bg.jpg"
      />
    </>
  );
}

