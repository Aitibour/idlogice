/* ─────────────────────────────────────────────────────────────────────────
   Simplified CRS (Comprehensive Ranking System) calculator
   Based on IRCC official scoring tables (single applicant / no spouse path)
   Approximation suitable for eligibility screening — not a legal assessment.
───────────────────────────────────────────────────────────────────────── */

export type EducationLevel =
  | "none" | "secondary" | "oneYear" | "twoYear"
  | "bachelors" | "twoDegrees" | "masters" | "phd";

export type ForeignWorkYears = 0 | 1 | 2 | 3; // 0=none 1=1-2yrs 2=3-4yrs 3=5+
export type CanadianWorkYears = 0 | 1 | 2 | 3 | 4 | 5; // 0=none, then years

export interface CRSInput {
  maritalStatus: "single" | "partnered";
  age: number;
  education: EducationLevel;
  hasECA: boolean;
  // CLB levels 0–10+
  clbSpeaking:  number;
  clbListening: number;
  clbReading:   number;
  clbWriting:   number;
  // Second language (optional)
  hasSecondLanguage: boolean;
  secondLangCLB: number; // overall average if present
  foreignWorkYears:   ForeignWorkYears;
  canadianWorkYears:  CanadianWorkYears;
  hasProvincialNomination: boolean;
  hasJobOffer: boolean;
  jobOfferNOC00: boolean; // NOC TEER 00 (senior managers) = +200, else +50
  hasSiblingInCanada: boolean;
}

export interface CRSBreakdown {
  age:               number;
  education:         number;
  language:          number;
  canadianWork:      number;
  skillTransfer:     number;
  additionalFactors: number;
  total:             number;
}

export interface CRSResult {
  breakdown: CRSBreakdown;
  total: number;
  currentCutoff: number;
  eligible: boolean;
  missingPoints: number;
  strengths: string[];
  improvements: string[];
}

// ── Age score (no spouse) ────────────────────────────────────────────────────
function scoreAge(age: number): number {
  if (age < 18 || age > 49) return 0;
  const table: Record<number, number> = {
    18: 99, 19: 105, 20: 110, 21: 110, 22: 110, 23: 110, 24: 110,
    25: 110, 26: 110, 27: 110, 28: 110, 29: 110, 30: 110, 31: 110,
    32: 110, 33: 110, 34: 110, 35: 110,
    36: 105, 37: 99, 38: 94, 39: 88, 40: 83,
    41: 77, 42: 72, 43: 66, 44: 61, 45: 50,
    46: 39, 47: 28, 48: 17, 49: 6,
  };
  return table[age] ?? 0;
}

// ── Education score (no spouse) ──────────────────────────────────────────────
function scoreEducation(level: EducationLevel): number {
  const table: Record<EducationLevel, number> = {
    none:       0,
    secondary:  28,
    oneYear:    84,
    twoYear:    91,
    bachelors:  112,
    twoDegrees: 119,
    masters:    126,
    phd:        150,
  };
  return table[level];
}

// ── Language score per CLB level ──────────────────────────────────────────────
function clbToPoints(clb: number): number {
  if (clb >= 10) return 32;
  if (clb === 9)  return 29;
  if (clb === 8)  return 22;
  if (clb === 7)  return 16;
  if (clb === 6)  return 8;
  if (clb >= 4)   return 6;
  return 0;
}

function scoreLanguage(
  speaking: number, listening: number, reading: number, writing: number
): number {
  return clbToPoints(speaking) + clbToPoints(listening) +
         clbToPoints(reading)  + clbToPoints(writing);
}

// ── Second language bonus (max 24 pts) ───────────────────────────────────────
function scoreSecondLanguage(clb: number): number {
  if (clb >= 9) return 6;
  if (clb >= 7) return 3;
  if (clb >= 5) return 1;
  return 0;
}

// ── Canadian work experience (no spouse, max 70) ─────────────────────────────
function scoreCanadianWork(years: CanadianWorkYears): number {
  const table: Record<CanadianWorkYears, number> = {
    0: 0, 1: 40, 2: 53, 3: 64, 4: 72, 5: 80,
  };
  return Math.min(table[years], 70);
}

// ── Skill transferability (max 100) ──────────────────────────────────────────
function scoreSkillTransferability(input: CRSInput): number {
  const minLang = Math.min(input.clbSpeaking, input.clbListening, input.clbReading, input.clbWriting);
  const highEdu = ["bachelors", "twoDegrees", "masters", "phd"].includes(input.education);
  const hasCWE  = input.canadianWorkYears >= 1;
  const hasFWE  = input.foreignWorkYears >= 1;
  let pts = 0;

  // A: Education + Language
  if (highEdu) {
    if (minLang >= 9) pts += 50;
    else if (minLang >= 7) pts += 25;
  }

  // B: Education + Canadian work experience
  if (highEdu && hasCWE) {
    pts += ["masters", "phd"].includes(input.education) ? 25 : 13;
  }

  // C: Foreign work + Language
  if (hasFWE) {
    const fwePts = input.foreignWorkYears >= 2 ? 2 : 1; // 1=1-2yrs, 2=3+
    if (minLang >= 9) pts += fwePts === 2 ? 50 : 25;
    else if (minLang >= 7) pts += fwePts === 2 ? 25 : 13;
  }

  // D: Foreign work + Canadian work
  if (hasFWE && hasCWE) {
    pts += input.foreignWorkYears >= 2 ? 25 : 13;
  }

  return Math.min(pts, 100);
}

