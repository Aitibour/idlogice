"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { signIn, signUp, signInWithGoogle, getUser } from "@/lib/auth";
import { ga } from "@/lib/analytics";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, CheckCircle, MailCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Google icon SVG ─────────────────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/evaluation";
  const authError = params.get("error");
  const mode = params.get("mode");

  const [tab, setTab] = useState<"signin" | "signup">(mode === "signin" ? "signin" : "signup");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(authError === "auth_failed" ? "Authentication failed. Please try again." : "");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [state, setState] = useState<"form" | "verify_email">("form");

  useEffect(() => {
    getUser().then(u => {
      if (u?.emailVerified) router.replace(next);
    });
  }, [next, router]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Please fill in all required fields."); return; }
    if (tab === "signup" && !form.name.trim()) { setError("Please enter your full name."); return; }
    if (form.password.length < 12) { setError("Password must be at least 12 characters."); return; }

    setLoading(true);
    try {
      if (tab === "signup") {
        await signUp(form.name.trim(), form.email, form.password, next);
        ga.signUp("email");
        setState("verify_email");
      } else {
        await signIn(form.email, form.password);
        // Check email verification after sign-in
        const u = await getUser();
        if (u && !u.emailVerified) {
          setError("Please verify your email address first. Check your inbox for the verification link.");
        } else {
          ga.login("email");
          router.push(next);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred. Please try again.";
      setError(msg.replace("AuthApiError: ", ""));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
      ga.login("google");
      await signInWithGoogle(next);
      // Redirect happens in signInWithGoogle — no further action needed
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not sign in with Google.";
      setError(msg);
      setGoogleLoading(false);
    }
  }

  const inputClass = "w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400";

  const benefits = [
    "Get your Express Entry CRS score instantly",
    "See exactly what you need to improve",
    "Personalised pathway recommendations",
    "Connect with a certified RCIC consultant",
  ];

  /* ── Email verification screen ─────────────────────────────────────────── */
  if (state === "verify_email") {
    return (
      <main className="min-h-screen flex items-center justify-center py-16 px-4" style={{ background: "#f9fafb" }}>
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <MailCheck className="size-10 text-primary" />
          </div>
          <h1 className="text-2xl font-black mb-3" style={{ color: "#111827" }}>Check your email</h1>
          <p className="text-sm leading-relaxed mb-2" style={{ color: "#6b7280" }}>
            We sent a verification link to
          </p>
          <p className="font-bold mb-6" style={{ color: "#111827" }}>{form.email}</p>
          <p className="text-sm leading-relaxed mb-8" style={{ color: "#374151" }}>
            Click the link in your email to verify your account, then come back here to sign in. The link expires in 24 hours.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => { setState("form"); setTab("signin"); }}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 shadow-md shadow-primary/25 transition-all"
            >
              I&apos;ve verified — Sign In
              <ArrowRight className="size-4" />
            </button>
            <button
              onClick={() => setState("form")}
              className="w-full h-10 rounded-xl text-sm font-medium transition-colors hover:bg-gray-50"
              style={{ color: "#374151" }}
            >
              ← Back
            </button>
          </div>
          <p className="mt-6 text-xs" style={{ color: "#9ca3af" }}>
            Didn&apos;t get the email? Check your spam folder or{" "}
            <button onClick={() => setState("form")} className="text-primary font-semibold hover:underline">try again</button>.
          </p>
        </div>
      </main>
    );
  }

  /* ── Main login/signup form ─────────────────────────────────────────────── */
  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: "linear-gradient(135deg, #fef2f2 0%, #f9fafb 50%, #fef3c7 100%)" }}>
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-xl bg-white border border-gray-100">

        {/* ── Left: light brand panel ─────────────────────────────────────── */}
        <div className="hidden lg:flex flex-col p-10 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)" }}>
          {/* Decorative gradient orb */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #c2272d, transparent)" }} />

          <div className="relative flex-1 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                IDLOGICE Immigration
              </p>
            </div>

            <h2 className="text-4xl font-black leading-tight tracking-tight mb-5" style={{ color: "#111827" }}>
              Your path to<br />
              <span style={{ background: "linear-gradient(135deg, #c2272d, #8b1a1f)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Canada starts here.</span>
            </h2>
            <p className="text-base leading-relaxed mb-10" style={{ color: "#374151" }}>
              Create a free account to access your Express Entry CRS evaluation and connect with our certified RCIC consultants.
            </p>

            <ul className="space-y-3.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle className="size-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "#111827" }}>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mt-8 pt-6 border-t border-gray-200 z-10">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle className="size-4 text-primary" />
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>
                <strong style={{ color: "#111827" }}>RCIC Regulated.</strong> IDLOGICE consultants are registered with the College of Immigration and Citizenship Consultants (CICC).
              </p>
            </div>
          </div>
        </div>

        {/* ── Right: form panel ───────────────────────────────────────────── */}
        <div className="flex flex-col p-8 lg:p-10 bg-white">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold transition-colors hover:text-primary" style={{ color: "#6b7280" }}>
              ← Back to homepage
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl mb-7" style={{ background: "#f3f4f6" }}>
            {(["signup", "signin"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={cn(
                  "flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200",
                  tab === t ? "bg-white shadow-sm" : "hover:bg-white/50"
                )}
                style={{ color: tab === t ? "#111827" : "#6b7280" }}
              >
                {t === "signup" ? "Create Account" : "Sign In"}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-black mb-2 tracking-tight" style={{ color: "#111827" }}>
              {tab === "signup" ? "Create your free account" : "Welcome back"}
            </h1>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              {tab === "signup"
                ? "Sign up to access your Express Entry evaluation."
                : "Sign in to access your evaluation and profile."}
            </p>
          </div>

          {/* Google OAuth button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border-2 border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5 text-sm font-bold transition-all mb-5 disabled:opacity-60"
            style={{ color: "#111827" }}
          >
            {googleLoading ? (
              <span className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {tab === "signup" ? "Sign up with Google" : "Sign in with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
            <span className="text-xs font-semibold" style={{ color: "#6b7280" }}>or with email</span>
            <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 flex-1">
            {tab === "signup" && (
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "#111827" }}>Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4" style={{ color: "#9ca3af" }} />
                  <input
                    type="text" placeholder="John Smith"
                    value={form.name} onChange={set("name")}
                    className={inputClass} required autoComplete="name"
                    style={{ color: "#111827" }}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "#111827" }}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4" style={{ color: "#9ca3af" }} />
                <input
                  type="email" placeholder="you@example.com"
                  value={form.email} onChange={set("email")}
                  className={inputClass} required autoComplete="email"
                  style={{ color: "#111827" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "#111827" }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4" style={{ color: "#9ca3af" }} />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="At least 12 characters"
                  value={form.password} onChange={set("password")}
                  className={cn(inputClass, "pr-11")} required
                  autoComplete={tab === "signup" ? "new-password" : "current-password"}
                  style={{ color: "#111827" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors hover:text-primary"
                  style={{ color: "#9ca3af" }}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 text-xs bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3" style={{ color: "#b91c1c" }}>
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {tab === "signup" && (
              <p className="text-xs leading-relaxed px-1" style={{ color: "#6b7280" }}>
                <strong style={{ color: "#374151" }}>📧 Email verification required.</strong> We&apos;ll send you a link to confirm your address before you can access the evaluation.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-shimmer w-full flex items-center justify-center gap-2 h-12 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-60 !mt-5 shadow-md shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.01] active:scale-[0.99]"
              style={{ background: "linear-gradient(135deg, #c2272d, #8b1a1f)" }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {tab === "signup" ? "Creating account…" : "Signing in…"}
                </span>
              ) : (
                <>
                  {tab === "signup" ? "Create My Free Account" : "Sign In & Continue"}
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-xs text-center" style={{ color: "#6b7280" }}>
            {tab === "signup" ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => { setTab(tab === "signup" ? "signin" : "signup"); setError(""); }}
              className="text-primary font-bold hover:underline"
            >
              {tab === "signup" ? "Sign in instead" : "Create one for free"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
