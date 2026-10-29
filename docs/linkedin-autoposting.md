# IDLOGICE LinkedIn posting

Company page: https://www.linkedin.com/company/idlogice-immigration-canada/
Organization author is fixed to `urn:li:organization:103105245`.

English calendar, starting October 28, 2026, in `America/Toronto` (Montreal):

| Content | Frequency | Time |
| --- | --- | --- |
| Informative Canadian immigration post | Daily | 09:00 |
| Website job spotlight | Every 2 calendar days | 12:30 |
| Audience question | Every 3 calendar days | 16:00 |

Job and question posts are additional to the daily informative post. The hourly dispatcher runs at :00 and :30 UTC and calculates Montreal local time, including DST. A date-based index preserves the cadence across month boundaries. It catches up only today's due slots, never an old backlog.

Every caption has exactly ten unique, topic-related Canadian immigration hashtags plus contact@idlogice.com and +1 581-634-0224. Marketing posts link to https://idlogice.com/en/book-consultation. Article posts link to the matching, verified live IDLOGICE article. All public caption URLs stay on idlogice.com; official source URLs are retained privately for audit. Every published post requires a newly rendered PNG and an image that LinkedIn reports as AVAILABLE. Graphics rotate six layouts, six palettes, topic illustrations and edition text, with the official public/logo.png on every image. Audience graphics show the actual question. Graphic CTAs match the caption: read the article or book a consultation, plus email and phone. SHA-256 reservations reject duplicate images. No text-only fallback.

Informative captions prioritize unused IRCC news releases and notices published within fourteen days, checked at execution time. Dates are shown explicitly. Matching recent IDLOGICE articles are discovered from the live blog and verified against article metadata and an official reference before an article CTA is used. Without a matching live article, a news post uses the booking CTA. If there is no unused recent news or recent sourced article, the post uses clearly labelled evergreen guidance; it never invents news or an article URL. The writing uses a calm, professional Canadian immigration advisory voice and a specific invitation to take the next step with IDLOGICE, without fabricated credentials, pressure tactics or guarantees. Source URLs, publication dates, verification timestamps and source hashes are retained with the post; published news sources are marked to avoid repeated announcements. Source-check failures hold the post. Document-upload timing claims and unsourced reference-letter/contract details are explicitly blocked. Job spotlights import the website data, retain original posting dates and ask readers to confirm availability and pay. Questions invite general discussion without soliciting application identifiers.

## Connect the correct app

The former deployment used client ID `789r90vu68fphl`. The app supplied by the owner is `784lavctz4gscn`. Do not mix secrets or tokens between apps.

1. In LinkedIn Developers, Auth, register `https://idlogice.com/api/linkedin/callback` as an authorized redirect URL.
2. Save the matching client secret in ignored `.env.linkedin.local` and run `node scripts/linkedin-setup.mjs --credentials`. Secrets are sent directly to the authenticated Netlify environment API and are never printed.
3. Deploy. Visit `/api/linkedin/connect?key=SOCIAL_AUTOMATION_SECRET_VALUE` privately, replacing the placeholder with the deployment's secret. The connection URL grants administrative setup access; do not share it publicly.
4. Authorize with a LinkedIn account that administers this exact company page. Requested permissions: `w_organization_social` and `rw_organization_admin`.
5. Callback verifies a short-lived, single-use state plus an HttpOnly browser cookie and checks the organization ACL before saving tokens. Tokens are encrypted with AES-256-GCM in a private Netlify Blobs store. No bearer tokens appear in HTML or logs.

LinkedIn access is subject to the app's granted API tier. Development access has call limits; LinkedIn describes Standard tier as intended for live production. Apply for the appropriate tier in LinkedIn Developers when required. Access/refresh tokens can expire or be revoked; an administrator must reconnect when programmatic refresh is unavailable or no longer valid.

## Runtime and operations

Native Netlify functions:

- `linkedin-scheduler`: schedule only, never trusts a client-supplied scheduling header.
- `linkedin-worker-background`: authenticated 15-minute worker for source checks, image generation/upload and publishing.
- `linkedin-status`: bearer-protected status and individual record/image retrieval.
- `linkedin-connect`, `linkedin-callback`: native OAuth endpoints under `/api/linkedin/`.

