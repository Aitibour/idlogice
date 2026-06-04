/* ─────────────────────────────────────────────────────────────────────────
   Auth helpers — thin wrappers around Supabase Auth (browser client).
   Import createClient lazily so this file stays tree-shakeable on the
   server side.
───────────────────────────────────────────────────────────────────────── */

import { createClient } from "@/lib/supabase/client";
import { safeAuthNext } from "@/lib/auth-redirect";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

/** Derive a clean display name from email when no full_name is set. */
function deriveNameFromEmail(email: string): string {
  const prefix = email.split("@")[0] || "";
  return prefix
    .replace(/[._\-+]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** Returns the current Supabase session user, or null. */
export async function getUser(): Promise<AuthUser | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const meta = user.user_metadata || {};
  // Prefer the explicit full_name from signup; fall back to Google's name/given_name;
  // last resort: derive a readable name from the email prefix (never display the email).
  const name =
    meta.full_name ||
    meta.name ||
    [meta.given_name, meta.family_name].filter(Boolean).join(" ") ||
    deriveNameFromEmail(user.email ?? "");
  return {
    id: user.id,
    email: user.email ?? "",
    name,
    emailVerified: !!user.email_confirmed_at,
  };
}

/** Returns true if there is a live, email-confirmed session. */
export async function isLoggedIn(): Promise<boolean> {
  const u = await getUser();
  return u !== null && u.emailVerified;
}

/** Sign up with email + password. Supabase will send a verification email. */
export async function signUp(name: string, email: string, password: string, next = "/evaluation") {
  const supabase = createClient();
  const safeNext = safeAuthNext(next);
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
    },
  });
  if (error) throw error;
}

/** Sign in with email + password. */
export async function signIn(email: string, password: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

/** Sign in with Google OAuth (redirects to Google). */
export async function signInWithGoogle(next = "/evaluation") {
  const supabase = createClient();
  const safeNext = safeAuthNext(next);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
    },
  });
  if (error) throw error;
}

/** Sign out of Supabase session. */
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}
