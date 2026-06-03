"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { X, Cookie } from "lucide-react";

export function CookieConsent() {
  const [visible, setVisible] = useState(() => {
    try {
      return !localStorage.getItem("idlogice_cookie_consent");
    } catch {
      return false;
    }
  });

  function accept() {
    try { localStorage.setItem("idlogice_cookie_consent", "accepted"); } catch {}
    setVisible(false);
  }

  function decline() {
    try { localStorage.setItem("idlogice_cookie_consent", "declined"); } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 animate-fade-up"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-border shadow-2xl shadow-black/10 overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-transparent" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Cookie className="size-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold mb-0.5" style={{ color: "#111827" }}>
              We use cookies
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>
              We use cookies to improve your experience and comply with Quebec Law 25 &amp; GDPR.
              Your data stays private.{" "}
              <Link href="/cookies" className="text-primary underline underline-offset-2 hover:no-underline">
                Learn more
              </Link>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={decline}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-gray-50 transition-colors"
              style={{ color: "#374151" }}
            >
              Decline
            </button>
            <button
              onClick={accept}
              className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Accept all
            </button>
            <button
              onClick={accept}
              aria-label="Close"
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0"
              style={{ color: "#9ca3af" }}
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
