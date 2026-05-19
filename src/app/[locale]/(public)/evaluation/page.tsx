"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  calculateCRS, CRSInput, EDUCATION_LABELS,
  EducationLevel, ForeignWorkYears, CanadianWorkYears,
} from "@/lib/crs-calculator";
import {
  User, GraduationCap, Languages, Briefcase, Star,
  ChevronRight, ChevronLeft, CheckCircle2,
  TrendingUp, AlertTriangle, ArrowRight, Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

// â"€â"€ Wizard state defaults â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
const DEFAULT: CRSInput = {
  maritalStatus: "single",
  age: 28,
  education: "bachelors",
  hasECA: false,
  clbSpeaking: 7, clbListening: 7, clbReading: 7, clbWriting: 7,
  hasSecondLanguage: false,
  secondLangCLB: 0,
  foreignWorkYears: 1,
  canadianWorkYears: 0,
  hasProvincialNomination: false,
  hasJobOffer: false,
  jobOfferNOC00: false,
  hasSiblingInCanada: false,
};

const STEPS = [
  { id: 1, label: "Profile",    icon: User },
  { id: 2, label: "Education",  icon: GraduationCap },
  { id: 3, label: "Language",   icon: Languages },
  { id: 4, label: "Experience", icon: Briefcase },
  { id: 5, label: "Extras",     icon: Star },
];

// â"€â"€ Small UI helpers â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <span className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
      <p className="text-[10px] font-black uppercase tracking-widest text-primary px-2">{children}</p>
      <span className="h-px flex-1 bg-gradient-to-l from-primary/40 to-transparent" />
    </div>
  );
}
function Question({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <p className="font-bold text-base mb-1" style={{ color: "#111827" }}>{label}</p>
      {sub && <p className="text-xs mb-4 leading-relaxed" style={{ color: "#6b7280" }}>{sub}</p>}
      {!sub && <div className="mb-4" />}
      {children}
    </div>
  );
}
function OptionCard({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button" onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-semibold transition-all duration-150",
        selected
          ? "border-primary bg-primary/8 text-primary shadow-sm shadow-primary/15"
          : "border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5"
      )}
      style={selected ? undefined : { color: "#111827" }}
    >
      {children}
    </button>
  );
}
function CLBSelect({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <p className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: "#374151" }}>{label}</p>
      <div className="grid grid-cols-7 gap-1.5">
        {[4, 5, 6, 7, 8, 9, 10].map(n => (
          <button key={n} type="button" onClick={() => onChange(n)}
            className={cn(
              "py-2.5 rounded-lg text-sm font-bold border-2 transition-all",
              value === n ? "bg-primary text-white border-primary shadow-md shadow-primary/25" : "border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5"
            )}
            style={value === n ? undefined : { color: "#111827" }}
          >
            {n}{n === 10 ? "+" : ""}
          </button>
        ))}
      </div>
    </div>
  );
}

// â"€â"€ Gauge component â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function ScoreGauge({ score, max = 1200 }: { score: number; max?: number }) {
  const pct = Math.min((score / max) * 100, 100);
  const cutoff = 491;
  const cutoffPct = (cutoff / max) * 100;
  return (
    <div className="relative h-3 rounded-full overflow-hidden" style={{ background: "#f3f4f6" }}>
      <div
        className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
        style={{
          width: `${pct}%`,
          background: score >= cutoff
            ? "linear-gradient(90deg, #10b981, #059669)"
            : score >= 400
              ? "linear-gradient(90deg, #f59e0b, #d97706)"
              : "linear-gradient(90deg, #ef4444, #dc2626)",
        }}
      />
      {/* Cutoff marker */}
      <div
        className="absolute top-0 bottom-0 w-0.5"
        style={{ left: `${cutoffPct}%`, background: "#9ca3af" }}
        title={`Recent cutoff: ${cutoff}`}
      />
    </div>
  );
}

