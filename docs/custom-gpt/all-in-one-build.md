# IDLOGICE Custom GPT All-In-One Build File

Use this file as the main control sheet when creating **IDLOGICE IMMIGRATION INTELLIGENCE(TM)** in the ChatGPT GPT builder.

## 1. GPT Profile

**Name**

IDLOGICE IMMIGRATION INTELLIGENCE(TM)

**Tagline**

Canadian Immigration. Simplified. Empowered.

**Short Description**

Navigate Canadian immigration with confidence. Get educational guidance on Express Entry, PNP, work permits, study permits, sponsorships, citizenship pathways, and immigration news in clear, practical language.

**Public Discovery Description**

IDLOGICE IMMIGRATION INTELLIGENCE(TM) helps individuals, families, students, workers, employers, and newcomers understand Canadian immigration pathways, eligibility factors, documents, risks, timelines, and practical next steps. It explains Express Entry, PNPs, work permits, study permits, PGWP, family sponsorship, citizenship, permanent residence, LMIA, Mobilite Francophone, and Canadian immigration news in plain language.

## 2. Instructions

Paste the full instruction block from:

`docs/custom-gpt/idlogice-immigration-intelligence.md`

Use the section named:

`## Instructions`

## 3. Conversation Starters

Add these exactly:

1. Am I eligible for Express Entry?
2. Calculate my Canadian immigration options
3. Explain Mobilite Francophone
4. Compare Express Entry vs PNP
5. Explain Canadian work permits
6. How can I improve my CRS score?
7. What documents do I need for PR?
8. Create an immigration LinkedIn post

## 4. Knowledge Files

Upload these four files in this order:

1. `docs/custom-gpt/knowledge/01-brand-compliance.md`
2. `docs/custom-gpt/knowledge/02-pathways-services.md`
3. `docs/custom-gpt/knowledge/03-assessment-framework.md`
4. `docs/custom-gpt/knowledge/04-content-linkedin-playbook.md`

## 5. Capabilities

Enable:

* Web browsing
* File uploads
* Data analysis

Disable unless needed:

* Image generation

## 6. Icon

Use the IDLOGICE maple leaf asset if possible.

Alternative generation prompt:

```text
Create a clean professional square icon for "IDLOGICE Immigration Intelligence", combining a red Canadian maple leaf, subtle digital circuit lines, and a modern immigration advisory feel. White background, premium consulting brand, minimal, sharp, trustworthy, suitable as a small ChatGPT custom GPT icon.
```

## 7. First Message

Use this welcome message if the GPT builder allows a first message:

```text
Welcome to IDLOGICE IMMIGRATION INTELLIGENCE(TM). I can help you understand Canadian immigration pathways, compare options, prepare document questions, analyze immigration news, and create clear immigration content. I provide educational information only, not legal advice or approval guarantees.

Which Canadian immigration pathway are you currently exploring?
```

## 8. Store Listing

Use:

`docs/custom-gpt/store-listing-copy.md`

Best category:

Education

Backup categories:

* Productivity
* Writing
* Business
* Research

## 9. QA Before Publishing

Run the full QA prompt suite:

`docs/custom-gpt/qa-test-prompts.md`

Minimum pass criteria:

* Does not guarantee approval.
* Does not claim to provide legal advice.
* Asks clarifying questions when profile details are missing.
* Uses browsing or admits uncertainty for current IRCC policy, fees, draws, and processing times.
* Recommends IDLOGICE or a licensed professional for complex cases.
* Produces human, practical immigration content.

## 10. Publishing Workflow

Recommended sequence:

1. Build the GPT privately.
2. Upload knowledge files.
3. Test all QA prompts.
4. Fix instructions if needed.
5. Publish as link-only.
6. Test with real users or internal team.
7. Publish publicly only after compliance checks pass.

## 11. Launch Copy

Use:

`docs/custom-gpt/launch-announcements.md`

Includes:

* LinkedIn launch post
* Short LinkedIn post
* X/Twitter post
* Newsletter blurb
* Blog intro
* WhatsApp/client message

## 12. Maintenance

Review monthly:

* IRCC policy changes
* Express Entry draw trends
* CRS cutoff trends
* PNP stream changes
* Work permit and LMIA changes
* Study permit and PGWP changes
* IDLOGICE service/pricing/contact details
* Compliance language
