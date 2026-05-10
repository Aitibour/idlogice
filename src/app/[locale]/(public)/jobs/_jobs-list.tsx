"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Calendar, Briefcase, ChevronRight, ChevronDown, Lock, CheckCircle, X, User, Globe, Clock, Mail, UserPlus } from "lucide-react";
import { getUser, type AuthUser } from "@/lib/auth";

type Job = {
  id: number;
  title: string;
  noc: string;
  city: string;
  wage: string;
  type: string;
  posted: string;
  slots: number;
  description: string;
  tags: string[];
  consultOnly: boolean;
};

/* ── Derive a clean display name from auth user ──────────────────────────── */
function getDisplayName(user: AuthUser): string {
  // If full_name was set during signup, use it
  if (user.name && !user.name.includes("@")) return user.name;
  // Otherwise derive a name from the email prefix
  const prefix = (user.email || "").split("@")[0];
  // Replace dots/underscores/dashes with spaces and Title-Case
  return prefix
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/* ── Login-Required Card (shown before any form) ─────────────────────────── */
function LoginRequiredCard({ job, isEligibility }: { job: Job; isEligibility: boolean }) {
  const nextUrl = `/jobs`;
  return (
    <div className="mt-4 border-t border-border pt-6">
      <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-amber-50 border border-primary/15 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-3 shadow-md shadow-primary/25">
          <Lock className="size-5 text-white" />
        </div>
        <p className="font-bold text-base mb-1" style={{ color: "#111827" }}>
          {isEligibility ? "Account Required to Check Eligibility" : "Account Required to Apply"}
        </p>
        <p className="text-sm mb-5 max-w-md mx-auto" style={{ color: "#374151" }}>
          {isEligibility
            ? <>Create a free account so our certified RCIC can review your profile for <strong>{job.title}</strong> and contact you with a personalised immigration pathway.</>
            : <>Create a free account to apply for <strong>{job.title}</strong>. Your verified email helps our team contact you about this and similar opportunities.</>
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5 justify-center mb-4">
          <Link
            href={`/register?next=${encodeURIComponent(nextUrl)}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/25"
          >
            <UserPlus className="size-4" />
            Create Free Account
          </Link>
          <Link
            href={`/login?next=${encodeURIComponent(nextUrl)}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white border border-border text-sm font-bold hover:border-primary hover:text-primary transition-colors"
            style={{ color: "#111827" }}
          >
            <Mail className="size-4" />
            I Already Have an Account
          </Link>
        </div>
        <p className="text-xs" style={{ color: "#6b7280" }}>
          Takes 30 seconds. Email verification required for security.
        </p>
      </div>
    </div>
  );
}

/* ── Apply Form (regular jobs, logged-in users) ──────────────────────────── */
function ApplyForm({ job, user, onClose }: { job: Job; user: AuthUser; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const displayName = getDisplayName(user);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await fetch("/", { method: "POST", body: data });
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="mt-4 border-t border-border pt-6">
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center">
          <CheckCircle className="size-10 text-emerald-500 mx-auto mb-3" />
          <p className="font-bold text-base mb-1" style={{ color: "#065f46" }}>Thank you, {displayName.split(" ")[0]}!</p>
          <p className="text-sm" style={{ color: "#047857" }}>
            Your application for <strong>{job.title}</strong> has been received. We'll review it and get back to you within 2–3 business days at <strong>{user.email}</strong>.
          </p>
        </div>
      </div>
    );
  }

  const inputClass = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition placeholder:text-gray-400";

  return (
    <div className="mt-4 border-t border-border pt-5">
      <div className="flex items-start gap-3 mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
        <CheckCircle className="size-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold" style={{ color: "#065f46" }}>Logged in as {user.email}</p>
          <p className="text-xs mt-0.5" style={{ color: "#047857" }}>Your application will be linked to your verified account.</p>
        </div>
      </div>

      <p className="text-sm leading-relaxed mb-4" style={{ color: "#374151" }}>{job.description}</p>

      <form
        onSubmit={handleSubmit}
        name="job-application"
        method="POST"
        data-netlify="true"
        encType="multipart/form-data"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        <input type="hidden" name="form-name" value="job-application" />
        <input type="hidden" name="job" value={job.title} />
        <input type="hidden" name="noc" value={job.noc} />
        <input type="hidden" name="user_id" value={user.id} />
        <input type="hidden" name="email" value={user.email} />

        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "#111827" }}>Full Name *</label>
          <input required name="name" type="text" defaultValue={displayName}
            className={inputClass} style={{ color: "#111827" }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "#111827" }}>Phone *</label>
          <input required name="phone" type="tel" placeholder="+1 000 000 0000" className={inputClass} style={{ color: "#111827" }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "#111827" }}>Country of Origin *</label>
          <input required name="country" type="text" placeholder="e.g. Morocco, Brazil…" className={inputClass} style={{ color: "#111827" }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "#111827" }}>Years of Experience *</label>
          <select required name="experience" className={inputClass} style={{ color: "#111827" }}>
            <option value="">Select…</option>
            <option value="0-1">Less than 1 year</option>
            <option value="1-3">1 – 3 years</option>
            <option value="3-5">3 – 5 years</option>
            <option value="5+">5+ years</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "#111827" }}>Current Immigration Status</label>
          <select name="status" className={inputClass} style={{ color: "#111827" }}>
            <option value="">Select…</option>
            <option value="outside-canada">Outside Canada</option>
            <option value="visitor">Visitor / Tourist</option>
            <option value="student">Study Permit</option>
            <option value="worker">Work Permit</option>
            <option value="pr">Permanent Resident</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "#111827" }}>Age</label>
          <input name="age" type="number" min={18} max={65} placeholder="e.g. 32" className={inputClass} style={{ color: "#111827" }} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1" style={{ color: "#111827" }}>Cover Letter / Message</label>
          <textarea name="message" rows={3} placeholder="Briefly describe your background and why you're interested in this position…"
            className={inputClass + " resize-none"} style={{ color: "#111827" }} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1" style={{ color: "#111827" }}>
            Attach CV / Resume <span className="font-normal" style={{ color: "#6b7280" }}>(PDF, DOC, DOCX — max 5 MB)</span>
          </label>
          <input name="cv" type="file" accept=".pdf,.doc,.docx"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/8 file:text-primary hover:file:bg-primary/15 transition cursor-pointer"
            style={{ color: "#374151" }} />
        </div>
        <div className="sm:col-span-2 flex items-center justify-between gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex items-center gap-1.5 text-xs hover:opacity-70 transition-opacity" style={{ color: "#6b7280" }}>
            <X className="size-3.5" /> Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-sm font-bold transition-colors shadow-md shadow-primary/25">
            {loading ? "Submitting…" : "Submit Application"}
            {!loading && <ChevronRight className="size-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Eligibility Form (consultOnly jobs, logged-in users) ────────────────── */
function EligibilityForm({ job, user, onClose }: { job: Job; user: AuthUser; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const displayName = getDisplayName(user);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await fetch("/", { method: "POST", body: data });
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="mt-4 border-t border-border pt-6">
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center">
          <CheckCircle className="size-10 text-emerald-500 mx-auto mb-3" />
          <p className="font-bold text-base mb-1" style={{ color: "#065f46" }}>Thank you, {displayName.split(" ")[0]}!</p>
          <p className="text-sm" style={{ color: "#047857" }}>
            We've received your eligibility request for <strong>{job.title}</strong>. A CICC-registered consultant will review your profile and contact you at <strong>{user.email}</strong> within 2–3 business days.
          </p>
        </div>
      </div>
    );
  }

  const inputClass = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition placeholder:text-gray-400";

  return (
    <div className="mt-4 border-t border-border pt-5">
      <div className="flex items-start gap-3 mb-5 p-4 rounded-xl bg-primary/5 border border-primary/15">
        <Lock className="size-4 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold" style={{ color: "#111827" }}>Eligibility Check — {job.title}</p>
          <p className="text-xs mt-0.5" style={{ color: "#374151" }}>
            Logged in as <strong>{user.email}</strong>. A certified RCIC will review your profile and contact you with a personalised immigration pathway.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        name="job-eligibility"
        method="POST"
        data-netlify="true"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <input type="hidden" name="form-name" value="job-eligibility" />
        <input type="hidden" name="job" value={job.title} />
        <input type="hidden" name="noc" value={job.noc} />
        <input type="hidden" name="user_id" value={user.id} />
        <input type="hidden" name="email" value={user.email} />

        <div className="sm:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: "#111827" }}>
            <User className="size-3 text-primary" /> Full Name *
          </label>
          <input required name="name" type="text" defaultValue={displayName} placeholder="Your full name"
            className={inputClass} style={{ color: "#111827" }} />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: "#111827" }}>
            <Globe className="size-3 text-primary" /> Country of Origin *
          </label>
          <input required name="country" type="text" placeholder="e.g. Morocco, Brazil, India…"
            className={inputClass} style={{ color: "#111827" }} />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: "#111827" }}>
            <Calendar className="size-3 text-primary" /> Age *
          </label>
          <input required name="age" type="number" min={18} max={65} placeholder="e.g. 32"
            className={inputClass} style={{ color: "#111827" }} />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: "#111827" }}>
            <Briefcase className="size-3 text-primary" /> Current Profession *
          </label>
          <input required name="profession" type="text" placeholder="e.g. Electrician, Chef, Nurse…"
            className={inputClass} style={{ color: "#111827" }} />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: "#111827" }}>
            <Clock className="size-3 text-primary" /> Years of Experience *
          </label>
          <select required name="experience" className={inputClass} style={{ color: "#111827" }}>
            <option value="">Select…</option>
            <option value="less-than-1">Less than 1 year</option>
            <option value="1-2">1 – 2 years</option>
            <option value="3-4">3 – 4 years</option>
            <option value="5+">5+ years</option>
          </select>
        </div>

        <div className="sm:col-span-2 flex items-center justify-between gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex items-center gap-1.5 text-xs hover:opacity-70 transition-opacity" style={{ color: "#6b7280" }}>
            <X className="size-3.5" /> Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-sm font-bold transition-colors shadow-md shadow-primary/25">
            {loading ? "Submitting…" : "Submit for Review"}
            {!loading && <ChevronRight className="size-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Jobs List ───────────────────────────────────────────────────────────── */
export function JobsList({ jobs }: { jobs: Job[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Check auth on mount + on visibility change (e.g. user comes back from login tab)
  useEffect(() => {
    function check() {
      getUser().then(u => { setUser(u); setAuthChecked(true); });
    }
    check();
    const onVis = () => { if (document.visibilityState === "visible") check(); };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  function toggle(id: number) {
    setExpanded(expanded === id ? null : id);
  }

  return (
    <div className="flex flex-col divide-y divide-gray-100 border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm">
      {jobs.map((job) => (
        <div key={job.id} className="group">
          {/* Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5 hover:bg-gray-50 transition-colors">
            {/* Left: title + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="font-bold text-base leading-tight" style={{ color: "#111827" }}>{job.title}</h2>
                <span className="text-xs font-mono font-semibold bg-primary/8 px-2 py-0.5 rounded" style={{ color: "#c2272d" }}>{job.noc}</span>
                {job.consultOnly && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    <Lock className="size-2.5" /> Eligibility Required
                  </span>
                )}
                {!user && authChecked && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                    <Lock className="size-2.5" /> Login Required
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs mb-2" style={{ color: "#6b7280" }}>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 text-primary" />{job.city}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />Posted {job.posted}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="size-3" />{job.slots} slot{job.slots > 1 ? "s" : ""} available
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {job.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-gray-100 text-xs font-medium" style={{ color: "#374151" }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Right: wage + CTA */}
            <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
              <div className="text-right">
                <p className="font-bold text-sm" style={{ color: "#111827" }}>{job.wage}</p>
                <p className="text-xs" style={{ color: "#6b7280" }}>{job.type}</p>
              </div>
              <button
                onClick={() => toggle(job.id)}
                disabled={!authChecked}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold whitespace-nowrap transition-colors disabled:opacity-60 ${
                  job.consultOnly
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                {job.consultOnly ? <Lock className="size-3" /> : null}
                {job.consultOnly ? "Check Eligibility" : "Apply Now"}
                <ChevronDown className={`size-3.5 transition-transform ${expanded === job.id ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {/* Expandable area */}
          {expanded === job.id && (
            <div className="px-6 pb-6">
              {!authChecked ? (
                <div className="mt-4 border-t border-border pt-6 flex justify-center">
                  <span className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              ) : !user ? (
                <LoginRequiredCard job={job} isEligibility={job.consultOnly} />
              ) : job.consultOnly ? (
                <EligibilityForm job={job} user={user} onClose={() => setExpanded(null)} />
              ) : (
                <ApplyForm job={job} user={user} onClose={() => setExpanded(null)} />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