// â"€â"€ Main component â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
export default function EvaluationPage() {
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [contactDone, setContactDone] = useState(false);
  const [contactErrors, setContactErrors] = useState<Partial<typeof contact>>({});
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CRSInput>(DEFAULT);
  const [result, setResult] = useState<ReturnType<typeof calculateCRS> | null>(null);


  const set = <K extends keyof CRSInput>(k: K, v: CRSInput[K]) =>
    setData(p => ({ ...p, [k]: v }));

  async function handleCalculate() {
    const crsResult = calculateCRS(data);
    setResult(crsResult);
    setStep(6);

    // GA4 conversion event
    import("@/lib/analytics").then(({ ga }) => ga.evaluationComplete(crsResult.total, crsResult.eligible));

    // Submit lead data to Netlify form (non-blocking)
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        "form-name": "free-evaluation",
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        crsScore: crsResult.total.toString(),
        eligible: crsResult.eligible ? "yes" : "no",
      }).toString(),
    }).catch(() => {});
  }


  // â"€â"€ Step content â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <SectionLabel>Personal Profile</SectionLabel>
            <Question label="What is your marital / partnership status?">
              <div className="grid grid-cols-2 gap-2">
                {(["single", "partnered"] as const).map(v => (
                  <OptionCard key={v} selected={data.maritalStatus === v} onClick={() => set("maritalStatus", v)}>
                    {v === "single" ? "Single / Divorced / Separated" : "Married / Common-law partner"}
                  </OptionCard>
                ))}
              </div>
            </Question>
            <Question label="How old are you?" sub="Age significantly affects your CRS score — the optimal range is 18—35.">
              <div className="flex items-center gap-4">
                <input
                  type="range" min={18} max={60} value={data.age}
                  onChange={e => set("age", Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="text-2xl font-bold w-12 text-center tabular-nums">{data.age}</span>
              </div>
              {data.age > 35 && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-2">
                  Age points decrease after 35 — acting sooner maximises your score.
                </p>
              )}
            </Question>
          </>
        );

      case 2:
        return (
          <>
            <SectionLabel>Education</SectionLabel>
            <Question label="What is your highest level of education?" sub="Include completed degrees only.">
              <div className="space-y-2">
                {(Object.keys(EDUCATION_LABELS) as EducationLevel[]).map(k => (
                  <OptionCard key={k} selected={data.education === k} onClick={() => set("education", k)}>
                    {EDUCATION_LABELS[k]}
                  </OptionCard>
                ))}
              </div>
            </Question>
            {["bachelors", "twoDegrees", "masters", "phd"].includes(data.education) && (
              <Question
                label="Do you have a valid ECA (Educational Credential Assessment)?"
                sub="Required to have foreign education recognised in Express Entry."
              >
                <div className="grid grid-cols-2 gap-2">
                  <OptionCard selected={data.hasECA} onClick={() => set("hasECA", true)}>Yes, I have an ECA</OptionCard>
                  <OptionCard selected={!data.hasECA} onClick={() => set("hasECA", false)}>Not yet</OptionCard>
                </div>
                {!data.hasECA && (
                  <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-2">
                    Without an ECA, your foreign degree may not be recognised — IDLOGICE can guide you through the process.
                  </p>
                )}
              </Question>
            )}
          </>
        );

      case 3:
        return (
          <>
            <SectionLabel>Language Skills</SectionLabel>
            <Question
              label="Select your CLB level for each language ability"
              sub="CLB = Canadian Language Benchmark. 4 = basic, 7 = good, 9+ = excellent. Check your IELTS/CELPIP/TEF score conversion."
            >
              <div className="space-y-5">
                <CLBSelect label="Speaking"  value={data.clbSpeaking}  onChange={v => set("clbSpeaking", v)} />
                <CLBSelect label="Listening" value={data.clbListening} onChange={v => set("clbListening", v)} />
                <CLBSelect label="Reading"   value={data.clbReading}   onChange={v => set("clbReading", v)} />
                <CLBSelect label="Writing"   value={data.clbWriting}   onChange={v => set("clbWriting", v)} />
              </div>
              {Math.min(data.clbSpeaking, data.clbListening, data.clbReading, data.clbWriting) < 7 && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-4">
                  CLB 7 minimum in all abilities is required for most Express Entry programs.
                </p>
              )}
            </Question>
            <Question
              label="Do you have proficiency in a second official language (French or English)?"
              sub="French + English bilingualism adds up to 30 bonus points."
            >
              <div className="grid grid-cols-2 gap-2 mb-3">
                <OptionCard selected={data.hasSecondLanguage} onClick={() => set("hasSecondLanguage", true)}>Yes</OptionCard>
                <OptionCard selected={!data.hasSecondLanguage} onClick={() => { set("hasSecondLanguage", false); set("secondLangCLB", 0); }}>No</OptionCard>
              </div>
              {data.hasSecondLanguage && (
                <CLBSelect label="Overall CLB level (second language)" value={data.secondLangCLB || 5} onChange={v => set("secondLangCLB", v)} />
              )}
            </Question>
          </>
        );

      case 4:
        return (
          <>
            <SectionLabel>Work Experience</SectionLabel>
            <Question
              label="How many years of skilled foreign work experience do you have?"
              sub="Skilled work = NOC TEER 0, 1, 2, or 3 occupations in the last 10 years."
            >
              <div className="space-y-2">
                {([
                  [0, "None"],
                  [1, "1—2 years"],
                  [2, "3—4 years"],
                  [3, "5+ years"],
                ] as [ForeignWorkYears, string][]).map(([v, label]) => (
                  <OptionCard key={v} selected={data.foreignWorkYears === v} onClick={() => set("foreignWorkYears", v)}>
                    {label}
                  </OptionCard>
                ))}
              </div>
            </Question>
            <Question
              label="How many years of Canadian work experience do you have?"
              sub="Canadian work experience adds 40—80 points and is a major CRS booster."
            >
              <div className="space-y-2">
                {([
                  [0, "None"],
                  [1, "1 year"],
                  [2, "2 years"],
                  [3, "3 years"],
                  [4, "4 years"],
                  [5, "5+ years"],
                ] as [CanadianWorkYears, string][]).map(([v, label]) => (
                  <OptionCard key={v} selected={data.canadianWorkYears === v} onClick={() => set("canadianWorkYears", v)}>
                    {label}
                  </OptionCard>
                ))}
              </div>
            </Question>
          </>
        );

      case 5:
        return (
          <>
            <SectionLabel>Additional Factors</SectionLabel>
            <Question label="Do you have a valid provincial or territorial nomination (PNP)?" sub="A PNP nomination adds 600 points — virtually guaranteeing an ITA.">
              <div className="grid grid-cols-2 gap-2">
                <OptionCard selected={data.hasProvincialNomination} onClick={() => set("hasProvincialNomination", true)}>Yes</OptionCard>
                <OptionCard selected={!data.hasProvincialNomination} onClick={() => set("hasProvincialNomination", false)}>No</OptionCard>
              </div>
            </Question>
            <Question label="Do you have a valid Canadian job offer?" sub="A valid skilled job offer adds 50—200 bonus points.">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <OptionCard selected={data.hasJobOffer} onClick={() => set("hasJobOffer", true)}>Yes</OptionCard>
                <OptionCard selected={!data.hasJobOffer} onClick={() => { set("hasJobOffer", false); set("jobOfferNOC00", false); }}>No</OptionCard>
              </div>
              {data.hasJobOffer && (
                <Question label="Is the position in NOC TEER 00 (Senior Manager / Director)?" sub="NOC 00 roles receive 200 points; other skilled roles receive 50 points.">
                  <div className="grid grid-cols-2 gap-2">
                    <OptionCard selected={data.jobOfferNOC00} onClick={() => set("jobOfferNOC00", true)}>Yes — Senior Manager</OptionCard>
                    <OptionCard selected={!data.jobOfferNOC00} onClick={() => set("jobOfferNOC00", false)}>No — Other skilled role</OptionCard>
                  </div>
                </Question>
              )}
            </Question>
            <Question label="Do you have a sibling who is a Canadian citizen or permanent resident?" sub="Adds 15 bonus points.">
              <div className="grid grid-cols-2 gap-2">
                <OptionCard selected={data.hasSiblingInCanada} onClick={() => set("hasSiblingInCanada", true)}>Yes</OptionCard>
                <OptionCard selected={!data.hasSiblingInCanada} onClick={() => set("hasSiblingInCanada", false)}>No</OptionCard>
              </div>
            </Question>
          </>
        );

      default:
        return null;
    }
  };

  // â"€â"€ Results view â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  if (step === 6 && result) {
    const { breakdown, total, eligible, missingPoints, currentCutoff, strengths, improvements } = result;
    return (
      <main className="min-h-screen" style={{ background: "#f9fafb" }}>
        {/* Hero banner */}
        <div className="relative h-44 overflow-hidden">
          <Image src="/images/feature-evaluation.jpg" alt="Canadian immigration CRS evaluation" fill className="object-cover" priority />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(17,24,39,0.85), rgba(194,39,45,0.7))" }} />
          <div className="relative h-full flex items-center justify-center px-4">
            <p className="text-xs font-bold uppercase tracking-widest text-white">Express Entry — Your CRS Results</p>
          </div>
        </div>

        <div className="py-12 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Score header — light, encouraging */}
          <div className="rounded-3xl bg-white border border-border shadow-sm p-8 mb-6 overflow-hidden relative">
            {/* Top accent strip */}
            <div className={cn(
              "absolute top-0 left-0 right-0 h-1",
              eligible ? "bg-emerald-500" : total >= 400 ? "bg-amber-500" : "bg-primary"
            )} />

            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#6b7280" }}>Your CRS Score</p>
                <div className="text-7xl font-black tabular-nums leading-none mb-3" style={{ color: eligible ? "#059669" : "#111827" }}>{total}</div>
                <div className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold",
                  eligible
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    : total >= 400
                      ? "bg-amber-50 border border-amber-200 text-amber-800"
                      : "bg-red-50 border border-red-200 text-red-700"
                )}>
                  {eligible
                    ? <><CheckCircle2 className="size-4" /><span>Competitive — above recent cutoff</span></>
                    : <><AlertTriangle className="size-4" /><span>{missingPoints} points below cutoff ({currentCutoff})</span></>
                  }
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#6b7280" }}>Target cutoff</p>
                <p className="text-3xl font-bold tabular-nums" style={{ color: "#111827" }}>{currentCutoff}</p>
              </div>
            </div>

            <div className="mt-6">
              <ScoreGauge score={total} />
              <div className="flex justify-between mt-1.5 text-[10px] font-medium" style={{ color: "#9ca3af" }}>
                <span>0</span><span>300</span><span>â†‘ {currentCutoff} cutoff</span><span>900</span><span>1200</span>
              </div>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="bg-white rounded-3xl border border-border p-6 mb-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#374151" }}>Score Breakdown</p>
            <div className="space-y-3">
              {[
                { label: "Age",                pts: breakdown.age,               max: 110 },
                { label: "Education",           pts: breakdown.education,         max: 150 },
                { label: "Language Skills",     pts: breakdown.language,          max: 128 },
                { label: "Canadian Experience", pts: breakdown.canadianWork,      max: 70  },
                { label: "Skill Transferability", pts: breakdown.skillTransfer,   max: 100 },
                { label: "Additional Factors",  pts: breakdown.additionalFactors, max: 600 },
              ].map(({ label, pts, max }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-sm w-36 shrink-0 font-medium" style={{ color: "#374151" }}>{label}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#f3f4f6" }}>
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(pts / max) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold tabular-nums w-16 text-right" style={{ color: "#111827" }}>
                    {pts} <span className="font-normal text-xs" style={{ color: "#9ca3af" }}>/ {max}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths */}
          {strengths.length > 0 && (
            <div className="bg-white rounded-3xl border border-border p-6 mb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Your Strengths</p>
              <ul className="space-y-2">
                {strengths.map(s => (
                  <li key={s} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {improvements.length > 0 && (
            <div className="bg-white rounded-3xl border border-border p-6 mb-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="size-4 text-primary" />
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  How to Improve Your Score
                </p>
              </div>
              <ul className="space-y-3">
                {improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-[10px] font-black text-primary tabular-nums shrink-0 mt-0.5 w-4">{i + 1}</span>
                    <span style={{ color: "#111827" }}>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* IDLOGICE CTA */}
          <div className="rounded-3xl overflow-hidden border border-primary/20 bg-primary/5">
            <div className="p-6 border-b border-primary/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shrink-0">
                  <Calendar className="size-5 text-white" />
                </div>
                <div>
                  <p className="font-bold mb-1">
                    {eligible
                      ? "You are competitive — but immigration is complex."
                      : `You need ${missingPoints} more points — IDLOGICE can help.`}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                    {eligible
                      ? "Our certified consultants will ensure your application is complete, accurate, and submitted at the right moment to maximise your chances."
                      : "Our certified consultants specialise in identifying the fastest path to improving your CRS score — whether through language coaching, PNP targeting, or job offer assistance."}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 flex flex-wrap gap-3">
              <Link
                href="/book-consultation"
                className="btn-shimmer flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
              >
                <Calendar className="size-4" />
                Free Profile Evaluation
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-white text-sm font-medium hover:bg-secondary/50 transition-colors"
              >
                Contact Us
              </Link>
              <button
                onClick={() => { setStep(1); setResult(null); }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-white text-sm font-medium hover:bg-secondary/50 transition-colors"
              >
                Recalculate
              </button>
            </div>
            <div className="px-6 pb-4 text-[11px]" style={{ color: "#6b7280" }}>
              * This score is an approximation based on simplified CRS rules. Consult a certified RCIC for a precise assessment. CRS cutoffs change with each draw.
            </div>
          </div>

        </div>
        </div>
      </main>
    );
  }

  // ── Contact form gate ────────────────────────────────────────────────────
  function validateContact() {
    const errs: Partial<typeof contact> = {};
    if (!contact.name.trim()) errs.name = "Name is required";
    if (!contact.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) errs.email = "Valid email required";
    setContactErrors(errs);
    return Object.keys(errs).length === 0;
  }

  if (!contactDone) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ background: "#f9fafb" }}>
        {/* Netlify hidden form */}
        <form name="free-evaluation" data-netlify="true" hidden>
          <input name="name" /><input name="email" /><input name="phone" />
          <input name="crsScore" /><input name="eligible" />
        </form>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              <Star className="size-3" /> Free CRS Evaluation
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Check your eligibility</h1>
            <p className="text-gray-500 text-sm leading-relaxed">Enter your details to get your free Comprehensive Ranking System score in 5 quick steps.</p>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block mb-1.5">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Your full name"
                value={contact.name}
                onChange={e => setContact(p => ({ ...p, name: e.target.value }))}
                className={cn("w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-colors", contactErrors.name ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-primary")}
              />
              {contactErrors.name && <p className="text-xs text-red-500 mt-1">{contactErrors.name}</p>}
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block mb-1.5">Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                placeholder="you@example.com"
                value={contact.email}
                onChange={e => setContact(p => ({ ...p, email: e.target.value }))}
                className={cn("w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-colors", contactErrors.email ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-primary")}
              />
              {contactErrors.email && <p className="text-xs text-red-500 mt-1">{contactErrors.email}</p>}
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block mb-1.5">Phone Number <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={contact.phone}
                onChange={e => setContact(p => ({ ...p, phone: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary text-sm outline-none transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={() => { if (validateContact()) setContactDone(true); }}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              Start My Evaluation <ChevronRight className="size-4" />
            </button>
            <p className="text-center text-xs text-gray-400">No account needed · Results in under 2 minutes</p>
          </div>
        </div>
      </main>
    );
  }

  // ── Wizard view ────────────────────────────────────────────────────────────
  const currentStep = STEPS[step - 1];
  const Icon = currentStep.icon;

  const progressPct = Math.round((step / STEPS.length) * 100);

  return (
    <main className="min-h-screen" style={{ background: "#f9fafb" }}>

      {/* â"€â"€ Modern hero with image + overlay â"€â"€ */}
      <div className="relative h-64 sm:h-72 overflow-hidden">
        <Image
          src="/images/feature-evaluation.jpg"
          alt="Canadian immigration CRS evaluation"
          fill
          className="object-cover"
          priority
        />
        {/* Strong dark gradient for contrast */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, rgba(17,24,39,0.85) 0%, rgba(194,39,45,0.75) 100%)"
        }} />
        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-bold uppercase tracking-widest mb-4">
            <Star className="size-3 fill-white" /> Express Entry Â· Free CRS Evaluation
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
            Hello, {contact.name ? contact.name.split(/[\s.]+/)[0] : "there"} 👋
          </h1>
          <p className="text-sm sm:text-base text-white/90 max-w-md">
            5 quick steps to check your eligibility and get your personalised CRS score.
          </p>
        </div>
      </div>

      <div className="py-10 px-4 -mt-8 relative z-10">
      <div className="max-w-2xl mx-auto">

        {/* â"€â"€ Modern progress bar with step indicators â"€â"€ */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#6b7280" }}>Progress</p>
              <p className="text-sm font-bold" style={{ color: "#111827" }}>Step {step} of {STEPS.length} Â· {progressPct}% complete</p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #c2272d, #8b1a1f)" }}>
              <span className="text-white font-black text-base">{step}</span>
            </div>
          </div>
          {/* Progress track */}
          <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: "#f3f4f6" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                background: "linear-gradient(90deg, #c2272d, #f59e0b)"
              }}
            />
          </div>
          {/* Step pills */}
          <div className="flex items-center justify-between gap-1">
            {STEPS.map((s) => {
              const done = step > s.id;
              const active = step === s.id;
              const SIcon = s.icon;
              return (
                <div key={s.id} className="flex flex-col items-center flex-1 min-w-0">
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 mb-1.5",
                    done ? "bg-emerald-500 shadow-md shadow-emerald-200" :
                    active ? "bg-primary ring-4 ring-primary/15 shadow-md shadow-primary/25" :
                    "border-2"
                  )} style={!done && !active ? { background: "#f3f4f6", borderColor: "#e5e7eb" } : undefined}>
                    {done
                      ? <CheckCircle2 className="size-4 text-white" />
                      : <SIcon className={cn("size-4", active ? "text-white" : "")} style={!active ? { color: "#9ca3af" } : undefined} />
                    }
                  </div>
                  <span className={cn(
                    "text-[10px] font-semibold truncate w-full text-center hidden sm:block",
                  )} style={{
                    color: active ? "#c2272d" : done ? "#059669" : "#9ca3af"
                  }}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* â"€â"€ Step content card â"€â"€ */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-5">
          {/* Card header with gradient accent */}
          <div className="relative p-6 pb-5 border-b" style={{ borderColor: "#f3f4f6", background: "linear-gradient(135deg, #fef2f2 0%, #ffffff 60%)" }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shadow-primary/25" style={{ background: "linear-gradient(135deg, #c2272d, #8b1a1f)" }}>
                <Icon className="size-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#9ca3af" }}>Section {step} / {STEPS.length}</p>
                <h2 className="text-xl font-black tracking-tight" style={{ color: "#111827" }}>{currentStep.label}</h2>
              </div>
            </div>
          </div>
          {/* Card body */}
          <div className="p-6 sm:p-8">
            {renderStep()}
          </div>
        </div>

        {/* â"€â"€ Modern navigation â"€â"€ */}
        <div className="flex gap-3 items-center">
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white border-2 border-gray-200 text-sm font-bold hover:border-primary/40 hover:bg-primary/5 transition-all"
              style={{ color: "#111827" }}
            >
              <ChevronLeft className="size-4" /> Back
            </button>
          )}
          <button
            onClick={step === STEPS.length ? handleCalculate : () => setStep(s => s + 1)}
            className="btn-shimmer flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-white text-sm font-bold transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: "linear-gradient(135deg, #c2272d, #8b1a1f)" }}
          >
            {step === STEPS.length ? (
              <><Star className="size-4 fill-white" /> Calculate My CRS Score</>
            ) : (
              <>Continue to Next Step <ChevronRight className="size-4" /></>
            )}
          </button>
        </div>

        {/* Reassurance footer */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs flex-wrap" style={{ color: "#6b7280" }}>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-500" /> 100% Free</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-500" /> No card required</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-500" /> Takes ~2 minutes</span>
        </div>

      </div>

      </div>
    </main>
  );
}
