"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const t = useTranslations("contact");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t("form.errors.nameRequired");
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = t("form.errors.emailInvalid");
    }
    if (!form.subject.trim()) e.subject = t("form.errors.subjectRequired");
    if (!form.message.trim()) e.message = t("form.errors.messageRequired");
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    // Backend not yet wired (P2). Show success optimistically.
    setSubmitted(true);
  }

  const inputClass =
    "w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  if (submitted) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="text-lg font-semibold mb-2">{t("form.successTitle")}</p>
        <p className="text-muted-foreground">{t("form.successMessage")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label className="text-sm font-medium mb-1 block" htmlFor="name">
          {t("form.name")}
        </label>
        <input
          id="name"
          className={inputClass}
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-xs text-destructive mt-1">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block" htmlFor="email">
          {t("form.email")}
        </label>
        <input
          id="email"
          type="email"
          className={inputClass}
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-destructive mt-1">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block" htmlFor="subject">
          {t("form.subject")}
        </label>
        <input
          id="subject"
          className={inputClass}
          value={form.subject}
          onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
          aria-describedby={errors.subject ? "subject-error" : undefined}
        />
        {errors.subject && (
          <p id="subject-error" className="text-xs text-destructive mt-1">
            {errors.subject}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block" htmlFor="message">
          {t("form.message")}
        </label>
        <textarea
          id="message"
          rows={5}
          className={cn(inputClass, "resize-none")}
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="text-xs text-destructive mt-1">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className={cn(buttonVariants({ size: "lg" }), "w-full")}
      >
        {t("form.submit")}
      </button>
    </form>
  );
}
