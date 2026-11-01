# Facebook automatic posting

Verified Buffer channel: `6ae6a81be29c69a1711e4766`; Facebook Page ID: `1399791626553928` (IDLOGICE Immigration Canada). Run `node scripts/facebook-setup.mjs` to verify the Page and save deployment settings; redeploy afterward. Reuses the existing Buffer API key.

Facebook follows the LinkedIn calendar in America/Toronto: daily information at 09:00, jobs every two days at 12:30 and questions every three days at 16:00, anchored October 28, 2026. Its dispatcher runs at :10 and :40 UTC, after LinkedIn, and waits until the matching LinkedIn edition is published. Delivery is generally ten minutes later, and can be later if LinkedIn is still preparing or unavailable. It does not post an old backlog.

The exact verified LinkedIn caption and checksum-validated image are reused, including CTA, contacts and hashtags. No additional model or image API is called. Facebook uses single image posts, never X threads. Buffer shareNow avoids filling the scheduled queue. Provider limits hold the post rather than upgrading the plan.

Independent store `idlogice-facebook` contains conditional slot claims, records and exported image bytes. Only SHA-256 image paths are exposed through facebook-media; records require the existing social bearer secret at facebook-status. A saved Buffer ID is polled rather than resubmitted. Ambiguous submissions and interrupted publishing require review; definite pre-publication failures retry up to three times. Draft requests use a separate ledger and create an unpublished Buffer draft. Production and FACEBOOK_AUTOMATION_ENABLED gates protect all dispatches.

A revoked Facebook authorization or Buffer disconnection can require the Page administrator to reconnect. No browser or local computer is required for daily server execution.


## Agency text editions — November 1, 2026

Every other edition of each content kind (even calendar ordinal) now converts the approved caption into a private IDLOGICE agency-style text image. It uses the official logo, red/white/navy colours, a dated headline, complete body paragraphs, contacts and an article or consultation CTA. Dedicated contact/hashtag lines move to the footer or remain in the caption. Policy restrictions, dates and qualifications are never summarized away. Text is escaped, wrapped and fitted at a minimum 24px; unfit text holds the slot instead of being truncated. Images are 1080 x 1620 PNGs rendered locally with bundled Lato fonts and no image API cost.

This adds a new alternating style, including for news; other editions retain the existing stock/branded image rules. The newer style request supersedes the stock-only news exception for these selected editions. LinkedIn generates the image; Facebook reuses its checksum-verified bytes, and X reuses them when the matching edition is ready (or renders using the same inputs). Already published records are never replayed. The image version change affects only safe, unpublished preparations.
