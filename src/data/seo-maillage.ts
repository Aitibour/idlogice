export type MaillageLink = {
  href: string;
  label: string;
  description: string;
};

export type ProgramMaillage = {
  pillar: MaillageLink;
  service: MaillageLink;
  siblings: MaillageLink[];
  children: MaillageLink[];
  countryTargets: string[];
  ctas: MaillageLink[];
};

const consultationLink: MaillageLink = {
  href: "/book-consultation",
  label: "Book an immigration consultation",
  description: "Turn research into a reviewed strategy with IDLOGICE.",
};

const evaluationLink: MaillageLink = {
  href: "/evaluation",
  label: "Free Canada immigration evaluation",
  description: "Check which Canadian immigration pathway fits your profile.",
};

export const PROGRAM_MAILLAGE: Record<string, ProgramMaillage> = {
  "express-entry": {
    pillar: {
      href: "/programs/express-entry",
      label: "Express Entry Canada",
      description: "The main authority page for skilled worker permanent residence.",
    },
    service: {
      href: "/services/express-entry",
      label: "Express Entry application help",
      description: "Paid support for profile strategy, CRS improvement, and PR filing.",
    },
    siblings: [
      { href: "/calculator", label: "CRS score calculator", description: "Estimate your CRS score before building a profile." },
      { href: "/draws", label: "Express Entry draws", description: "Track draw history, cut-offs, and category-based invitations." },
      { href: "/programs/provincial-nominee-program", label: "Provincial Nominee Program", description: "Use PNP options when CRS is not competitive enough." },
      { href: "/programs/francophone-mobility", label: "Francophone Mobility Program", description: "Build Canadian work experience through a French-language work permit route." },
      { href: "/programs/canada-tech-immigration", label: "Canada tech immigration", description: "Express Entry and PNP options for software, data, and STEM workers." },
    ],
    children: [
      { href: "/blog/crs-score-calculator-2026", label: "CRS score explained", description: "Understand the factors that shape your Express Entry ranking." },
      { href: "/blog/express-entry-draw-history-2026", label: "Express Entry draw history", description: "Use past cut-offs to plan your invitation strategy." },
      { href: "/blog/pnp-vs-express-entry", label: "PNP vs Express Entry", description: "Compare direct federal PR with provincial nomination routes." },
    ],
    countryTargets: ["morocco", "france", "united-arab-emirates", "india", "nigeria", "algeria"],
    ctas: [evaluationLink, consultationLink],
  },
  "provincial-nominee-program": {
    pillar: {
      href: "/programs/provincial-nominee-program",
      label: "Provincial Nominee Program Canada",
      description: "The main PNP authority page for province-backed immigration.",
    },
    service: {
      href: "/services/pnp",
      label: "PNP application help",
      description: "Support for selecting, preparing, and filing provincial pathways.",
    },
    siblings: [
      { href: "/programs/express-entry", label: "Express Entry Canada", description: "Connect PNP strategy to the federal Express Entry system." },
      { href: "/programs/canada-tech-immigration", label: "PNP for tech workers", description: "Tech-focused province options for skilled workers." },
      { href: "/programs/work-permit", label: "Canada work permit", description: "Use Canadian work experience to strengthen future PNP options." },
      { href: "/calculator", label: "CRS score calculator", description: "Estimate whether PNP points could change your ranking." },
    ],
    children: [
      { href: "/blog/pnp-vs-express-entry", label: "PNP vs Express Entry", description: "Compare the two strongest permanent residence pathways." },
      { href: "/programs/canada-tech-immigration", label: "Best PNP for IT workers", description: "Explore tech and STEM-oriented provincial pathways." },
      { href: "/programs/express-entry", label: "Low CRS score options", description: "Use provincial nomination when CRS is too low." },
    ],
    countryTargets: ["morocco", "france", "united-arab-emirates", "india", "philippines", "nigeria"],
    ctas: [evaluationLink, consultationLink],
  },
  "work-permit": {
    pillar: {
      href: "/programs/work-permit",
      label: "Canada Work Permit",
      description: "The main work permit authority page for temporary work routes.",
    },
    service: {
      href: "/services/work-permit",
      label: "Canada work permit assistance",
      description: "Support for employer-specific, open, LMIA, and exempt permits.",
    },
    siblings: [
      { href: "/programs/lmia-work-permit", label: "LMIA work permit", description: "Employer-supported work permit pathway for foreign workers." },
      { href: "/programs/francophone-mobility", label: "Francophone Mobility Program", description: "LMIA-exempt work permits for French-speaking applicants." },
      { href: "/programs/canada-tech-immigration", label: "Canada tech immigration", description: "Work permit and PR strategies for technology workers." },
      { href: "/programs/express-entry", label: "Express Entry Canada", description: "Use skilled Canadian work experience for permanent residence." },
    ],
    children: [
      { href: "/blog/canada-work-permit-guide", label: "Canada work permit guide", description: "Step-by-step overview of Canadian work permit options." },
      { href: "/programs/lmia-work-permit", label: "Closed work permit and LMIA", description: "Understand employer-specific work permit strategy." },
      { href: "/programs/francophone-mobility", label: "LMIA-exempt work permit", description: "Explore French-language mobility options outside Quebec." },
    ],
    countryTargets: ["united-arab-emirates", "morocco", "india", "philippines", "tunisia", "algeria"],
    ctas: [evaluationLink, consultationLink],
  },
  "study-permit": {
    pillar: {
      href: "/programs/study-permit",
      label: "Study Permit Canada",
      description: "The main study permit authority page for students and graduates.",
    },
    service: {
      href: "/services/study-permit",
      label: "Study permit application help",
      description: "Support for study plans, documents, refusals, and PR after studies.",
    },
    siblings: [
      { href: "/programs/work-permit", label: "Canada work permit", description: "Move from study permit to work permit after graduation." },
      { href: "/programs/express-entry", label: "Express Entry Canada", description: "Plan PR after Canadian study and skilled work experience." },
      { href: "/programs/provincial-nominee-program", label: "PNP for graduates", description: "Use provincial graduate streams after studying in Canada." },
    ],
    children: [
      { href: "/blog/canada-study-permit-guide", label: "Canada study permit guide", description: "Understand documents, eligibility, and common refusal risks." },
      { href: "/programs/work-permit", label: "PGWP pathway", description: "Plan the transition from studies to Canadian work experience." },
      { href: "/evaluation", label: "PR after studies evaluation", description: "Check long-term PR options before choosing a program." },
    ],
    countryTargets: ["morocco", "india", "nigeria", "united-arab-emirates", "france", "algeria"],
    ctas: [evaluationLink, consultationLink],
  },
  "family-sponsorship": {
    pillar: {
      href: "/programs/family-sponsorship",
      label: "Family Sponsorship Canada",
      description: "The main authority page for sponsoring eligible family members.",
    },
    service: {
      href: "/services/family-sponsorship",
      label: "Family sponsorship application help",
      description: "Support for spouse, partner, parent, and family sponsorship files.",
    },
    siblings: [
      { href: "/programs/tourist-visa", label: "Canada visitor visa", description: "Temporary visitor options while sponsorship strategy is planned." },
      { href: "/programs/express-entry", label: "Express Entry Canada", description: "Compare family sponsorship with skilled worker PR options." },
      { href: "/contact", label: "Immigration consultation", description: "Review family eligibility and refusal risks before filing." },
    ],
    children: [
      { href: "/blog/family-sponsorship-canada", label: "Family sponsorship guide", description: "Step-by-step overview of sponsorship categories and timelines." },
      { href: "/programs/tourist-visa", label: "Visitor visa for family", description: "Understand temporary travel options for family members." },
      { href: "/book-consultation", label: "Sponsorship document review", description: "Prepare relationship proof, forms, and supporting evidence." },
    ],
    countryTargets: ["morocco", "india", "nigeria", "philippines", "france", "algeria"],
    ctas: [consultationLink],
  },
  "tourist-visa": {
    pillar: {
      href: "/programs/tourist-visa",
      label: "Canada Visitor Visa",
      description: "The main visitor visa authority page for temporary travel.",
    },
    service: {
      href: "/services/tourist-visa",
      label: "Canada visitor visa assistance",
      description: "Support for TRV, Super Visa, invitation letters, and refusals.",
    },
    siblings: [
      { href: "/programs/family-sponsorship", label: "Family Sponsorship Canada", description: "Move from temporary family visits to permanent sponsorship." },
      { href: "/programs/study-permit", label: "Study Permit Canada", description: "Compare visitor, student, and long-term immigration intent." },
      { href: "/programs/work-permit", label: "Canada Work Permit", description: "Understand why visitor status does not authorize most work." },
    ],
    children: [
      { href: "/blog/canada-tourist-visa-guide", label: "Canada tourist visa guide", description: "Documents, proof of funds, ties, and refusal risks." },
      { href: "/programs/family-sponsorship", label: "Super Visa and sponsorship", description: "Compare visitor options for parents and grandparents." },
      { href: "/book-consultation", label: "Visitor visa refusal review", description: "Get help addressing weak ties or insufficient evidence." },
    ],
    countryTargets: ["morocco", "india", "nigeria", "united-arab-emirates", "algeria", "tunisia"],
    ctas: [consultationLink],
  },
  "francophone-mobility": {
    pillar: {
      href: "/programs/francophone-mobility",
      label: "Francophone Mobility Program",
      description: "The main French-speaking work permit page for jobs outside Quebec.",
    },
    service: {
      href: "/services/work-permit",
      label: "Francophone work permit support",
      description: "Support for LMIA-exempt work permits and employer compliance.",
    },
    siblings: [
      { href: "/programs/work-permit", label: "Canada Work Permit", description: "Compare Francophone Mobility with other work permit pathways." },
      { href: "/programs/lmia-work-permit", label: "LMIA Work Permit", description: "Compare LMIA-exempt and LMIA-supported employer routes." },
      { href: "/programs/express-entry", label: "Express Entry French points", description: "Use French ability to improve CRS and PR strategy." },
      { href: "/programs/canada-tech-immigration", label: "French tech immigration", description: "Combine French, tech work, and Canadian experience." },
    ],
    children: [
      { href: "/from/morocco/francophone-mobility", label: "Francophone Mobility from Morocco", description: "A high-fit pathway for Moroccan French-speaking workers." },
      { href: "/from/france/francophone-mobility", label: "Francophone Mobility from France", description: "Work permit options for French applicants outside Quebec." },
      { href: "/from/algeria/francophone-mobility", label: "Francophone Mobility from Algeria", description: "French-speaking work permit strategy for Algerian applicants." },
    ],
    countryTargets: ["morocco", "france", "algeria", "tunisia", "senegal", "cameroon"],
    ctas: [evaluationLink, consultationLink],
  },
  "lmia-work-permit": {
    pillar: {
      href: "/programs/lmia-work-permit",
      label: "LMIA Work Permit",
      description: "The main employer-supported work permit authority page.",
    },
    service: {
      href: "/services/work-permit",
      label: "LMIA support",
      description: "Support for employer evidence, recruitment, and worker permits.",
    },
    siblings: [
      { href: "/programs/work-permit", label: "Canada Work Permit", description: "Place LMIA inside the wider work permit ecosystem." },
      { href: "/programs/francophone-mobility", label: "Francophone Mobility Program", description: "Compare LMIA and LMIA-exempt French-speaking options." },
      { href: "/programs/express-entry", label: "Express Entry job offer points", description: "Understand how qualifying job offers can affect CRS." },
      { href: "/programs/provincial-nominee-program", label: "PNP with job offer", description: "Connect employer support to provincial nomination strategy." },
    ],
    children: [
      { href: "/from/united-arab-emirates/lmia-work-permit", label: "LMIA work permit from UAE", description: "Employer-supported work permit strategy for UAE residents." },
      { href: "/from/morocco/lmia-work-permit", label: "LMIA work permit from Morocco", description: "Canadian employer route for Moroccan workers." },
      { href: "/from/india/lmia-work-permit", label: "LMIA work permit from India", description: "Employer-supported work permit strategy for Indian applicants." },
    ],
    countryTargets: ["united-arab-emirates", "morocco", "india", "philippines", "tunisia", "pakistan"],
    ctas: [evaluationLink, consultationLink],
  },
  "canada-tech-immigration": {
    pillar: {
      href: "/programs/canada-tech-immigration",
      label: "Canada Tech Immigration",
      description: "The main authority page for IT, STEM, and digital workers.",
    },
    service: {
      href: "/services/express-entry",
      label: "Tech immigration strategy",
      description: "Support for Express Entry, PNP tech streams, and work permit planning.",
    },
    siblings: [
      { href: "/programs/express-entry", label: "Express Entry for IT workers", description: "Use skilled tech work experience for permanent residence." },
      { href: "/programs/provincial-nominee-program", label: "PNP for IT workers", description: "Use provincial tech pathways when CRS needs support." },
      { href: "/programs/francophone-mobility", label: "French-speaking tech workers", description: "Combine French language and tech work permit strategy." },
      { href: "/programs/work-permit", label: "Tech work permit Canada", description: "Move into Canada through an employer-supported work route." },
    ],
    children: [
      { href: "/from/united-arab-emirates/canada-tech-immigration", label: "Canada tech immigration from UAE", description: "High-intent tech immigration page for UAE residents." },
      { href: "/from/morocco/canada-tech-immigration", label: "Canada tech immigration from Morocco", description: "Tech and Francophone strategy for Moroccan applicants." },
      { href: "/from/india/canada-tech-immigration", label: "Canada tech immigration from India", description: "Express Entry, PNP, and work permit options for Indian tech workers." },
    ],
    countryTargets: ["united-arab-emirates", "morocco", "india", "france", "nigeria", "brazil"],
    ctas: [evaluationLink, consultationLink],
  },
};

export function getProgramMaillage(slug: string): ProgramMaillage | undefined {
  return PROGRAM_MAILLAGE[slug];
}

export function localizeHref(locale: string, href: string): string {
  if (href.startsWith("http")) return href;
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}
