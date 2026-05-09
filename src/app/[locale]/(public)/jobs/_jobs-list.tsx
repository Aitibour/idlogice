"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Calendar, Briefcase, ChevronRight, ChevronDown, Lock, CheckCircle, X } from "lucide-react";

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
      <div className="mt-4 p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
        <CheckCircle className="size-8 text-emerald-500 mx-auto mb-2" />
        <p className="font-semibold text-emerald-800 text-sm">Application submitted!</p>
        <p className="text-emerald-600 text-xs mt-1">We'll review your profile and contact you within 2–3 business days.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <p className="text-gray-500 text-sm leading-relaxed mb-4">{job.description}</p>
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
          <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
          <input required name="name" type="text" placeholder="Your full name"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[oklch(0.52_0.22_27)] focus:ring-1 focus:ring-[oklch(0.52_0.22_27/0.2)] transition" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
          <input required name="email" type="email" placeholder="your@email.com"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[oklch(0.52_0.22_27)] focus:ring-1 focus:ring-[oklch(0.52_0.22_27/0.2)] transition" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
          <input name="phone" type="tel" placeholder="+1 000 000 0000"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[oklch(0.52_0.22_27)] focus:ring-1 focus:ring-[oklch(0.52_0.22_27/0.2)] transition" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Country of Origin *</label>
          <input required name="country" type="text" placeholder="e.g. Morocco, Brazil…"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[oklch(0.52_0.22_27)] focus:ring-1 focus:ring-[oklch(0.52_0.22_27/0.2)] transition" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Years of Experience *</label>
          <select required name="experience"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[oklch(0.52_0.22_27)] focus:ring-1 focus:ring-[oklch(0.52_0.22_27/0.2)] transition bg-white">
            <option value="">Select…</option>
            <option value="0-1">Less than 1 year</option>
            <option value="1-3">1 – 3 years</option>
            <option value="3-5">3 – 5 years</option>
            <option value="5+">5+ years</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Current Immigration Status</label>
          <select name="status"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[oklch(0.52_0.22_27)] focus:ring-1 focus:ring-[oklch(0.52_0.22_27/0.2)] transition bg-white">
            <option value="">Select…</option>
            <option value="outside-canada">Outside Canada</option>
            <option value="visitor">Visitor / Tourist</option>
            <option value="student">Study Permit</option>
            <option value="worker">Work Permit</option>
            <option value="pr">Permanent Resident</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Cover Letter / Message</label>
          <textarea name="message" rows={3} placeholder="Briefly describe your background and why you're interested in this position…"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[oklch(0.52_0.22_27)] focus:ring-1 focus:ring-[oklch(0.52_0.22_27/0.2)] transition resize-none" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Attach CV / Resume <span className="text-gray-400 font-normal">(PDF, DOC, DOCX — max 5 MB)</span></label>
          <input name="cv" type="file" accept=".pdf,.doc,.docx"
            className="w-full text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[oklch(0.52_0.22_27/0.08)] file:text-[oklch(0.42_0.22_27)] hover:file:bg-[oklch(0.52_0.22_27/0.15)] transition cursor-pointer" />
          <p className="text-[11px] text-gray-400 mt-1">Your CV will be reviewed by our RCIC consultants to assess your eligibility for this position and the associated immigration pathway.</p>
        </div>
        <div className="sm:col-span-2 flex items-center justify-between gap-3">
          <button type="button" onClick={onClose}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
            <X className="size-3.5" /> Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[oklch(0.52_0.22_27)] hover:bg-[oklch(0.48_0.22_27)] disabled:opacity-60 text-white text-sm font-semibold transition-colors">
            {loading ? "Submitting…" : "Submit Application"}
            {!loading && <ChevronRight className="size-3.5" />}
          </button>
        </div>
      </form>
    </div>
  );
}

export function JobsList({ jobs }: { jobs: Job[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="flex flex-col divide-y divide-gray-200 border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm">
      {jobs.map((job) => (
        <div key={job.id} className="group">
          {/* Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5 hover:bg-gray-50 transition-colors">
            {/* Left: title + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-gray-900 font-bold text-base leading-tight">{job.title}</h2>
                <span className="text-[oklch(0.52_0.22_27)] text-xs font-mono font-semibold bg-[oklch(0.52_0.22_27/0.08)] px-2 py-0.5 rounded">{job.noc}</span>
                {job.consultOnly && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    <Lock className="size-2.5" /> Eligibility Required
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-gray-400 text-xs mb-2">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 text-[oklch(0.52_0.22_27)]" />{job.city}
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
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-xs">{tag}</span>
                ))}
              </div>
            </div>

            {/* Right: wage + CTA */}
            <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
              <div className="text-right">
                <p className="text-gray-900 font-bold text-sm">{job.wage}</p>
                <p className="text-gray-400 text-xs">{job.type}</p>
              </div>
              {job.consultOnly ? (
                <Link
                  href="/book-consultation"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[oklch(0.52_0.22_27)] hover:bg-[oklch(0.48_0.22_27)] text-white text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  Check Eligibility
                  <ChevronRight className="size-3.5" />
                </Link>
              ) : (
                <button
                  onClick={() => setExpanded(expanded === job.id ? null : job.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-700 text-white text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  {expanded === job.id ? "Close" : "Apply Now"}
                  <ChevronDown className={`size-3.5 transition-transform ${expanded === job.id ? "rotate-180" : ""}`} />
                </button>
              )}
            </div>
          </div>

          {/* Expandable apply form */}
          {!job.consultOnly && expanded === job.id && (
            <div className="px-6 pb-6">
              <ApplyForm job={job} onClose={() => setExpanded(null)} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
