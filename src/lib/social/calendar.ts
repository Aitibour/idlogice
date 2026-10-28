export type PostKind = "informative" | "job" | "question";
export const TIME_ZONE = "America/Toronto";
export const COMPANY_URN = "urn:li:organization:103105245";
export const CONTACT_CTA = [
  "Book your immigration consultation: https://idlogice.com/en/book-consultation",
  "Email: contact@idlogice.com",
  "Call: +1 581-634-0224",
].join("\n");

export function localClock(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return { date: `${get("year")}-${get("month")}-${get("day")}`, minutes: +get("hour") * 60 + +get("minute") };
}

// Calendar-day arithmetic keeps intervals stable across month boundaries and DST.
export function dayNumber(date: string, start: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start)) throw new Error("Invalid LINKEDIN_START_DATE");
  return Math.floor((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000);
}

export function dueSlots(now: Date, start: string) {
  const { date, minutes } = localClock(now);
  const day = dayNumber(date, start);
  if (day < 0) return [];
  return ([
    { kind: "informative" as const, every: 1, minute: 9 * 60 },
    { kind: "job" as const, every: 2, minute: 12 * 60 + 30 },
    { kind: "question" as const, every: 3, minute: 16 * 60 },
  ]).filter((s) => day % s.every === 0 && minutes >= s.minute)
    .map((s) => ({ key: `${date}/${s.kind}`, date, kind: s.kind, ordinal: day / s.every }));
}

export function completePost(body: string, sourceUrl?: string) {
  const text = [body.trim(), sourceUrl ? `Source: ${sourceUrl}` : "", CONTACT_CTA,
    "#IDLOGICE #CanadaImmigration #MoveToCanada"].filter(Boolean).join("\n\n");
  if (text.length > 3000) throw new Error("LinkedIn post exceeds 3,000 characters");
  return text;
}

// Immediate publishing is an explicit authenticated admin action. It cannot replay
// old dates or pre-publish future calendar slots, and shares the normal post ledger.
export function executionSlot(key: string, start: string, options: { draft?: boolean; publishNow?: boolean } = {}, now = new Date()) {
  const match = /^(\d{4}-\d{2}-\d{2})\/(informative|job|question)$/.exec(key);
  if (!match) throw new Error("Invalid slot key");
  if (options.draft && options.publishNow) throw new Error("Draft and immediate publication cannot be combined");
  const date = match[1], kind = match[2] as PostKind;
  const due = dueSlots(now, start).find((slot) => slot.key === key);
  if (!due && !options.draft && !(options.publishNow && date === localClock(now).date)) throw new Error("Slot is not due today");
  const every = kind === "job" ? 2 : kind === "question" ? 3 : 1;
  return { key, date, kind, ordinal: due?.ordinal ?? Math.max(0, Math.floor(dayNumber(date, start) / every)) };
}

export function canClaimPost(record: { status: string; updatedAt: string; attempts: number } | null | undefined, now = Date.now()) {
  if (!record) return true;
  if (["published", "publishing", "needs_review"].includes(record.status) || record.attempts >= 3) return false;
  // Prepared includes the image upload window: retain ownership until the lease expires.
  return !["generating", "prepared"].includes(record.status) || now - Date.parse(record.updatedAt) >= 20 * 60000;
}

export type DeployContext = { deploy: { context: string; published: boolean; id?: string } };
export const isPublishedProduction = (context: DeployContext) => context.deploy.context === "production" && context.deploy.published;
