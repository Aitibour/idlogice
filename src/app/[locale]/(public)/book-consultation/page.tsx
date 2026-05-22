import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book an Immigration Consultation — Montréal",
  description: "Book a one-on-one consultation with a CICC-registered Canadian immigration consultant. 30-min, 1-hour, and 2-hour sessions available. Expert guidance for Express Entry, PNP, work permits and more.",
  alternates: { canonical: "https://idlogice.com/book-consultation" },
  openGraph: { title: "Book Immigration Consultation | IDLOGICE Montréal", description: "One-on-one sessions with certified RCICs. Choose from 30-min, 1-hour, or 2-hour consultation packages.", url: "https://idlogice.com/book-consultation" },
};

import { Link } from "@/i18n/navigation";
import {
  Phone, Mail, MapPin, Clock, ArrowUpRight,
  CheckCircle, Users, Shield, Star, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "starter",
    duration: "30 min",
    price: 100,
    tag: null,
    description: "A focused first assessment — ideal if you have a specific question or want to know which pathway fits you best.",
    includes: [
      "Initial CRS profile review",
      "Express Entry eligibility check",
      "Top 2–3 pathway recommendations",
      "Q&A with a certified RCIC",
    ],
  },
  {
    id: "standard",
    duration: "1 hour",
    price: 200,
    tag: "Most Popular",
    description: "Deep-dive into your full profile with a personalised immigration roadmap and written summary sent after.",
    includes: [
      "Full CRS score breakdown & analysis",
      "Detailed pathway comparison (EE, PNP, etc.)",
      "Document checklist tailored to your case",
      "Language score improvement strategy",
      "Written summary emailed after the session",
      "Q&A with a certified RCIC",
    ],
  },
  {
    id: "premium",
    duration: "2 hours",
    price: 280,
    tag: "Best Value",
    description: "Comprehensive strategy session for complex cases, families, or full application preparation.",
    includes: [
      "Everything in the 1-hour session",
      "Spousal / family profile review",
      "PNP stream matching & comparison",
      "Job offer & LMIA guidance",
      "Full application timeline planning",
      "Priority follow-up by email (48 h)",
    ],
  },
];

const STEPS = [
  { n: "01", title: "Choose a plan",      body: "Pick the session length that fits your needs below." },
  { n: "02", title: "Send a message",     body: "Contact us and mention your preferred time slot." },
  { n: "03", title: "Get confirmed",      body: "We confirm your appointment within 24 hours by email." },
  { n: "04", title: "Meet in person",     body: "Attend your RDV at our Montréal office." },
];

const TRUST = [
  { icon: Shield,       value: "CICC Registered",  sub: "Regulated Canadian Immigration Consultants" },
  { icon: Star,         value: "95% Success Rate",  sub: "Across 500+ cases since 2014" },
  { icon: Users,        value: "50+ Countries",     sub: "Clients from around the world" },
];

