# Week 2 — Public Marketing Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build all public marketing pages (About, Contact, Services overview + 4 service detail pages, 3 legal stubs), enhance the homepage, and add a Services dropdown to the header.

**Architecture:** Shared Server Component sections (`PageHero`, `FeatureGrid`, `StepsSection`, `RequirementsSection`, `CtaBanner`) are composed by each page. Translation strings are resolved in page files and passed as props. Only `ContactForm` uses `"use client"`. New locale namespaces (`about`, `contact`, `services`) are loaded via `src/i18n/request.ts`.

**Tech Stack:** Next.js 16.2.2, React 19, TypeScript (strict), Tailwind CSS v4, Shadcn/ui v4, next-intl v4 (EN + FR), Lucide React. No backend — all pages are static.

---

## File Map

| Status | Path | Purpose |
|--------|------|---------|
| MODIFY | `locales/en/common.json` | Add `nav.servicesItems` |
| MODIFY | `locales/en/home.json` | Add `stats`, `howItWorks`, `trust` sections |
| CREATE | `locales/en/about.json` | About page strings |
| CREATE | `locales/en/contact.json` | Contact page strings |
| CREATE | `locales/en/services.json` | All service page strings |
| MODIFY | `locales/fr/common.json` | Add `nav.servicesItems` (French) |
| MODIFY | `locales/fr/home.json` | Add `stats`, `howItWorks`, `trust` sections (French) |
| CREATE | `locales/fr/about.json` | French About page strings |
| CREATE | `locales/fr/contact.json` | French Contact page strings |
| CREATE | `locales/fr/services.json` | French service page strings |
| MODIFY | `src/i18n/request.ts` | Load 3 new namespaces |
| CREATE | `src/components/sections/page-hero.tsx` | Inner-page hero section |
| CREATE | `src/components/sections/feature-grid.tsx` | Icon+title+desc grid |
| CREATE | `src/components/sections/steps-section.tsx` | Numbered process steps |
| CREATE | `src/components/sections/requirements-section.tsx` | Checklist + facts |
| CREATE | `src/components/sections/cta-banner.tsx` | Full-width CTA band |
| CREATE | `src/components/forms/contact-form.tsx` | Client Component — contact form |
| MODIFY | `src/components/layout/header.tsx` | Add Services dropdown |
| MODIFY | `src/app/[locale]/page.tsx` | Add stats bar, how-it-works, trust sections |
| CREATE | `src/app/[locale]/(public)/about/page.tsx` | About page |
| CREATE | `src/app/[locale]/(public)/contact/page.tsx` | Contact page |
| CREATE | `src/app/[locale]/(public)/services/page.tsx` | Services overview |
| CREATE | `src/app/[locale]/(public)/services/express-entry/page.tsx` | Express Entry |
| CREATE | `src/app/[locale]/(public)/services/study-permit/page.tsx` | Study Permit |
| CREATE | `src/app/[locale]/(public)/services/work-permit/page.tsx` | Work Permit |
| CREATE | `src/app/[locale]/(public)/services/pnp/page.tsx` | PNP |
| CREATE | `src/app/[locale]/(public)/privacy/page.tsx` | Privacy policy stub |
| CREATE | `src/app/[locale]/(public)/terms/page.tsx` | Terms of service stub |
| CREATE | `src/app/[locale]/(public)/cookies/page.tsx` | Cookie policy stub |

---

## Task 1: English translation files

**Files:**
- Modify: `locales/en/common.json`
- Modify: `locales/en/home.json`
- Create: `locales/en/about.json`
- Create: `locales/en/contact.json`
- Create: `locales/en/services.json`

- [ ] **Step 1: Add `nav.servicesItems` to `locales/en/common.json`**

Open `locales/en/common.json` and add these two keys inside the `"nav"` object (after the existing `"services": "Services"` key):

```json
"servicesItems": {
  "expressEntry": "Express Entry",
  "studyPermit": "Study Permit",
  "workPermit": "Work Permit",
  "pnp": "Provincial Nominee"
}
```

The full `"nav"` object in `locales/en/common.json` should become:
```json
"nav": {
  "home": "Home",
  "services": "Services",
  "servicesItems": {
    "expressEntry": "Express Entry",
    "studyPermit": "Study Permit",
    "workPermit": "Work Permit",
    "pnp": "Provincial Nominee"
  },
  "calculator": "CRS Calculator",
  "evaluation": "Free Evaluation",
  "draws": "Draw Tracker",
  "blog": "Blog",
  "pricing": "Pricing",
  "help": "Help",
  "login": "Log In",
  "register": "Sign Up",
  "dashboard": "Dashboard"
}
```

- [ ] **Step 2: Replace the `stats` key and add `howItWorks` + `trust` to `locales/en/home.json`**

The existing `stats` in `home.json` uses flat strings — replace the entire `stats` block and add the two new sections. The complete updated `locales/en/home.json`:

```json
{
  "hero": {
    "title": "Your Path to Canada Starts Here",
    "subtitle": "Free CRS calculator, immigration evaluation, and expert coaching to help you immigrate to Canada.",
    "cta": "Check Your Eligibility — Free",
    "secondaryCta": "Calculate Your CRS Score"
  },
  "features": {
    "title": "Everything You Need to Immigrate to Canada",
    "calculator": {
      "title": "CRS Calculator",
      "description": "Calculate your Comprehensive Ranking System score instantly and compare it to the latest Express Entry draws."
    },
    "evaluation": {
      "title": "Free Evaluation",
      "description": "Find out which immigration programs you qualify for based on your education, work experience, and language skills."
    },
    "mockTests": {
      "title": "Mock Tests",
      "description": "Practice for IELTS, CELPIP, TEF, and TCF with realistic exam simulations and instant scoring."
    },
    "coaching": {
      "title": "Expert Coaching",
      "description": "Get personalized guidance from immigration experts to maximize your chances of success."
    }
  },
  "stats": {
    "evaluations": { "value": "10,000+", "label": "Evaluations Completed" },
    "improvement": { "value": "47 pts", "label": "Average CRS Improvement" },
    "countries": { "value": "80+", "label": "Countries Served" }
  },
  "howItWorks": {
    "title": "How It Works",
    "subtitle": "Get your CRS score and immigration roadmap in 3 simple steps.",
    "steps": [
      {
        "number": 1,
        "title": "Evaluate Your Profile",
        "description": "Enter your education, work experience, and language scores. Our engine calculates your CRS score instantly."
      },
      {
        "number": 2,
        "title": "Get Your Roadmap",
        "description": "See which immigration programs you qualify for and receive a personalized action plan to improve your score."
      },
      {
        "number": 3,
        "title": "Take Action",
        "description": "Follow your roadmap, track your progress, and practice for IELTS with our mock tests — all in one platform."
      }
    ]
  },
  "trust": {
    "title": "Why Thousands Trust IDLOGICE",
    "items": [
      {
        "title": "Free Tools, Always",
        "description": "Our CRS calculator, evaluation tool, and draw tracker are free — no account required, no credit card, no catch."
      },
      {
        "title": "Your Privacy Is Protected",
        "description": "We never sell your data or share it with consultants. Your evaluation results are yours alone."
      },
      {
        "title": "Expert Guidance When You Need It",
        "description": "When you are ready for human support, our coaching programs connect you with experienced immigration professionals."
      }
    ]
  },
  "drawTracker": {
    "title": "Latest Express Entry Draw",
    "crsScore": "CRS Cutoff",
    "invitations": "Invitations Issued",
    "date": "Draw Date",
    "viewAll": "View All Draws"
  }
}
```

- [ ] **Step 3: Create `locales/en/about.json`**

```json
{
  "about": {
    "hero": {
      "title": "About IDLOGICE",
      "subtitle": "We built IDLOGICE to make Canadian immigration understandable, transparent, and accessible to everyone.",
      "cta": "Free Evaluation",
      "secondaryCta": "CRS Calculator"
    },
    "mission": {
      "heading": "Our Mission",
      "body": "Navigating Canadian immigration can be overwhelming. Between changing rules, complex point systems, and expensive consultants, many qualified candidates give up before they start. IDLOGICE changes that. We provide free, accurate tools — powered by the same public data IRCC uses — so you can understand exactly where you stand and what steps to take next. We are not immigration lawyers or consultants. We are technologists who believe access to clear immigration information should not depend on your budget."
    },
    "values": {
      "title": "What We Stand For",
      "items": [
        {
          "title": "Accuracy First",
          "description": "Our CRS calculator uses the official IRCC scoring matrix, updated whenever rules change. Every calculation is versioned and traceable."
        },
        {
          "title": "Your Data Is Private",
          "description": "We collect only what we need to run your evaluation. We never sell data to third parties or share it with immigration consultants without your explicit consent."
        },
        {
          "title": "Education Over Sales",
          "description": "Our goal is to help you make informed decisions — not to push you into purchasing a service you may not need. Free tools stay free."
        }
      ]
    },
    "cta": {
      "title": "Ready to Start?",
      "subtitle": "Check your CRS score and eligibility in under 5 minutes — completely free.",
      "primary": "Free Evaluation",
      "secondary": "CRS Calculator"
    }
  }
}
```

- [ ] **Step 4: Create `locales/en/contact.json`**

```json
{
  "contact": {
    "hero": {
      "title": "Contact Us",
      "subtitle": "Have a question about immigration or our tools? We will get back to you within 24 hours."
    },
    "form": {
      "name": "Your Name",
      "email": "Email Address",
      "subject": "Subject",
      "message": "Message",
      "submit": "Send Message",
      "successTitle": "Message sent!",
      "successMessage": "Thanks for reaching out. We will get back to you within 24 hours.",
      "errors": {
        "nameRequired": "Name is required",
        "emailInvalid": "Please enter a valid email address",
        "subjectRequired": "Subject is required",
        "messageRequired": "Message is required"
      }
    },
    "info": {
      "heading": "Get in Touch",
      "emailLabel": "Email",
      "emailValue": "support@idlogice.com",
      "responseLabel": "Response Time",
      "responseValue": "Within 24 business hours",
      "disclaimer": "For immigration advice, consult a Regulated Canadian Immigration Consultant (RCIC) or a licensed immigration lawyer. We cannot provide immigration legal advice."
    },
    "cta": {
      "title": "Looking for Quick Answers?",
      "subtitle": "Check our Help Center for answers to the most common immigration questions.",
      "primary": "Visit Help Center",
      "secondary": "Free Evaluation"
    }
  }
}
```

