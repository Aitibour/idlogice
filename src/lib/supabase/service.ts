import { createClient } from "@supabase/supabase-js";

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase service credentials");
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * Build-time safe variant: returns null when credentials are missing
 * instead of throwing. Use in page/metadata generators so the build
 * can complete and pages render dynamically at runtime via ISR.
 */
export function tryCreateServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
