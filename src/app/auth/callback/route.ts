import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Paths a successful auth callback is allowed to redirect to. */
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

/**
 * Validates the `next` param against an allowlist.
 * Rejects protocol-relative URLs (//evil.com), backslash bypasses, and
 * any path not in the allowlist. Falls back to /evaluation.
 */
function safeNext(next: string | null, origin: string): string {
  if (!next) return `${origin}/evaluation`;
  const decoded = decodeURIComponent(next);
  // Must start with a single / followed by a non-slash, non-backslash char
  if (!/^\/[^/\\]/.test(decoded)) return `${origin}/evaluation`;
  if (!ALLOWED_NEXT_PATHS.some((p) => decoded === p || decoded.startsWith(p + "/"))) {
    return `${origin}/evaluation`;
  }
  return `${origin}${decoded}`;
}

/**
 * Handles:
 *   • Email verification links (code= in URL)
 *   • Google OAuth redirect (code= in URL)
 *
 * After exchange, redirects to a validated `next` param (default: /evaluation).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(safeNext(next, origin));
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