- [ ] **Step 5: Create `locales/en/services.json`**

```json
{
  "services": {
    "overview": {
      "hero": {
        "title": "Canadian Immigration Pathways",
        "subtitle": "Explore the main routes to Canadian permanent residence. Use our free tools to find out which programs you qualify for."
      },
      "grid": {
        "title": "Choose Your Pathway",
        "items": [
          {
            "title": "Express Entry",
            "description": "The federal system for skilled workers. The fastest path to permanent residence for most applicants."
          },
          {
            "title": "Study Permit",
            "description": "Study at a Canadian institution and build a path to permanent residence through the PGWP and Canadian Experience Class."
          },
          {
            "title": "Work Permit",
            "description": "Work in Canada temporarily with an LMIA-based or LMIA-exempt permit, and build Canadian experience toward PR."
          },
          {
            "title": "Provincial Nominee Program",
            "description": "Get nominated by a Canadian province and receive 600 additional CRS points — a near-guaranteed invitation to apply."
          }
        ]
      },
      "cta": {
        "title": "Not Sure Which Path Is Right for You?",
        "subtitle": "Our free evaluation checks your profile against all major immigration programs in under 5 minutes.",
        "primary": "Free Evaluation",
        "secondary": "CRS Calculator"
      }
    },
    "expressEntry": {
      "hero": {
        "badge": "Express Entry",
        "title": "Express Entry — Federal Skilled Worker Program",
        "subtitle": "Canada's flagship immigration system for skilled workers. Create a profile, enter the pool, and receive an Invitation to Apply based on your CRS score.",
        "cta": "Calculate Your CRS Score",
        "secondaryCta": "Free Evaluation"
      },
      "requirements": {
        "title": "Do You Qualify?",
        "qualifications": [
          "At least 1 year of continuous skilled work experience (NOC TEER 0, 1, 2, or 3)",
          "Language skills meeting CLB 7 or higher in all four abilities",
          "A post-secondary credential or Canadian equivalent via ECA",
          "Sufficient settlement funds (varies by family size)",
          "No criminal record and passing a medical examination"
        ],
        "facts": [
          { "label": "Max CRS Score", "value": "1,200 points" },
          { "label": "Streams", "value": "FSW, CEC, FST" },
          { "label": "Typical Processing", "value": "6 months" },
          { "label": "Min. Language", "value": "CLB 7 (FSW / CEC)" },
          { "label": "Work Experience", "value": "1+ year NOC TEER 0–3" }
        ]
      },
      "steps": {
        "title": "The Express Entry Process",
        "subtitle": "From creating your profile to receiving your permanent residence.",
        "items": [
          {
            "number": 1,
            "title": "Create Your Profile",
            "description": "Submit your Express Entry profile via the IRCC portal with your work experience, education, and language test results."
          },
          {
            "number": 2,
            "title": "Enter the Pool",
            "description": "Your profile is ranked in the Express Entry pool against other candidates using the Comprehensive Ranking System (CRS)."
          },
          {
            "number": 3,
            "title": "Receive an ITA",
            "description": "IRCC holds regular draws and issues Invitations to Apply (ITAs) to the highest-ranked candidates."
          },
          {
            "number": 4,
            "title": "Submit Your PR Application",
            "description": "You have 60 days to submit a complete permanent residence application with all supporting documents."
          },
          {
            "number": 5,
            "title": "Receive Permanent Residence",
            "description": "Most Express Entry applications are processed within 6 months of submission."
          }
        ]
      },
      "streams": {
        "title": "Express Entry Streams",
        "items": [
          {
            "title": "Federal Skilled Worker (FSW)",
            "description": "For workers with foreign skilled work experience and a strong CRS score. Requires an ECA for foreign credentials."
          },
          {
            "title": "Canadian Experience Class (CEC)",
            "description": "For workers who already have at least 1 year of Canadian skilled work experience in the last 3 years."
          },
          {
            "title": "Federal Skilled Trades (FST)",
            "description": "For workers in skilled trade occupations with a job offer or certificate of qualification in Canada."
          }
        ]
      },
      "cta": {
        "title": "What Is Your CRS Score?",
        "subtitle": "Calculate your score in 2 minutes and see how you compare to recent Express Entry draws.",
        "primary": "Calculate My CRS Score",
        "secondary": "Free Eligibility Check"
      }
    },
    "studyPermit": {
      "hero": {
        "badge": "Study Permit",
        "title": "Study in Canada",
        "subtitle": "Gain a Canadian education, work during your studies, and build a clear path to permanent residence through the Post-Graduation Work Permit.",
        "cta": "Check Your Eligibility",
        "secondaryCta": "CRS Calculator"
      },
      "requirements": {
        "title": "Key Requirements",
        "qualifications": [
          "An acceptance letter from a Designated Learning Institution (DLI) in Canada",
          "Proof of sufficient funds (minimum CAD $20,635/year for living costs plus tuition)",
          "Language scores meeting your program's requirements (typically IELTS 6.0+ or equivalent)",
          "No criminal record and passing a medical examination if required",
          "Proof that you will comply with the conditions of your permit"
        ],
        "facts": [
          { "label": "Min. Living Funds", "value": "CAD $20,635/year" },
          { "label": "Work Rights", "value": "20 hrs/week during studies" },
          { "label": "Post-Grad Work", "value": "PGWP up to 3 years" },
          { "label": "Path to PR", "value": "CEC after 1 year of work" },
          { "label": "Processing Time", "value": "4–16 weeks (online)" }
        ]
      },
      "steps": {
        "title": "How to Get Your Study Permit",
        "items": [
          {
            "number": 1,
            "title": "Choose a Designated Learning Institution",
            "description": "Select a DLI-approved school in Canada and receive your letter of acceptance before applying."
          },
          {
            "number": 2,
            "title": "Apply for a Study Permit",
            "description": "Submit your study permit application online via IRCC with your acceptance letter, financial proof, and language scores."
          },
          {
            "number": 3,
            "title": "Receive Your Permit",
            "description": "Once approved, you will receive a Port of Entry letter of introduction to present at the Canadian border."
          },
          {
            "number": 4,
            "title": "Arrive and Start Your Studies",
            "description": "Present your documents at the border. You can work 20 hours per week during the academic semester and full-time during breaks."
          }
        ]
      },
      "facts": {
        "title": "Why Study in Canada?",
        "items": [
          {
            "title": "Work While You Study",
            "description": "Study permit holders can work up to 20 hours per week during the academic semester and full-time during scheduled breaks."
          },
          {
            "title": "Post-Graduation Work Permit",
            "description": "After graduating, you may be eligible for a PGWP of up to 3 years — giving you time to gain the Canadian experience needed for CEC."
          },
          {
            "title": "Clear Path to Permanent Residence",
            "description": "Just 1 year of Canadian skilled work after graduation makes you eligible for the Canadian Experience Class — one of the fastest PR routes."
          }
        ]
      },
      "cta": {
        "title": "Ready to Study in Canada?",
        "subtitle": "Check your immigration eligibility and calculate your CRS score — free.",
        "primary": "Free Eligibility Check",
        "secondary": "Calculate CRS Score"
      }
    },
    "workPermit": {
      "hero": {
        "badge": "Work Permit",
        "title": "Work in Canada",
        "subtitle": "A Canadian work permit lets you gain valuable experience, build your CRS score, and create a pathway to permanent residence.",
        "cta": "Check Your Eligibility",
        "secondaryCta": "Free Evaluation"
      },
      "requirements": {
        "title": "Do You Qualify?",
        "qualifications": [
          "A valid job offer from a Canadian employer (for LMIA-based permits)",
          "Your employer has received a positive Labour Market Impact Assessment (LMIA), or your role is LMIA-exempt",
          "You meet the language and educational requirements for your occupation",
          "No criminal record and passing a medical examination if required",
          "You qualify under CUSMA, the International Experience Canada (IEC) program, or an intra-company transfer (for LMIA-exempt)"
        ],
        "facts": [
          { "label": "LMIA-Based", "value": "Requires employer LMIA" },
          { "label": "LMIA-Exempt", "value": "CUSMA, IEC, ICT" },
          { "label": "Processing Time", "value": "2–27 weeks (varies)" },
          { "label": "Path to PR", "value": "Express Entry (CEC)" },
          { "label": "Validity", "value": "Up to 3 years (varies)" }
        ]
      },
      "steps": {
        "title": "How to Get a Work Permit",
        "items": [
          {
            "number": 1,
            "title": "Secure a Job Offer",
            "description": "Find a Canadian employer willing to hire you. For LMIA-based permits, they must first obtain a positive LMIA from ESDC."
          },
          {
            "number": 2,
            "title": "Determine Your Permit Type",
            "description": "Confirm whether your role requires an LMIA or qualifies for an exemption (CUSMA, intra-company transfer, IEC)."
          },
          {
            "number": 3,
            "title": "Apply for Your Work Permit",
            "description": "Submit your work permit application online via IRCC with your job offer letter, LMIA number (if applicable), and supporting documents."
          },
          {
            "number": 4,
            "title": "Build Canadian Experience",
            "description": "Work in Canada, gain 1+ year of skilled work experience, and become eligible for the Canadian Experience Class in Express Entry."
          }
        ]
      },
      "permitTypes": {
        "title": "Types of Work Permits",
        "items": [
          {
            "title": "LMIA-Based Permit",
            "description": "Your employer applies for a Labour Market Impact Assessment proving no qualified Canadian was available for the role."
          },
          {
            "title": "CUSMA / NAFTA Permit",
            "description": "For citizens of USA and Mexico in specific professional occupations. No LMIA required — faster processing at the border."
          },
          {
            "title": "Intra-Company Transfer",
            "description": "For employees of multinational companies transferring to a Canadian office in a managerial, executive, or specialized knowledge role."
          }
        ]
      },
      "cta": {
        "title": "Is a Canadian Work Permit Right for You?",
        "subtitle": "Check your eligibility and see how Canadian work experience can boost your immigration prospects.",
        "primary": "Free Evaluation",
        "secondary": "Calculate CRS Score"
      }
    },
    "pnp": {
      "hero": {
        "badge": "Provincial Nominee Program",
        "title": "Provincial Nominee Program (PNP)",
        "subtitle": "A provincial nomination adds 600 points to your CRS score — virtually guaranteeing an Invitation to Apply at the next Express Entry draw.",
        "cta": "Check Your Eligibility",
        "secondaryCta": "Calculate CRS Score"
      },
      "requirements": {
        "title": "Do You Qualify?",
        "qualifications": [
          "Skills, education, or work experience that meets a specific province's labour market needs",
          "An intention to live and work in the nominating province",
          "You meet federal admissibility requirements (health, security, language)",
          "You are already in the Express Entry pool (for Enhanced PNP streams)",
          "Some streams require a job offer or a prior connection to the province"
        ],
        "facts": [
          { "label": "CRS Bonus", "value": "+600 points" },
          { "label": "Provinces", "value": "All except Quebec & Nunavut" },
          { "label": "Processing Time", "value": "6–19 months (varies)" },
          { "label": "Application Fee", "value": "$0–500 CAD (varies)" },
          { "label": "Available Streams", "value": "100+ across Canada" }
        ]
      },
      "steps": {
        "title": "The PNP Process",
        "items": [
          {
            "number": 1,
            "title": "Choose Your Target Province",
            "description": "Research which provinces have streams matching your occupation, education, and experience. Each province has different requirements."
          },
          {
            "number": 2,
            "title": "Apply to the Provincial Program",
            "description": "Submit a provincial application directly or via an Express Entry enhanced stream. Many provinces have their own Expression of Interest systems."
          },
          {
            "number": 3,
            "title": "Receive Your Nomination",
            "description": "If selected, the province nominates you. For Express Entry PNP streams, IRCC immediately adds 600 CRS points to your profile."
          },
          {
            "number": 4,
            "title": "Apply for Permanent Residence",
            "description": "With 600 extra CRS points you are virtually guaranteed an ITA at the next draw. Submit your PR application within 60 days."
          }
        ]
      },
      "provinces": {
        "title": "Popular Provincial Streams",
        "items": [
          {
            "title": "Ontario (OINP)",
            "description": "Canada's largest province offers streams for tech workers, in-demand trades, and international students from Ontario universities."
          },
          {
            "title": "British Columbia (BC PNP)",
            "description": "Strong tech sector with dedicated streams for software engineers, data scientists, and health professionals."
          },
          {
            "title": "Alberta (AINP)",
            "description": "Growing economy with streams for the Alberta Advantage, rural renewal, and self-employed farmers."
          }
        ]
      },
      "cta": {
        "title": "Could You Get a Provincial Nomination?",
        "subtitle": "Our free evaluation checks your profile against all PNP streams and identifies your best matching provinces.",
        "primary": "Free Evaluation",
        "secondary": "Calculate CRS Score"
      }
    }
  }
}
```

