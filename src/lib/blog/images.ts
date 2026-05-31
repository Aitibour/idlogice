import { getBlogTopic } from "@/lib/blog/topics";

type BlogImage = {
  url: string;
  alt: string;
};

const FALLBACKS = [
  {
    url: "/images/feature-evaluation.jpg",
    alt: "Canadian immigration eligibility evaluation and CRS planning",
    terms: ["express entry", "crs", "draw", "score", "pool", "invitation", "pr", "permanent residence", "evaluation", "eligible"],
  },
  {
    url: "/images/jobs-bg.jpg",
    alt: "Canadian job opportunities and work permit pathways for newcomers",
    terms: ["work", "permit", "job", "jobs", "worker", "lmia", "employer", "wage", "career", "nurse", "healthcare"],
  },
  {
    url: "/images/feature-language.jpg",
    alt: "International students and language preparation for Canada",
    terms: ["student", "study", "college", "university", "sds", "language", "ielts", "tef", "school"],
  },
  {
    url: "/images/feature-family.jpg",
    alt: "Family immigration and sponsorship pathways to Canada",
    terms: ["family", "spouse", "spousal", "parents", "grandparents", "sponsorship", "super visa"],
  },
  {
    url: "/images/feature-consulting.jpg",
    alt: "Canadian immigration consultation and application strategy",
    terms: ["consultant", "consultation", "rcic", "lawyer", "refusal", "mistake", "application", "document"],
  },
  {
    url: "/images/feature-immigration.jpg",
    alt: "Canada immigration pathways and permanent residence planning",
    terms: ["immigration", "canada", "visa", "newcomer", "province", "pnp", "ontario", "toronto", "processing"],
  },
] as const;

export function getRelatedBlogImage(title: string, excerpt = "", slug = ""): BlogImage {
  const text = `${title} ${excerpt} ${slug}`.toLowerCase();
  const match = FALLBACKS.find((item) => item.terms.some((term) => text.includes(term)));
  if (match) return match;

  const topic = getBlogTopic(title, excerpt, slug);
  if (topic.id === "express-entry") return FALLBACKS[0];
  if (topic.id === "work-permit") return FALLBACKS[1];
  if (topic.id === "study-permit") return FALLBACKS[2];
  if (topic.id === "family-sponsorship") return FALLBACKS[3];
  if (topic.id === "pnp") return FALLBACKS[5];
  return FALLBACKS[FALLBACKS.length - 1];
}
