export type BlogTopicId =
  | "all"
  | "express-entry"
  | "work-permit"
  | "study-permit"
  | "pnp"
  | "family-sponsorship"
  | "immigration-news";

export type BlogTopic = {
  id: BlogTopicId;
  label: string;
  href: string;
  anchor: string;
  terms: string[];
};

export const BLOG_TOPICS: BlogTopic[] = [
  {
    id: "all",
    label: "All",
    href: "/blog",
    anchor: "Canada Immigration Blog",
    terms: [],
  },
  {
    id: "express-entry",
    label: "Express Entry",
    href: "/programs/express-entry",
    anchor: "Express Entry Canada",
    terms: ["express entry", "crs", "draw", "score", "pool", "invitation", "permanent residence", "pr pathway"],
  },
  {
    id: "work-permit",
    label: "Work Permits",
    href: "/services/work-permit",
    anchor: "Canada Work Permit",
    terms: ["work permit", "worker", "temporary foreign worker", "lmia", "job", "jobs", "employer", "pgwp", "iec", "skilled trades"],
  },
  {
    id: "study-permit",
    label: "Study Permits",
    href: "/services/study-permit",
    anchor: "Study Permit Canada",
    terms: ["student", "study", "college", "university", "sds", "international students", "pgwp", "off-campus", "language test"],
  },
  {
    id: "pnp",
    label: "PNP",
    href: "/province",
    anchor: "Provincial Nominee Programs",
    terms: ["pnp", "provincial nominee", "province", "alberta", "british columbia", "bc pnp", "manitoba", "nova scotia", "newfoundland", "pei"],
  },
  {
    id: "family-sponsorship",
    label: "Family Sponsorship",
    href: "/services/family-sponsorship",
    anchor: "Family Sponsorship Canada",
    terms: ["family", "spouse", "spousal", "parents", "grandparents", "super visa", "sponsorship"],
  },
  {
    id: "immigration-news",
    label: "Immigration News",
    href: "/draws",
    anchor: "Canada Immigration News and Draws",
    terms: ["ircc", "citizenship", "asylum", "minister", "processing times", "immigration trends", "newcomer", "canada ranks", "requirements"],
  },
];

export function getBlogTopic(title: string, excerpt = "", slug = ""): BlogTopic {
  const text = `${title} ${excerpt} ${slug}`.toLowerCase();
  return BLOG_TOPICS.slice(1).find((topic) => topic.terms.some((term) => text.includes(term))) ?? BLOG_TOPICS[BLOG_TOPICS.length - 1];
}

export function isBlogTopicId(value: string | undefined): value is BlogTopicId {
  return BLOG_TOPICS.some((topic) => topic.id === value);
}
