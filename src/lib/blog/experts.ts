import type { BlogTopicId } from "@/lib/blog/topics";

export type BlogExpert = {
  id: string;
  name: string;
  title: string;
  credential: string;
  rcic: string;
  summary: string;
  bio: string;
  specialties: string[];
  languages: string[];
  knowsAbout: string[];
};

const sarahBenali: BlogExpert = {
  id: "sarah-benali",
  name: "Sarah Benali",
  title: "Senior Immigration Consultant",
  credential: "Regulated Canadian Immigration Consultant (RCIC)",
  rcic: "R123456",
  summary: "Reviews skilled worker, Express Entry, PNP, Francophone immigration, and work permit guidance for IDLOGICE.",
  bio: "Sarah Benali focuses on skilled worker immigration strategy, including Express Entry, CRS improvement, PNP options, Francophone pathways, and Canadian work permit planning. Her content reviews help keep IDLOGICE guides practical, source-aware, and aligned with real applicant questions.",
  specialties: ["Express Entry", "PNP", "Francophone Immigration", "Work Permits"],
  languages: ["English", "French", "Arabic"],
  knowsAbout: [
    "Express Entry Canada",
    "CRS score strategy",
    "Provincial Nominee Programs",
    "Francophone immigration to Canada",
    "Canada work permits",
  ],
};

const mohamedAitIbour: BlogExpert = {
  id: "mohamed-ait-ibour",
  name: "Mohamed Ait Ibour",
  title: "Founder & Lead Immigration Consultant",
  credential: "Regulated Canadian Immigration Consultant (RCIC)",
  rcic: "R789012",
  summary: "Reviews study permit, family sponsorship, skilled trades, refusal, and complex application guidance for IDLOGICE.",
  bio: "Mohamed Ait Ibour reviews IDLOGICE guidance on study permits, family sponsorship, skilled trades immigration, refusal recovery, and complex Canada PR planning. His work connects immigration policy with applicant-first strategy and clear next steps.",
  specialties: ["Study Permits", "Family Sponsorship", "Skilled Trades Immigration", "Refusal Appeals"],
  languages: ["English", "French", "Arabic", "Spanish"],
  knowsAbout: [
    "Study Permit Canada",
    "Family Sponsorship Canada",
    "Skilled trades immigration",
    "Canadian immigration refusals",
    "Canada PR pathways",
  ],
};

const expertByTopic: Partial<Record<BlogTopicId, BlogExpert>> = {
  all: sarahBenali,
  "express-entry": sarahBenali,
  "work-permit": sarahBenali,
  pnp: sarahBenali,
  "immigration-news": sarahBenali,
  "study-permit": mohamedAitIbour,
  "family-sponsorship": mohamedAitIbour,
};

export const BLOG_EXPERTS = [sarahBenali, mohamedAitIbour] as const;

export function getBlogExpert(topicId: BlogTopicId): BlogExpert {
  return expertByTopic[topicId] ?? sarahBenali;
}

export function getBlogExpertById(id: string): BlogExpert | undefined {
  return BLOG_EXPERTS.find((expert) => expert.id === id);
}