- [ ] **Step 6: Commit**

```bash
cd app
git add locales/en/
git commit -m "feat(i18n): add EN translations for about, contact, services; update home + common"
```

---

## Task 2: French translation files

**Files:**
- Modify: `locales/fr/common.json`
- Modify: `locales/fr/home.json`
- Create: `locales/fr/about.json`
- Create: `locales/fr/contact.json`
- Create: `locales/fr/services.json`

- [ ] **Step 1: Add `nav.servicesItems` to `locales/fr/common.json`**

Add inside the `"nav"` object (after the existing `"services": "Services"` key):

```json
"servicesItems": {
  "expressEntry": "Entrée express",
  "studyPermit": "Permis d'études",
  "workPermit": "Permis de travail",
  "pnp": "Programme des candidats des provinces"
}
```

- [ ] **Step 2: Replace `stats` and add `howItWorks` + `trust` in `locales/fr/home.json`**

Complete updated `locales/fr/home.json`:

```json
{
  "hero": {
    "title": "Votre chemin vers le Canada commence ici",
    "subtitle": "Calculateur CRS gratuit, évaluation d'immigration et coaching expert pour vous aider à immigrer au Canada.",
    "cta": "Vérifiez votre admissibilité — Gratuit",
    "secondaryCta": "Calculez votre score CRS"
  },
  "features": {
    "title": "Tout ce dont vous avez besoin pour immigrer au Canada",
    "calculator": {
      "title": "Calculateur CRS",
      "description": "Calculez votre score du Système de classement global instantanément et comparez-le aux derniers tirages d'Entrée express."
    },
    "evaluation": {
      "title": "Évaluation gratuite",
      "description": "Découvrez à quels programmes d'immigration vous êtes admissible en fonction de votre éducation, expérience et compétences linguistiques."
    },
    "mockTests": {
      "title": "Tests de pratique",
      "description": "Préparez-vous pour l'IELTS, le CELPIP, le TEF et le TCF avec des simulations d'examen réalistes et une notation instantanée."
    },
    "coaching": {
      "title": "Coaching expert",
      "description": "Obtenez des conseils personnalisés d'experts en immigration pour maximiser vos chances de succès."
    }
  },
  "stats": {
    "evaluations": { "value": "10 000+", "label": "Évaluations complétées" },
    "improvement": { "value": "47 pts", "label": "Amélioration moyenne du CRS" },
    "countries": { "value": "80+", "label": "Pays desservis" }
  },
  "howItWorks": {
    "title": "Comment ça fonctionne",
    "subtitle": "Obtenez votre score CRS et votre feuille de route en 3 étapes simples.",
    "steps": [
      {
        "number": 1,
        "title": "Évaluez votre profil",
        "description": "Entrez votre éducation, expérience de travail et scores linguistiques. Notre système calcule votre score CRS instantanément."
      },
      {
        "number": 2,
        "title": "Obtenez votre feuille de route",
        "description": "Découvrez les programmes d'immigration auxquels vous êtes admissible et recevez un plan d'action personnalisé."
      },
      {
        "number": 3,
        "title": "Passez à l'action",
        "description": "Suivez votre feuille de route, suivez vos progrès et préparez-vous à l'IELTS avec nos tests de pratique."
      }
    ]
  },
  "trust": {
    "title": "Pourquoi des milliers de personnes font confiance à IDLOGICE",
    "items": [
      {
        "title": "Outils gratuits, toujours",
        "description": "Notre calculateur CRS, outil d'évaluation et suivi des tirages sont gratuits — sans compte, sans carte de crédit."
      },
      {
        "title": "Vos données sont protégées",
        "description": "Nous ne vendons jamais vos données ni ne les partageons avec des consultants. Vos résultats d'évaluation vous appartiennent."
      },
      {
        "title": "Conseils d'experts quand vous en avez besoin",
        "description": "Quand vous êtes prêt pour un soutien humain, nos programmes de coaching vous connectent avec des professionnels de l'immigration."
      }
    ]
  },
  "drawTracker": {
    "title": "Dernier tirage d'Entrée express",
    "crsScore": "Score CRS minimum",
    "invitations": "Invitations émises",
    "date": "Date du tirage",
    "viewAll": "Voir tous les tirages"
  }
}
```

- [ ] **Step 3: Create `locales/fr/about.json`**

```json
{
  "about": {
    "hero": {
      "title": "À propos d'IDLOGICE",
      "subtitle": "Nous avons créé IDLOGICE pour rendre l'immigration canadienne compréhensible, transparente et accessible à tous.",
      "cta": "Évaluation gratuite",
      "secondaryCta": "Calculateur CRS"
    },
    "mission": {
      "heading": "Notre mission",
      "body": "Naviguer dans l'immigration canadienne peut être accablant. Entre des règles qui changent, des systèmes de points complexes et des consultants coûteux, de nombreux candidats qualifiés abandonnent avant même de commencer. IDLOGICE change ça. Nous fournissons des outils gratuits et précis — alimentés par les mêmes données publiques qu'utilise IRCC — pour que vous sachiez exactement où vous en êtes et quelles étapes suivre. Nous ne sommes pas des avocats ni des consultants en immigration. Nous sommes des technologues qui croient que l'accès à une information claire sur l'immigration ne devrait pas dépendre de votre budget."
    },
    "values": {
      "title": "Ce pour quoi nous nous battons",
      "items": [
        {
          "title": "L'exactitude avant tout",
          "description": "Notre calculateur CRS utilise la matrice de notation officielle d'IRCC, mise à jour à chaque changement de règles. Chaque calcul est versionné et traçable."
        },
        {
          "title": "Vos données sont privées",
          "description": "Nous collectons uniquement ce dont nous avons besoin pour votre évaluation. Nous ne vendons jamais vos données ni ne les partageons sans votre consentement explicite."
        },
        {
          "title": "Éducation plutôt que vente",
          "description": "Notre objectif est de vous aider à prendre des décisions éclairées — pas de vous pousser vers un service dont vous n'avez peut-être pas besoin. Les outils gratuits restent gratuits."
        }
      ]
    },
    "cta": {
      "title": "Prêt à commencer?",
      "subtitle": "Vérifiez votre score CRS et votre admissibilité en moins de 5 minutes — totalement gratuit.",
      "primary": "Évaluation gratuite",
      "secondary": "Calculateur CRS"
    }
  }
}
```

