/**
 * seed-cluster-topics.ts
 * Seeds 30 planned cluster article topics into the blog_posts table as drafts.
 * Run with: SUPABASE_SERVICE_ROLE_KEY=xxx npx jiti scripts/seed-cluster-topics.ts
 *
 * These are the Diamond SEO strategy cluster articles — 5 per pillar × 6 pillars.
 * The daily blog-generator will pick them up and generate full content automatically.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// 30 cluster topics: 6 pillars × 5 articles each
const CLUSTER_TOPICS = [
  // ── Pillar 1: Express Entry ──────────────────────────────────────────────
  {
    source_url: "https://idlogice.com/cluster/how-express-entry-works",
    title: { en: "How Express Entry Works: Complete 2026 Guide", fr: "Comment fonctionne l'Entrée express : Guide complet 2026" },
    excerpt: { en: "Step-by-step breakdown of Canada's Express Entry system — pool, draws, ITA, and permanent residence application.", fr: "Aperçu étape par étape du système d'Entrée express canadien — pool, tirages, LAI et demande de résidence permanente." },
    category: "express-entry",
  },
  {
    source_url: "https://idlogice.com/cluster/crs-score-guide-2026",
    title: { en: "CRS Score Guide 2026: How to Calculate and Improve Your Score", fr: "Guide CRS 2026 : Comment calculer et améliorer votre score" },
    excerpt: { en: "Everything you need to know about the Comprehensive Ranking System — factors, points, and proven strategies to boost your CRS before the next draw.", fr: "Tout ce que vous devez savoir sur le Système de classement global — facteurs, points et stratégies pour améliorer votre score." },
    category: "express-entry",
  },
  {
    source_url: "https://idlogice.com/cluster/express-entry-draw-predictions",
    title: { en: "Express Entry Draw Predictions 2026: What Score Do You Need?", fr: "Prédictions de tirage Entrée express 2026 : Quel score faut-il ?" },
    excerpt: { en: "Analysis of 2025 draw trends and CRS cut-offs to help you plan your Express Entry strategy for 2026.", fr: "Analyse des tendances de tirages 2025 et des seuils CRS pour vous aider à planifier votre stratégie Entrée express 2026." },
    category: "express-entry",
  },
  {
    source_url: "https://idlogice.com/cluster/ita-process-explained",
    title: { en: "ITA Process Explained: What Happens After You Get an Invitation to Apply", fr: "Processus LAI expliqué : Que se passe-t-il après avoir reçu une invitation ?" },
    excerpt: { en: "A complete walkthrough of the 60-day ITA window — what documents to gather, how to submit, and common mistakes to avoid.", fr: "Un guide complet du délai de 60 jours après la LAI — documents à rassembler, comment soumettre et erreurs à éviter." },
    category: "express-entry",
  },
  {
    source_url: "https://idlogice.com/cluster/noc-code-guide-2026",
    title: { en: "NOC Code Guide 2026: Find Your TEER Category for Express Entry", fr: "Guide des codes CNP 2026 : Trouvez votre catégorie TEER pour l'Entrée express" },
    excerpt: { en: "How to find and verify your National Occupation Code (NOC) under the TEER system, and what it means for your Express Entry eligibility.", fr: "Comment trouver et vérifier votre Code national des professions (CNP) dans le système TEER et ce que cela signifie pour votre éligibilité à l'Entrée express." },
    category: "express-entry",
  },

  // ── Pillar 2: PNP Programs ───────────────────────────────────────────────
  {
    source_url: "https://idlogice.com/cluster/best-pnp-programs-2026",
    title: { en: "Best PNP Programs in Canada 2026: Which Province is Right for You?", fr: "Meilleurs programmes PNP au Canada 2026 : Quelle province vous convient ?" },
    excerpt: { en: "A province-by-province comparison of PNP streams, minimum CRS scores, and in-demand occupations to help you choose the best nomination program.", fr: "Une comparaison province par province des voies PNP, scores CRS minimaux et professions en demande pour choisir le meilleur programme de nomination." },
    category: "pnp",
  },
  {
    source_url: "https://idlogice.com/cluster/ontario-pnp-tech-draws",
    title: { en: "Ontario PNP Tech Draws 2026: How to Get Nominated by OINP", fr: "Tirages technologiques PNP Ontario 2026 : Comment obtenir une nomination OINP" },
    excerpt: { en: "Ontario's Human Capital Priorities stream and tech draws — who qualifies, what CRS score is needed, and how to apply for OINP nomination.", fr: "Le volet des priorités en capital humain de l'Ontario et tirages technologiques — qui est éligible, quel score CRS est nécessaire et comment postuler." },
    category: "pnp",
  },
  {
    source_url: "https://idlogice.com/cluster/bc-pnp-tech-stream-guide",
    title: { en: "BC PNP Tech Pilot Guide 2026: Fast-Track to BC Permanent Residency", fr: "Guide du projet pilote technologique PNP BC 2026 : Voie rapide vers la résidence permanente en CB" },
    excerpt: { en: "British Columbia's tech-focused immigration stream explained — eligibility, processing times, and how to combine BC PNP with Express Entry.", fr: "Le volet d'immigration technologique de la Colombie-Britannique expliqué — éligibilité, délais et comment combiner PNP BC avec l'Entrée express." },
    category: "pnp",
  },
  {
    source_url: "https://idlogice.com/cluster/pnp-vs-express-entry-comparison",
    title: { en: "PNP vs Express Entry: Which Canadian Immigration Path is Faster?", fr: "PNP vs Entrée express : Quelle voie d'immigration canadienne est la plus rapide ?" },
    excerpt: { en: "An honest comparison of provincial nomination versus federal Express Entry — processing times, success rates, and which path suits different profiles.", fr: "Une comparaison honnête de la nomination provinciale versus l'Entrée express fédérale — délais, taux de réussite et quelle voie convient à différents profils." },
    category: "pnp",
  },
  {
    source_url: "https://idlogice.com/cluster/french-pnp-programs",
    title: { en: "Best PNP Programs for French Speakers 2026", fr: "Meilleurs programmes PNP pour les francophones 2026" },
    excerpt: { en: "PNP streams specifically designed for French-speaking applicants outside Quebec — Manitoba, New Brunswick, Nova Scotia, and Ontario francophone pathways.", fr: "Voies PNP spécialement conçues pour les candidats francophones hors Québec — Manitoba, Nouveau-Brunswick, Nouvelle-Écosse et voies francophones de l'Ontario." },
    category: "pnp",
  },

  // ── Pillar 3: Work Permits ───────────────────────────────────────────────
  {
    source_url: "https://idlogice.com/cluster/open-work-permit-guide",
    title: { en: "Open Work Permit Canada 2026: Who Qualifies and How to Apply", fr: "Permis de travail ouvert Canada 2026 : Qui est éligible et comment postuler" },
    excerpt: { en: "A complete guide to open work permits — PGWP, spousal OWP, BOWP, and IEC — who qualifies, processing times, and step-by-step application tips.", fr: "Un guide complet des permis de travail ouverts — PTPD, permis conjoint, PPOT et EMI — qui est éligible, délais et conseils de demande étape par étape." },
    category: "work-permit",
  },
  {
    source_url: "https://idlogice.com/cluster/lmia-explained-2026",
    title: { en: "LMIA Explained 2026: What It Is, Who Needs It, and How to Get One", fr: "EIMT expliquée 2026 : Ce que c'est, qui en a besoin et comment l'obtenir" },
    excerpt: { en: "Everything employers and foreign workers need to know about the Labour Market Impact Assessment — timelines, costs, and LMIA-exempt alternatives.", fr: "Tout ce que les employeurs et les travailleurs étrangers doivent savoir sur l'Étude d'impact sur le marché du travail — délais, coûts et alternatives sans EIMT." },
    category: "work-permit",
  },
  {
    source_url: "https://idlogice.com/cluster/mobilite-francophone-guide",
    title: { en: "Mobilite Francophone Work Permit Guide 2026: LMIA-Exempt for French Speakers", fr: "Guide du Programme Mobilité francophone 2026 : Sans EIMT pour les francophones" },
    excerpt: { en: "How French-speaking workers outside Quebec can get a Canadian work permit without LMIA through the Mobilite Francophone program.", fr: "Comment les travailleurs francophones hors Québec peuvent obtenir un permis de travail canadien sans EIMT via le Programme Mobilité francophone." },
    category: "work-permit",
  },
  {
    source_url: "https://idlogice.com/cluster/bridging-open-work-permit",
    title: { en: "Bridging Open Work Permit (BOWP): Keep Working While Your PR is Processed", fr: "Permis de travail ouvert de transition (PTOT) : Continuez à travailler pendant le traitement de votre RP" },
    excerpt: { en: "How to apply for a Bridging Open Work Permit to maintain your legal work status while your permanent residence application is pending.", fr: "Comment demander un Permis de travail ouvert de transition pour maintenir votre statut de travail légal pendant le traitement de votre demande de résidence permanente." },
    category: "work-permit",
  },
  {
    source_url: "https://idlogice.com/cluster/work-permit-extension-canada",
    title: { en: "How to Extend Your Work Permit in Canada 2026", fr: "Comment prolonger votre permis de travail au Canada 2026" },
    excerpt: { en: "Step-by-step guide to renewing a Canadian work permit — implied status, restoration, and how to avoid gaps in your work authorization.", fr: "Guide étape par étape pour renouveler un permis de travail canadien — statut implicite, rétablissement et comment éviter les interruptions d'autorisation de travail." },
    category: "work-permit",
  },

  // ── Pillar 4: Study Permits ──────────────────────────────────────────────
  {
    source_url: "https://idlogice.com/cluster/study-permit-requirements-2026",
    title: { en: "Canada Study Permit Requirements 2026: Full Application Checklist", fr: "Exigences du permis d'études Canada 2026 : Liste de contrôle complète" },
    excerpt: { en: "Everything international students need to apply for a Canadian study permit — documents, financial requirements, language scores, and common refusal reasons.", fr: "Tout ce dont les étudiants internationaux ont besoin pour demander un permis d'études canadien — documents, exigences financières, scores de langue et raisons de refus courantes." },
    category: "study-permit",
  },
  {
    source_url: "https://idlogice.com/cluster/sds-canada-guide",
    title: { en: "Student Direct Stream (SDS) Canada: Faster Study Permit for Select Countries", fr: "Voie d'accès directe aux étudiants (VADE) Canada : Permis d'études plus rapide pour certains pays" },
    excerpt: { en: "The Student Direct Stream offers 20-day processing for eligible applicants. Learn which countries qualify and how to apply correctly.", fr: "La Voie d'accès directe aux étudiants offre un traitement en 20 jours pour les demandeurs éligibles. Apprenez quels pays sont admissibles et comment postuler correctement." },
    category: "study-permit",
  },
  {
    source_url: "https://idlogice.com/cluster/pgwp-guide-2026",
    title: { en: "Post-Graduation Work Permit (PGWP) Guide 2026", fr: "Guide du Permis de travail postdiplome (PTPD) 2026" },
    excerpt: { en: "How international graduates can get a work permit after completing a Canadian program — eligible programs, duration, and pathway to PR.", fr: "Comment les diplômés internationaux peuvent obtenir un permis de travail après avoir complété un programme canadien — programmes admissibles, durée et voie vers la RP." },
    category: "study-permit",
  },
  {
    source_url: "https://idlogice.com/cluster/student-to-pr-pathway",
    title: { en: "International Student to Canadian PR: Complete Roadmap", fr: "Etudiant international vers la RP canadienne : Feuille de route complète" },
    excerpt: { en: "A step-by-step roadmap from study permit to Canadian permanent residence — which programs to target, how to build your CRS profile, and PNP options.", fr: "Une feuille de route étape par étape du permis d'études à la résidence permanente canadienne — quels programmes cibler, comment construire votre profil CRS et options PNP." },
    category: "study-permit",
  },
  {
    source_url: "https://idlogice.com/cluster/best-colleges-canada-immigration",
    title: { en: "Best Colleges in Canada for International Students Aiming for PR", fr: "Meilleures universites au Canada pour les etudiants internationaux visant la RP" },
    excerpt: { en: "Which Canadian colleges and universities offer PGWP-eligible programs and strong pathways to permanent residency through PNP graduate streams.", fr: "Quels collèges et universités canadiens offrent des programmes admissibles au PTPD et de solides voies vers la résidence permanente via les voies PNP pour diplômés." },
    category: "study-permit",
  },

  // ── Pillar 5: Family Sponsorship ─────────────────────────────────────────
  {
    source_url: "https://idlogice.com/cluster/spousal-sponsorship-guide",
    title: { en: "Spousal Sponsorship Canada 2026: Complete Application Guide", fr: "Parrainage du conjoint Canada 2026 : Guide de demande complet" },
    excerpt: { en: "Everything sponsors and sponsored spouses need to know — eligibility, documents, processing times, and how to strengthen your application.", fr: "Tout ce que les répondants et les conjoints parrainés doivent savoir — admissibilité, documents, délais et comment renforcer votre demande." },
    category: "family-sponsorship",
  },
  {
    source_url: "https://idlogice.com/cluster/inland-vs-outland-sponsorship",
    title: { en: "Inland vs Outland Spousal Sponsorship: Which is Better?", fr: "Parrainage conjugal interieur vs exterieur : Lequel est meilleur ?" },
    excerpt: { en: "A detailed comparison of inland (in-Canada) and outland (outside Canada) sponsorship pathways — work authorization, processing, and which suits your situation.", fr: "Une comparaison détaillée des voies de parrainage intérieur (au Canada) et extérieur (hors Canada) — autorisation de travail, traitement et laquelle convient à votre situation." },
    category: "family-sponsorship",
  },
  {
    source_url: "https://idlogice.com/cluster/parents-grandparents-sponsorship",
    title: { en: "Parents and Grandparents Program Canada 2026", fr: "Programme de parrainage des parents et grands-parents Canada 2026" },
    excerpt: { en: "How Canadian PRs and citizens can sponsor parents and grandparents — lottery system, income requirements, and Super Visa alternative.", fr: "Comment les RP et citoyens canadiens peuvent parrainer leurs parents et grands-parents — système de loterie, exigences de revenus et alternative du super visa." },
    category: "family-sponsorship",
  },
  {
    source_url: "https://idlogice.com/cluster/sponsorship-processing-times",
    title: { en: "Family Sponsorship Processing Times Canada 2026", fr: "Delais de traitement du parrainage familial Canada 2026" },
    excerpt: { en: "Current IRCC processing times for all family class applications — spousal, parents, children — and tips to avoid delays.", fr: "Délais de traitement IRCC actuels pour toutes les demandes de la catégorie de la famille — conjoint, parents, enfants — et conseils pour éviter les retards." },
    category: "family-sponsorship",
  },
  {
    source_url: "https://idlogice.com/cluster/sponsorship-refusal-reasons",
    title: { en: "Top Reasons Canada Sponsorship Applications are Refused (and How to Avoid Them)", fr: "Principales raisons de refus des demandes de parrainage Canada (et comment les eviter)" },
    excerpt: { en: "The most common reasons IRCC refuses spousal and family sponsorship applications — and how to address each issue before submitting.", fr: "Les raisons les plus courantes pour lesquelles l'IRCC refuse les demandes de parrainage — et comment résoudre chaque problème avant de soumettre." },
    category: "family-sponsorship",
  },

  // ── Pillar 6: PR Pathways ────────────────────────────────────────────────
  {
    source_url: "https://idlogice.com/cluster/pr-for-tech-workers",
    title: { en: "Canadian PR for Tech Workers 2026: Best Pathways for IT Professionals", fr: "RP canadienne pour les travailleurs tech 2026 : Meilleures voies pour les professionnels TI" },
    excerpt: { en: "Express Entry, PNP tech streams, and employer-sponsored options for software engineers, data scientists, and IT professionals targeting Canadian PR.", fr: "Entrée express, voies PNP technologiques et options parrainées par l'employeur pour les ingénieurs logiciels, scientifiques des données et professionnels TI visant la RP canadienne." },
    category: "pr-pathways",
  },
  {
    source_url: "https://idlogice.com/cluster/pr-without-lmia",
    title: { en: "How to Get Canadian PR Without LMIA: LMIA-Exempt Pathways", fr: "Comment obtenir la RP canadienne sans EIMT : Voies exemptees d'EIMT" },
    excerpt: { en: "Canada's LMIA-exempt immigration streams — Intra-Company Transfers, IEC, CUSMA/USMCA, Francophone Mobility, and more — and how to use them strategically.", fr: "Les voies d'immigration canadiennes exemptées d'EIMT — Transferts intra-entreprise, EMI, ACEUM, Mobilité francophone et plus — et comment les utiliser stratégiquement." },
    category: "pr-pathways",
  },
  {
    source_url: "https://idlogice.com/cluster/pr-through-work-experience",
    title: { en: "Getting Canadian PR Through Work Experience: CEC and Other Options", fr: "Obtenir la RP canadienne par l'experience de travail : ECC et autres options" },
    excerpt: { en: "How skilled workers with Canadian work experience can use the Canadian Experience Class (CEC) and other programs to get permanent residency.", fr: "Comment les travailleurs qualifiés avec une expérience de travail canadienne peuvent utiliser la Catégorie de l'expérience canadienne (CEC) et d'autres programmes pour obtenir la résidence permanente." },
    category: "pr-pathways",
  },
  {
    source_url: "https://idlogice.com/cluster/francophone-pr-pathways",
    title: { en: "Francophone Immigration to Canada: Fastest PR Pathways for French Speakers", fr: "Immigration francophone au Canada : Voies RP les plus rapides pour les francophones" },
    excerpt: { en: "How French-speaking applicants get priority processing, CRS bonuses, dedicated draws, and LMIA-exempt work permits on the path to Canadian PR.", fr: "Comment les candidats francophones bénéficient d'un traitement prioritaire, de bonus CRS, de tirages dédiés et de permis de travail exemptés d'EIMT sur la voie de la RP canadienne." },
    category: "pr-pathways",
  },
  {
    source_url: "https://idlogice.com/cluster/pr-for-hospitality-workers",
    title: { en: "Canadian PR for Hospitality Workers 2026: Chefs, Cooks, and Hotel Staff", fr: "RP canadienne pour les travailleurs de l'hotellerie 2026 : Chefs, cuisiniers et personnel d'hotel" },
    excerpt: { en: "Immigration pathways for restaurant, hotel, and hospitality workers — including Rural and Northern programs, PNP streams, and Atlantic Immigration Program.", fr: "Voies d'immigration pour les travailleurs de la restauration, de l'hôtellerie et du tourisme — incluant les programmes ruraux et du Nord, les voies PNP et le Programme d'immigration au Canada atlantique." },
    category: "pr-pathways",
  },
];

async function main() {
  console.log(`Seeding ${CLUSTER_TOPICS.length} cluster article topics...`);
  let inserted = 0;
  let skipped = 0;

  for (const topic of CLUSTER_TOPICS) {
    // Check if already exists
    const { data: existing } = await db
      .from("blog_posts")
      .select("id")
      .eq("source_url", topic.source_url)
      .maybeSingle();

    if (existing) {
      skipped++;
      continue;
    }

    const slug = topic.source_url.split("/cluster/")[1];
    const { error } = await db.from("blog_posts").insert({
      slug,
      source_url: topic.source_url,
      title: topic.title,
      excerpt: topic.excerpt,
      category: topic.category,
      status: "queued", // Will be picked up and expanded by blog-generator
      published_at: null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error(`Failed to insert ${slug}:`, error.message);
    } else {
      inserted++;
      console.log(`  Queued: ${slug}`);
    }
  }

  console.log(`\nDone. Inserted: ${inserted}, Skipped (already existed): ${skipped}`);
}

main().catch(console.error);
