import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Success Stories â€” IDLOGICE Immigration",
  description: "Real stories from clients who achieved Canadian permanent residency, work permits, and study permits with IDLOGICE's CICC-registered immigration consultants.",
};

import { setRequestLocale, getTranslations } from "next-intl/server";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const EXTRA_STORIES = [
  {
    name: "Mei Lin Chen",
    origin: "China â†’ Montreal",
    text: "After three years of trying on my own, I found IDLOGICE. Within six months they had my Express Entry profile optimized, my documents in order, and I received my ITA. The team is incredibly knowledgeable and always available to answer questions.",
    result: "Express Entry â€” Permanent Resident",
    rating: 5,
    category: "Express Entry",
  },
  {
    name: "Ahmed Benali",
    origin: "Algeria â†’ Quebec City",
    text: "I needed the Quebec Skilled Worker program and IDLOGICE was the only firm that truly understood the Quebec immigration system. They prepared a flawless application and I was approved in record time. Exceptional service.",
    result: "Quebec Skilled Worker Program",
    rating: 5,
    category: "Provincial Nominee",
  },
  {
    name: "Priya Nair",
    origin: "India â†’ Ottawa",
    text: "The level of care and attention to detail is outstanding. They caught issues in my previous application that would have caused a refusal, corrected them, and submitted a perfect file. My work permit was approved first try.",
    result: "Employer-Specific Work Permit",
    rating: 5,
    category: "Work Permit",
  },
  {
    name: "Marcus Okonkwo",
    origin: "Nigeria â†’ Toronto",
    text: "IDLOGICE helped our whole family. My wife and I both got our PRs through Express Entry, and our two children are now Canadian citizens by birth. The team treated us like family throughout the entire journey.",
    result: "Family Express Entry â€” Permanent Residents",
    rating: 5,
    category: "Family",
  },
  {
    name: "Valentina Rossi",
    origin: "Italy â†’ Vancouver",
    text: "I was nervous about the student permit process, but IDLOGICE made it completely stress-free. They prepared every document, wrote a compelling letter of intent, and my permit arrived in just 5 weeks. Now finishing my MBA at UBC!",
    result: "Study Permit â€” UBC Graduate Program",
    rating: 5,
    category: "Study Permit",
  },
  {
    name: "Luis Herrera",
    origin: "Colombia â†’ Calgary",
    text: "Complex LMIA case with multiple NOC codes and IDLOGICE handled it brilliantly. They knew exactly which documents IRCC required, negotiated with my employer, and we had the work permit within two months.",
    result: "LMIA Work Permit â€” Oil & Gas Sector",
    rating: 5,
    category: "Work Permit",
  },
];

const STATS = [
  { value: "95%", label: "Success rate" },
  { value: "500+", label: "Cases handled" },
  { value: "50+", label: "Countries represented" },
  { value: "12+", label: "Years of experience" },
];

const CATEGORIES = ["All", "Express Entry", "Work Permit", "Study Permit", "Provincial Nominee", "Family"];

export default async function TestimonialsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const baseTestimonials = (t.raw("testimonials.items") as Array<{
    name: string; origin: string; text: string; result: string; rating: number;
  }>).map((item) => ({ ...item, category: "Express Entry" }));

  const allStories = [...baseTestimonials, ...EXTRA_STORIES];

  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-16 pb-12 border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Success Stories</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4" style={{ color: "#111827" }}>
              Real People.<br /><span className="text-primary">Real Results.</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-xl" style={{ color: "#374151" }}>
              Over 500 families and professionals have trusted IDLOGICE to navigate their Canadian immigration journey. Here are some of their stories.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8">
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-3xl font-black text-primary">{value}</p>
                  <p className="text-sm" style={{ color: "#6b7280" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stories grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {allStories.map((story, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4 h-full hover:shadow-md hover:border-primary/20 transition-all">
                  {/* Category badge */}
                  <span className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-primary/8 text-[10px] font-bold uppercase tracking-wider text-primary">
                    <CheckCircle2 className="size-3" />
                    {story.category}
                  </span>

                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: story.rating }).map((_, si) => (
                      <Star key={si} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="relative flex-1">
                    <Quote className="size-5 text-primary/20 absolute -top-1 -left-0.5" />
                    <p className="text-sm leading-relaxed pl-5" style={{ color: "#374151" }}>
                      {story.text}
                    </p>
                  </div>

                  {/* Attribution */}
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm font-bold" style={{ color: "#111827" }}>{story.name}</p>
                    <p className="text-xs" style={{ color: "#9ca3af" }}>{story.origin}</p>
                    <p className="text-xs font-semibold text-primary mt-1">{story.result}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 max-w-xl mx-auto text-center">
            <div className="bg-white rounded-3xl border border-border p-10 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Start Your Journey</p>
              <h2 className="text-2xl font-bold mb-3" style={{ color: "#111827" }}>Your story could be next</h2>
              <p className="text-sm mb-6" style={{ color: "#374151" }}>
                Free profile evaluation with a CICC-registered consultant and take the first step toward your Canadian dream.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/book-consultation"
                  className="px-8 py-3 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
                  Free Profile Evaluation
                </Link>
                <Link href="/book-consultation"
                  className="px-8 py-3 rounded-full border border-border text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                  style={{ color: "#374151" }}>
                  Free Evaluation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