// ── Additional factors ────────────────────────────────────────────────────────
function scoreAdditional(input: CRSInput): number {
  let pts = 0;
  if (input.hasProvincialNomination) pts += 600;
  if (input.hasJobOffer) pts += input.jobOfferNOC00 ? 200 : 50;
  if (input.hasSiblingInCanada) pts += 15;
  // Second official language bonus (French for English speakers)
  if (input.hasSecondLanguage) pts += scoreSecondLanguage(input.secondLangCLB) * 4;
  return pts;
}

// ── Main calculator ───────────────────────────────────────────────────────────
const CURRENT_CUTOFF = 491; // approximate recent average cutoff

export function calculateCRS(input: CRSInput): CRSResult {
  const age        = scoreAge(input.age);
  const education  = scoreEducation(input.education);
  const language   = scoreLanguage(input.clbSpeaking, input.clbListening, input.clbReading, input.clbWriting);
  const canadianWork = scoreCanadianWork(input.canadianWorkYears);
  const skillTransfer = scoreSkillTransferability(input);
  const additionalFactors = scoreAdditional(input);

  const total = age + education + language + canadianWork + skillTransfer + additionalFactors;

  const breakdown: CRSBreakdown = {
    age, education, language, canadianWork, skillTransfer, additionalFactors, total,
  };

  const eligible = total >= CURRENT_CUTOFF;
  const missingPoints = Math.max(0, CURRENT_CUTOFF - total);

  // ── Strength analysis ────────────────────────────────────────────────────
  const strengths: string[] = [];
  if (age >= 99)        strengths.push("Ideal age — maximum age points (110/110)");
  if (education >= 126) strengths.push("Advanced degree (Master's/PhD) — strong education score");
  if (language >= 100)  strengths.push("Excellent language scores — near-maximum language points");
  if (canadianWork >= 53) strengths.push("Valuable Canadian work experience");
  if (skillTransfer >= 50) strengths.push("Strong skill transferability combination");
  if (input.hasProvincialNomination) strengths.push("Provincial nomination secured (+600 pts)");
  if (input.hasJobOffer) strengths.push("Valid Canadian job offer in place");

  // ── Improvement suggestions ──────────────────────────────────────────────
  const improvements: string[] = [];

  const minLang = Math.min(input.clbSpeaking, input.clbListening, input.clbReading, input.clbWriting);

  if (input.age > 35 && input.age <= 45)
    improvements.push("Act quickly — CRS age points decrease each year after 35");
  if (input.age > 45)
    improvements.push("Age significantly impacts your score; other factors must compensate");

  if (minLang < 9)
    improvements.push(`Improving your language score to CLB 9+ could add up to ${(9 - minLang) * 4 * 7} points`);
  if (minLang < 7)
    improvements.push("Priority: Reach CLB 7 minimum in all abilities for Express Entry eligibility");

  if (!input.hasECA && ["bachelors", "twoDegrees", "masters", "phd"].includes(input.education))
    improvements.push("Get your foreign credentials assessed (ECA) to unlock full education points");

  if (input.canadianWorkYears === 0)
    improvements.push("Any Canadian work experience (LMIA or open permit) adds 40+ points");

  if (!input.hasSecondLanguage)
    improvements.push("French proficiency (CLB 7+) adds up to +30 points and opens more pathways");

  if (!input.hasJobOffer)
    improvements.push("A valid Canadian job offer in a skilled occupation adds 50–200 points");

  if (!input.hasProvincialNomination)
    improvements.push("A provincial nomination (PNP) adds 600 points and can substantially improve your invitation prospects");

  if (input.education === "secondary" || input.education === "none")
    improvements.push("Higher education (bachelor's or master's) significantly increases your score");

  return { breakdown, total, currentCutoff: CURRENT_CUTOFF, eligible, missingPoints, strengths, improvements };
}

// ── Helper: education label ───────────────────────────────────────────────────
export const EDUCATION_LABELS: Record<EducationLevel, string> = {
  none:       "No formal education",
  secondary:  "High school diploma / Secondary education",
  oneYear:    "1-year post-secondary diploma or certificate",
  twoYear:    "2-year post-secondary diploma or certificate",
  bachelors:  "Bachelor's degree (3+ years)",
  twoDegrees: "Two or more post-secondary degrees",
  masters:    "Master's degree or professional degree",
  phd:        "Doctoral degree (PhD)",
};