- [ ] **Step 4: Create `locales/fr/contact.json`**

```json
{
  "contact": {
    "hero": {
      "title": "Contactez-nous",
      "subtitle": "Vous avez une question sur l'immigration ou nos outils? Nous vous répondrons dans les 24 heures."
    },
    "form": {
      "name": "Votre nom",
      "email": "Adresse courriel",
      "subject": "Sujet",
      "message": "Message",
      "submit": "Envoyer le message",
      "successTitle": "Message envoyé!",
      "successMessage": "Merci de nous avoir contactés. Nous vous répondrons dans les 24 heures.",
      "errors": {
        "nameRequired": "Le nom est obligatoire",
        "emailInvalid": "Veuillez entrer une adresse courriel valide",
        "subjectRequired": "Le sujet est obligatoire",
        "messageRequired": "Le message est obligatoire"
      }
    },
    "info": {
      "heading": "Prenez contact",
      "emailLabel": "Courriel",
      "emailValue": "support@idlogice.com",
      "responseLabel": "Délai de réponse",
      "responseValue": "Dans les 24 heures ouvrables",
      "disclaimer": "Pour des conseils en immigration, consultez un consultant réglementé en immigration canadienne (CRIC) ou un avocat spécialisé. Nous ne pouvons pas fournir de conseils juridiques en matière d'immigration."
    },
    "cta": {
      "title": "Vous cherchez des réponses rapides?",
      "subtitle": "Consultez notre centre d'aide pour des réponses aux questions les plus courantes.",
      "primary": "Visiter le centre d'aide",
      "secondary": "Évaluation gratuite"
    }
  }
}
```

- [ ] **Step 5: Create `locales/fr/services.json`**

Mirror the structure of `locales/en/services.json` with French content. Full file:

```json
{
  "services": {
    "overview": {
      "hero": {
        "title": "Voies d'immigration canadienne",
        "subtitle": "Explorez les principales routes vers la résidence permanente au Canada. Utilisez nos outils gratuits pour savoir à quels programmes vous êtes admissible."
      },
      "grid": {
        "title": "Choisissez votre voie",
        "items": [
          {
            "title": "Entrée express",
            "description": "Le système fédéral pour les travailleurs qualifiés. La voie la plus rapide vers la résidence permanente pour la plupart des candidats."
          },
          {
            "title": "Permis d'études",
            "description": "Étudiez dans un établissement canadien et construisez une voie vers la résidence permanente via le PGWP et la Catégorie de l'expérience canadienne."
          },
          {
            "title": "Permis de travail",
            "description": "Travaillez temporairement au Canada avec un permis basé sur l'EIMT ou exempté d'EIMT, et accumulez de l'expérience canadienne."
          },
          {
            "title": "Programme des candidats des provinces",
            "description": "Obtenez une nomination provinciale et recevez 600 points CRS supplémentaires — une invitation à présenter une demande pratiquement garantie."
          }
        ]
      },
      "cta": {
        "title": "Vous ne savez pas quelle voie choisir?",
        "subtitle": "Notre évaluation gratuite vérifie votre profil par rapport à tous les principaux programmes d'immigration en moins de 5 minutes.",
        "primary": "Évaluation gratuite",
        "secondary": "Calculateur CRS"
      }
    },
    "expressEntry": {
      "hero": {
        "badge": "Entrée express",
        "title": "Entrée express — Programme des travailleurs qualifiés",
        "subtitle": "Le principal système d'immigration du Canada pour les travailleurs qualifiés. Créez un profil, entrez dans le bassin et recevez une invitation à présenter une demande basée sur votre score CRS.",
        "cta": "Calculez votre score CRS",
        "secondaryCta": "Évaluation gratuite"
      },
      "requirements": {
        "title": "Êtes-vous admissible?",
        "qualifications": [
          "Au moins 1 an d'expérience de travail qualifié continu (CNP NEER 0, 1, 2 ou 3)",
          "Compétences linguistiques de niveau CLN 7 ou plus dans les quatre habiletés",
          "Un diplôme postsecondaire ou l'équivalent canadien via une EDE",
          "Fonds de subsistance suffisants (varie selon la taille de la famille)",
          "Aucun casier judiciaire et réussite d'un examen médical"
        ],
        "facts": [
          { "label": "Score CRS max.", "value": "1 200 points" },
          { "label": "Volets", "value": "TQF, CEC, TQM" },
          { "label": "Traitement typique", "value": "6 mois" },
          { "label": "Langue minimale", "value": "CLN 7 (TQF / CEC)" },
          { "label": "Expérience de travail", "value": "1+ an CNP NEER 0–3" }
        ]
      },
      "steps": {
        "title": "Le processus d'Entrée express",
        "subtitle": "De la création de votre profil à l'obtention de votre résidence permanente.",
        "items": [
          {
            "number": 1,
            "title": "Créez votre profil",
            "description": "Soumettez votre profil d'Entrée express via le portail IRCC avec votre expérience de travail, votre éducation et vos résultats de tests linguistiques."
          },
          {
            "number": 2,
            "title": "Entrez dans le bassin",
            "description": "Votre profil est classé dans le bassin d'Entrée express par rapport aux autres candidats selon le Système de classement global (SCG)."
          },
          {
            "number": 3,
            "title": "Recevez une invitation",
            "description": "IRCC organise des tirages réguliers et émet des Invitations à présenter une demande (IPD) aux candidats les mieux classés."
          },
          {
            "number": 4,
            "title": "Soumettez votre demande de RP",
            "description": "Vous avez 60 jours pour soumettre une demande de résidence permanente complète avec tous les documents justificatifs."
          },
          {
            "number": 5,
            "title": "Obtenez la résidence permanente",
            "description": "La plupart des demandes d'Entrée express sont traitées dans les 6 mois suivant la soumission."
          }
        ]
      },
      "streams": {
        "title": "Volets d'Entrée express",
        "items": [
          {
            "title": "Travailleurs qualifiés (fédéral)",
            "description": "Pour les travailleurs avec une expérience de travail qualifié à l'étranger et un bon score CRS. Nécessite une EDE pour les diplômes étrangers."
          },
          {
            "title": "Catégorie de l'expérience canadienne (CEC)",
            "description": "Pour les travailleurs ayant déjà au moins 1 an d'expérience de travail qualifié au Canada au cours des 3 dernières années."
          },
          {
            "title": "Travailleurs de métiers spécialisés",
            "description": "Pour les travailleurs dans des métiers spécialisés avec une offre d'emploi ou un certificat de qualification au Canada."
          }
        ]
      },
      "cta": {
        "title": "Quel est votre score CRS?",
        "subtitle": "Calculez votre score en 2 minutes et voyez comment vous vous comparez aux tirages récents.",
        "primary": "Calculer mon score CRS",
        "secondary": "Vérification d'admissibilité gratuite"
      }
    },
    "studyPermit": {
      "hero": {
        "badge": "Permis d'études",
        "title": "Étudier au Canada",
        "subtitle": "Obtenez une éducation canadienne, travaillez pendant vos études et construisez une voie vers la résidence permanente via le Permis de travail post-diplôme.",
        "cta": "Vérifiez votre admissibilité",
        "secondaryCta": "Calculateur CRS"
      },
      "requirements": {
        "title": "Conditions requises",
        "qualifications": [
          "Une lettre d'acceptation d'un établissement d'enseignement désigné (EED) au Canada",
          "Preuve de fonds suffisants (minimum 20 635 $ CAD/an pour les frais de subsistance + frais de scolarité)",
          "Des résultats linguistiques répondant aux exigences de votre programme (généralement IELTS 6.0+ ou équivalent)",
          "Aucun casier judiciaire et examen médical si requis",
          "Preuve que vous respecterez les conditions de votre permis"
        ],
        "facts": [
          { "label": "Fonds min.", "value": "20 635 $ CAD/an" },
          { "label": "Droit de travail", "value": "20 h/semaine pendant les études" },
          { "label": "PTPD", "value": "Jusqu'à 3 ans" },
          { "label": "Voie vers la RP", "value": "CEC après 1 an de travail" },
          { "label": "Délai de traitement", "value": "4–16 semaines (en ligne)" }
        ]
      },
      "steps": {
        "title": "Comment obtenir votre permis d'études",
        "items": [
          {
            "number": 1,
            "title": "Choisissez un établissement désigné",
            "description": "Sélectionnez une école approuvée par l'EED au Canada et recevez votre lettre d'acceptation avant de faire une demande."
          },
          {
            "number": 2,
            "title": "Demandez un permis d'études",
            "description": "Soumettez votre demande en ligne via IRCC avec votre lettre d'acceptation, preuve de fonds et résultats linguistiques."
          },
          {
            "number": 3,
            "title": "Recevez votre permis",
            "description": "Une fois approuvé, vous recevrez une lettre d'introduction pour le point d'entrée à présenter à la frontière canadienne."
          },
          {
            "number": 4,
            "title": "Arrivez et commencez vos études",
            "description": "Présentez vos documents à la frontière. Vous pouvez travailler 20 heures par semaine pendant le semestre et à temps plein pendant les congés."
          }
        ]
      },
      "facts": {
        "title": "Pourquoi étudier au Canada?",
        "items": [
          {
            "title": "Travaillez pendant vos études",
            "description": "Les titulaires d'un permis d'études peuvent travailler jusqu'à 20 heures par semaine pendant le semestre et à temps plein pendant les congés."
          },
          {
            "title": "Permis de travail post-diplôme",
            "description": "Après l'obtention de votre diplôme, vous pourriez être admissible à un PTPD allant jusqu'à 3 ans pour acquérir l'expérience canadienne nécessaire."
          },
          {
            "title": "Voie claire vers la résidence permanente",
            "description": "Seulement 1 an de travail qualifié au Canada après l'obtention de votre diplôme vous rend admissible à la CEC — l'une des voies les plus rapides."
          }
        ]
      },
      "cta": {
        "title": "Prêt à étudier au Canada?",
        "subtitle": "Vérifiez votre admissibilité à l'immigration et calculez votre score CRS — gratuitement.",
        "primary": "Vérification d'admissibilité gratuite",
        "secondary": "Calculer le score CRS"
      }
    },
    "workPermit": {
      "hero": {
        "badge": "Permis de travail",
        "title": "Travailler au Canada",
        "subtitle": "Un permis de travail canadien vous permet d'acquérir de l'expérience précieuse, d'améliorer votre score CRS et de créer une voie vers la résidence permanente.",
        "cta": "Vérifiez votre admissibilité",
        "secondaryCta": "Évaluation gratuite"
      },
      "requirements": {
        "title": "Êtes-vous admissible?",
        "qualifications": [
          "Une offre d'emploi valide d'un employeur canadien (pour les permis basés sur l'EIMT)",
          "Votre employeur a reçu une Étude d'impact sur le marché du travail (EIMT) positive, ou votre poste est exempté",
          "Vous répondez aux exigences linguistiques et éducatives de votre profession",
          "Aucun casier judiciaire et examen médical si requis",
          "Vous êtes admissible en vertu de l'ACEUM, du Programme vacances-travail ou d'un transfert intra-société"
        ],
        "facts": [
          { "label": "Basé sur l'EIMT", "value": "EIMT de l'employeur requis" },
          { "label": "Exempté d'EIMT", "value": "ACEUM, EIC, TIS" },
          { "label": "Délai de traitement", "value": "2–27 semaines (varie)" },
          { "label": "Voie vers la RP", "value": "Entrée express (CEC)" },
          { "label": "Validité", "value": "Jusqu'à 3 ans (varie)" }
        ]
      },
      "steps": {
        "title": "Comment obtenir un permis de travail",
        "items": [
          {
            "number": 1,
            "title": "Obtenez une offre d'emploi",
            "description": "Trouvez un employeur canadien disposé à vous embaucher. Pour les permis basés sur l'EIMT, il doit d'abord obtenir une EIMT positive d'EDSC."
          },
          {
            "number": 2,
            "title": "Déterminez votre type de permis",
            "description": "Confirmez si votre poste nécessite une EIMT ou est admissible à une exemption (ACEUM, transfert intra-société, EIC)."
          },
          {
            "number": 3,
            "title": "Demandez votre permis de travail",
            "description": "Soumettez votre demande en ligne via IRCC avec votre lettre d'offre d'emploi, le numéro d'EIMT (si applicable) et les documents requis."
          },
          {
            "number": 4,
            "title": "Accumulez de l'expérience canadienne",
            "description": "Travaillez au Canada, accumulez 1+ an d'expérience de travail qualifié et devenez admissible à la Catégorie de l'expérience canadienne."
          }
        ]
      },
      "permitTypes": {
        "title": "Types de permis de travail",
        "items": [
          {
            "title": "Permis basé sur l'EIMT",
            "description": "Votre employeur demande une Étude d'impact sur le marché du travail prouvant qu'aucun Canadien qualifié n'était disponible pour ce poste."
          },
          {
            "title": "Permis ACEUM / ALENA",
            "description": "Pour les citoyens des États-Unis et du Mexique dans des professions spécifiques. Aucune EIMT requise — traitement plus rapide à la frontière."
          },
          {
            "title": "Transfert intra-société",
            "description": "Pour les employés de sociétés multinationales transférés dans un bureau canadien dans un rôle de direction, de direction générale ou de connaissances spécialisées."
          }
        ]
      },
      "cta": {
        "title": "Un permis de travail canadien est-il fait pour vous?",
        "subtitle": "Vérifiez votre admissibilité et voyez comment l'expérience de travail canadienne peut améliorer vos perspectives d'immigration.",
        "primary": "Évaluation gratuite",
        "secondary": "Calculer le score CRS"
      }
    },
    "pnp": {
      "hero": {
        "badge": "Programme des candidats des provinces",
        "title": "Programme des candidats des provinces (PCP)",
        "subtitle": "Une nomination provinciale ajoute 600 points à votre score CRS — ce qui garantit pratiquement une invitation à présenter une demande.",
        "cta": "Vérifiez votre admissibilité",
        "secondaryCta": "Calculer le score CRS"
      },
      "requirements": {
        "title": "Êtes-vous admissible?",
        "qualifications": [
          "Des compétences, une éducation ou une expérience de travail répondant aux besoins du marché du travail d'une province",
          "L'intention de vivre et de travailler dans la province qui vous nomme",
          "Vous répondez aux exigences fédérales d'admissibilité (santé, sécurité, langue)",
          "Vous êtes déjà dans le bassin d'Entrée express (pour les volets PCP améliorés)",
          "Certains volets exigent une offre d'emploi ou un lien antérieur avec la province"
        ],
        "facts": [
          { "label": "Bonus CRS", "value": "+600 points" },
          { "label": "Provinces", "value": "Toutes sauf Québec et Nunavut" },
          { "label": "Délai de traitement", "value": "6–19 mois (varie)" },
          { "label": "Frais de demande", "value": "0–500 $ CAD (varie)" },
          { "label": "Volets disponibles", "value": "100+ à travers le Canada" }
        ]
      },
      "steps": {
        "title": "Le processus du PCP",
        "items": [
          {
            "number": 1,
            "title": "Choisissez votre province cible",
            "description": "Recherchez quelles provinces ont des volets correspondant à votre profession, éducation et expérience. Chaque province a des exigences différentes."
          },
          {
            "number": 2,
            "title": "Postulez au programme provincial",
            "description": "Soumettez une demande provinciale directement ou via un volet amélioré d'Entrée express. Plusieurs provinces ont leurs propres systèmes de déclaration d'intérêt."
          },
          {
            "number": 3,
            "title": "Recevez votre nomination",
            "description": "Si sélectionné, la province vous nomme. Pour les volets PCP d'Entrée express, IRCC ajoute immédiatement 600 points CRS à votre profil."
          },
          {
            "number": 4,
            "title": "Demandez la résidence permanente",
            "description": "Avec 600 points CRS supplémentaires, vous êtes pratiquement assuré d'une IPD au prochain tirage. Soumettez votre demande de RP dans les 60 jours."
          }
        ]
      },
      "provinces": {
        "title": "Volets provinciaux populaires",
        "items": [
          {
            "title": "Ontario (OINP)",
            "description": "La plus grande province du Canada offre des volets pour les travailleurs technologiques, les métiers en demande et les étudiants internationaux des universités ontariennes."
          },
          {
            "title": "Colombie-Britannique (PCP C.-B.)",
            "description": "Fort secteur technologique avec des volets dédiés aux ingénieurs logiciels, scientifiques des données et professionnels de la santé."
          },
          {
            "title": "Alberta (AINP)",
            "description": "Économie en croissance avec des volets pour l'avantage albertain, le renouveau rural et les agriculteurs indépendants."
          }
        ]
      },
      "cta": {
        "title": "Pourriez-vous obtenir une nomination provinciale?",
        "subtitle": "Notre évaluation gratuite vérifie votre profil par rapport à tous les volets du PCP et identifie vos meilleures provinces.",
        "primary": "Évaluation gratuite",
        "secondary": "Calculer le score CRS"
      }
    }
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add locales/fr/
git commit -m "feat(i18n): add FR translations for about, contact, services; update home + common"
```

