import test from "node:test";
import assert from "node:assert/strict";
import twitterText from "twitter-text";
import { xThread, publishXPart } from "../src/lib/social/x.ts";
import { completePost, CONTACT_CTA } from "../src/lib/social/calendar.ts";
import { createContent, editorialCaption } from "../src/lib/social/content.ts";
import { xCaption } from "../src/lib/social/x-content.ts";

test("X captions differ from LinkedIn while retaining the verified topic, listing facts and contact actions", async () => {
  for (const kind of ["job", "question"]) {
    const content = await createContent(kind, "2026-10-31", 0);
    const text = xCaption(content, kind);
    assert.notEqual(text, content.text);
    assert.equal((text.match(/#[A-Za-z][A-Za-z0-9_]*/g) || []).length, 10);
    assert.ok(text.includes(CONTACT_CTA));
    if (kind === "job") {
      assert.match(text, /Listed pay:/);
      assert.match(text, /originally posted/);
      assert.match(text, /does not guarantee/);
    } else assert.ok(text.includes(content.graphicHeadline));
  }
  const content = {
    title:
      "Canada updates temporary measures for people affected by crises in Haiti and Sudan",
    text: "Original caption",
    sourceType: "news",
    sourcePublishedAt: "2026-10-27",
    purpose: "marketing",
    checkedAt: new Date().toISOString(),
  };
  const text = xCaption(content, "informative");
  assert.ok(text.includes(content.title));
  assert.match(text, /2026-10-27/);
  assert.match(text, /scope, conditions and dates/);
  assert.doesNotMatch(text, /fee exemptions|automatic extension/);
  const article = xCaption(
    {
      ...content,
      purpose: "article",
      articleUrl: "https://idlogice.com/en/blog/real-article",
    },
    "informative",
  );
  assert.match(article, /https:\/\/idlogice.com\/en\/blog\/real-article/);
  assert.doesNotMatch(article, /book-consultation/);
});

test("X threads preserve the entire caption, CTA, phone, email, ten hashtags and policy qualifiers", async () => {
  const news = completePost(
    editorialCaption(
      "Canada updates temporary measures for people affected by crises in Haiti and Sudan",
      false,
    ),
  );
  for (const caption of [
    news,
    (await createContent("job", "2026-10-30", 1)).text,
    (await createContent("question", "2026-10-30", 1)).text,
  ]) {
    const parts = xThread(caption);
    assert.ok(parts.length > 1);
    for (const part of parts)
      assert.equal(twitterText.parseTweet(part).valid, true);
    const reconstructed = parts
      .map((part) => part.replace(/\n\n\d+\/\d+$/, " "))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    assert.equal(reconstructed, caption.replace(/\s+/g, " ").trim());
    assert.equal(
      (reconstructed.match(/#[A-Za-z][A-Za-z0-9_]*/g) || []).length,
      10,
    );
    for (const line of CONTACT_CTA.split("\n"))
      assert.ok(reconstructed.includes(line));
  }
});

test("X threads respect weighted emoji/URL lengths and never split a URL or hashtag", () => {
  const text =
    "Prepare carefully 👨‍👩‍👧‍👦 🇨🇦 ".repeat(20) +
    "https://idlogice.com/en/book-consultation #CanadaImmigration";
  const parts = xThread(text);
  assert.ok(
    parts.some((part) =>
      part.includes("https://idlogice.com/en/book-consultation"),
    ),
  );
  assert.ok(parts.some((part) => part.includes("#CanadaImmigration")));
  for (const part of parts) assert.ok(twitterText.parseTweet(part).valid);
  assert.throws(() => xThread("x".repeat(300)), /token/);
  assert.throws(() => xThread(""), /invalid/);
});

test("X creates a media post then replies to the previous part", async () => {
  const calls = [];
  const client = {
    v2: {
      tweet: async (text, body) => {
        calls.push({ text, body });
        return { data: { id: String(calls.length) } };
      },
    },
  };
  assert.equal(await publishXPart(client, "Verified headline", "media-1"), "1");
  assert.equal(
    await publishXPart(client, "Consultation CTA", undefined, "1"),
    "2",
  );
  assert.deepEqual(calls[0].body, { media: { media_ids: ["media-1"] } });
  assert.deepEqual(calls[1].body, { reply: { in_reply_to_tweet_id: "1" } });
});

test("X retries only definite rejections; network failures or missing IDs require review", async () => {
  for (const [code, uncertain] of [
    [401, false],
    [429, false],
    [503, true],
    [undefined, true],
  ]) {
    const client = {
      v2: {
        tweet: async () => {
          throw { code };
        },
      },
    };
    await assert.rejects(
      publishXPart(client, "Example"),
      (error) => error.uncertain === uncertain,
    );
  }
  await assert.rejects(
    publishXPart({ v2: { tweet: async () => ({ data: {} }) } }, "Example"),
    (error) => error.uncertain === true,
  );
});
