# AI Auto-Blog System — Design Spec
**Date:** 2026-05-12  
**Project:** IDLOGICE Immigration Consulting  
**Status:** Approved

---

## Overview

A fully automated, zero-cost daily blog pipeline that fetches Canadian immigration news from RSS feeds, generates bilingual (EN/FR) articles via Groq (Llama 3.3 70B), attaches a relevant Unsplash photo, and publishes instantly to the site — no human review required.

---

## Goals

- Publish 1 new blog post per day automatically
- Target high-intent immigration queries for SEO
- Zero ongoing cost
- Notify Google/Bing immediately via IndexNow on publish

---

## Architecture

```
[Netlify Scheduled Function — daily 7am UTC]
         ↓
Fetch 3 RSS feeds (IRCC, CIC News, CanadaVisa)
         ↓
Pick newest item not already in Supabase (dedup by source_url)
         ↓
Groq API (Llama 3.3 70B) → generate EN + FR article
  - title, slug, excerpt, full content (markdown), meta_desc
         ↓
Unsplash API → keyword search from title → first result URL + credit
         ↓
INSERT into blog_posts (status: published)
         ↓
IndexNow ping → /en/blog/[slug] + /fr/blog/[slug]
```

---

## Data Model

```sql
create table blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  source_url    text unique not null,     -- dedup key
  source_title  text,

  title         jsonb not null,           -- {en, fr}
  excerpt       jsonb not null,           -- {en, fr} ~160 chars
  content       jsonb not null,           -- {en, fr} markdown
  meta_desc     jsonb not null,           -- {en, fr} ~155 chars

  image_url     text,
  image_alt     text,
  image_credit  text,                     -- Unsplash photographer name

  status        text default 'published',
  published_at  timestamptz default now(),
  created_at    timestamptz default now()
);

create index on blog_posts (published_at desc);
create index on blog_posts (slug);
```

RLS: public SELECT, service-role INSERT only.

---

## File Structure

```
netlify/functions/
  blog-generator.mts          ← Netlify scheduled function (cron)

src/
  lib/
    blog/
      rss.ts                  ← fetch + parse 3 RSS feeds
      generate.ts             ← Groq article generation (EN+FR)
      unsplash.ts             ← Unsplash keyword search
      publish.ts              ← Supabase insert + IndexNow ping
  app/[locale]/(public)/
    blog/
      page.tsx                ← paginated list (ISR revalidate: 3600)
      [slug]/
        page.tsx              ← individual post (ISR revalidate: 3600)
  components/blog/
    PostCard.tsx              ← card for list page
    PostBody.tsx              ← rendered markdown content
```

---

## RSS Sources

| Feed | URL |
|------|-----|
| IRCC (Government) | `https://www.canada.ca/en/immigration-refugees-citizenship/news.atom` |
| CIC News | `https://www.cicnews.com/feed/` |
| CanadaVisa | `https://www.canadavisa.com/canada-immigration-news.rss` |

---

## Services & Credentials

| Service | Purpose | Cost | Env Var |
|---------|---------|------|---------|
| Groq (Llama 3.3 70B) | Article generation | Free | `GROQ_API_KEY` |
| Unsplash API | Featured image | Free | `UNSPLASH_ACCESS_KEY` |
| Supabase | Storage | Free tier | existing |
| Netlify Functions | Scheduling | Free | — |
| IndexNow | Search ping | Free | existing `indexnow.ts` |

---

## Groq Prompt Strategy

Single prompt generates the full article in both languages in one call (JSON response):

```
You are an expert Canadian immigration content writer.
Given this news item: [title + description from RSS]
Generate a blog post in JSON with keys: title_en, title_fr, slug,
excerpt_en, excerpt_fr, content_en, content_fr, meta_desc_en, meta_desc_fr,
unsplash_keyword.

Rules:
- Content: 600-900 words per language, markdown format
- SEO: include primary keyword in title and first paragraph
- Tone: professional, helpful, bilingual Canadian audience
- slug: lowercase-hyphenated, max 60 chars
- unsplash_keyword: 1-2 words for image search (e.g. "passport canada")
```

---

## Netlify Scheduled Function Config

```toml
# netlify.toml addition
[functions.blog-generator]
schedule = "0 7 * * *"   # daily 7am UTC
```

---

## Blog Pages

- **List page** (`/[locale]/blog`): paginated grid of PostCards, 9 per page, sorted by `published_at DESC`. ISR revalidate 3600s.
- **Post page** (`/[locale]/blog/[slug]`): full article with image header, markdown body, source credit, and related posts (3 most recent). ISR revalidate 3600s. Full SEO metadata per post.
- **generateStaticParams**: pre-renders the 10 most recent posts at build time; older posts rendered on demand.

---

## Error Handling

- RSS fetch fails → log + exit silently (retry tomorrow)
- No new RSS items → exit silently (no duplicate posts)
- Groq generation fails → log error, do not insert
- Unsplash fails → insert post with `image_url: null` (blog still publishes)
- Supabase insert fails → log error, skip IndexNow ping

---

## Out of Scope

- Admin dashboard for posts (future)
- ES/AR translations (future — add locales to prompt when ready)
- Comment system
- Author attribution