---

## Task 3: Update `src/i18n/request.ts` to load new namespaces

**Files:**
- Modify: `src/i18n/request.ts`

- [ ] **Step 1: Add the three new namespace imports**

Replace the entire contents of `src/i18n/request.ts` with:

```ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "en" | "fr")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: {
      ...(await import(`../../locales/${locale}/common.json`)).default,
      ...(await import(`../../locales/${locale}/home.json`)).default,
      ...(await import(`../../locales/${locale}/about.json`)).default,
      ...(await import(`../../locales/${locale}/contact.json`)).default,
      ...(await import(`../../locales/${locale}/services.json`)).default,
    },
  };
});
```

- [ ] **Step 2: Verify the dev server starts without errors**

```bash
cd app
npm run dev
```

Expected: Server starts on http://localhost:3000 with no import errors in the terminal. Visit http://localhost:3000 — homepage loads normally.

- [ ] **Step 3: Commit**

```bash
git add src/i18n/request.ts
git commit -m "feat(i18n): load about, contact, services namespaces in request config"
```

---

## Task 4: `PageHero` section component

**Files:**
- Create: `src/components/sections/page-hero.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  badge?: string;
  title: string;
  subtitle: string;
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function PageHero({
  badge,
  title,
  subtitle,
  cta,
  secondaryCta,
}: PageHeroProps) {
  return (
    <section className="py-16 bg-muted/30 border-b">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        {badge && (
          <span className="inline-block mb-4 px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
            {badge}
          </span>
        )}
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground mb-8">{subtitle}</p>
        {(cta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {cta && (
              <Link
                href={cta.href}
                className={cn(buttonVariants({ size: "lg" }))}
              >
                {cta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/page-hero.tsx
git commit -m "feat(ui): add PageHero section component"
```

---

## Task 5: `FeatureGrid` section component

**Files:**
- Create: `src/components/sections/feature-grid.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface FeatureGridItem {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href?: string;
}

interface FeatureGridProps {
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  items: FeatureGridItem[];
}

export function FeatureGrid({
  title,
  subtitle,
  columns = 3,
  items,
}: FeatureGridProps) {
  const colClass =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
        ? "md:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-3";

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold mb-3">{title}</h2>
            )}
            {subtitle && (
              <p className="text-muted-foreground max-w-xl mx-auto">{subtitle}</p>
            )}
          </div>
        )}
        <div className={cn("grid grid-cols-1 gap-6", colClass)}>
          {items.map((item, i) => {
            const content = (
              <>
                {item.icon && (
                  <item.icon className="h-8 w-8 text-primary mb-3" />
                )}
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </>
            );

            if (item.href) {
              return (
                <Link
                  key={i}
                  href={item.href}
                  className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow block"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div key={i} className="rounded-xl border bg-card p-6">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/feature-grid.tsx
git commit -m "feat(ui): add FeatureGrid section component"
```

