# Week 2 — Public Marketing Pages Design

**Date:** 2026-04-08
**Phase:** P1 — Week 2 of 6
**Status:** Approved

---

## Goal

Build all public marketing pages for the IDLOGICE immigration platform: Homepage (enhanced), About, Contact, Services overview, 4 service detail pages (Express Entry, Study Permit, Work Permit, PNP), and 3 legal stub pages (Privacy, Terms, Cookies). Update the header with a Services dropdown.

---

## Approach

**Option A — Shared section components.** Reusable presentational section components (`PageHero`, `FeatureGrid`, `StepsSection`, `RequirementsSection`, `CtaBanner`) are composed by each page. Translation strings are resolved in the page file and passed as props. All section components are Server Components. Only `ContactForm` is a Client Component.

---

## File & Folder Structure

```
src/
├── app/[locale]/
│   ├── (public)/
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── services/
│   │   │   ├── page.tsx                    ← Services overview
│   │   │   ├── express-entry/page.tsx
│   │   │   ├── study-permit/page.tsx
│   │   │   ├── work-permit/page.tsx
│   │   │   └── pnp/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   └── cookies/page.tsx
│   └── page.tsx                            ← Homepage (enhanced, already exists)
│
├── components/
│   ├── sections/                           ← NEW
│   │   ├── page-hero.tsx
│   │   ├── feature-grid.tsx
│   │   ├── steps-section.tsx
│   │   ├── requirements-section.tsx
│   │   └── cta-banner.tsx
│   └── forms/
│       └── contact-form.tsx               ← Client Component
│
locales/
├── en/
│   ├── common.json     ← add services nav keys + services dropdown labels
│   ├── home.json       ← add stats, how-it-works, trust sections
│   ├── about.json      ← NEW
│   ├── contact.json    ← NEW
│   └── services.json   ← NEW (shared services keys + per-service sections)
└── fr/ (mirrors en/)
```

**Notes:**
- `(public)` route group uses the locale layout (Header + Footer) — no additional layout file required
- Homepage (`[locale]/page.tsx`) stays outside `(public)` — consistent with existing structure
- Legal pages are stubs with placeholder copy; real legal text to be added before P1 launch

---

## Shared Section Components

All components in `src/components/sections/` are **Server Components** (pure presentational).

### `page-hero.tsx`
Props:
```ts
{
  badge?: string        // e.g. "Express Entry"
  title: string
  subtitle: string
  cta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}
```
Lighter than homepage hero — white/muted background, smaller vertical padding (`py-16`).

### `feature-grid.tsx`
Props:
```ts
{
  title?: string
  subtitle?: string
  columns?: 2 | 3 | 4   // default: 3
  items: Array<{
    icon?: LucideIcon
    title: string
    description: string
    href?: string
  }>
}
```

### `steps-section.tsx`
Props:
```ts
{
  title: string
  subtitle?: string
  steps: Array<{
    number: number
    title: string
    description: string
  }>
}
```
Numbered cards in horizontal scroll on mobile, grid on desktop.

### `requirements-section.tsx`
Props:
```ts
{
  title: string
  qualifications: string[]   // "You may qualify if..."
  facts: Array<{ label: string; value: string }>  // key facts right column
}
```
Two-column layout: checklist left, key facts right.

### `cta-banner.tsx`
Props:
```ts
{
  title: string
  subtitle?: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}
```
Full-width primary-colored band. Used as last section on every page.

---

## Page Content

### Homepage (enhance existing)
Add to existing hero + features grid:
1. **Stats bar** — 3 numbers: Evaluations Completed, Average CRS Improvement, Countries Served
2. **How it works** — 3-step `StepsSection`: Evaluate → Plan → Immigrate
3. **Trust section** — `FeatureGrid` (3 cards): Free Tools, Data Privacy, Expert Guidance
4. Existing `CtaBanner` at bottom (already present)

### About (`/about`)
1. `PageHero` — title, subtitle
2. Mission paragraph (prose, no component)
3. `FeatureGrid` — 3 values: Accuracy, Privacy, Education
4. `CtaBanner` — "Start your free evaluation"

