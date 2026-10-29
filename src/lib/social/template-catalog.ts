import type { PostKind } from "./calendar.ts";

export type GraphicTopic =
  | "study"
  | "work"
  | "express-entry"
  | "family"
  | "policy"
  | "safety"
  | "citizenship"
  | "settlement"
  | "jobs"
  | "question";
type Definition = {
  id: string;
  family: "editorial" | "skyline" | "phone" | "photo" | "flag" | "briefing";
  variant: number;
  topics: readonly GraphicTopic[];
  name: string;
};
export const TEMPLATE_CATALOG = [
  {
    id: "editorial-01",
    family: "editorial",
    variant: 0,
    topics: ["policy", "safety"],
    name: "Minimal news bulletin",
  },
  {
    id: "editorial-02",
    family: "editorial",
    variant: 1,
    topics: ["express-entry", "policy"],
    name: "Red rail editorial",
  },
  {
    id: "editorial-03",
    family: "editorial",
    variant: 2,
    topics: ["family", "citizenship"],
    name: "Centred paper cover",
  },
  {
    id: "editorial-04",
    family: "editorial",
    variant: 3,
    topics: ["work", "jobs"],
    name: "Framed occupation spotlight",
  },
  {
    id: "editorial-05",
    family: "editorial",
    variant: 4,
    topics: ["study", "settlement"],
    name: "Oversized topic masthead",
  },
  {
    id: "skyline-01",
    family: "skyline",
    variant: 0,
    topics: ["work", "settlement"],
    name: "City and icon columns",
  },
  {
    id: "skyline-02",
    family: "skyline",
    variant: 1,
    topics: ["express-entry", "policy"],
    name: "City upper headline card",
  },
  {
    id: "skyline-03",
    family: "skyline",
    variant: 2,
    topics: ["family", "citizenship"],
    name: "Skyline window and ribbon",
  },
  {
    id: "skyline-04",
    family: "skyline",
    variant: 3,
    topics: ["study", "work"],
    name: "Split skyline cover",
  },
  {
    id: "skyline-05",
    family: "skyline",
    variant: 4,
    topics: ["question", "settlement"],
    name: "Centred city conversation",
  },
  {
    id: "phone-01",
    family: "phone",
    variant: 0,
    topics: ["work", "jobs"],
    name: "Phone right and headline left",
  },
  {
    id: "phone-02",
    family: "phone",
    variant: 1,
    topics: ["question", "family"],
    name: "Phone with navy question card",
  },
  {
    id: "phone-03",
    family: "phone",
    variant: 2,
    topics: ["study", "settlement"],
    name: "Phone upper banner",
  },
  {
    id: "phone-04",
    family: "phone",
    variant: 3,
    topics: ["safety", "policy"],
    name: "Phone inset and red rail",
  },
  {
    id: "phone-05",
    family: "phone",
    variant: 4,
    topics: ["express-entry", "citizenship"],
    name: "Phone feature and lower panel",
  },
  {
    id: "photo-01",
    family: "photo",
    variant: 0,
    topics: ["study", "family"],
    name: "Full bleed photo headline",
  },
  {
    id: "photo-02",
    family: "photo",
    variant: 1,
    topics: ["study", "work"],
    name: "Photo upper window",
  },
  {
    id: "photo-03",
    family: "photo",
    variant: 2,
    topics: ["safety", "policy"],
    name: "Side portrait editorial",
  },
  {
    id: "photo-04",
    family: "photo",
    variant: 3,
    topics: ["jobs", "settlement"],
    name: "Portrait inset on navy",
  },
  {
    id: "photo-05",
    family: "photo",
    variant: 4,
    topics: ["question", "citizenship"],
    name: "Photo with floating quote card",
  },
  {
    id: "flag-01",
    family: "flag",
    variant: 0,
    topics: ["policy", "citizenship"],
    name: "Red flag announcement",
  },
  {
    id: "flag-02",
    family: "flag",
    variant: 1,
    topics: ["express-entry", "work"],
    name: "Flag and blue headline pill",
  },
  {
    id: "flag-03",
    family: "flag",
    variant: 2,
    topics: ["family", "question"],
    name: "Flag with white speech panel",
  },
  {
    id: "flag-04",
    family: "flag",
    variant: 3,
    topics: ["study", "policy"],
    name: "Flag framed news panel",
  },
  {
    id: "flag-05",
    family: "flag",
    variant: 4,
    topics: ["jobs", "settlement"],
    name: "Flag upper band and split cover",
  },
  {
    id: "briefing-01",
    family: "briefing",
    variant: 0,
    topics: ["policy", "safety"],
    name: "Navy official-source briefing",
  },
  {
    id: "briefing-02",
    family: "briefing",
    variant: 1,
    topics: ["express-entry", "work"],
    name: "White source-check cards",
  },
  {
    id: "briefing-03",
    family: "briefing",
    variant: 2,
    topics: ["family", "question"],
    name: "Conversation speech bubble",
  },
  {
    id: "briefing-04",
    family: "briefing",
    variant: 3,
    topics: ["study", "citizenship"],
    name: "Red header and guide steps",
  },
  {
    id: "briefing-05",
    family: "briefing",
    variant: 4,
    topics: ["jobs", "settlement"],
    name: "Offset feature card",
  },
] as const satisfies readonly Definition[];
export type SocialTemplate = (typeof TEMPLATE_CATALOG)[number]["id"];
export const SOCIAL_TEMPLATES = TEMPLATE_CATALOG.map((t) => t.id);

