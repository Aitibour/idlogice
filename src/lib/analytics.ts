/**
 * GA4 event tracking helper — wraps window.gtag with TypeScript safety.
 * Use track() to send conversion events without crashing if gtag isn't loaded
 * (e.g. ad-blocker, server render).
 */

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: "event" | "config" | "set", action: string, params?: EventParams) => void;
  }
}

export function track(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  if (!window.gtag) return;
  try {
    window.gtag("event", event, params);
  } catch {
    /* no-op */
  }
}

// ── Pre-defined conversion events ────────────────────────────────────────

export const ga = {
  formSubmit: (formName: string, extra: EventParams = {}) =>
    track("form_submit", { form_name: formName, ...extra }),

  evaluationComplete: (score: number, eligible: boolean) =>
    track("evaluation_complete", {
      crs_score: score,
      eligible,
      score_band: score >= 491 ? "competitive" : score >= 400 ? "fair" : "low",
    }),

  ctaClick: (ctaType: string, location: string) =>
    track("cta_click", { cta_type: ctaType, cta_location: location }),

  signUp: (method: "email" | "google") =>
    track("sign_up", { method }),

  login: (method: "email" | "google") =>
    track("login", { method }),

  jobApplication: (jobTitle: string, noc: string, isEligibility: boolean) =>
    track(isEligibility ? "eligibility_request" : "job_application", {
      job_title: jobTitle,
      noc,
    }),

  bookConsultation: (channel: string) =>
    track("book_consultation", { channel }),

  outboundClick: (destination: string, label: string) =>
    track("outbound_click", { destination, label }),
};