### Contact (`/contact`)
1. `PageHero`
2. Two-column layout:
   - Left: `ContactForm` (Client Component) — fields: name, email, subject, message; basic client-side validation; no backend yet (P2 wire-up)
   - Right: contact info (email, response time)
3. `CtaBanner`

### Services Overview (`/services`)
1. `PageHero`
2. `FeatureGrid` (2 columns) — 4 service cards, each linking to detail page
3. `CtaBanner`

### Express Entry (`/services/express-entry`)
1. `PageHero` with badge "Express Entry"
2. `RequirementsSection` — qualification checklist + key facts (CRS max: 1200, streams: 3)
3. `StepsSection` — 5 steps: Create profile → Enter pool → Receive ITA → Apply → PR
4. `FeatureGrid` — 3 EE streams: FSW, CEC, FST
5. `CtaBanner` — "Calculate your CRS score free"

### Study Permit (`/services/study-permit`)
1. `PageHero` with badge "Study Permit"
2. `RequirementsSection` — acceptance letter, finances, language, health
3. `StepsSection` — 4 steps: Choose school → Apply → Receive permit → Arrive
4. `FeatureGrid` — 3 key facts: Work rights (20h/week), PGWP eligibility, Path to PR
5. `CtaBanner`

### Work Permit (`/services/work-permit`)
1. `PageHero` with badge "Work Permit"
2. `RequirementsSection` — LMIA-based vs LMIA-exempt distinction
3. `StepsSection` — 4 steps
4. `FeatureGrid` — 3 permit types: LMIA, CUSMA, Intra-company
5. `CtaBanner`

### PNP (`/services/pnp`)
1. `PageHero` with badge "Provincial Nominee Program"
2. `RequirementsSection` — provincial criteria, +600 CRS bonus highlighted
3. `StepsSection` — 4 steps: Choose province → Apply PNP → Get nomination → Apply PR
4. `FeatureGrid` — 3 popular provinces: Ontario, BC, Alberta
5. `CtaBanner`

### Legal Stubs (Privacy, Terms, Cookies)
- `PageHero` + `<article>` prose with placeholder paragraphs
- "Last updated: April 2026" date shown
- No section components needed — these are content pages

---

## Header Update

Add a "Services" nav item with a dropdown:

**Desktop:** On hover/focus, a dropdown panel appears below the nav item showing 4 links (Express Entry, Study Permit, Work Permit, PNP) in a 2×2 grid with brief descriptions. Implemented with CSS (`group-hover`) — no JS library.

**Mobile:** "Services" expands inline in the drawer showing the 4 links indented below it. Uses a `servicesOpen` boolean via `useState` — the header is already a `"use client"` component so no directive change needed.

**Typed hrefs:** `src/i18n/navigation.ts` exports typed navigation via next-intl's `createNavigation`. All 4 service paths (`/services`, `/services/express-entry`, `/services/study-permit`, `/services/work-permit`, `/services/pnp`) must be added as valid `href` values there, otherwise TypeScript will error on `<Link href="/services/...">` usage.

---

## Translations

Each new locale namespace (`about.json`, `contact.json`, `services.json`) created in both `locales/en/` and `locales/fr/`.

`services.json` structure:
```json
{
  "overview": { "title": "...", "subtitle": "...", ... },
  "expressEntry": { "title": "...", "badge": "...", "requirements": [...], "steps": [...], ... },
  "studyPermit": { ... },
  "workPermit": { ... },
  "pnp": { ... }
}
```

`home.json` additions: `stats`, `howItWorks`, `trust` sections.
`common.json` additions: `nav.services`, `nav.servicesItems` object with 4 keys.

---

## What's Not In Scope

- Blog, Calculator, Evaluation, Draws, Pricing, Help, Dashboard, Auth pages — all P1 Week 3–5 or P2
- Real legal copy — placeholder only
- Contact form backend (wire-up in P2)
- SEO metadata per-page (added in Week 4 per plan) — basic `<title>` only for now
- Supabase / any data fetching — all pages are fully static
