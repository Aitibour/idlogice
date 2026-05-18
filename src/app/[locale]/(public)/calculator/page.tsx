"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight, ArrowLeft, Calculator, User, GraduationCap,
  Languages, Briefcase, Star, CheckCircle, TrendingUp,
  Phone, CalendarCheck, RotateCcw, Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
type FormData = {
  maritalStatus: "single" | "married";
  age: number;
  education: string;
  spouseEducation: string;
  firstLangCLB: number;
  secondLangCLB: number;
  spouseLangCLB: number;
  foreignWork: string;
  canadianWork: string;
  spouseCanadianWork: string;
  hasPN: boolean;
  jobOfferType: "none" | "noc00" | "other";
  canadianStudy: "none" | "1-2" | "3+";
  hasSibling: boolean;
  frenchBonus: boolean;
};

const INIT: FormData = {
  maritalStatus: "single", age: 28, education: "bachelors",
  spouseEducation: "bachelors", firstLangCLB: 9, secondLangCLB: 0,
  spouseLangCLB: 0, foreignWork: "1", canadianWork: "none",
  spouseCanadianWork: "none", hasPN: false, jobOfferType: "none",
  canadianStudy: "none", hasSibling: false, frenchBonus: false,
};

// ── Scoring ───────────────────────────────────────────────────────────────────
function agePoints(age: number, sp: boolean): number {
  if (age < 18 || age > 44) return 0;
  const S: Record<number,number> = {18:99,19:105,36:105,37:99,38:94,39:88,40:83,41:77,42:72,43:66,44:61};
  const M: Record<number,number> = {18:90,19:95,36:95,37:90,38:85,39:80,40:75,41:70,42:65,43:60,44:55};
  if (age >= 20 && age <= 35) return sp ? 100 : 110;
  return ((sp ? M : S)[age]) ?? 0;
}
function eduPoints(e: string, sp: boolean): number {
  const S: Record<string,number> = {none:0,secondary:28,cert1:84,cert2:91,bachelors:112,two:119,masters:135,phd:150};
  const M: Record<string,number> = {none:0,secondary:25,cert1:68,cert2:74,bachelors:90,two:96,masters:108,phd:120};
  return ((sp ? M : S)[e]) ?? 0;
}
function lang1PerSkill(clb: number, sp: boolean): number {
  const S = [0,0,0,0,6,6,8,16,22,29,32,32,32];
  const M = [0,0,0,0,6,6,6,14,19,26,28,28,28];
  return ((sp ? M : S)[Math.min(clb,12)]) ?? 0;
}
function lang2PerSkill(clb: number): number {
  if (clb < 5) return 0;
  if (clb <= 6) return 1;
  if (clb <= 8) return 3;
  return 6;
}
function spouseLangPerSkill(clb: number): number {
  if (clb < 5) return 0;
  const T: Record<number,number> = {5:1,6:1,7:3,8:3,9:5,10:5,11:5,12:5};
  return T[Math.min(clb,12)] ?? 5;
}
function canWorkPoints(w: string, sp: boolean): number {
  const S: Record<string,number> = {none:0,"1":40,"2-3":53,"4-5":64,"5+":72};
  const M: Record<string,number> = {none:0,"1":35,"2-3":46,"4-5":56,"5+":63};
  return ((sp ? M : S)[w]) ?? 0;
}
function spouseEduPoints(e: string): number {
  const T: Record<string,number> = {none:0,secondary:2,cert1:7,cert2:8,bachelors:10,two:10,masters:10,phd:10};
  return T[e] ?? 0;
}
function spouseWorkPoints(w: string): number {
  const T: Record<string,number> = {none:0,"1":5,"2-3":7,"4-5":8,"5+":10};
  return T[w] ?? 0;
}
function transferPoints(d: FormData): number {
  let p = 0;
  const clb = d.firstLangCLB;
  const highEdu = ["bachelors","two","masters","phd"].includes(d.education);
  const midEdu  = ["cert1","cert2"].includes(d.education);
  // Edu + lang
  if (highEdu) { if (clb>=9) p+=50; else if (clb>=7) p+=25; }
  else if (midEdu) { if (clb>=9) p+=25; else if (clb>=7) p+=13; }
  // Edu + CAN work
  if (highEdu) { if (d.canadianWork!=="none"&&d.canadianWork!=="1") p+=50; else if (d.canadianWork==="1") p+=25; }
  else if (midEdu) { if (d.canadianWork!=="none"&&d.canadianWork!=="1") p+=25; else if (d.canadianWork==="1") p+=13; }
  // Foreign work + lang
  if (d.foreignWork!=="none") {
    if (clb>=9) p += d.foreignWork==="1" ? 25 : 50;
    else if (clb>=7) p += d.foreignWork==="1" ? 13 : 25;
  }
  // Foreign + CAN work
  if (d.foreignWork!=="none"&&d.canadianWork!=="none") {
    p += (d.foreignWork==="1"||d.canadianWork==="1") ? 25 : 50;
  }
  return Math.min(100, p);
}
function additionalPoints(d: FormData): number {
  let p = 0;
  if (d.hasPN) p += 600;
  if (d.jobOfferType==="noc00") p += 200;
  else if (d.jobOfferType==="other") p += 50;
  if (d.canadianStudy==="1-2") p += 15;
  else if (d.canadianStudy==="3+") p += 30;
  if (d.hasSibling) p += 15;
  if (d.frenchBonus) p += 50;
  return p;
}

