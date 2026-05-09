"use client";

import { useState, useEffect } from "react";
import { X, Mail, ArrowRight, CheckCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "idlogice_newsletter_dismissed";
const DISMISS_DAYS = 7;

export function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const until = parseInt(raw, 10);
      if (Date.now() < until) return;
    }
    const timer = setTimeout(() => setVisible(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, String(Date.now() + DISMISS_DAYS * 86400_000));
    setVisible(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) { setError("Please enter a valid email address."); return; }
    setLoading(true);
    setError("");
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ "form-name": "newsletter", email }).toString(),
      });
      setSubmitted(true);
      setTimeout(dismiss, 2800);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={dismiss}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none">
        <div className={cn(
          "relative w-full max-w-md pointer-events-auto overflow-hidden rounded-3xl shadow-2xl",
          "bg-white border border-border",
          "animate-in fade-in zoom-in-95 duration-300",
        )}>
          {/* Top accent */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-transparent" />

          {/* Dismiss */}
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors z-10"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>

          {/* Hero strip */}
          <div
            className="relative h-36 bg-cover bg-center flex items-end"
            style={{ backgroundImage: "url('/images/feature-immigration.jpg')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
            <div className="relative z-10 px-6 pb-5">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="size-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">IDLOGICE · Montréal</span>
              </div>
              <p className="text-white text-lg font-bold leading-tight">
                Your Canadian dream<br />starts with the right info.
              </p>
            </div>
          </div>

          <div className="p-6">
            {submitted ? (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-4">
                  <CheckCircle className="size-7 text-green-500" />
                </div>
                <p className="text-sm font-bold mb-1">You&apos;re on the list!</p>
                <p className="text-xs text-muted-foreground">
                  We&apos;ll send you immigration updates, tips, and exclusive offers straight to your inbox.
                </p>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-1.5">Free Immigration Newsletter</p>
                <h2 className="text-xl font-bold mb-1 leading-snug">
                  Stay ahead of<br />Canadian immigration changes
                </h2>
                <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                  Get monthly updates on Express Entry draws, PNP streams, and policy changes — written by our certified RCICs.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3" name="newsletter" data-netlify="true">
                  <input type="hidden" name="form-name" value="newsletter" />
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="your@email.com"
                      className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 transition-colors placeholder:text-muted-foreground/40"
                      required
                    />
                  </div>
                  {error && <p className="text-xs text-destructive">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60"
                  >
                    {loading ? "Subscribing…" : "Subscribe — It's Free"}
                    {!loading && <ArrowRight className="size-4" />}
                  </button>
                </form>

                <p className="mt-3 text-center text-[10px] text-muted-foreground/60">
                  No spam. Unsubscribe at any time.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
