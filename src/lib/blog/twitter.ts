/**
 * X (Twitter) auto-publish module
 * Uses OAuth 1.0a (user context) to post tweets with image + article link.
 * No external dependencies — signs requests with built-in Node crypto.
 */

import crypto from "crypto";

export interface TwitterPostPayload {
  title: string;
  summary: string;
  slug: string;
  locale?: string;
  coverImage?: Buffer | null;
}

const BASE_URL = "https://idlogice.com";
const TWEET_API = "https://api.twitter.com/2/tweets";
const MEDIA_API = "https://upload.twitter.com/1.1/media/upload.json";

// ─── OAuth 1.0a signer ────────────────────────────────────────────────────────

function oauthSign(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerKey: string,
  consumerSecret: string,
  tokenKey: string,
  tokenSecret: string
): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: tokenKey,
    oauth_version: "1.0",
    ...params,
  };

  const encode = (s: string) => encodeURIComponent(s);

  const sortedParams = Object.entries(oauthParams)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${encode(k)}=${encode(v)}`)
    .join("&");

  const baseString = [method.toUpperCase(), encode(url), encode(sortedParams)].join("&");
  const signingKey = `${encode(consumerSecret)}&${encode(tokenSecret)}`;

  const signature = crypto
    .createHmac("sha1", signingKey)
    .update(baseString)
    .digest("base64");

  oauthParams["oauth_signature"] = signature;

  const header = "OAuth " +
    Object.entries(oauthParams)
      .filter(([k]) => k.startsWith("oauth_"))
      .map(([k, v]) => `${encode(k)}="${encode(v)}"`)
      .join(", ");

  return header;
}

function getCredentials() {
  return {
    consumerKey: process.env.TWITTER_API_KEY ?? "",
    consumerSecret: process.env.TWITTER_API_SECRET ?? "",
    accessToken: process.env.TWITTER_ACCESS_TOKEN ?? "",
    accessSecret: process.env.TWITTER_ACCESS_SECRET ?? "",
  };
}

// ─── Upload image ─────────────────────────────────────────────────────────────

async function uploadMedia(imageBuffer: Buffer): Promise<string | null> {
  const { consumerKey, consumerSecret, accessToken, accessSecret } = getCredentials();

  const authHeader = oauthSign(
    "POST",
    MEDIA_API,
    {},
    consumerKey,
    consumerSecret,
    accessToken,
    accessSecret
  );

  // Build multipart form
  const boundary = `----FormBoundary${crypto.randomBytes(8).toString("hex")}`;
  const CRLF = "\r\n";
  const bodyParts: Buffer[] = [
    Buffer.from(
      `--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="media"${CRLF}` +
      `Content-Type: image/png${CRLF}${CRLF}`
    ),
    imageBuffer,
    Buffer.from(`${CRLF}--${boundary}--${CRLF}`),
  ];
  const body = Buffer.concat(bodyParts);

  const res = await fetch(MEDIA_API, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    },
    body,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Twitter media upload failed:", res.status, err);
    return null;
  }

  const data = (await res.json()) as { media_id_string: string };
  console.log("Twitter media uploaded:", data.media_id_string);
  return data.media_id_string;
}

// ─── Build tweet text ─────────────────────────────────────────────────────────

function buildTweetText(payload: TwitterPostPayload): string {
  const { title, summary, slug, locale = "en" } = payload;
  const articleUrl = `${BASE_URL}/en/blog/${slug}`;

  // Twitter counts URLs as 23 chars — reserve space accordingly
  const clean = summary.replace(/[-–—]/g, " ").replace(/\s{2,}/g, " ").trim();
  const maxExcerpt = 180;
  const excerpt = clean.length > maxExcerpt ? clean.slice(0, maxExcerpt - 1) + "…" : clean;

  if (locale === "fr") {
    return [
      `Nouveau sur notre blog 🍁`,
      ``,
      title,
      ``,
      excerpt,
      ``,
      articleUrl,
      ``,
      `#ImmigrationCanada #EntréeExpress #VisaCanada #RCIC`,
    ].join("\n");
  }

  if (locale === "ar") {
    return [
      `جديد على مدونتنا 🍁`,
      ``,
      title,
      ``,
      excerpt,
      ``,
      articleUrl,
      ``,
      `#هجرة_كندا #الدخول_السريع #تأشيرة_كندا`,
    ].join("\n");
  }

  // English (default)
  return [
    `New immigration insight 🍁`,
    ``,
    title,
    ``,
    excerpt,
    ``,
    articleUrl,
    ``,
    `#CanadaImmigration #ExpressEntry #CanadaPR #RCIC`,
  ].join("\n");
}

// ─── Post tweet ───────────────────────────────────────────────────────────────

async function postTweet(
  text: string,
  mediaId: string | null
): Promise<boolean> {
  const { consumerKey, consumerSecret, accessToken, accessSecret } = getCredentials();

  const authHeader = oauthSign(
    "POST",
    TWEET_API,
    {},
    consumerKey,
    consumerSecret,
    accessToken,
    accessSecret
  );

  const body: Record<string, unknown> = { text };
  if (mediaId) {
    body.media = { media_ids: [mediaId] };
  }

  const res = await fetch(TWEET_API, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Twitter post failed:", res.status, err);
    return false;
  }

  const data = (await res.json()) as { data?: { id: string } };
  console.log("Tweet posted:", data.data?.id);
  return true;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function publishToTwitter(payload: TwitterPostPayload): Promise<boolean> {
  const { consumerKey, consumerSecret, accessToken, accessSecret } = getCredentials();

  if (!consumerKey || !consumerSecret || !accessToken || !accessSecret) {
    console.log("Twitter credentials not configured — skipping publish");
    return false;
  }

  console.log("Publishing to X:", payload.title);

  // Upload cover image if provided
  let mediaId: string | null = null;
  if (payload.coverImage) {
    mediaId = await uploadMedia(payload.coverImage);
  }

  const text = buildTweetText(payload);
  return postTweet(text, mediaId);
}
