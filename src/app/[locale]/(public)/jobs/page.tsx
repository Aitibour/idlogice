import { generatePageAlternates } from "@/lib/seo/alternates";

const JOBS_META: Record<string, { title: string; description: string }> = {
  en: { title: "Canadian Immigration Job Opportunities", description: "Browse Canadian job opportunities for immigrants. Chef Cook, Electrician, RN, Software Developer, Truck Driver. Check eligibility with RCIC experts." },
  fr: { title: "Offres d'emploi pour l'immigration canadienne", description: "Parcourez les offres d'emploi canadiennes pour immigrants. Cuisinier, électricien, infirmier, développeur, chauffeur. Vérifiez votre éligibilité." },
  es: { title: "Empleos canadienses para inmigrantes", description: "Busque empleos canadienses para inmigrantes. Cocinero, Electricista, Enfermero, Desarrollador, Camionero. Verifique su elegibilidad con RCICs." },
  ar: { title: "فرص عمل للهجرة إلى كندا", description: "تصفح فرص العمل الكندية للمهاجرين. طاهٍ، كهربائي، ممرض، مطور برمجيات، سائق. تحقق من أهليتك مع مستشاري RCIC." },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const m = JOBS_META[locale] ?? JOBS_META.en;
  return {
    title: m.title,
    description: m.description,
    alternates: generatePageAlternates(locale, "/jobs"),
  };
}

import Image from "next/image";
import Link from "next/link";
import { Lock, Star, ChevronRight } from "lucide-react";
import { JobsList } from "./_jobs-list";

import { JOBS } from "@/data/jobs";


export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200" style={{ minHeight: 340 }}>
        <Image src="/images/jobs-bg.jpg" alt="Canadian job opportunities for immigrants" fill className="object-cover object-center" priority sizes="100vw" unoptimized />
        <div className="absolute inset-0 bg-black/45" />

        <div className="container mx-auto px-4 lg:px-6 pt-16 pb-14 relative">
          <div className="flex items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/30 text-white text-xs font-semibold tracking-wide uppercase">
              <Lock className="size-3" />
              Exclusive · Clients Only
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white/80 text-xs font-medium">
              <Star className="size-3 fill-current text-amber-400 stroke-none" />
              {JOBS.length} Active Listings
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-none tracking-tight">
            Canadian Job<br />
            <span className="text-[oklch(0.80_0.18_27)]">Opportunities</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-8 leading-relaxed">
            These positions are reserved exclusively for IDLOGICE clients. Higher-wage roles require an eligibility consultation — our consultants will map your exact immigration pathway.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm text-white/80 bg-white/15 border border-white/20 rounded-xl px-4 py-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Updated April 2026
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80 bg-white/15 border border-white/20 rounded-xl px-4 py-2.5">
              <Lock className="size-3.5 text-white/60" />
              Access requires active consultation
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Browse & Apply", desc: "Lower-wage roles: apply directly with your details. Higher-wage roles: book an eligibility consultation first." },
              { step: "02", title: "Profile Review", desc: "Our RCIC consultants review your application and verify your credentials match the job and immigration pathway." },
              { step: "03", title: "Your Roadmap", desc: "Receive a personalised action plan — what qualifies you, what gaps exist, and how to bridge them." },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <span className="text-3xl font-black text-[oklch(0.52_0.22_27/0.25)] leading-none mt-0.5 font-mono">{item.step}</span>
                <div>
                  <h3 className="text-gray-800 font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="container mx-auto px-4 lg:px-6 py-10 max-w-4xl">
        <JobsList jobs={JOBS} />
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 lg:px-6 py-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[oklch(0.52_0.22_27/0.08)] border border-[oklch(0.52_0.22_27/0.2)]">
            <Lock className="size-3.5 text-[oklch(0.52_0.22_27)]" />
            <span className="text-[oklch(0.42_0.22_27)] text-xs font-semibold tracking-wide uppercase">IDLOGICE Exclusive Listings</span>
          </div>
          <h2 className="text-gray-900 text-2xl font-bold mb-3">Not sure which job fits your profile?</h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto mb-6 leading-relaxed">
            Book a free eligibility consultation. Our RCIC-certified consultants will match you to the right opportunity and map out your entire immigration pathway.
          </p>
          <Link
            href="/book-consultation"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[oklch(0.52_0.22_27)] hover:bg-[oklch(0.48_0.22_27)] text-white font-semibold text-sm transition-colors"
          >
            Free Profile Evaluation
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}


