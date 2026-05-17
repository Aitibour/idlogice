"use client";

import { useState, useEffect, useRef } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { InlineWidget } from "react-calendly";
import {
  ArrowLeft, ArrowRight, Check, CheckCircle, Clock3,
  Lock, CreditCard, User, Mail, Phone, MessageSquare, CalendarCheck,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const PLANS: Record<string, { duration: string; price: number; description: string; tag: string | null }> = {
  starter: {
    duration: "30 min",
    price: 100,
    tag: null,
    description: "A focused first assessment — ideal if you have a specific question or want to know which pathway fits you best.",
  },
  standard: {
    duration: "1 hour",
    price: 160,
    tag: "Most Popular",
    description: "Deep-dive into your full profile with a personalised immigration roadmap and written summary sent after.",
  },
  premium: {
    duration: "2 hours",
    price: 250,
    tag: "Best Value",
    description: "Comprehensive strategy session for complex cases, families, or full application preparation.",
  },
};

const STEP_LIST = [
  { key: "info",     label: "Your Info", icon: User },
  { key: "payment",  label: "Payment",   icon: CreditCard },
  { key: "schedule", label: "Schedule",  icon: CalendarCheck },
] as const;

type StepKey = "info" | "payment" | "schedule" | "done";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  notes: string;
};

const INPUT =
  "w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors";

