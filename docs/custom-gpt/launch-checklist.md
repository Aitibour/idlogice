# IDLOGICE Custom GPT Launch Checklist

Use this checklist when creating **IDLOGICE IMMIGRATION INTELLIGENCE(TM)** in the ChatGPT GPT builder.

## 1. GPT Profile

Set these fields:

* **Name:** IDLOGICE IMMIGRATION INTELLIGENCE(TM)
* **Tagline:** Canadian Immigration. Simplified. Empowered.
* **Short description:** Navigate Canadian immigration with confidence. Get educational guidance on Express Entry, PNP, work permits, study permits, sponsorships, citizenship pathways, and immigration news in clear, practical language.

## 2. Instructions

Paste the full instruction block from:

`docs/custom-gpt/idlogice-immigration-intelligence.md`

Use the block under:

`## Instructions`

## 3. Conversation Starters

Add these starter prompts:

1. Am I eligible for Express Entry?
2. Calculate my Canadian immigration options
3. Explain Mobilite Francophone
4. Compare Express Entry vs PNP
5. Explain Canadian work permits
6. How can I improve my CRS score?
7. What documents do I need for PR?
8. Create an immigration LinkedIn post

## 4. Knowledge Uploads

Upload these files:

1. `docs/custom-gpt/knowledge/01-brand-compliance.md`
2. `docs/custom-gpt/knowledge/02-pathways-services.md`
3. `docs/custom-gpt/knowledge/03-assessment-framework.md`
4. `docs/custom-gpt/knowledge/04-content-linkedin-playbook.md`

## 5. Recommended Capabilities

Enable:

* Web browsing
* File uploads
* Data analysis

Disable unless needed:

* Image generation

## 6. Logo/Icon

Use the IDLOGICE maple leaf/favicon asset where possible.

Alternative icon prompt:

```text
Create a clean professional square icon for "IDLOGICE Immigration Intelligence", combining a red Canadian maple leaf, subtle digital circuit lines, and a modern immigration advisory feel. White background, premium consulting brand, minimal, sharp, trustworthy, suitable as a small ChatGPT custom GPT icon.
```

## 7. Pre-Publish QA

Before publishing, run every test in:

`docs/custom-gpt/qa-test-prompts.md`

The GPT should:

* Give educational guidance, not legal advice.
* Avoid guarantees.
* Ask clarifying questions when profile details are missing.
* Mention IRCC verification for current policy, fees, draws, or processing times.
* Recommend IDLOGICE or a licensed professional for complex cases.
* Create useful LinkedIn/blog content without sounding robotic.

## 8. Publishing Notes

Recommended visibility:

* Start as private or link-only.
* Test with 10-20 real prompts.
* Publish publicly only after compliance checks pass.

Recommended category:

* Education
* Productivity
* Business, if available

## 9. Ongoing Maintenance

Review monthly:

* IRCC policy changes
* Express Entry draw patterns
* Processing-time changes
* Study permit and PGWP changes
* PNP stream changes
* IDLOGICE services, pricing, contact details, and disclaimers