The scheduler does nothing on previews or without a completed OAuth connection. `LINKEDIN_AUTOMATION_ENABLED=false` pauses publishing (redeploy after changing runtime env). Separate server-side secrets protect dispatch, status, OAuth setup and token encryption. Never rotate the encryption key without migrating stored credentials.

Store: `idlogice-linkedin`. Records: `posts/YYYY-MM-DD/KIND`; drafts use `drafts/`. Atomic conditional writes claim slots and prevent simultaneous workers. Up to three attempts are allowed for definite pre-publication/rejection failures. A timeout, ambiguous LinkedIn response, or interrupted publishing checkpoint requires manual review; the worker never blindly retries a possible successful post. Published records include the LinkedIn post URN.

Bearer-protected status: `/.netlify/functions/linkedin-status`. Append `?key=posts/2026-10-28/informative` to inspect one record. Use the image key from a record to retrieve its PNG. Never put the bearer secret in a public link.

For an unpublished preview, invoke the worker with JSON `{"key":"2026-10-28/job","draft":true}` and the authorization header. Drafts use isolated records and never publish. Graphics render locally with resvg and bundled OFL-licensed Lato fonts, with no image-generation API requests, key requirement or per-image provider charge. The worker bundle explicitly includes the fonts and native renderer. Groq still generates and checks informative text under that account's limits; hosting/storage and LinkedIn limits also apply. Required env: `GROQ_API_KEY`, `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `SOCIAL_AUTOMATION_SECRET`, `SOCIAL_TOKEN_ENCRYPTION_KEY`, and the calendar settings. OpenAI keys are unused by this LinkedIn workflow.

The blog generator no longer cross-posts to LinkedIn, avoiding additional posts outside this calendar. Its website and Twitter behavior is preserved.

News and article teasers use verified official headlines with approved advisory copy and a dated attribution, rather than model-generated policy interpretations. This avoids silently extending a fee, eligibility rule or temporary measure to groups the source does not cover. Evergreen captions continue to use source-grounded generation and a second review.

Preview and published image hashes use separate namespaces so previewing a deterministic graphic cannot block its scheduled edition. Legacy preview reservations can be promoted atomically to a publication; hashes already owned by another real post remain blocked. Retrying an interrupted image-cache write for the same post retains its reservation.

For an expressly requested immediate publication, the same bearer-protected worker accepts `{"key":"TODAYS_MONTREAL_DATE/informative","publishNow":true}`. This runs the full source-check, graphic-rendering, image-upload and publication workflow on the server. It uses the same `posts/` record as the schedule, so repeated requests cannot duplicate a completed post. It accepts only the current Montreal calendar date, requires the published production deployment with automation enabled, and cannot be combined with draft mode. Ordinary scheduled dispatches do not set this option. Browser sign-in, manual image uploads and personal-profile posting are not part of the server automation.

## Reference-matched image templates

The active renderer uses 1080 × 1350 portrait graphics based on the owner's screenshot references: minimal editorial, Toronto skyline with silk wave and icon columns, person emerging from a phone, document-review photography, student photography, and Canadian-flag red with optional blue highlight. Eight layout variants rotate across editions. Photo selection follows the topic; study-related headlines use the student image. Background artwork was generated once with the built-in image tool and bundled in `assets/social/backgrounds/`. Daily headline, date, CTA and contact layers render locally; there is no per-post image API charge.

Every image explicitly displays `idlogice.com`, the booking or article CTA, email and phone. `assets/social/logo-dark.png` and `logo-light.png` preserve the official logo's original alpha and red leaf while changing neutral lettering to dark or white to match the known background at the logo position. There is no white plaque. These PNG variants derive from `public/logo.png`; no model-generated logo is used in final automated images. `GRAPHIC_VERSION` invalidates old prepared graphics on safe pre-publication retries; published and uncertain records are never replayed.

Validation: `node --experimental-strip-types --test tests/linkedin.test.mjs`, TypeScript, targeted ESLint and production build. Tests mock external publishing APIs and never create a real post.
