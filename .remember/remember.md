# Handoff

## State
AI auto-blog pipeline fully built and tested (Tasks 1-12 complete). First post published to Supabase. Netlify cron fires daily at 7am UTC. Performance fixes pushed: hero video lazy-mount, poster preload, cache headers. Sticky CTA updated to "Free Profile Evaluation" → /evaluation.

## Next
1. Re-run Lighthouse after Netlify deploy to measure LCP improvement (was 8.6s, perf score 44)
2. Submit sitemap in Bing Webmaster Tools after Bing verification confirms
3. Add BlogPosting JSON-LD schema to `/blog/[slug]` page for rich snippets

## Context
- **Always git push after every change** — Netlify auto-deploys on push, never leave unpushed
- Deployment: Netlify (not Vercel) — use `netlify env:set` for env vars, not Vercel CLI
- Locale files in `locales/<locale>/` not `messages/` — imported via `src/i18n/request.ts`
- Supabase service role key set in Netlify + .env.local
- Blog test script: `npx tsx --env-file=.env.local scripts/test-blog.ts`
