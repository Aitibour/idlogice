"use client";

import { useTranslations } from "next-intl";
import { ContactForm } from "@/components/forms/contact-form";
import { Phone, Mail, MapPin, Clock, ExternalLink, ArrowUpRight } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("contact");

  const steps = [
    { n: "01", title: "Reviewed personally",  body: "A certified consultant reads every message." },
    { n: "02", title: "Reply within 24 h",    body: "Tailored response from our team." },
    { n: "03", title: "Free assessment",      body: "Best immigration path mapped to your profile." },
    { n: "04", title: "CICC registered",      body: "Regulated, confidential, and trusted." },
  ];

  return (
    <>
      {/* ── HERO (light theme) ──────────────────────────────────────────── */}
      <section className="relative bg-white pt-16 pb-40 overflow-hidden border-b border-border/40">
        <div className="relative z-10 container mx-auto px-4 w-full">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Contact Us</span>
            </div>
            <h1
              className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-5"
              style={{ color: "#111827" }}
            >
              Let&apos;s start your<br />
              <span className="text-primary">journey.</span>
            </h1>
            <p className="text-lg max-w-xl leading-relaxed" style={{ color: "#374151" }}>{t("hero.subtitle")}</p>
            <div className="flex flex-wrap items-center gap-5 mt-8">
              {[
                { icon: Phone, label: "+1 581-634-0224",      href: "tel:+15816340224" },
                { icon: Mail,  label: "contact@idlogice.com", href: "mailto:contact@idlogice.com" },
              ].map(({ icon: Icon, label, href }) => (
                <a key={href} href={href}
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors group"
                  style={{ color: "#374151" }}
                >
                  <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
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
          <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_360px] gap-5 items-start">

            {/* ── FORM CARD ─────────────────────────────────────────────── */}
            <div className="animate-fade-up bg-white rounded-3xl border border-border shadow-[0_4px_24px_-4px_oklch(0_0_0/0.08)] overflow-hidden">
              {/* Accent top bar — gradient */}
              <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-transparent" />

              <div className="p-8 lg:p-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Send a message</p>
                <h2 className="text-2xl font-bold mb-1" style={{ color: "#111827" }}>We&apos;re here to help</h2>
                <p className="text-sm mb-8" style={{ color: "#374151" }}>
                  A certified consultant will personally reply within 24 hours.
                </p>

                <ContactForm />

                {/* Process steps */}
                <div className="mt-10 pt-8 border-t border-border">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-5" style={{ color: "#374151" }}>
                    What happens next
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {steps.map(({ n, title, body }, i) => (
                      <div
                        key={n}
                        className="animate-float-up flex gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors group cursor-default"
                        style={{ animationDelay: `${300 + i * 70}ms` }}
                      >
                        <span className="text-[11px] font-black tabular-nums text-primary shrink-0 pt-px">{n}</span>
                        <div>
                          <p className="text-xs font-semibold mb-0.5 group-hover:text-primary transition-colors" style={{ color: "#111827" }}>{title}</p>
                          <p className="text-[11px] leading-relaxed" style={{ color: "#374151" }}>{body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN ──────────────────────────────────────────── */}
            <div className="flex flex-col gap-4">

              {/* CARD 1 — Quick contact buttons */}
              <div className="animate-fade-up delay-100 bg-white rounded-3xl border border-border shadow-[0_4px_24px_-4px_oklch(0_0_0/0.08)] overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/40 to-primary" />
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "#374151" }}>
                    Reach us directly
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Phone, label: "Call",  sub: "+1 581-634-0224",      href: "tel:+15816340224" },
                      { icon: Mail,  label: "Email", sub: "contact@idlogice.com", href: "mailto:contact@idlogice.com" },
                    ].map(({ icon: Icon, label, sub, href }) => (
                      <a
                        key={href} href={href}
                        className="group relative flex flex-col gap-3 p-4 rounded-2xl border border-primary bg-primary hover:bg-primary/90 transition-all duration-200 overflow-hidden"
                      >
                        <ArrowUpRight className="absolute top-3 right-3 size-3.5 text-white/70" />
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                          <Icon className="size-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{label}</p>
                          <p className="text-[10px] text-white/85 truncate mt-0.5">{sub}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD 2 — Address + Hours */}
              <div className="animate-fade-up delay-200 bg-white rounded-3xl border border-border shadow-[0_4px_24px_-4px_oklch(0_0_0/0.08)] overflow-hidden">
                <div className="divide-y divide-border">
                  {[
                    { icon: MapPin, label: "Office",  value: "410 Saint-Catherine St\nMontreal, QC, Canada" },
                    { icon: Clock,  label: "Hours",   value: "Mon – Fri\n9:00 AM – 6:00 PM EST" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-4 p-5">
                      <div className="w-9 h-9 rounded-xl bg-primary border border-primary flex items-center justify-center shrink-0">
                        <Icon className="size-4 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#374151" }}>{label}</p>
                        <p className="text-sm font-medium leading-snug whitespace-pre-line" style={{ color: "#111827" }}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 3 — Map */}
              <div className="animate-fade-up delay-300 rounded-3xl border border-border shadow-[0_4px_24px_-4px_oklch(0_0_0/0.08)] overflow-hidden bg-white">
                {/* Map */}
                <div className="relative h-[220px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2796.508!2d-73.5700!3d45.5088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91a439b07f2a9%3A0x3c23c52f6638bd36!2s410+Rue+Sainte-Catherine+O%2C+Montr%C3%A9al%2C+QC+H3B+1A7!5e0!3m2!1sen!2sca!4v1"
                    width="100%" height="100%"
                    style={{ border: 0, display: "block", filter: "grayscale(0.3) contrast(1.05)" }}
                    allowFullScreen loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="IDLOGICE Office"
                  />
                  {/* Center pin */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-9 h-9 rounded-full bg-primary flex items-center justify-center"
                        style={{ boxShadow: "0 0 0 6px oklch(0.52 0.22 27 / 0.2), 0 4px 12px oklch(0 0 0 / 0.3)" }}
                      >
                        <MapPin className="size-4 text-white" fill="rgba(255,255,255,0.3)" />
                      </div>
                      <div className="w-0.5 h-3 bg-primary/60 mt-0.5" />
                    </div>
                  </div>
                </div>

                {/* Footer bar */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-secondary/30">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-3.5 text-primary shrink-0" />
                    <span className="text-xs font-medium" style={{ color: "#374151" }}>410 Saint-Catherine St</span>
                  </div>
                  <a
                    href="https://maps.google.com/?q=410+Saint-Catherine+St+Montreal"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    Directions <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>

            </div>{/* end right column */}
          </div>
        </div>
      </section>
    </>
  );
}