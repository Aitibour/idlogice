"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getUser, AuthUser } from "@/lib/auth";
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

// ── Wizard state defaults ────────────────────────────────────────────────────
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

// ── Small UI helpers ─────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">{children}</p>;
}
function Question({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="font-semibold text-sm mb-0.5" style={{ color: "#111827" }}>{label}</p>
      {sub && <p className="text-xs mb-3" style={{ color: "#374151" }}>{sub}</p>}
      {!sub && <div className="mb-3" />}
      {children}
    </div>
  );
}
function OptionCard({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button" onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150",
        selected
          ? "border-primary bg-primary/8 text-primary"
          : "border-border bg-white hover:border-primary/40 hover:bg-primary/5"
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
      <p className="text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>{label}</p>
      <div className="grid grid-cols-7 gap-1">
        {[4, 5, 6, 7, 8, 9, 10].map(n => (
          <button key={n} type="button" onClick={() => onChange(n)}
            className={cn(
              "py-2 rounded-lg text-xs font-bold border transition-all",
              value === n ? "bg-primary text-white border-primary" : "border-border bg-white hover:border-primary/40"
            )}
            style={value === n ? undefined : { color: "#374151" }}
          >
            {n}{n === 10 ? "+" : ""}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Gauge component ──────────────────────────────────────────────────────────
function ScoreGauge({ score, max = 1200 }: { score: number; max?: number }) {
  const pct = Math.min((score / max) * 100, 100);
  const cutoff = 491;
  const cutoffPct = (cutoff / max) * 100;
  return (
    <div className="relative h-5 bg-secondary rounded-full overflow-hidden">
      <div
        className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
        style={{
          width: `${pct}%`,
          background: score >= cutoff
            ? "linear-gradient(90deg, oklch(0.52 0.22 27), oklch(0.62 0.2 27))"
            : "linear-gradient(90deg, oklch(0.65 0.15 50), oklch(0.7 0.18 40))",
        }}
      />
      {/* Cutoff marker */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-foreground/30"
        style={{ left: `${cutoffPct}%` }}
        title={`Recent cutoff: ${cutoff}`}
      />
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function EvaluationPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CRSInput>(DEFAULT);
  const [result, setResult] = useState<ReturnType<typeof calculateCRS> | null>(null);

  useEffect(() => {
    getUser().then(u => {
      if (!u || !u.emailVerified) {
        router.replace("/login?next=/evaluation");
      } else {
        setUser(u);
        setAuthChecked(true);
      }
    });
  }, [router]);

  const set = <K extends keyof CRSInput>(k: K, v: CRSInput[K]) =>
    setData(p => ({ ...p, [k]: v }));

  async function handleCalculate() {
    const crsResult = calculateCRS(data);
    setResult(crsResult);
    setStep(6);

    // Fire marketing confirmation email (non-blocking)
    if (user) {
      const firstName = user.name.split(/[\s.]+/)[0];
      fetch("/api/v1/email/evaluation-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          crsScore: crsResult.total,
          eligible: crsResult.eligible,
          improvements: crsResult.improvements ?? [],
        }),
      }).catch(() => {}); // silent — don't block the UI
    }
  }

  // Show a subtle loading state while checking auth
  if (!authChecked || !user) {
    return (
      <main className="min-h-screen bg-[oklch(0.97_0_0)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <span className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm">Verifying your account…</p>
        </div>
      </main>
    );
  }

  // ── Step content ─────────────────────────────────────────────────────────
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
            <Question label="How old are you?" sub="Age significantly affects your CRS score — the optimal range is 18–35.">
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
                  [1, "1–2 years"],
                  [2, "3–4 years"],
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
              sub="Canadian work experience adds 40–80 points and is a major CRS booster."
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
            <Question label="Do you have a valid Canadian job offer?" sub="A valid skilled job offer adds 50–200 bonus points.">
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

  // ── Results view ─────────────────────────────────────────────────────────
  if (step === 6 && result) {
    const { breakdown, total, eligible, missingPoints, currentCutoff, strengths, improvements } = result;
    return (
      <main className="min-h-screen bg-[oklch(0.97_0_0)]">
        {/* Hero banner */}
        <div className="relative h-44 overflow-hidden">
          <Image src="/images/feature-evaluation.jpg" alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-[oklch(0.08_0_0)]/75" />
          <div className="relative h-full flex items-center justify-center px-4">
            <p className="text-xs font-bold uppercase tracking-widest text-white/50">Express Entry — CRS Results</p>
          </div>
        </div>

        <div className="py-12 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Score header */}
          <div className={cn(
            "rounded-3xl p-8 mb-6 text-white",
            eligible ? "bg-primary" : "bg-[oklch(0.25_0_0)]"
          )}>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Your CRS Score</p>
                <div className="text-7xl font-black tabular-nums leading-none mb-3">{total}</div>
                <div className="flex items-center gap-2">
                  {eligible
                    ? <><CheckCircle2 className="size-5" /><span className="font-semibold">Competitive — above recent draw cutoff</span></>
                    : <><AlertTriangle className="size-5 text-amber-400" /><span className="font-semibold">{missingPoints} points below recent cutoff ({currentCutoff})</span></>
                  }
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/50 mb-1">Target cutoff</p>
                <p className="text-3xl font-bold">{currentCutoff}</p>
              </div>
            </div>
            <div className="mt-6">
              <ScoreGauge score={total} />
              <div className="flex justify-between mt-1 text-[10px] text-white/40">
                <span>0</span><span>300</span><span>↑ {currentCutoff} cutoff</span><span>900</span><span>1200</span>
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
                  <span className="text-sm w-36 shrink-0" style={{ color: "#374151" }}>{label}</span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(pts / max) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold tabular-nums w-16 text-right">
                    {pts} <span className="font-normal text-xs" style={{ color: "#6b7280" }}>/ {max}</span>
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
                Book a Free Consultation
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

  // ── Wizard view ──────────────────────────────────────────────────────────
  const currentStep = STEPS[step - 1];
  const Icon = currentStep.icon;

  return (
    <main className="min-h-screen bg-[oklch(0.97_0_0)]">

      {/* ── Image hero ── */}
      <div className="relative h-56 sm:h-64 overflow-hidden">
        <Image
          src="/images/feature-evaluation.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.08_0_0)]/75 via-[oklch(0.08_0_0)]/55 to-[oklch(0.08_0_0)]/80" />
        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/25 border border-primary/35 text-primary text-xs font-bold uppercase tracking-widest mb-3">
            Express Entry — Free CRS Evaluation
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Hello, {user.name.split(/[\s.]+/)[0]} 👋</h1>
          <p className="text-sm text-white/60">5 quick steps to check your Express Entry eligibility and CRS score.</p>
        </div>
      </div>

      <div className="py-10 px-4">
      <div className="max-w-xl mx-auto">

        {/* Progress steps */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((s, i) => {
            const done = step > s.id;
            const active = step === s.id;
            const SIcon = s.icon;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
                    done ? "bg-primary" : active ? "bg-primary ring-4 ring-primary/20" : "bg-secondary border border-border"
                  )}>
                    {done
                      ? <CheckCircle2 className="size-4 text-white" />
                      : <SIcon className={cn("size-4", active ? "text-white" : "text-gray-500")} />
                    }
                  </div>
                  <span className={cn(
                    "text-[10px] font-semibold mt-1.5 hidden sm:block",
                    active ? "text-primary" : done ? "text-primary/70" : "text-gray-500"
                  )}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn("flex-1 h-0.5 mx-1 transition-colors duration-300", done ? "bg-primary" : "bg-border")} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step card */}
        <div className="bg-white rounded-3xl border border-border shadow-sm p-7 mb-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#6b7280" }}>Step {step} of {STEPS.length}</p>
              <h2 className="text-base font-bold leading-tight" style={{ color: "#111827" }}>{currentStep.label}</h2>
            </div>
          </div>
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-white text-sm font-medium hover:bg-secondary/50 transition-colors"
            >
              <ChevronLeft className="size-4" /> Back
            </button>
          )}
          <button
            onClick={step === STEPS.length ? handleCalculate : () => setStep(s => s + 1)}
            className="btn-shimmer flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            {step === STEPS.length ? (
              <><Star className="size-4" /> Calculate My Score</>
            ) : (
              <>Next <ChevronRight className="size-4" /></>
            )}
          </button>
        </div>

      </div>

      </div>
    </main>
  );
}