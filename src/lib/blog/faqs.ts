import type { BlogTopicId } from "@/lib/blog/topics";

type Faq = { q: string; a: string };

const FAQS: Record<Exclude<BlogTopicId, "all">, Faq[]> = {
  "express-entry": [
    {
      q: "How does this update affect Express Entry candidates?",
      a: "Most Express Entry updates affect candidates through CRS cutoffs, draw frequency, category-based invitations, or document timing. Candidates should compare the update with their CRS score, occupation, language results, and provincial nomination options before changing their strategy.",
    },
    {
      q: "Should I enter the Express Entry pool if my CRS score is not competitive?",
      a: "Yes, many candidates benefit from entering the pool even with a lower CRS score because it can make them visible for provincial nomination streams and future category-based draws. A profile also helps you track your eligibility while improving language scores, work experience, or education factors.",
    },
    {
      q: "What is the fastest way to improve an Express Entry profile?",
      a: "The strongest improvements usually come from higher language test results, a provincial nomination, additional skilled work experience, French ability, or correcting weak profile details. The best option depends on your occupation, age, education, work history, and whether a province is targeting your profile.",
    },
  ],
  "work-permit": [
    {
      q: "Can a work permit lead to permanent residence in Canada?",
      a: "A Canadian work permit can support permanent residence if the job builds skilled Canadian experience, qualifies under Express Entry or a PNP stream, or leads to employer-supported immigration. The pathway depends on the NOC, province, employer, wage, and your language and education profile.",
    },
    {
      q: "Do I need an LMIA for every Canadian work permit?",
      a: "No. Some work permits require an LMIA, while others are LMIA-exempt through programs such as Francophone Mobility, international agreements, intra-company transfers, post-graduation work permits, or open work permit categories. The correct route depends on your job and personal situation.",
    },
    {
      q: "What should I check before accepting a Canadian job offer?",
      a: "Confirm the employer, wage, job duties, NOC, province, work permit type, and whether the offer can support permanent residence. A job offer that looks attractive may not help immigration unless it matches program requirements and has proper supporting documents.",
    },
  ],
  "study-permit": [
    {
      q: "Can studying in Canada help with permanent residence?",
      a: "Studying in Canada can help if the program is eligible, leads to a post-graduation work permit, and supports skilled Canadian work experience. The school, program length, province, and career outcome all matter when planning a study-to-PR pathway.",
    },
    {
      q: "What causes many Canadian study permit refusals?",
      a: "Common refusal reasons include weak proof of funds, unclear study purpose, poor ties to the home country, inconsistent documents, or choosing a program that does not fit the applicant's background. A strong application explains why the program is logical and affordable.",
    },
    {
      q: "Should international students choose a program based only on tuition?",
      a: "No. Tuition matters, but students should also consider PGWP eligibility, labour market demand, provincial nomination options, location, program length, and whether the program supports a realistic career and immigration plan.",
    },
  ],
  pnp: [
    {
      q: "How can a Provincial Nominee Program help my immigration plan?",
      a: "A PNP can help candidates who may not receive a federal invitation quickly. Some streams target specific occupations, job offers, graduates, French speakers, or workers already in the province. An enhanced nomination can add 600 CRS points in Express Entry.",
    },
    {
      q: "Do all PNP streams require a job offer?",
      a: "No. Some PNP streams require a job offer, while others invite candidates through Express Entry, occupation lists, graduate categories, business streams, or provincial labour market priorities. Requirements vary significantly by province.",
    },
    {
      q: "Which province is best for immigration to Canada?",
      a: "There is no single best province for everyone. The best option depends on your occupation, language scores, work experience, education, settlement plans, and whether your profile matches current provincial priorities.",
    },
  ],
  "family-sponsorship": [
    {
      q: "Who can sponsor a family member for Canadian immigration?",
      a: "Canadian citizens and permanent residents may be able to sponsor eligible spouses, partners, dependent children, parents, or grandparents if they meet legal, financial, and admissibility requirements. Each family category has its own rules and evidence standards.",
    },
    {
      q: "What evidence is important for spousal sponsorship?",
      a: "Strong spousal sponsorship files usually include proof of relationship history, communication, shared responsibilities, visits, photos, financial support, and consistent personal statements. The evidence should show the relationship is genuine and not entered into mainly for immigration.",
    },
    {
      q: "Can family sponsorship be refused?",
      a: "Yes. Refusals can happen because of insufficient relationship proof, missing documents, inadmissibility, financial ineligibility, or inconsistencies in the application. Careful preparation and clear supporting evidence reduce the risk.",
    },
  ],
  "immigration-news": [
    {
      q: "How often does Canadian immigration policy change?",
      a: "Canadian immigration policy changes regularly through IRCC instructions, Express Entry draws, PNP updates, processing changes, and new program priorities. Applicants should avoid relying on outdated information when planning applications.",
    },
    {
      q: "Should I change my immigration plan after one news update?",
      a: "Not usually. A single update should be reviewed in the context of your full profile, current eligibility, timing, documents, and alternative pathways. Some updates are temporary, while others signal a longer-term program shift.",
    },
    {
      q: "Where should I verify Canadian immigration news?",
      a: "Important updates should be checked against official IRCC pages, provincial immigration websites, ministerial instructions, and trusted professional analysis. For personal decisions, compare the update with your own eligibility before taking action.",
    },
  ],
};

export function getTopicFaqs(topicId: BlogTopicId, locale: string): Faq[] {
  if (locale !== "en" || topicId === "all") return [];
  return FAQS[topicId];
}