function Field({
  icon: Icon,
  label,
  required,
  error,
  children,
}: {
  icon: React.ElementType;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
        <Icon className="size-3.5 text-primary" />
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function StepBar({ current }: { current: StepKey }) {
  const order = ["info", "payment", "schedule"] as const;
  const idx = order.indexOf(current as typeof order[number]);
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEP_LIST.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s.key} className="flex items-center">
            {i > 0 && (
              <div className={cn("w-10 sm:w-16 h-px mx-2 transition-colors", done ? "bg-foreground" : "bg-border")} />
            )}
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  active  ? "bg-primary text-white shadow-md shadow-primary/30" :
                  done    ? "bg-foreground text-white" :
                            "bg-secondary text-muted-foreground",
                )}
              >
                {done ? <Check className="size-3.5" /> : <span>{i + 1}</span>}
              </div>
              <span className={cn("text-xs font-medium hidden sm:block", active ? "text-foreground" : "text-muted-foreground")}>
                {s.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CheckoutClient({ planId }: { planId?: string }) {
  const resolvedId = planId && PLANS[planId] ? planId : "standard";
  const plan = PLANS[resolvedId];

  const [step, setStep] = useState<StepKey>("info");
  const [form, setForm] = useState<FormData>({ fullName: "", email: "", phone: "", notes: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [paypalOrderId, setPaypalOrderId] = useState("");
  const [paid, setPaid] = useState(false);
  const mainPanelRef = useRef<HTMLDivElement>(null);
  const paypalRef = useRef<HTMLDivElement>(null);

  // Scroll main panel into view on step change.
  useEffect(() => {
    if (mainPanelRef.current) {
      const top = mainPanelRef.current.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [step]);

  // Watch PayPal container size — when the card form expands, scroll it below the header.
  useEffect(() => {
    if (!paypalRef.current || step !== "payment") return;
    const el = paypalRef.current;
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top < 100) {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [step]);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.event === "calendly.event_scheduled") {
        const calendlyUri = e.data.payload?.event?.uri ?? "scheduled";
        submitToNetlify(paypalOrderId, calendlyUri).then(() => setPaid(true));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [paypalOrderId]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validateInfo() {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!form.email.includes("@")) errs.email = "Enter a valid email";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function submitToNetlify(orderID: string, calendlyUri: string) {
    await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        "form-name": "consultation-booking",
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        notes: form.notes,
        plan: `${plan.duration} — $${plan.price} CAD`,
        price: plan.price.toString(),
        calendlyEventUri: calendlyUri,
        paypalOrderId: orderID,
      }).toString(),
    });
  }

  const CALENDLY_URLS: Record<string, string> = {
    starter:  "https://calendly.com/meeting-idlogice/30min",
    standard: "https://calendly.com/meeting-idlogice/1h-consultation-meeting",
    premium:  "https://calendly.com/meeting-idlogice/2h-consultation-meeting",
  };
  const calendlyBase = CALENDLY_URLS[resolvedId];

  /* ── Done screen ─────────────────────────────────────────────────────────── */
  if (paid) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-3xl border border-border shadow-lg p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="size-8 text-green-500" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">Booking Confirmed</p>
          <h2 className="text-2xl font-bold mb-3">You&apos;re all set, {form.fullName.split(" ")[0]}!</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Payment received and your {plan.duration} slot is reserved. You&apos;ll receive a calendar invite and confirmation email shortly.
          </p>
          <div className="rounded-2xl bg-secondary/40 p-4 text-sm text-left space-y-2 mb-6">
            <p><span className="font-semibold">Plan:</span> {plan.duration} — ${plan.price} CAD</p>
            <p><span className="font-semibold">Email:</span> {form.email}</p>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  /* ── Sidebar ─────────────────────────────────────────────────────────────── */
  const sidebar = (
    <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden sticky top-24">
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/40 to-primary" />
      <div className="p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Order summary</p>

        <div className="rounded-2xl border border-border bg-gray-50 p-4 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock3 className="size-4 text-primary" />
            <span className="text-sm font-bold">{plan.duration} Consultation</span>
            {plan.tag && (
              <span className="ml-auto text-[11px] font-bold bg-primary text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                {plan.tag}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{plan.description}</p>
        </div>

        <div className="divide-y divide-border">
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="text-sm font-semibold">${plan.price}.00 CAD</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-bold">Total due today</span>
            <div className="text-right">
              <span className="text-2xl font-black">${plan.price}</span>
              <span className="text-sm font-normal text-muted-foreground ml-1">CAD</span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {[
            { label: "Your info",   done: step === "payment" || step === "schedule" },
            { label: "Payment",     done: !!paypalOrderId },
            { label: "Slot booked", done: false },
          ].map(({ label, done }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center border text-[9px]",
                done ? "bg-green-500 border-green-500 text-white" : "border-border text-muted-foreground",
              )}>
                {done && <Check className="size-2.5" />}
              </div>
              <span className={cn("text-xs", done ? "text-foreground line-through decoration-muted-foreground/40" : "text-muted-foreground")}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Lock className="size-3.5 text-muted-foreground" />
          <p className="text-[10px] text-muted-foreground">256-bit SSL · Powered by PayPal</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <Link
          href="/book-consultation"
          className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors mb-8"
          style={{ color: "#374151" }}
        >
          <ArrowLeft className="size-4" />
          Back to plans
        </Link>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">

          {/* ── Main panel ───────────────────────────────────────────────── */}
          <div ref={mainPanelRef} className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden scroll-mt-24">
            <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-transparent" />
            <div className="p-7 lg:p-9">
              <StepBar current={step} />

              {/* ── STEP 1: Info ──────────────────────────────────────────── */}
              {step === "info" && (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Step 1</p>
                  <h2 className="text-xl font-bold mb-1">Tell us about yourself</h2>
                  <p className="text-sm text-muted-foreground mb-7">
                    We&apos;ll pre-fill your details when you pick a time slot.
                  </p>

                  <div className="space-y-4">
                    <Field icon={User} label="Full Name" required error={errors.fullName}>
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        placeholder="Jane Doe"
                        className={cn(INPUT, errors.fullName && "border-destructive")}
                      />
                    </Field>

                    <Field icon={Mail} label="Email Address" required error={errors.email}>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="jane@example.com"
                        className={cn(INPUT, errors.email && "border-destructive")}
                      />
                    </Field>

                    <Field icon={Phone} label="Phone Number">
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+1 514 000 0000"
                        className={INPUT}
                      />
                    </Field>

                    <Field icon={MessageSquare} label="Notes / Questions">
                      <textarea
                        value={form.notes}
                        onChange={(e) => handleChange("notes", e.target.value)}
                        placeholder="Any context or questions for your consultant…"
                        rows={3}
                        className={cn(INPUT, "resize-none")}
                      />
                    </Field>
                  </div>

                  <button
                    onClick={() => validateInfo() && setStep("payment")}
                    className="mt-7 w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm shadow-primary/20"
                  >
                    Continue to Payment
                    <ArrowRight className="size-4" />
                  </button>
                </>
              )}

              {/* ── STEP 2: Payment ───────────────────────────────────────── */}
              {step === "payment" && (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Step 2</p>
                    <button
                      onClick={() => setStep("info")}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      <ArrowLeft className="size-3" /> Edit info
                    </button>
                  </div>
                  <h2 className="text-xl font-bold mb-1">Complete payment</h2>
                  <p className="text-sm text-muted-foreground mb-7">
                    Pay securely to unlock your appointment booking.
                  </p>

                  <div className="rounded-2xl border border-border bg-gray-50 p-4 mb-7 space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="font-medium">{form.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium">{form.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Session</span>
                      <span className="font-medium">{plan.duration} · ${plan.price} CAD</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="size-3.5 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Secure checkout — pay by card or PayPal balance</p>
                  </div>

                  <PayPalScriptProvider
                    options={{
                      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "sb",
                      currency: "CAD",
                    }}
                  >
                    <div ref={paypalRef} className="scroll-mt-28">
                    <PayPalButtons
                      style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay", height: 48 }}
                      createOrder={(_data, actions) =>
                        actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [
                            {
                              amount: { currency_code: "CAD", value: plan.price.toFixed(2) },
                              description: `IDLOGICE ${plan.duration} Immigration Consultation`,
                            },
                          ],
                        })
                      }
                      onApprove={async (data, actions) => {
                        await actions.order?.capture();
                        setPaypalOrderId(data.orderID);
                        setStep("schedule");
                      }}
                    />
                    </div>
                  </PayPalScriptProvider>
                </>
              )}

              {/* ── STEP 3: Calendly ──────────────────────────────────────── */}
              {step === "schedule" && (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Step 3</p>
                  <h2 className="text-xl font-bold mb-1">Reserve your slot</h2>
                  <div className="flex items-start gap-2 mb-5">
                    <CheckCircle className="size-4 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700 font-medium">
                      Payment confirmed — choose your appointment date and time below.
                    </p>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-border">
                    <InlineWidget
                      url={calendlyBase}
                      prefill={{
                        name: form.fullName,
                        email: form.email,
                        customAnswers: { a1: form.phone },
                      }}
                      styles={{ height: "660px", minWidth: "280px" }}
                    />
                  </div>
                  <p className="mt-3 text-[11px] text-muted-foreground text-center">
                    Your booking is confirmed automatically once you select a slot.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          {sidebar}
        </div>
      </div>
    </div>
  );
}
