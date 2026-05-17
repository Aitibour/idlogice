"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Calendar, X } from "lucide-react";

/**
 * Sticky "Free profile evaluation" CTA — slides up from bottom after the user
 * scrolls past 600px. Dismissible per session.
 *
 * Hidden on conversion pages (book-consultation, login, register, checkout,
 * evaluation, calculator) where it would distract from the primary action.
 */
const HIDDEN_ROUTES = [
  "/book-consultation",
  "/login",
  "/register",
  "/checkout",
  "/book-consultation",
  "/calculator",
  "/dashboard",
];

export function StickyConsultCta() {
  const pathname = usePathname() || "";
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [newsletterCleared, setNewsletterCleared] = useState(false);

  // Strip locale segment for matching
  const pathWithoutLocale = pathname.replace(/^\/(en|fr|es|ar)/, "");

  const hidden = HIDDEN_ROUTES.some((r) => pathWithoutLocale.startsWith(r));

  // Gate the sticky CTA on the newsletter popup being dismissed.
  // The newsletter sets `idlogice_newsletter_dismissed` in localStorage when
  // closed, and the popup itself appears after 3500ms.
  useEffect(() => {
    if (hidden) return;
    function check() {
      const raw = localStorage.getItem("idlogice_newsletter_dismissed");
      if (raw) {
        const until = parseInt(raw, 10);
        // If the dismissal is in the future, the user has dismissed it.
        if (!Number.isNaN(until) && until > Date.now()) {
          setNewsletterCleared(true);
          return true;
        }
      }
      return false;
    }
    if (check()) return;
    // Poll briefly until the newsletter is dismissed (cheap and reliable).
    const id = setInterval(() => {
      if (check()) clearInterval(id);
    }, 500);
    return () => clearInterval(id);
  }, [hidden]);

  useEffect(() => {
    if (hidden || !newsletterCleared) return;
    if (sessionStorage.getItem("idlogice_sticky_cta_dismissed") === "1") {
      setDismissed(true);
      return;
    }
    function onScroll() {
      setShow(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [hidden, newsletterCleared]);

  function dismiss() {
    sessionStorage.setItem("idlogice_sticky_cta_dismissed", "1");
    setDismissed(true);
  }

  if (hidden || dismissed || !show) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100%-2rem)] pointer-events-auto">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm"
           style={{ background: "linear-gradient(135deg, #c2272d, #8b1a1f)" }}>
        <div className="hidden sm:flex w-9 h-9 rounded-xl bg-white/20 items-center justify-center">
          <Calendar className="size-4 text-white" />
        </div>
        <div className="text-white">
          <p className="text-sm font-bold leading-tight">Free Profile Evaluation</p>
          <p className="text-xs opacity-90 hidden sm:block">Find out if you qualify — no cost, no commitment.</p>
        </div>
        <Link
          href="/book-consultation"
          onClick={() => {
            if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
              (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", "cta_click", {
                cta_type: "sticky_evaluation",
                page_path: pathname,
              });
            }
          }}
          className="ml-1 inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white text-sm font-bold whitespace-nowrap hover:bg-gray-100 transition-colors shadow-md"
          style={{ color: "#c2272d" }}
        >
          Book Now →
        </Link>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-colors shrink-0"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