export function graphicTopic(input: {
  kind: PostKind;
  title: string;
  headline?: string;
}): GraphicTopic {
  if (input.kind === "job") return "jobs";
  if (input.kind === "question") return "question";
  const text = `${input.title} ${input.headline ?? ""}`;
  if (/fraud|scam|unauthori[sz]ed|representative/i.test(text)) return "safety";
  if (
    /law|legislat|regulat|penalt|ministerial|policy|measures|changes|amend/i.test(
      text,
    )
  )
    return "policy";
  if (/express entry|crs|nominee|provincial|permanent residen/i.test(text))
    return "express-entry";
  if (/study|student|education|credential|language/i.test(text)) return "study";
  if (/family|spous|sponsor|parent|grandparent/i.test(text)) return "family";
  if (/work|job|employ/i.test(text)) return "work";
  if (/citizenship|citizen/i.test(text)) return "citizenship";
  return "settlement";
}
export function chooseTemplate(
  input: { kind: PostKind; title: string; headline?: string; ordinal: number },
  recent: readonly string[] = [],
): SocialTemplate {
  const topic = graphicTopic(input),
    blocked = new Set(recent.slice(-29));
  const available = TEMPLATE_CATALOG.filter((t) => !blocked.has(t.id));
  const lastFamily = TEMPLATE_CATALOG.find(
    (t) => t.id === recent.at(-1),
  )?.family;
  const offset = (input.ordinal * 7) % TEMPLATE_CATALOG.length;
  return [...(available.length ? available : TEMPLATE_CATALOG)].sort((a, b) => {
    const score = (t: Definition) =>
      (t.topics.includes(topic) ? 100 : 0) +
      (t.family !== lastFamily ? 10 : 0) -
      ((TEMPLATE_CATALOG.findIndex((x) => x.id === t.id) - offset + 30) % 30) /
        30;
    return score(b) - score(a);
  })[0].id;
}
export function templateLogoVariant(id: SocialTemplate) {
  const t = TEMPLATE_CATALOG.find((t) => t.id === id)!;
  return t.family === "photo" ||
    t.family === "flag" ||
    (t.family === "briefing" && [0, 4].includes(t.variant))
    ? "light"
    : "dark";
}
