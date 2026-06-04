import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeAuthNext } from "@/lib/auth-redirect";

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
      return NextResponse.redirect(`${origin}${safeAuthNext(next)}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