export default function BookConsultationPage() {
  return (
    <>
      {/* ── HERO (light theme) ──────────────────────────────────────────── */}
      <section className="relative bg-white pt-16 pb-40 overflow-hidden border-b border-border/40">
        <div className="relative z-10 container mx-auto px-4 w-full">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Free Profile Evaluation</span>
            </div>
            <h1
              className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-5"
              style={{ color: "#111827" }}
            >
              Turn your dream<br />
              <span className="text-primary">into a plan.</span>
            </h1>
            <p className="text-lg max-w-xl leading-relaxed" style={{ color: "#374151" }}>
              Meet face-to-face with a Regulated Canadian Immigration Consultant (RCIC). One session can change everything.
            </p>
            <div className="flex flex-wrap items-center gap-5 mt-8">
              {[
                { icon: Phone, label: "+1 581-634-0224",      href: "tel:+15816340224" },
                { icon: Mail,  label: "contact@idlogice.com", href: "mailto:contact@idlogice.com" },
              ].map(({ icon: Icon, label, href }) => (
                <a key={href} href={href}
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors group"
                  style={{ color: "#374151" }}
                >
                  <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Icon className="size-3.5 text-primary group-hover:text-white" />
                  </span>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN SECTION ─────────────────────────────────────────────────── */}
      <section className="bg-white pb-24 -mt-32 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_340px] gap-5 items-start">

            {/* ── LEFT: Pricing tiers card ──────────────────────────────── */}
            <div className="animate-fade-up bg-white rounded-3xl border border-border shadow-[0_4px_24px_-4px_oklch(0_0_0/0.08)] overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-transparent" />
              <div className="p-8 lg:p-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Consultation fees</p>
                <h2 className="text-2xl font-bold mb-1">Choose your session</h2>
                <p className="text-sm text-muted-foreground mb-8">
                  All sessions are held in person by appointment only (RDV). Fees are non-refundable once confirmed.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {PLANS.map((plan, i) => {
                    const isPopular = plan.tag === "Most Popular";
                    const isPremium = plan.tag === "Best Value";
                    return (
                      <div
                        key={plan.id}
                        className={cn(
                          "relative rounded-2xl overflow-hidden transition-all duration-200 flex flex-col",
                          isPopular
                            ? "shadow-xl shadow-foreground/15"
                            : "border border-border hover:border-primary/25 hover:shadow-md",
                        )}
                        style={isPopular ? { background: "oklch(0.52 0.22 27)" } : undefined}
                      >
                        {/* Top accent bar */}
                        <div
                          className="h-[3px] w-full shrink-0"
                          style={{
                            background: isPopular
                              ? "oklch(0.65 0.18 27)"
                              : isPremium
                              ? "linear-gradient(to right, oklch(0.52 0.22 27), oklch(0.52 0.22 27 / 0.3))"
                              : "oklch(0.90 0 0)",
                          }}
                        />

                        <div className="p-5 flex flex-col flex-1">
                          {/* Top row: index + tag */}
                          <div className="flex items-center justify-between mb-4">
                            <span
                              className="text-[10px] font-black tabular-nums tracking-widest"
                              style={{ color: isPopular ? "oklch(0.90 0.08 27)" : "oklch(0.75 0 0)" }}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            {plan.tag && (
                              <span
                                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                                style={
                                  isPopular
                                    ? { background: "oklch(0.90 0.08 27/0.2)", color: "white" }
                                    : { background: "oklch(0.13 0 0)", color: "white" }
                                }
                              >
                                {plan.tag}
                              </span>
                            )}
                          </div>

                          {/* Duration + price */}
                          <p
                            className="text-[26px] font-black leading-none tracking-tight mb-1"
                            style={{ color: isPopular ? "white" : "oklch(0.13 0 0)" }}
                          >
                            {plan.duration}
                          </p>
                          <div className="flex items-baseline gap-1 mb-3">
                            <span
                              className="text-3xl font-black leading-none"
                              style={{ color: isPopular ? "white" : "oklch(0.13 0 0)" }}
                            >
                              ${plan.price}
                            </span>
                            <span
                              className="text-[10px] tracking-wide"
                              style={{ color: isPopular ? "oklch(0.90 0.08 27)" : "oklch(0.65 0 0)" }}
                            >
                              CAD
                            </span>
                          </div>

                          {/* Description */}
                          <p
                            className="text-[11px] leading-relaxed mb-4"
                            style={{ color: isPopular ? "oklch(0.93 0.05 27)" : "oklch(0.55 0 0)" }}
                          >
                            {plan.description}
                          </p>

                          {/* Includes */}
                          <ul className="flex flex-col gap-1.5 mb-5 flex-1">
                            {plan.includes.map((item) => (
                              <li key={item} className="flex items-center gap-1.5">
                                <CheckCircle
                                  className="size-3 shrink-0"
                                  style={{ color: isPopular ? "white" : "oklch(0.52 0.22 27)" }}
                                />
                                <span
                                  className="text-[11px]"
                                  style={{ color: isPopular ? "oklch(0.93 0.05 27)" : "oklch(0.50 0 0)" }}
                                >
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>

                          {/* CTA */}
                          <Link
                            href={`/book-consultation/checkout?plan=${plan.id}`}
                            className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl text-xs font-bold active:scale-[0.97] transition-all"
                            style={
                              isPopular
                                ? { background: "white", color: "oklch(0.52 0.22 27)" }
                                : { background: "oklch(0.13 0 0)", color: "white" }
                            }
                          >
                            Book now
                            <ArrowRight className="size-3" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <div className="mt-8 pt-6 border-t border-border flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Prefer to call?</span>
                  <a
                    href="tel:+15816340224"
                    className="flex items-center gap-2 h-9 px-4 rounded-xl border border-border bg-secondary/40 hover:bg-secondary text-sm font-semibold transition-colors"
                  >
                    <Phone className="size-3.5" />
                    +1 581-634-0224
                  </a>
                </div>

                {/* Process steps */}
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-5">How it works</p>
                  <div className="grid grid-cols-2 gap-4">
                    {STEPS.map(({ n, title, body }, i) => (
                      <div
                        key={n}
                        className="animate-float-up flex gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-default"
                        style={{ animationDelay: `${300 + i * 70}ms` }}
                      >
                        <span className="text-[11px] font-black tabular-nums text-primary/30 shrink-0 pt-px">{n}</span>
                        <div>
                          <p className="text-xs font-semibold mb-0.5">{title}</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT column ──────────────────────────────────────────── */}
            <div className="flex flex-col gap-4">

              {/* Trust signals */}
              <div className="animate-fade-up delay-100 bg-white rounded-3xl border border-border shadow-[0_4px_24px_-4px_oklch(0_0_0/0.08)] overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/40 to-primary" />
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "#9ca3af" }}>Why choose IDLOGICE</p>
                  <div className="space-y-3">
                    {TRUST.map(({ icon: Icon, value, sub }) => (
                      <div key={value} className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-white hover:border-primary/30 hover:bg-gray-50 transition-colors">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <Icon className="size-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-bold" style={{ color: "#111827" }}>{value}</p>
                          <p className="text-[10px] leading-snug" style={{ color: "#6b7280" }}>{sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick contact */}
              <div className="animate-fade-up delay-200 bg-white rounded-3xl border border-border shadow-[0_4px_24px_-4px_oklch(0_0_0/0.08)] overflow-hidden">
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "#9ca3af" }}>Reach us directly</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Phone, label: "Call",  sub: "+1 581-634-0224",      href: "tel:+15816340224" },
                      { icon: Mail,  label: "Email", sub: "contact@idlogice.com", href: "mailto:contact@idlogice.com" },
                    ].map(({ icon: Icon, label, sub, href }) => (
                      <a key={href} href={href}
                        className="group relative flex flex-col gap-3 p-4 rounded-2xl border border-border bg-white hover:bg-primary hover:border-primary transition-all duration-200 overflow-hidden"
                      >
                        <ArrowUpRight className="absolute top-3 right-3 size-3.5 text-primary/40 group-hover:text-white/70 transition-colors" />
                        <div className="w-9 h-9 rounded-xl bg-primary/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                          <Icon className="size-4 text-primary group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="text-xs font-bold group-hover:text-white transition-colors" style={{ color: "#111827" }}>{label}</p>
                          <p className="text-[10px] group-hover:text-white/70 transition-colors truncate mt-0.5" style={{ color: "#6b7280" }}>{sub}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Office info */}
              <div className="animate-fade-up delay-300 bg-white rounded-3xl border border-border shadow-[0_4px_24px_-4px_oklch(0_0_0/0.08)] overflow-hidden">
                <div className="divide-y divide-border">
                  {[
                    { icon: MapPin, label: "Office",  value: "410 Saint-Catherine St\nMontreal, QC, Canada" },
                    { icon: Clock,  label: "Hours",   value: "Mon – Fri\n9:00 AM – 6:00 PM EST" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-4 p-5">
                      <div className="w-9 h-9 rounded-xl bg-primary/8 border border-primary/12 flex items-center justify-center shrink-0">
                        <Icon className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#9ca3af" }}>{label}</p>
                        <p className="text-sm font-medium leading-snug whitespace-pre-line" style={{ color: "#111827" }}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RDV notice */}
              <div className="animate-fade-up delay-400 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-bold text-amber-800 mb-1">By Appointment Only — RDV</p>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  All in-person sessions require a confirmed appointment. Walk-ins are not accepted. Book via the contact form or by phone.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
