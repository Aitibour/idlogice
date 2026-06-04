const AUTH_REDIRECT_BASE = "https://idlogice.invalid";
const LOCALE_PREFIX = /^\/(?:en|fr|es|ar)(?=\/|$)/;

const ALLOWED_NEXT_PATHS = [
  "/evaluation",
  "/book-consultation",
  "/about",
  "/services",
  "/contact",
  "/jobs",
  "/calculator",
  "/dashboard",
  "/testimonials",
  "/faq",
];

/** Returns an allowlisted same-site auth destination or a safe fallback. */
export function safeAuthNext(next: string | null | undefined, fallback = "/evaluation"): string {
  if (!next) return fallback;

  let parsed: URL;
  try {
    parsed = new URL(next, AUTH_REDIRECT_BASE);
  } catch {
    return fallback;
  }

  if (parsed.origin !== AUTH_REDIRECT_BASE) return fallback;

  const pathWithoutLocale = parsed.pathname.replace(LOCALE_PREFIX, "") || "/";
  const isAllowed = ALLOWED_NEXT_PATHS.some(
    (path) => pathWithoutLocale === path || pathWithoutLocale.startsWith(`${path}/`),
  );

  return isAllowed ? `${parsed.pathname}${parsed.search}${parsed.hash}` : fallback;
}
