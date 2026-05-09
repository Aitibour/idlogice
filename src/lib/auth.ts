/* ─────────────────────────────────────────────────────────────────────────
   Auth helpers — thin wrappers around Supabase Auth (browser client).
   Import createClient lazily so this file stays tree-shakeable on the
   server side.
───────────────────────────────────────────────────────────────────────── */

import { createClient } from "@/lib/supabase/client";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

/** Returns the current Supabase session user, or null. */
export async function getUser(): Promise<AuthUser | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return {
    id: user.id,
    email: user.email ?? "",
    name: user.user_metadata?.full_name ?? user.email ?? "",
    emailVerified: !!user.email_confirmed_at,
  };
}

/** Returns true if there is a live, email-confirmed session. */
export async function isLoggedIn(): Promise<boolean> {
  const u = await getUser();
  return u !== null && u.emailVerified;
}

/** Sign up with email + password. Supabase will send a verification email. */
export async function signUp(name: string, email: string, password: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${location.origin}/auth/callback?next=/evaluation`,
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
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
  if (error) throw error;
}

/** Sign out of Supabase session. */
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}