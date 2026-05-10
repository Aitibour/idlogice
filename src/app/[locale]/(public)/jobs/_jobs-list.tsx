"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Calendar, Briefcase, ChevronRight, ChevronDown, Lock, CheckCircle, X, User, Globe, Clock } from "lucide-react";
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

/* ── Standard Apply Form ─────────────────────────────────────────────────── */
function ApplyForm({ job, onClose }: { job: Job; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("/", { method: "POST", body: data });
      if (res.ok) setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="mt-4 p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
        <CheckCircle className="size-8 text-emerald-500 mx-auto mb-2" />
        <p className="font-semibold text-sm" style={{ color: "#065f46" }}>Application submitted!</p>
        <p className="text-xs mt-1" style={{ color: "#047857" }}>We'll review your profile and contact you within 2–3 business days.</p>
      </div>
    );
  }

  const inputClass = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition placeholder:text-gray-400";

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
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

        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "#111827" }}>Full Name *</label>
          <input required name="name" type="text" placeholder="Your full name" className={inputClass} style={{ color: "#111827" }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "#111827" }}>Email *</label>
          <input required name="email" type="email" placeholder="your@email.com" className={inputClass} style={{ color: "#111827" }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "#111827" }}>Phone</label>
          <input name="phone" type="tel" placeholder="+1 000 000 0000" className={inputClass} style={{ color: "#111827" }} />
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
          <p className="text-[11px] mt-1" style={{ color: "#6b7280" }}>Your CV will be reviewed by our RCIC consultants to assess your eligibility.</p>
        </div>
        <div className="sm:col-span-2 flex items-center justify-between gap-3">
          <button type="button" onClick={onClose} className="flex items-center gap-1.5 text-xs hover:opacity-70 transition-opacity" style={{ color: "#6b7280" }}>
            <X className="size-3.5" /> Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-sm font-semibold transition-colors">
            {loading ? "Submitting…" : "Submit Application"}
            {!loading && <ChevronRight className="size-3.5" />}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Eligibility Check Form (consultOnly jobs) ───────────────────────────── */
function EligibilityForm({ job, onClose }: { job: Job; onClose: () => void }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUser().then(u => { setUser(u); setChecking(false); });
  }, []);

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

  if (checking) {
    return (
      <div className="mt-4 border-t border-gray-100 pt-6 flex justify-center">
        <span className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in — prompt to login
  if (!user) {
    return (
      <div className="mt-4 border-t border-border pt-6">
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 text-center">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
            <Lock className="size-5 text-amber-600" />
          </div>
          <p className="font-bold text-sm mb-1" style={{ color: "#111827" }}>Account Required</p>
          <p className="text-sm mb-4" style={{ color: "#374151" }}>
            Create a free account to check your eligibility for <strong>{job.title}</strong> and get connected with a certified RCIC.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href={`/login?next=/jobs`}
              className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              Log In
            </Link>
            <Link
              href={`/register?next=/jobs`}
              className="px-5 py-2.5 rounded-full border border-primary text-sm font-bold hover:bg-primary/5 transition-colors"
              style={{ color: "#c2272d" }}
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Submitted — thank you screen
  if (submitted) {
    return (
      <div className="mt-4 border-t border-border pt-6">
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center">
          <CheckCircle className="size-10 text-emerald-500 mx-auto mb-3" />
          <p className="font-bold text-base mb-1" style={{ color: "#065f46" }}>Thank you, {user.name.split(/[\s.]+/)[0]}!</p>
          <p className="text-sm" style={{ color: "#047857" }}>
            We've received your eligibility request for <strong>{job.title}</strong>. One of our CICC-registered consultants will review your profile and get in touch with you shortly.
          </p>
        </div>
      </div>
    );
  }

  const inputClass = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition placeholder:text-gray-400";

  return (
    <div className="mt-4 border-t border-border pt-5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-5 p-4 rounded-xl bg-primary/5 border border-primary/15">
        <Lock className="size-4 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold" style={{ color: "#111827" }}>Eligibility Check — {job.title}</p>
          <p className="text-xs mt-0.5" style={{ color: "#374151" }}>
            Fill in the details below. Our certified RCIC will assess your profile and contact you with a personalised immigration pathway.
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
        <input type="hidden" name="email" value={user.email} />

        {/* Full name */}
        <div className="sm:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: "#111827" }}>
            <User className="size-3 text-primary" /> Full Name *
          </label>
          <input required name="name" type="text" defaultValue={user.name} placeholder="Your full name"
            className={inputClass} style={{ color: "#111827" }} />
        </div>

        {/* Country */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: "#111827" }}>
            <Globe className="size-3 text-primary" /> Country of Origin *
          </label>
          <input required name="country" type="text" placeholder="e.g. Morocco, Brazil, India…"
            className={inputClass} style={{ color: "#111827" }} />
        </div>

        {/* Age */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: "#111827" }}>
            <Calendar className="size-3 text-primary" /> Age *
          </label>
          <input required name="age" type="number" min={18} max={65} placeholder="e.g. 32"
            className={inputClass} style={{ color: "#111827" }} />
        </div>

        {/* Profession */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: "#111827" }}>
            <Briefcase className="size-3 text-primary" /> Current Profession *
          </label>
          <input required name="profession" type="text" placeholder="e.g. Electrician, Chef, Nurse…"
            className={inputClass} style={{ color: "#111827" }} />
        </div>

        {/* Years of experience */}
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

        {/* Actions */}
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
              {job.consultOnly ? (
                <button
                  onClick={() => toggle(job.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  <Lock className="size-3" />
                  Check Eligibility
                  <ChevronDown className={`size-3.5 transition-transform ${expanded === job.id ? "rotate-180" : ""}`} />
                </button>
              ) : (
                <button
                  onClick={() => toggle(job.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  {expanded === job.id ? "Close" : "Apply Now"}
                  <ChevronDown className={`size-3.5 transition-transform ${expanded === job.id ? "rotate-180" : ""}`} />
                </button>
              )}
            </div>
          </div>

          {/* Expandable form */}
          {expanded === job.id && (
            <div className="px-6 pb-6">
              {job.consultOnly
                ? <EligibilityForm job={job} onClose={() => setExpanded(null)} />
                : <ApplyForm job={job} onClose={() => setExpanded(null)} />
              }
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