type Result = {
  total: number;
  age: number; education: number; firstLanguage: number;
  secondLanguage: number; canadianWork: number;
  spouse: number; transferability: number; additional: number;
};

function calcCRS(d: FormData): Result {
  const sp = d.maritalStatus === "married";
  const age        = agePoints(d.age, sp);
  const education  = eduPoints(d.education, sp);
  const firstLanguage  = lang1PerSkill(d.firstLangCLB, sp) * 4;
  const secondLanguage = lang2PerSkill(d.secondLangCLB) * 4;
  const canadianWork   = canWorkPoints(d.canadianWork, sp);
  const spouse = sp
    ? spouseEduPoints(d.spouseEducation) + spouseLangPerSkill(d.spouseLangCLB)*4 + spouseWorkPoints(d.spouseCanadianWork)
    : 0;
  const transferability = transferPoints(d);
  const additional      = additionalPoints(d);
  const total = age + education + firstLanguage + secondLanguage + canadianWork + spouse + transferability + additional;
  return { total, age, education, firstLanguage, secondLanguage, canadianWork, spouse, transferability, additional };
}

// ── UI helpers ────────────────────────────────────────────────────────────────
const SEL = "w-full rounded-xl border border-input bg-white text-gray-900 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 appearance-none cursor-pointer";

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-foreground/80 mb-1.5">{children}</p>;
}

function Row({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div className={cn("grid gap-4", cols === 1 ? "grid-cols-1" : cols === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2")}>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center gap-3 w-full p-3 rounded-xl border text-sm font-medium transition-all",
        checked ? "border-primary bg-primary/5 text-primary" : "border-border bg-secondary/30 text-foreground/70 hover:bg-secondary/60",
      )}
    >
      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
        checked ? "border-primary bg-primary" : "border-border")}>
        {checked && <CheckCircle className="size-3 text-white" />}
      </div>
      {label}
    </button>
  );
}

const EDU_OPTIONS = [
  { v: "none",      l: "Less than secondary school" },
  { v: "secondary", l: "Secondary diploma (high school)" },
  { v: "cert1",     l: "1-year post-secondary certificate" },
  { v: "cert2",     l: "2-year post-secondary diploma" },
  { v: "bachelors", l: "Bachelor's degree / 3+ year program" },
  { v: "two",       l: "Two or more certificates (one 3+ yrs)" },
  { v: "masters",   l: "Master's degree / professional degree" },
  { v: "phd",       l: "Doctoral (PhD)" },
];
const WORK_OPTIONS = [
  { v: "none", l: "None" },
  { v: "1",    l: "1 year" },
  { v: "2-3",  l: "2–3 years" },
  { v: "4-5",  l: "4–5 years" },
  { v: "5+",   l: "5+ years" },
];

