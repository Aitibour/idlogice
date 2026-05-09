"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Send, Loader2, CheckCircle } from "lucide-react";

/* ── Floating-label field ───────────────────────────────────────────────── */
interface FieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  error?: string;
  rows?: number;
  delay?: number;
  onChange: (v: string) => void;
}

function FloatField({ id, name, label, type = "text", value, error, rows, delay = 0, onChange }: FieldProps) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  const base =
    "peer w-full bg-transparent border-0 border-b-2 border-border px-0 pt-6 pb-2 text-sm text-foreground " +
    "placeholder-transparent focus:outline-none focus:border-primary transition-colors duration-200 resize-none";

  return (
    <div
      className="animate-float-up relative group"
      style={{ animationDelay: `${delay}ms` }}
    >
      {rows ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          value={value}
          placeholder=" "
          className={base}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={e => onChange(e.target.value)}
          aria-describedby={error ? `${id}-err` : undefined}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          placeholder=" "
          className={base}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={e => onChange(e.target.value)}
          aria-describedby={error ? `${id}-err` : undefined}
        />
      )}

      {/* Floating label */}
      <label
        htmlFor={id}
        className={cn(
          "absolute left-0 pointer-events-none font-medium transition-all duration-200",
          lifted
            ? "top-0 text-[10px] tracking-widest uppercase text-primary"
            : "top-6 text-sm text-muted-foreground"
        )}
      >
        {label}
      </label>

      {/* Animated focus underline */}
      <span
        className={cn(
          "absolute bottom-0 left-0 h-[2px] bg-primary origin-left transition-transform duration-300",
          focused ? "scale-x-100" : "scale-x-0"
        )}
        style={{ width: "100%" }}
      />

      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-[11px] text-destructive font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Main form ──────────────────────────────────────────────────────────── */
export function ContactForm() {
  const t = useTranslations("contact");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t("form.errors.nameRequired");
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = t("form.errors.emailInvalid");
    if (!form.subject.trim()) e.subject = t("form.errors.subjectRequired");
    if (!form.message.trim()) e.message = t("form.errors.messageRequired");
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ "form-name": "contact-full", ...form }).toString(),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setServerError("Failed to send your message. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="animate-scale-in flex flex-col items-center justify-center py-16 text-center gap-4">
        <div className="relative w-20 h-20">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-30" />
          <div className="relative w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="size-10 text-primary animate-stat-pop" />
          </div>
        </div>
        <div>
          <p className="text-xl font-bold mb-1">{t("form.successTitle")}</p>
          <p className="text-sm text-muted-foreground max-w-xs">{t("form.successMessage")}</p>
        </div>
      </div>
    );
  }

  return (
    <form name="contact-full" onSubmit={handleSubmit} noValidate className="space-y-7">
      <input type="hidden" name="form-name" value="contact-full" />

      {/* Row 1: Name + Email */}
      <div className="grid sm:grid-cols-2 gap-7">
        <FloatField
          id="cf-name" name="name" label={t("form.name")}
          value={form.name} error={errors.name} delay={0} onChange={set("name")}
        />
        <FloatField
          id="cf-email" name="email" type="email" label={t("form.email")}
          value={form.email} error={errors.email} delay={80} onChange={set("email")}
        />
      </div>

      {/* Subject */}
      <FloatField
        id="cf-subject" name="subject" label={t("form.subject")}
        value={form.subject} error={errors.subject} delay={160} onChange={set("subject")}
      />

      {/* Message */}
      <FloatField
        id="cf-message" name="message" label={t("form.message")}
        value={form.message} error={errors.message} rows={4} delay={240} onChange={set("message")}
      />

      {serverError && (
        <p role="alert" className="text-xs text-destructive bg-destructive/8 border border-destructive/15 rounded-xl px-4 py-3">
          {serverError}
        </p>
      )}

      {/* Submit */}
      <div className="animate-float-up pt-2" style={{ animationDelay: "320ms" }}>
        <button
          type="submit"
          disabled={submitting}
          className="btn-shimmer group relative w-full flex items-center justify-center gap-2.5 h-12 rounded-xl bg-primary text-primary-foreground text-sm font-semibold tracking-wide hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              {t("form.submit")}
              <Send className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}