---

## Task 6: `StepsSection` component

**Files:**
- Create: `src/components/sections/steps-section.tsx`

- [ ] **Step 1: Create the component**

```tsx
interface StepsSectionProps {
  title: string;
  subtitle?: string;
  steps: Array<{
    number: number;
    title: string;
    description: string;
  }>;
}

export function StepsSection({ title, subtitle, steps }: StepsSectionProps) {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground max-w-xl mx-auto">{subtitle}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex gap-4 rounded-xl border bg-card p-6"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                {step.number}
              </span>
              <div>
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/steps-section.tsx
git commit -m "feat(ui): add StepsSection component"
```

---

## Task 7: `RequirementsSection` component

**Files:**
- Create: `src/components/sections/requirements-section.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { CheckCircle2 } from "lucide-react";

interface RequirementsSectionProps {
  title: string;
  qualifications: string[];
  facts: Array<{ label: string; value: string }>;
}

export function RequirementsSection({
  title,
  qualifications,
  facts,
}: RequirementsSectionProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-4 text-lg">You may qualify if:</h3>
            <ul className="space-y-3">
              {qualifications.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-4 text-lg">Key Facts</h3>
            <dl className="space-y-3">
              {facts.map((f, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm border-b pb-2 last:border-0 last:pb-0"
                >
                  <dt className="text-muted-foreground">{f.label}</dt>
                  <dd className="font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/requirements-section.tsx
git commit -m "feat(ui): add RequirementsSection component"
```

---

## Task 8: `CtaBanner` component

**Files:**
- Create: `src/components/sections/cta-banner.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CtaBannerProps {
  title: string;
  subtitle?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function CtaBanner({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: CtaBannerProps) {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
        {subtitle && (
          <p className="text-lg opacity-90 max-w-xl mx-auto mb-8">{subtitle}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={primaryCta.href}
            className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
          >
            {primaryCta.label}
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground",
              )}
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/cta-banner.tsx
git commit -m "feat(ui): add CtaBanner section component"
```

---

## Task 9: `ContactForm` client component

**Files:**
- Create: `src/components/forms/contact-form.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const t = useTranslations("contact");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t("form.errors.nameRequired");
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = t("form.errors.emailInvalid");
    }
    if (!form.subject.trim()) e.subject = t("form.errors.subjectRequired");
    if (!form.message.trim()) e.message = t("form.errors.messageRequired");
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    // Backend not yet wired (P2). Show success optimistically.
    setSubmitted(true);
  }

  const inputClass =
    "w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  if (submitted) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="text-lg font-semibold mb-2">{t("form.successTitle")}</p>
        <p className="text-muted-foreground">{t("form.successMessage")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label className="text-sm font-medium mb-1 block" htmlFor="name">
          {t("form.name")}
        </label>
        <input
          id="name"
          className={inputClass}
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-xs text-destructive mt-1">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block" htmlFor="email">
          {t("form.email")}
        </label>
        <input
          id="email"
          type="email"
          className={inputClass}
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-destructive mt-1">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block" htmlFor="subject">
          {t("form.subject")}
        </label>
        <input
          id="subject"
          className={inputClass}
          value={form.subject}
          onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
          aria-describedby={errors.subject ? "subject-error" : undefined}
        />
        {errors.subject && (
          <p id="subject-error" className="text-xs text-destructive mt-1">
            {errors.subject}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block" htmlFor="message">
          {t("form.message")}
        </label>
        <textarea
          id="message"
          rows={5}
          className={cn(inputClass, "resize-none")}
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="text-xs text-destructive mt-1">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className={cn(buttonVariants({ size: "lg" }), "w-full")}
      >
        {t("form.submit")}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/forms/contact-form.tsx
git commit -m "feat(ui): add ContactForm client component with client-side validation"
```

---

## Task 10: Update header with Services dropdown

**Files:**
- Modify: `src/components/layout/header.tsx`

The header is already a `"use client"` component. Add a `servicesOpen` state for the mobile accordion and a hover/focus-within dropdown for desktop.

- [ ] **Step 1: Replace `src/components/layout/header.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Menu, X, ChevronDown } from "lucide-react";

export function Header() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const navLinks = [
    { href: "/calculator" as const, label: t("calculator") },
    { href: "/evaluation" as const, label: t("evaluation") },
    { href: "/draws" as const, label: t("draws") },
    { href: "/blog" as const, label: t("blog") },
  ];

  const serviceLinks = [
    {
      href: "/services/express-entry" as const,
      label: t("servicesItems.expressEntry"),
    },
    {
      href: "/services/study-permit" as const,
      label: t("servicesItems.studyPermit"),
    },
    {
      href: "/services/work-permit" as const,
      label: t("servicesItems.workPermit"),
    },
    {
      href: "/services/pnp" as const,
      label: t("servicesItems.pnp"),
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-primary">ID</span>
          <span>LOGICE</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Services dropdown */}
          <div className="relative group">
            <button
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              aria-haspopup="true"
            >
              {t("services")}
              <ChevronDown className="h-4 w-4" />
            </button>
            {/* Dropdown panel — visible on hover OR focus-within */}
            <div className="absolute left-0 top-full pt-2 hidden group-hover:block group-focus-within:block">
              <div className="min-w-48 rounded-xl border bg-background shadow-lg p-2">
                {serviceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            {t("login")}
          </Link>
          <Link
            href="/register"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            {t("register")}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="flex flex-col p-4 gap-1">
            {/* Services accordion */}
            <button
              className="flex items-center justify-between w-full text-sm font-medium py-2 text-muted-foreground hover:text-foreground"
              onClick={() => setServicesOpen(!servicesOpen)}
              aria-expanded={servicesOpen}
            >
              {t("services")}
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  servicesOpen && "rotate-180",
                )}
              />
            </button>
            {servicesOpen && (
              <div className="pl-4 flex flex-col gap-1 mb-1">
                {serviceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm py-1.5 text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium py-2 text-muted-foreground hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <hr className="my-2" />
            <div className="flex items-center justify-between">
              <LanguageSwitcher />
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                  )}
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  {t("register")}
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Verify in browser**

With `npm run dev` running, open http://localhost:3000:
- Desktop: hover over "Services" — dropdown appears with 4 links
- Desktop: tab to the "Services" button and press Tab — dropdown stays open while focus is inside it
- Mobile (resize to < 768px): tap hamburger → tap "Services" → sub-links expand

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/header.tsx
git commit -m "feat(nav): add Services dropdown to header (desktop hover, mobile accordion)"
```

---

## Task 11: Enhance homepage

**Files:**
- Modify: `src/app/[locale]/page.tsx`

Add three new sections between the existing features grid and the final CTA: **Stats bar**, **How It Works** (`StepsSection`), **Trust** (`FeatureGrid`). The bottom CTA section is also replaced with `CtaBanner` for consistency.

- [ ] **Step 1: Replace `src/app/[locale]/page.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calculator, FileCheck, BookOpen, GraduationCap } from "lucide-react";
import { StepsSection } from "@/components/sections/steps-section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function HomePage() {
  const t = useTranslations();

  const features = [
    {
      icon: Calculator,
      title: t("features.calculator.title"),
      description: t("features.calculator.description"),
      href: "/calculator",
    },
    {
      icon: FileCheck,
      title: t("features.evaluation.title"),
      description: t("features.evaluation.description"),
      href: "/evaluation",
    },
    {
      icon: BookOpen,
      title: t("features.mockTests.title"),
      description: t("features.mockTests.description"),
      href: "/blog",
    },
    {
      icon: GraduationCap,
      title: t("features.coaching.title"),
      description: t("features.coaching.description"),
      href: "/pricing",
    },
  ];

  const howItWorksSteps = (
    t.raw("howItWorks.steps") as Array<{
      number: number;
      title: string;
      description: string;
    }>
  ).map((s) => ({ number: s.number, title: s.title, description: s.description }));

  const trustItems = (
    t.raw("trust.items") as Array<{ title: string; description: string }>
  ).map((item) => ({ title: item.title, description: item.description }));

  const statsData = [
    {
      value: t("stats.evaluations.value"),
      label: t("stats.evaluations.label"),
    },
    {
      value: t("stats.improvement.value"),
      label: t("stats.improvement.label"),
    },
    {
      value: t("stats.countries.value"),
      label: t("stats.countries.label"),
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/evaluation"
              className={cn(buttonVariants({ size: "lg" }), "text-lg px-8 py-6")}
            >
              {t("hero.cta")}
            </Link>
            <Link
              href="/calculator"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "text-lg px-8 py-6",
              )}
            >
              {t("hero.secondaryCta")}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            {statsData.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeatureGrid
        title={t("features.title")}
        columns={4}
        items={features}
      />

      {/* How It Works */}
      <StepsSection
        title={t("howItWorks.title")}
        subtitle={t("howItWorks.subtitle")}
        steps={howItWorksSteps}
      />

      {/* Trust Section */}
      <FeatureGrid
        title={t("trust.title")}
        columns={3}
        items={trustItems}
      />

      {/* CTA */}
      <CtaBanner
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        primaryCta={{ label: t("cta.freeEvaluation"), href: "/evaluation" }}
        secondaryCta={{
          label: t("cta.calculateCrs"),
          href: "/calculator",
        }}
      />
    </>
  );
}
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:3000:
- Stats bar (3 numbers) appears below hero
- "How It Works" section with 3 numbered cards appears
- Trust section with 3 cards appears
- CTA banner at bottom with two buttons

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat(home): add stats bar, how-it-works, and trust sections to homepage"
```

---

## Task 12: About page

