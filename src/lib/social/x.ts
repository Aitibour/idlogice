import { TwitterApi } from "twitter-api-v2";
import twitterText from "twitter-text";

export function xClient() {
  const keys = [
    "TWITTER_API_KEY",
    "TWITTER_API_SECRET",
    "TWITTER_ACCESS_TOKEN",
    "TWITTER_ACCESS_SECRET",
  ] as const;
  if (keys.some((key) => !process.env[key]))
    throw new Error("X credentials missing");
  return new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_SECRET!,
  });
}

// Preserve the approved caption and all ten hashtags, without deleting policy
// qualifiers just to fit a single post. Split only at whitespace boundaries.
export function xThread(text: string) {
  const parts: string[] = [];
  for (const paragraph of text.normalize("NFC").split(/\n\n+/)) {
    let current = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      if (!twitterText.parseTweet(word).valid)
        throw new Error(
          "An indivisible X caption token exceeds the post limit",
        );
      const candidate = current ? `${current} ${word}` : word;
      if (current && twitterText.parseTweet(candidate).weightedLength > 265) {
        parts.push(current);
        current = word;
      } else current = candidate;
    }
    if (current) {
      const previous = parts.at(-1);
      if (
        previous &&
        twitterText.parseTweet(`${previous}\n\n${current}`).weightedLength <=
          265
      )
        parts[parts.length - 1] = `${previous}\n\n${current}`;
      else parts.push(current);
    }
  }
  if (!parts.length || parts.length > 20)
    throw new Error("X thread length is invalid");
  const numbered = parts.map((part, i) =>
    parts.length > 1 ? `${part}\n\n${i + 1}/${parts.length}` : part,
  );
  if (numbered.some((part) => !twitterText.parseTweet(part).valid))
    throw new Error("X thread exceeds character limits");
  return numbered;
}

export class XPublishError extends Error {
  uncertain: boolean;
  constructor(message: string, uncertain: boolean) {
    super(message);
    this.uncertain = uncertain;
  }
}

export async function publishXPart(
  client: ReturnType<typeof xClient>,
  text: string,
  mediaId?: string,
  replyTo?: string,
) {
  if (!twitterText.parseTweet(text).valid)
    throw new XPublishError("Invalid X caption", false);
  try {
    const response = await client.v2.tweet(text, {
      ...(mediaId ? { media: { media_ids: [mediaId] } } : {}),
      ...(replyTo ? { reply: { in_reply_to_tweet_id: replyTo } } : {}),
    });
    if (!response.data?.id)
      throw new XPublishError("X returned no post ID", true);
    return response.data.id;
  } catch (error) {
    if (error instanceof XPublishError) throw error;
    const status = (error as { code?: number }).code;
    throw new XPublishError(
      `X post failed (${status ?? "network error"})`,
      !(typeof status === "number" && status >= 400 && status < 500),
    );
  }
}
