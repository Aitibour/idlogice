import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: "Canadian Immigration Job Opportunities",
    description: "Browse Canadian job opportunities for immigrants — Chef Cook, Electrician, RN, Software Developer, Truck Driver. Check eligibility with CICC-certified RCICs.",
    alternates: generatePageAlternates(locale, "/jobs"),
  };
}

import Image from "next/image";
import Link from "next/link";
import { Lock, Star, ChevronRight } from "lucide-react";
import { JobsList } from "./_jobs-list";

const JOBS = [
  {
    id: 1,
    title: "Chef Cook",
    noc: "NOC 62200",
    city: "Montreal, QC",
    wage: "$22 – $32/hr",
    type: "Full-time · Permanent",
    posted: "March 4, 2026",
    slots: 3,
    description: "Upscale hotel restaurant seeks experienced chef. Must have 3+ years in a professional kitchen. Employer provides uniform and meals. LMIA in process — employer committed to supporting permanent residence pathway for the right candidate.",
    tags: ["LMIA Supported", "PR Pathway", "Relocation Assistance"],
    consultOnly: false,
  },
  {
    id: 2,
    title: "Electrician (Construction)",
    noc: "NOC 72200",
    city: "Toronto, ON",
    wage: "$35 – $48/hr",
    type: "Full-time · Permanent",
    posted: "February 14, 2026",
    slots: 5,
    description: "Major construction firm hiring licensed electricians for large commercial projects. Red Seal or equivalent accepted. LMIA in process. This position requires a pre-eligibility consultation to assess your credentials and identify the correct immigration stream.",
    tags: ["LMIA In Process", "Red Seal Welcome", "Union Shop"],
    consultOnly: true,
  },
  {
    id: 3,
    title: "Kitchen Helper",
    noc: "NOC 65201",
    city: "Vancouver, BC",
    wage: "$18 – $22/hr",
    type: "Full-time · Permanent",
    posted: "April 1, 2026",
    slots: 8,
    description: "Growing restaurant group seeks kitchen helpers to assist with food preparation, cleaning, and dishwashing. No prior experience required — full on-the-job training provided. Employer committed to supporting PR applications through BC PNP and Atlantic streams.",
    tags: ["No Experience Required", "PR Supported", "Training Provided"],
    consultOnly: false,
  },
  {
    id: 4,
    title: "Registered Nurse (RN)",
    noc: "NOC 31301",
    city: "Calgary, AB",
    wage: "$42 – $58/hr",
    type: "Full-time · Permanent",
    posted: "January 20, 2026",
    slots: 4,
    description: "Regional health authority recruiting internationally trained nurses. A credential recognition and bridging program is available. This role requires a consultation to evaluate your nursing license, NCLEX status, and identify the correct Express Entry or PNP stream.",
    tags: ["Express Entry", "Bridging Program", "Health Benefits"],
    consultOnly: true,
  },
  {
    id: 5,
    title: "Software Developer",
    noc: "NOC 21232",
    city: "Ottawa, ON",
    wage: "$80,000 – $120,000/yr",
    type: "Full-time · Permanent",
    posted: "March 22, 2026",
    slots: 2,
    description: "Tech company in the national capital region hiring mid-to-senior full-stack developers. Express Entry Global Talent Stream eligible with 2-week processing. This high-wage position requires an eligibility consultation to confirm your profile qualifies and to prepare your application.",
    tags: ["Global Talent Stream", "Remote Option", "Stock Options"],
    consultOnly: true,
  },
  {
    id: 6,
    title: "Long-Haul Truck Driver",
    noc: "NOC 73300",
    city: "Edmonton, AB",
    wage: "$28 – $40/hr",
    type: "Full-time · Permanent",
    posted: "February 28, 2026",
    slots: 10,
    description: "Logistics company with cross-Canada routes seeks Class 1 AZ-licensed drivers. Sign-on bonus of $2,000. LMIA process supported by employer. Due to licensing and regulatory requirements, this position requires a consultation to evaluate your credentials and pathway.",
    tags: ["LMIA Supported", "Class 1 License", "Sign-On Bonus"],
    consultOnly: true,
  },
  {
    id: 7,
    title: "Construction Worker",
    noc: "NOC 75110",
    city: "Winnipeg, MB",
    wage: "$20 – $28/hr",
    type: "Full-time · Seasonal → Permanent",
    posted: "April 10, 2026",
    slots: 15,
    description: "Infrastructure development company seeking general labourers for road and building projects in Winnipeg. No trade certification required. Manitoba PNP Skilled Workers stream available. Tools and safety gear provided. Apply now to be considered for the next intake.",
    tags: ["Manitoba PNP", "Fast Track", "Tools Provided"],
    consultOnly: false,
  },
  {
    id: 8,
    title: "Welder (Pressure Systems)",
    noc: "NOC 72106",
    city: "Halifax, NS",
    wage: "$30 – $45/hr",
    type: "Full-time · Permanent",
    posted: "January 8, 2026",
    slots: 3,
    description: "Marine and industrial firm seeking certified pressure welders. Employer is Atlantic Immigration Program (AIP) designated, enabling a direct pathway to permanent residence. A consultation is required to verify your welding certifications and confirm AIP eligibility.",
    tags: ["Atlantic Immigration Program", "AIP Designated", "Certification Bonus"],
    consultOnly: true,
  },
  {
    id: 9,
    title: "Early Childhood Educator",
    noc: "NOC 42202",
    city: "Quebec City, QC",
    wage: "$19 – $26/hr",
    type: "Full-time · Permanent",
    posted: "March 15, 2026",
    slots: 6,
    description: "Licensed government-subsidized daycare centre hiring ECEs for a French-language environment. ECE diploma or equivalent experience accepted. Quebec PEQ and Skilled Worker pathways available. French language an asset but not mandatory for initial application.",
    tags: ["Quebec PEQ", "French Asset", "Government Subsidized"],
    consultOnly: false,
  },
];

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200" style={{ minHeight: 340 }}>
        <Image src="/images/jobs-bg.jpg" alt="Canadian job opportunities for immigrants" fill className="object-cover object-center" priority sizes="100vw" />
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