**Files:**
- Create: `src/app/[locale]/(public)/about/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
import { useTranslations } from "next-intl";
import { PageHero } from "@/components/sections/page-hero";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function AboutPage() {
  const t = useTranslations("about");

  const values = (
    t.raw("values.items") as Array<{ title: string; description: string }>
  ).map((item) => ({ title: item.title, description: item.description }));

  return (
    <>
      <PageHero
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        cta={{ label: t("hero.cta"), href: "/evaluation" }}
        secondaryCta={{ label: t("hero.secondaryCta"), href: "/calculator" }}
      />

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">{t("mission.heading")}</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {t("mission.body")}
          </p>
        </div>
      </section>

      <FeatureGrid title={t("values.title")} columns={3} items={values} />

      <CtaBanner
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
        primaryCta={{ label: t("cta.primary"), href: "/evaluation" }}
        secondaryCta={{ label: t("cta.secondary"), href: "/calculator" }}
      />
    </>
  );
}
```

- [ ] **Step 2: Verify**

Open http://localhost:3000/about — page renders with hero, mission paragraph, 3 value cards, CTA banner.

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/\(public\)/about/page.tsx
git commit -m "feat(pages): add About page"
```

---

## Task 13: Contact page

**Files:**
- Create: `src/app/[locale]/(public)/contact/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
import { useTranslations } from "next-intl";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ContactForm } from "@/components/forms/contact-form";

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <>
      <PageHero
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Form */}
            <ContactForm />

            {/* Contact Info */}
            <div>
              <h2 className="text-xl font-semibold mb-6">{t("info.heading")}</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground mb-1">
                    {t("info.emailLabel")}
                  </dt>
                  <dd className="font-medium">{t("info.emailValue")}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground mb-1">
                    {t("info.responseLabel")}
                  </dt>
                  <dd className="font-medium">{t("info.responseValue")}</dd>
                </div>
              </dl>
              <p className="mt-8 text-sm text-muted-foreground leading-relaxed border-l-2 border-muted pl-4">
                {t("info.disclaimer")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
        primaryCta={{ label: t("cta.primary"), href: "/help" }}
        secondaryCta={{ label: t("cta.secondary"), href: "/evaluation" }}
      />
    </>
  );
}
```

- [ ] **Step 2: Verify**

Open http://localhost:3000/contact — page renders. Try submitting the form empty — validation errors appear. Fill in the form and submit — success message shows.

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/\(public\)/contact/page.tsx
git commit -m "feat(pages): add Contact page"
```

---

## Task 14: Services overview page

**Files:**
- Create: `src/app/[locale]/(public)/services/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
import { useTranslations } from "next-intl";
import { PageHero } from "@/components/sections/page-hero";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function ServicesPage() {
  const t = useTranslations("services");

  const serviceItems = (
    t.raw("overview.grid.items") as Array<{ title: string; description: string }>
  ).map((item, i) => ({
    title: item.title,
    description: item.description,
    href: [
      "/services/express-entry",
      "/services/study-permit",
      "/services/work-permit",
      "/services/pnp",
    ][i],
  }));

  return (
    <>
      <PageHero
        title={t("overview.hero.title")}
        subtitle={t("overview.hero.subtitle")}
      />

      <FeatureGrid
        title={t("overview.grid.title")}
        columns={2}
        items={serviceItems}
      />

      <CtaBanner
        title={t("overview.cta.title")}
        subtitle={t("overview.cta.subtitle")}
        primaryCta={{ label: t("overview.cta.primary"), href: "/evaluation" }}
        secondaryCta={{ label: t("overview.cta.secondary"), href: "/calculator" }}
      />
    </>
  );
}
```

- [ ] **Step 2: Verify**

Open http://localhost:3000/services — page renders with 4 service cards (2 columns), each linking to the service detail pages.

- [ ] **Step 3: Commit**

```bash
git add "src/app/[locale]/(public)/services/page.tsx"
git commit -m "feat(pages): add Services overview page"
```

---

## Task 15: Express Entry page

**Files:**
- Create: `src/app/[locale]/(public)/services/express-entry/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
import { useTranslations } from "next-intl";
import { PageHero } from "@/components/sections/page-hero";
import { RequirementsSection } from "@/components/sections/requirements-section";
import { StepsSection } from "@/components/sections/steps-section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function ExpressEntryPage() {
  const t = useTranslations("services");

  const qualifications = t.raw(
    "expressEntry.requirements.qualifications",
  ) as string[];

  const facts = t.raw("expressEntry.requirements.facts") as Array<{
    label: string;
    value: string;
  }>;

  const steps = (
    t.raw("expressEntry.steps.items") as Array<{
      number: number;
      title: string;
      description: string;
    }>
  ).map((s) => ({ number: s.number, title: s.title, description: s.description }));

  const streams = (
    t.raw("expressEntry.streams.items") as Array<{
      title: string;
      description: string;
    }>
  ).map((item) => ({ title: item.title, description: item.description }));

  return (
    <>
      <PageHero
        badge={t("expressEntry.hero.badge")}
        title={t("expressEntry.hero.title")}
        subtitle={t("expressEntry.hero.subtitle")}
        cta={{ label: t("expressEntry.hero.cta"), href: "/calculator" }}
        secondaryCta={{
          label: t("expressEntry.hero.secondaryCta"),
          href: "/evaluation",
        }}
      />

      <RequirementsSection
        title={t("expressEntry.requirements.title")}
        qualifications={qualifications}
        facts={facts}
      />

      <StepsSection
        title={t("expressEntry.steps.title")}
        subtitle={t("expressEntry.steps.subtitle")}
        steps={steps}
      />

      <FeatureGrid
        title={t("expressEntry.streams.title")}
        columns={3}
        items={streams}
      />

      <CtaBanner
        title={t("expressEntry.cta.title")}
        subtitle={t("expressEntry.cta.subtitle")}
        primaryCta={{
          label: t("expressEntry.cta.primary"),
          href: "/calculator",
        }}
        secondaryCta={{
          label: t("expressEntry.cta.secondary"),
          href: "/evaluation",
        }}
      />
    </>
  );
}
```

- [ ] **Step 2: Verify**

Open http://localhost:3000/services/express-entry — all 5 sections render. Badge "Express Entry" shows in hero. Requirements section has checklist left + facts right. 5 steps. 3 stream cards.

- [ ] **Step 3: Commit**

```bash
git add "src/app/[locale]/(public)/services/express-entry/page.tsx"
git commit -m "feat(pages): add Express Entry service page"
```

---

## Task 16: Study Permit page

**Files:**
- Create: `src/app/[locale]/(public)/services/study-permit/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
import { useTranslations } from "next-intl";
import { PageHero } from "@/components/sections/page-hero";
import { RequirementsSection } from "@/components/sections/requirements-section";
import { StepsSection } from "@/components/sections/steps-section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function StudyPermitPage() {
  const t = useTranslations("services");

  const qualifications = t.raw(
    "studyPermit.requirements.qualifications",
  ) as string[];

  const facts = t.raw("studyPermit.requirements.facts") as Array<{
    label: string;
    value: string;
  }>;

  const steps = (
    t.raw("studyPermit.steps.items") as Array<{
      number: number;
      title: string;
      description: string;
    }>
  ).map((s) => ({ number: s.number, title: s.title, description: s.description }));

  const factItems = (
    t.raw("studyPermit.facts.items") as Array<{
      title: string;
      description: string;
    }>
  ).map((item) => ({ title: item.title, description: item.description }));

  return (
    <>
      <PageHero
        badge={t("studyPermit.hero.badge")}
        title={t("studyPermit.hero.title")}
        subtitle={t("studyPermit.hero.subtitle")}
        cta={{ label: t("studyPermit.hero.cta"), href: "/evaluation" }}
        secondaryCta={{
          label: t("studyPermit.hero.secondaryCta"),
          href: "/calculator",
        }}
      />

      <RequirementsSection
        title={t("studyPermit.requirements.title")}
        qualifications={qualifications}
        facts={facts}
      />

      <StepsSection
        title={t("studyPermit.steps.title")}
        steps={steps}
      />

      <FeatureGrid
        title={t("studyPermit.facts.title")}
        columns={3}
        items={factItems}
      />

      <CtaBanner
        title={t("studyPermit.cta.title")}
        subtitle={t("studyPermit.cta.subtitle")}
        primaryCta={{
          label: t("studyPermit.cta.primary"),
          href: "/evaluation",
        }}
        secondaryCta={{
          label: t("studyPermit.cta.secondary"),
          href: "/calculator",
        }}
      />
    </>
  );
}
```

- [ ] **Step 2: Verify + Commit**

```bash
git add "src/app/[locale]/(public)/services/study-permit/page.tsx"
git commit -m "feat(pages): add Study Permit service page"
```

---

## Task 17: Work Permit page

**Files:**
- Create: `src/app/[locale]/(public)/services/work-permit/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
import { useTranslations } from "next-intl";
import { PageHero } from "@/components/sections/page-hero";
import { RequirementsSection } from "@/components/sections/requirements-section";
import { StepsSection } from "@/components/sections/steps-section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function WorkPermitPage() {
  const t = useTranslations("services");

  const qualifications = t.raw(
    "workPermit.requirements.qualifications",
  ) as string[];

  const facts = t.raw("workPermit.requirements.facts") as Array<{
    label: string;
    value: string;
  }>;

  const steps = (
    t.raw("workPermit.steps.items") as Array<{
      number: number;
      title: string;
      description: string;
    }>
  ).map((s) => ({ number: s.number, title: s.title, description: s.description }));

  const permitTypes = (
    t.raw("workPermit.permitTypes.items") as Array<{
      title: string;
      description: string;
    }>
  ).map((item) => ({ title: item.title, description: item.description }));

  return (
    <>
      <PageHero
        badge={t("workPermit.hero.badge")}
        title={t("workPermit.hero.title")}
        subtitle={t("workPermit.hero.subtitle")}
        cta={{ label: t("workPermit.hero.cta"), href: "/evaluation" }}
        secondaryCta={{
          label: t("workPermit.hero.secondaryCta"),
          href: "/evaluation",
        }}
      />

      <RequirementsSection
        title={t("workPermit.requirements.title")}
        qualifications={qualifications}
        facts={facts}
      />

      <StepsSection
        title={t("workPermit.steps.title")}
        steps={steps}
      />

      <FeatureGrid
        title={t("workPermit.permitTypes.title")}
        columns={3}
        items={permitTypes}
      />

      <CtaBanner
        title={t("workPermit.cta.title")}
        subtitle={t("workPermit.cta.subtitle")}
        primaryCta={{
          label: t("workPermit.cta.primary"),
          href: "/evaluation",
        }}
        secondaryCta={{
          label: t("workPermit.cta.secondary"),
          href: "/calculator",
        }}
      />
    </>
  );
}
```

