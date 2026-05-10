"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useTranslations } from "next-intl";

interface ContactInlineProps {
  eyebrow: string;
  title: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export function ContactInline({
  eyebrow, title, address, phone, email, hours,
}: ContactInlineProps) {
  const t = useTranslations("contactForm");
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "form-name": "contact",
          ...form,
        }).toString(),
      });
    } finally {
      setSubmitted(true);
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition";
  const inputStyle = { color: "#111827" } as const;
  const labelStyle = { color: "#1f2937" } as const;
  const headingStyle = { color: "#111827" } as const;
  const subTextStyle = { color: "#374151" } as const;

  return (
    <section className="py-20 bg-white border-y border-border/40">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</span>
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="text-center mb-12" style={{ color: "#111827" }}>{title}</h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Office info — red accent card */}
          <ScrollReveal>
            <div className="rounded-2xl overflow-hidden border border-border shadow-sm h-full flex flex-col">
              {/* Red header bar */}
              <div className="bg-primary px-7 py-5">
                <p className="font-bold text-base text-white">{t("ourOffice")}</p>
              </div>
              <div className="bg-white px-7 py-6 flex-1">
                <ul className="space-y-5">
                  {[
                    { icon: MapPin, label: t("address"),       content: address, href: undefined },
                    { icon: Phone,  label: t("phone"),         content: phone,   href: `tel:${phone.replace(/\s/g, "")}` },
                    { icon: Mail,   label: t("email"),         content: email,   href: `mailto:${email}` },
                    { icon: Clock,  label: t("businessHours"), content: hours,   href: undefined },
                  ].map(({ icon: Icon, label, content, href }) => (
                    <li key={label} className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="size-4 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#9ca3af" }}>{label}</p>
                        {href ? (
                          <a href={href} className="text-sm font-medium hover:text-primary transition-colors" style={{ color: "#111827" }}>{content}</a>
                        ) : (
                          <p className="text-sm font-medium whitespace-pre-line" style={{ color: "#111827" }}>{content}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal delay={150}>
            {submitted ? (
              <div className="rounded-2xl border border-border bg-white p-10 text-center flex items-center justify-center h-full min-h-[320px] shadow-sm">
                <div>
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                    <Send className="size-6 text-white" aria-hidden="true" />
                  </div>
                  <p className="text-xl font-bold mb-2" style={{ color: "#111827" }}>{t("messageSent")}</p>
                  <p className="text-sm" style={subTextStyle}>{t("messageSentSubtitle")}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-transparent" />
                <form name="contact" onSubmit={handleSubmit} className="space-y-4 p-7" noValidate>
                  <input type="hidden" name="form-name" value="contact" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ci-firstName" className="text-sm font-medium mb-1.5 block" style={labelStyle}>{t("firstName")}</label>
                      <input id="ci-firstName" name="firstName" required className={inputClass} style={inputStyle}
                        value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
                    </div>
                    <div>
                      <label htmlFor="ci-lastName" className="text-sm font-medium mb-1.5 block" style={labelStyle}>{t("lastName")}</label>
                      <input id="ci-lastName" name="lastName" required className={inputClass} style={inputStyle}
                        value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ci-phone" className="text-sm font-medium mb-1.5 block" style={labelStyle}>{t("mobileNo")}</label>
                      <input id="ci-phone" name="phone" type="tel" className={inputClass} style={inputStyle}
                        value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                    </div>
                    <div>
                      <label htmlFor="ci-email" className="text-sm font-medium mb-1.5 block" style={labelStyle}>{t("email")}</label>
                      <input id="ci-email" name="email" type="email" required className={inputClass} style={inputStyle}
                        value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="ci-message" className="text-sm font-medium mb-1.5 block" style={labelStyle}>{t("message")}</label>
                    <textarea id="ci-message" name="message" required rows={5}
                      className={cn(inputClass, "resize-none")} style={inputStyle}
                      value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                  </div>
                  <button type="submit" disabled={submitting}
                    className={cn(buttonVariants({ size: "lg" }), "w-full gap-2 disabled:opacity-60")}>
                    <Send className="size-4" aria-hidden="true" />
                    {submitting ? t("sending") : t("submit")}
                  </button>
                </form>
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