const STEPS = [
  { label: "Personal",  icon: User },
  { label: "Education", icon: GraduationCap },
  { label: "Language",  icon: Languages },
  { label: "Work",      icon: Briefcase },
  { label: "Extras",    icon: Star },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CalculatorPage() {
  const [step, setStep]   = useState(0);
  const [data, setData]   = useState<FormData>(INIT);
  const [result, setResult] = useState<Result | null>(null);

  const sp = data.maritalStatus === "married";
  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => setData(d => ({ ...d, [k]: v }));

  function finish() { setResult(calcCRS(data)); }
  function reset()  { setData(INIT); setStep(0); setResult(null); }

  // ── Results screen ─────────────────────────────────────────────────────────
  if (result) {
    const score = result.total;
    const band =
      score >= 601 ? { label: "Excellent", color: "text-green-600", bg: "bg-green-50 border-green-200", tip: "You would likely receive an Invitation to Apply (ITA) in most recent Express Entry draws." } :
      score >= 491 ? { label: "Strong",    color: "text-blue-600",  bg: "bg-blue-50 border-blue-200",   tip: "Your score is competitive. You may receive an ITA, especially in targeted draws." } :
      score >= 451 ? { label: "Moderate",  color: "text-amber-600", bg: "bg-amber-50 border-amber-200", tip: "Your score is in range but below recent draw averages. Improving language or gaining Canadian experience can help." } :
      score >= 400 ? { label: "Fair",       color: "text-orange-600",bg: "bg-orange-50 border-orange-200",tip: "Consider targeted PNP streams, improving CLB scores, or gaining Canadian work experience." } :
                    { label: "Low",         color: "text-red-600",   bg: "bg-red-50 border-red-200",     tip: "Focus on improving language scores and education, or explore Provincial Nominee Programs." };

    const rows: { label: string; pts: number; max: number }[] = [
      { label: "Age",                pts: result.age,            max: 110 },
      { label: "Education",          pts: result.education,      max: 150 },
      { label: "First Language",     pts: result.firstLanguage,  max: 128 },
      { label: "Second Language",    pts: result.secondLanguage, max: 24  },
      { label: "Canadian Work Exp.", pts: result.canadianWork,   max: 72  },
      ...(sp ? [{ label: "Spouse / Partner", pts: result.spouse, max: 40 }] : []),
      { label: "Skill Transferability", pts: result.transferability, max: 100 },
      { label: "Additional Points",  pts: result.additional,     max: 600 },
    ];

    return (
      <div className="min-h-screen py-12 px-4" style={{ background: "#f9fafb" }}>
        <div className="max-w-2xl mx-auto">
          {/* Score card */}
          <div className="bg-white rounded-3xl border border-border shadow-lg overflow-hidden mb-5">
            <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-transparent" />
            <div className="p-8 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">Your Estimated CRS Score</p>
              <div className="text-7xl font-black tracking-tight mb-2" style={{ color: "#111827" }}>
                {score}
              </div>
              <div className={cn("inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold mb-4", band.bg, band.color)}>
                <TrendingUp className="size-3.5" />
                {band.label} Profile
              </div>
              <p className={cn("text-sm leading-relaxed max-w-md mx-auto p-4 rounded-2xl border", band.bg)} style={{ color: "#374151" }}>
                {band.tip}
              </p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden mb-5">
            <div className="p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-5" style={{ color: "#374151" }}>Score Breakdown</p>
              <div className="space-y-3">
                {rows.map(({ label, pts, max }) => (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold" style={{ color: "#374151" }}>{label}</span>
                      <span className="text-xs font-bold tabular-nums" style={{ color: "#111827" }}>{pts} <span className="font-normal" style={{ color: "#9ca3af" }}>/ {max}</span></span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#f3f4f6" }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, (pts / max) * 100)}%`, background: pts > 0 ? "var(--color-primary, #c2272d)" : "transparent" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              href="/book-consultation"
              className="flex items-center justify-center gap-2 h-12 rounded-2xl bg-primary text-white text-sm font-bold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm shadow-primary/20"
            >
              <CalendarCheck className="size-4" />
              Free Profile Evaluation
            </Link>
            <button
              onClick={reset}
              className="flex items-center justify-center gap-2 h-12 rounded-2xl border border-border bg-white text-sm font-semibold hover:bg-secondary/40 transition-all"
            >
              <RotateCcw className="size-4" />
              Recalculate
            </button>
          </div>
          <p className="text-center text-[11px] text-muted-foreground mt-4">
            This is an estimate only. For an accurate assessment, free profile evaluation with a certified RCIC.
          </p>
        </div>
      </div>
    );
  }

  // ── Wizard ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "#f9fafb" }}>
      {/* Hero */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-10 max-w-2xl text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Calculator className="size-6 text-primary" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">Free Tool</p>
          <h1 className="text-3xl font-black mb-2">CRS Score Calculator</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Estimate your Express Entry Comprehensive Ranking System score in under 2 minutes.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {/* Progress */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done   = i < step;
            const active = i === step;
            return (
              <div key={s.label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    active ? "bg-primary text-white shadow-md shadow-primary/30" :
                    done   ? "bg-foreground text-white" :
                             "bg-secondary text-muted-foreground",
                  )}>
                    {done ? <CheckCircle className="size-4" /> : <Icon className="size-3.5" />}
                  </div>
                  <span className={cn("text-[10px] font-semibold mt-1 hidden sm:block",
                    active ? "text-foreground" : "text-muted-foreground")}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn("flex-1 h-px mx-2 mb-4 sm:mb-5 transition-colors", done ? "bg-foreground" : "bg-border")} />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-transparent" />
          <div className="p-7 lg:p-9 space-y-5">

            {/* Step 0: Personal ─────────────────────────────────────────── */}
            {step === 0 && (
              <>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Step 1</p>
                  <h2 className="text-xl font-bold">Personal information</h2>
                </div>
                <Row>
                  <div>
                    <Label>Marital Status</Label>
                    <select value={data.maritalStatus} onChange={e => set("maritalStatus", e.target.value as FormData["maritalStatus"])} className={SEL}>
                      <option value="single">Single / Separated / Divorced / Widowed</option>
                      <option value="married">Married / Common-law partner</option>
                    </select>
                  </div>
                  <div>
                    <Label>Age</Label>
                    <select value={data.age} onChange={e => set("age", Number(e.target.value))} className={SEL}>
                      {Array.from({length:34},(_,i)=>i+17).map(a=>(
                        <option key={a} value={a}>{a}{a===50?"+":""}</option>
                      ))}
                      <option value={50}>45+</option>
                    </select>
                  </div>
                </Row>
              </>
            )}

            {/* Step 1: Education ─────────────────────────────────────────── */}
            {step === 1 && (
              <>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Step 2</p>
                  <h2 className="text-xl font-bold">Education</h2>
                </div>
                <Row cols={1}>
                  <div>
                    <Label>Highest level of education</Label>
                    <select value={data.education} onChange={e => set("education", e.target.value)} className={SEL}>
                      {EDU_OPTIONS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  </div>
                  {sp && (
                    <div>
                      <Label>Spouse / Partner — highest education</Label>
                      <select value={data.spouseEducation} onChange={e => set("spouseEducation", e.target.value)} className={SEL}>
                        {EDU_OPTIONS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                      </select>
                    </div>
                  )}
                </Row>
              </>
            )}

            {/* Step 2: Language ─────────────────────────────────────────── */}
            {step === 2 && (
              <>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Step 3</p>
                  <h2 className="text-xl font-bold">Language skills</h2>
                  <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1.5">
                    <Info className="size-3.5 shrink-0 mt-0.5 text-primary" />
                    Use your overall CLB level. IELTS 6.5 ≈ CLB 8 · IELTS 7.0 ≈ CLB 9 · IELTS 8.0 ≈ CLB 10.
                  </p>
                </div>
                <Row>
                  <div>
                    <Label>First language (English or French) — CLB</Label>
                    <select value={data.firstLangCLB} onChange={e => set("firstLangCLB", Number(e.target.value))} className={SEL}>
                      {Array.from({length:12},(_,i)=>i+1).map(l=>(
                        <option key={l} value={l}>CLB {l}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Second language — CLB (if applicable)</Label>
                    <select value={data.secondLangCLB} onChange={e => set("secondLangCLB", Number(e.target.value))} className={SEL}>
                      <option value={0}>None / Below CLB 5</option>
                      {Array.from({length:8},(_,i)=>i+5).map(l=>(
                        <option key={l} value={l}>CLB {l}</option>
                      ))}
                    </select>
                  </div>
                </Row>
                {sp && (
                  <div>
                    <Label>Spouse / Partner — first language CLB</Label>
                    <select value={data.spouseLangCLB} onChange={e => set("spouseLangCLB", Number(e.target.value))} className={SEL}>
                      <option value={0}>None / Below CLB 5</option>
                      {Array.from({length:8},(_,i)=>i+5).map(l=>(
                        <option key={l} value={l}>CLB {l}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Step 3: Work ─────────────────────────────────────────────── */}
            {step === 3 && (
              <>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Step 4</p>
                  <h2 className="text-xl font-bold">Work experience</h2>
                </div>
                <Row>
                  <div>
                    <Label>Foreign skilled work experience (NOC 0/A/B)</Label>
                    <select value={data.foreignWork} onChange={e => set("foreignWork", e.target.value)} className={SEL}>
                      {WORK_OPTIONS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Canadian skilled work experience</Label>
                    <select value={data.canadianWork} onChange={e => set("canadianWork", e.target.value)} className={SEL}>
                      {WORK_OPTIONS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  </div>
                </Row>
                {sp && (
                  <div>
                    <Label>Spouse / Partner — Canadian work experience</Label>
                    <select value={data.spouseCanadianWork} onChange={e => set("spouseCanadianWork", e.target.value)} className={SEL}>
                      {WORK_OPTIONS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Step 4: Additional ─────────────────────────────────────────── */}
            {step === 4 && (
              <>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Step 5</p>
                  <h2 className="text-xl font-bold">Additional points</h2>
                  <p className="text-xs text-muted-foreground mt-1">Select all that apply to your situation.</p>
                </div>
                <div className="space-y-2">
                  <Toggle checked={data.hasPN} onChange={v => set("hasPN", v)} label="I have a Provincial Nomination (+600)" />
                  <Toggle checked={data.hasSibling} onChange={v => set("hasSibling", v)} label="I have a sibling who is a Canadian citizen or PR (+15)" />
                  <Toggle checked={data.frenchBonus} onChange={v => set("frenchBonus", v)} label="Bilingual bonus: French CLB 7+ and English CLB 4+ (+50)" />
                </div>
                <Row>
                  <div>
                    <Label>Valid job offer in Canada</Label>
                    <select value={data.jobOfferType} onChange={e => set("jobOfferType", e.target.value as FormData["jobOfferType"])} className={SEL}>
                      <option value="none">None</option>
                      <option value="noc00">NOC TEER 0 — Senior manager (+200)</option>
                      <option value="other">NOC TEER 1/2/3 (+50)</option>
                    </select>
                  </div>
                  <div>
                    <Label>Canadian post-secondary education</Label>
                    <select value={data.canadianStudy} onChange={e => set("canadianStudy", e.target.value as FormData["canadianStudy"])} className={SEL}>
                      <option value="none">None</option>
                      <option value="1-2">1–2 year credential (+15)</option>
                      <option value="3+">3+ year credential (+30)</option>
                    </select>
                  </div>
                </Row>
              </>
            )}

          </div>

          {/* Nav buttons */}
          <div className="px-7 lg:px-9 pb-7 flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 h-11 px-5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary/40 transition-all"
              >
                <ArrowLeft className="size-4" /> Back
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm shadow-primary/20"
              >
                Continue <ArrowRight className="size-4" />
              </button>
            ) : (
              <button
                onClick={finish}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm shadow-primary/20"
              >
                <Calculator className="size-4" /> Calculate My Score
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-4">
          Based on IRCC&apos;s official CRS formula. Results are estimates — free profile evaluation for a certified assessment.
        </p>
      </div>
    </div>
  );
}