- [ ] **Step 2: Verify + Commit**

```bash
git add "src/app/[locale]/(public)/services/work-permit/page.tsx"
git commit -m "feat(pages): add Work Permit service page"
```

---

## Task 18: PNP page

**Files:**
- Create: `src/app/[locale]/(public)/services/pnp/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
import { useTranslations } from "next-intl";
import { PageHero } from "@/components/sections/page-hero";
import { RequirementsSection } from "@/components/sections/requirements-section";
import { StepsSection } from "@/components/sections/steps-section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function PnpPage() {
  const t = useTranslations("services");

  const qualifications = t.raw("pnp.requirements.qualifications") as string[];

  const facts = t.raw("pnp.requirements.facts") as Array<{
    label: string;
    value: string;
  }>;

  const steps = (
    t.raw("pnp.steps.items") as Array<{
      number: number;
      title: string;
      description: string;
    }>
  ).map((s) => ({ number: s.number, title: s.title, description: s.description }));

  const provinces = (
    t.raw("pnp.provinces.items") as Array<{
      title: string;
      description: string;
    }>
  ).map((item) => ({ title: item.title, description: item.description }));

  return (
    <>
      <PageHero
        badge={t("pnp.hero.badge")}
        title={t("pnp.hero.title")}
        subtitle={t("pnp.hero.subtitle")}
        cta={{ label: t("pnp.hero.cta"), href: "/evaluation" }}
        secondaryCta={{ label: t("pnp.hero.secondaryCta"), href: "/calculator" }}
      />

      <RequirementsSection
        title={t("pnp.requirements.title")}
        qualifications={qualifications}
        facts={facts}
      />

      <StepsSection
        title={t("pnp.steps.title")}
        steps={steps}
      />

      <FeatureGrid
        title={t("pnp.provinces.title")}
        columns={3}
        items={provinces}
      />

      <CtaBanner
        title={t("pnp.cta.title")}
        subtitle={t("pnp.cta.subtitle")}
        primaryCta={{ label: t("pnp.cta.primary"), href: "/evaluation" }}
        secondaryCta={{ label: t("pnp.cta.secondary"), href: "/calculator" }}
      />
    </>
  );
}
```

- [ ] **Step 2: Verify + Commit**

```bash
git add "src/app/[locale]/(public)/services/pnp/page.tsx"
git commit -m "feat(pages): add PNP service page"
```

---

## Task 19: Legal stub pages

**Files:**
- Create: `src/app/[locale]/(public)/privacy/page.tsx`
- Create: `src/app/[locale]/(public)/terms/page.tsx`
- Create: `src/app/[locale]/(public)/cookies/page.tsx`

These are content stubs. Real legal copy is written by a lawyer before P1 launch (Section 28 of the deployment plan). The pages use `PageHero` and plain HTML `<article>` — no i18n for placeholder text since it will be fully replaced.

- [ ] **Step 1: Create `src/app/[locale]/(public)/privacy/page.tsx`**

```tsx
import { PageHero } from "@/components/sections/page-hero";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your personal information."
      />
      <article className="container mx-auto px-4 py-12 max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-sm font-medium text-foreground">
          Last updated: April 2026
        </p>
        <p>
          <strong className="text-foreground">Placeholder — legal copy to be added before launch.</strong>{" "}
          This page will contain the full Privacy Policy for IDLOGICE in accordance
          with PIPEDA and applicable Canadian privacy law. It will describe what
          personal data we collect, why we collect it, how it is stored, who has
          access, and how you can exercise your rights (access, export, deletion).
        </p>
        <p>
          For questions about our privacy practices, contact us at{" "}
          <a
            href="mailto:support@idlogice.com"
            className="text-primary underline"
          >
            support@idlogice.com
          </a>
          .
        </p>
      </article>
    </>
  );
}
```

- [ ] **Step 2: Create `src/app/[locale]/(public)/terms/page.tsx`**

```tsx
import { PageHero } from "@/components/sections/page-hero";

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms of Service"
        subtitle="The rules and conditions governing your use of IDLOGICE."
      />
      <article className="container mx-auto px-4 py-12 max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-sm font-medium text-foreground">
          Last updated: April 2026
        </p>
        <p>
          <strong className="text-foreground">Placeholder — legal copy to be added before launch.</strong>{" "}
          This page will contain the full Terms of Service for IDLOGICE, including
          usage rules, account responsibilities, the immigration disclaimer, payment
          terms, refund policy, and limitation of liability.
        </p>
        <p className="border-l-4 border-destructive/50 pl-4 text-sm">
          <strong className="text-foreground">Important Disclaimer:</strong> IDLOGICE
          provides immigration information and tools for educational purposes only.
          We are not licensed immigration consultants or lawyers. Our tools provide
          estimates based on publicly available criteria. For official immigration
          advice, consult a Regulated Canadian Immigration Consultant (RCIC) or a
          licensed immigration lawyer.
        </p>
        <p>
          For questions, contact us at{" "}
          <a
            href="mailto:support@idlogice.com"
            className="text-primary underline"
          >
            support@idlogice.com
          </a>
          .
        </p>
      </article>
    </>
  );
}
```

- [ ] **Step 3: Create `src/app/[locale]/(public)/cookies/page.tsx`**

```tsx
import { PageHero } from "@/components/sections/page-hero";

export default function CookiesPage() {
  return (
    <>
      <PageHero
        title="Cookie Policy"
        subtitle="How we use cookies and similar tracking technologies."
      />
      <article className="container mx-auto px-4 py-12 max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-sm font-medium text-foreground">
          Last updated: April 2026
        </p>
        <p>
          <strong className="text-foreground">Placeholder — legal copy to be added before launch.</strong>{" "}
          This page will describe the cookies IDLOGICE uses, their purpose
          (necessary, analytics, marketing), their duration, and how you can
          manage your preferences.
        </p>
        <p>
          For questions, contact us at{" "}
          <a
            href="mailto:support@idlogice.com"
            className="text-primary underline"
          >
            support@idlogice.com
          </a>
          .
        </p>
      </article>
    </>
  );
}
```

- [ ] **Step 4: Verify all three**

- http://localhost:3000/privacy — renders with hero + placeholder text
- http://localhost:3000/terms — renders with disclaimer callout
- http://localhost:3000/cookies — renders

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(public)/privacy/page.tsx" \
        "src/app/[locale]/(public)/terms/page.tsx" \
        "src/app/[locale]/(public)/cookies/page.tsx"
git commit -m "feat(pages): add legal stub pages (privacy, terms, cookies)"
```

---

## Task 20: Build verification

- [ ] **Step 1: Run TypeScript check**

```bash
cd app
npx tsc --noEmit
```

Expected: No errors. If any, fix before proceeding.

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected output includes all new routes:
```
Route (app)
├ ○ /[locale]
├ ○ /[locale]/about
├ ○ /[locale]/contact
├ ○ /[locale]/services
├ ○ /[locale]/services/express-entry
├ ○ /[locale]/services/study-permit
├ ○ /[locale]/services/work-permit
├ ○ /[locale]/services/pnp
├ ○ /[locale]/privacy
├ ○ /[locale]/terms
└ ○ /[locale]/cookies
```

Build should complete with `✓ Compiled successfully`.

- [ ] **Step 3: Smoke test FR locale**

Start production build: `npm run start`

Visit http://localhost:3000/fr/about — page renders in French.
Visit http://localhost:3000/fr/services/express-entry — French content loads.

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "chore: verify Week 2 build passes — all public pages complete"
```

---

## Self-Review Checklist

- [x] **Spec coverage:**
  - Homepage enhanced with stats + how-it-works + trust ✓
  - About page ✓
  - Contact page + form with validation ✓
  - Services overview ✓
  - Express Entry, Study Permit, Work Permit, PNP ✓
  - Privacy, Terms, Cookies stubs ✓
  - Header Services dropdown (desktop hover + mobile accordion) ✓
  - EN + FR translations for all new pages ✓
  - `request.ts` updated to load new namespaces ✓

- [x] **No placeholders:** All code steps contain complete, runnable code.

- [x] **Type consistency:**
  - `FeatureGridItem.icon` typed as `React.ComponentType<{ className?: string }>` — used same way in Task 5 and Task 11.
  - `StepsSection.steps` typed as `Array<{ number: number; title: string; description: string }>` — consistent across Tasks 6, 11, 15–18.
  - `t.raw()` returns `unknown` in next-intl v4 — all usages cast to the correct type immediately after the call.
  - `PageHero`, `CtaBanner`, `RequirementsSection` prop interfaces defined in their respective files and used identically in all pages.

- [x] **`"use client"` directive:**
  - `ContactForm` has `"use client"` at line 1 ✓
  - `Header` already had `"use client"` — unchanged ✓
  - All section components (`PageHero`, `FeatureGrid`, `StepsSection`, `RequirementsSection`, `CtaBanner`) are Server Components with no directive ✓

- [x] **Scope:** Legal pages are stubs (no i18n, no backend). Contact form backend is explicitly deferred to P2. No SEO metadata beyond what Next.js provides by default (added in Week 4).
