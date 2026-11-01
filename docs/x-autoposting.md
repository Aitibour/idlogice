# IDLOGICE X posting

## Active provider: Buffer

X editions reuse the corresponding LinkedIn post's verified topic and source, and copy its exact image bytes when available and checksum-valid. X captions are independently composed for the platform: a shorter hook, dated official headline for news, essential listing facts for jobs, and a direct reply invitation for questions. They retain the proper website article/booking CTA, email, phone and ten topical hashtags. No new policy interpretations are invented during adaptation. Records retain `captionVersion=x-distinct-v1`; already submitted or published posts are not rewritten or duplicated.

From October 31, 2026, `X_PUBLISH_PROVIDER=buffer` routes publishing through Buffer instead of the paid direct X API. The workspace owner is a.aitibour@gmail.com; the verified twitter channel is `66f10f77ca3dab3e0a5f444d`, service ID `1829195467151822848`, username idlogicecanada. The LinkedIn channel in Buffer is not used. Run `node scripts/buffer-setup.mjs` to verify the channel and save the ignored `.env.buffer.local` API key into deployment settings, then redeploy.

Buffer accepts complete threads via `metadata.twitter.thread`, with all parts included and the image attached to the first part. The worker publishes only due slots using `shareNow`, so it does not fill the ten-post free-plan queue with a month of drafts. Free-plan thread and API limits still apply; explicit limit errors hold the slot rather than upgrade or pay. An unpublished six-part image draft was accepted during integration testing.

Only the intended PNG is exported to `public-media/SHA256.png` in the X blob store. The public `buffer-media` function accepts exactly a 64-character hex digest and serves PNG bytes only; protected captions, credentials and arbitrary storage paths are inaccessible. Buffer fetches this public image URL. Saved Buffer post IDs are polled to distinguish submission from actual delivery. `sent` marks published, `error` requires review, and an ambiguous create response is never blindly resubmitted. No direct X reads, media uploads or posting calls occur in Buffer mode.

The direct-API setup below is retained as historical/fallback documentation, not the active publishing route.

The X calendar uses the same English schedule and Toronto timezone as LinkedIn: informative at 09:00 daily, website jobs at 12:30 every two days, questions at 16:00 every three days. The original October 28, 2026 anchor preserves matching dates. The scheduled dispatcher runs every half hour, catches up only today's slots and operates only on the published production deployment when `X_AUTOMATION_ENABLED=true`.

News uses relevant free stock photos with no text or branding. Other content uses the 30 branded layouts. Existing LinkedIn edition content is reused when available; otherwise X invokes the same official-source discovery and validation. The complete approved caption, website booking/article CTA, email, phone and ten hashtags are preserved in numbered reply threads, using official twitter-text weighted counting and 280-character limits. A photo attaches to the first part. No separate Premium subscription or long-post capability is assumed. The former blog-generator X cross-post has been removed to prevent additional unscheduled posts.

Store `idlogice-x` has its own post/draft records, templates, images and used-source history. Conditional writes claim slots. Each returned post ID is checkpointed before the next reply. Definite rejected parts may retry up to three attempts, continuing after saved parts. Network errors, server errors, missing IDs, interrupted publication or failed checkpoints require review; they never blindly restart a thread. A successful whole-thread record retains `postIds`. No text-only fallback. The credential owner is checked against pinned `X_ACCOUNT_ID` before publishing.

Protected functions: `x-worker-background` accepts `{key:"YYYY-MM-DD/informative",draft:true}` with the existing social bearer secret. Draft mode never calls X. `x-status` reports configuration and saved records, with `?key=drafts/YYYY-MM-DD/informative` or its image key. The image and font assets are explicitly bundled in the background worker. `x-scheduler` is a native scheduled function.

## Connection and activation

The previously saved deployment credentials returned HTTP 401 on October 30, 2026. X automatic posting is not active. Credentials being present does not mean the account is connected.

1. In the intended IDLOGICE X developer app, allow Read and Write access; regenerate that account's access token and secret after changing permissions.
2. Save its public username and four matching credentials in ignored `.env.x.local`. Never paste secrets in chat.
3. Run `node scripts/x-setup.mjs --verify` to check that the authenticated username matches. Running without `--verify` saves credentials and pins the account ID but leaves publishing disabled.
4. After the owner approves X API charges, run `node scripts/x-setup.mjs --enable` and redeploy. No purchase or automatic credit recharge is configured by this workflow.

X's current official pricing lists $0.200 per post containing a URL and $0.015 per other created post. Thread replies are separate created posts, so preserving full captions costs more than a single post. Authentication reads, media operations and other endpoint charges may also apply. Current account rates and credits must be checked in the X Developer Console. Source: https://docs.x.com/x-api/getting-started/pricing (checked October 30, 2026).

Verification: TypeScript, targeted ESLint, `node --experimental-strip-types --test tests/x.test.mjs`, and a production server draft with all parts within X's weighted limit. Publishing tests use mocked clients and never create real posts.


## Agency text editions — November 1, 2026

Every other edition of each content kind (even calendar ordinal) now converts the approved caption into a private IDLOGICE agency-style text image. It uses the official logo, red/white/navy colours, a dated headline, complete body paragraphs, contacts and an article or consultation CTA. Dedicated contact/hashtag lines move to the footer or remain in the caption. Policy restrictions, dates and qualifications are never summarized away. Text is escaped, wrapped and fitted at a minimum 24px; unfit text holds the slot instead of being truncated. Images are 1080 x 1620 PNGs rendered locally with bundled Lato fonts and no image API cost.

This adds a new alternating style, including for news; other editions retain the existing stock/branded image rules. The newer style request supersedes the stock-only news exception for these selected editions. LinkedIn generates the image; Facebook reuses its checksum-verified bytes, and X reuses them when the matching edition is ready (or renders using the same inputs). Already published records are never replayed. The image version change affects only safe, unpublished preparations.
