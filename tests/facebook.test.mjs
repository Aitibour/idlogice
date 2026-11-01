import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  facebookPostInput,
  verifyFacebookChannel,
  createFacebookPost,
} from "../src/lib/social/facebook.ts";
import { runFacebookSlot } from "../src/lib/social/facebook-worker.ts";
import { XPublishError } from "../src/lib/social/x.ts";
process.env.BUFFER_FACEBOOK_CHANNEL_ID = "fb-channel";
process.env.FACEBOOK_PAGE_ID = "page";
process.env.BUFFER_API_KEY = "test";
const bytes = Buffer.from("verified image");
const hash = createHash("sha256").update(bytes).digest("hex");
const imageUrl =
  "https://idlogice.com/.netlify/functions/facebook-media?id=" + hash;
const key = "2026-11-24/informative";
function fixture(initial = null, linked = true) {
  let current = initial,
    submissions = 0;
  const source = {
    status: "published",
    content: {
      title: "Verified topic",
      text: "Approved caption and contacts #Canada",
      checkedAt: new Date().toISOString(),
    },
    imageKey: "image",
    imageHash: hash,
  };
  const deps = {
    store: {
      getWithMetadata: async () =>
        current ? { data: current, etag: "v1" } : null,
      setJSON: async (k, v) => {
        current = v;
        return { modified: true };
      },
      set: async () => {},
    },
    linkedin: {
      get: async (k) => (k === "image" ? bytes : linked ? source : null),
    },
    verify: async () => {},
    get: async () => ({ id: "post", status: "sent" }),
    create: async (text, url, draft) => {
      submissions++;
      assert.equal(text, source.content.text);
      assert.equal(url, imageUrl);
      assert.equal(draft, true);
      return { id: "post", status: "draft" };
    },
  };
  return { deps, record: () => current, count: () => submissions };
}
test("Facebook input keeps the full caption and image, without X thread metadata", () => {
  const input = facebookPostInput("Full caption", imageUrl);
  assert.equal(input.channelId, "fb-channel");
  assert.equal(input.mode, "shareNow");
  assert.equal(input.saveToDraft, false);
  assert.equal(input.metadata, undefined);
  assert.equal(facebookPostInput("caption", imageUrl, true).saveToDraft, true);
  for (const url of [
    "https://other.example/image.png",
    "https://idlogice.com/.netlify/functions/facebook-media?id=../../credentials",
  ])
    assert.throws(() => facebookPostInput("caption", url));
  assert.throws(() => facebookPostInput("", imageUrl));
});
test("Facebook channel verification rejects other Pages and unavailable channels", async () => {
  const original = fetch;
  const channel = {
    id: "fb-channel",
    service: "facebook",
    serviceId: "page",
    isDisconnected: false,
    isLocked: false,
    isQueuePaused: false,
  };
  try {
    globalThis.fetch = async () => Response.json({ data: { channel } });
    await verifyFacebookChannel();
    for (const change of [
      { service: "twitter" },
      { serviceId: "other" },
      { id: "other" },
      { isDisconnected: true },
      { isLocked: true },
      { isQueuePaused: true },
    ]) {
      globalThis.fetch = async () =>
        Response.json({ data: { channel: { ...channel, ...change } } });
      await assert.rejects(verifyFacebookChannel());
    }
  } finally {
    globalThis.fetch = original;
  }
});
test("waits for LinkedIn without consuming attempts; claims only one matching edition", async () => {
  const waiting = fixture(null, false);
  await runFacebookSlot(key, true, waiting.deps);
  assert.equal(waiting.record(), null);
  assert.equal(waiting.count(), 0);
  const f = fixture();
  await runFacebookSlot(key, true, f.deps);
  assert.equal(f.record().status, "draft");
  assert.equal(f.count(), 1);
  await runFacebookSlot(key, true, f.deps);
  assert.equal(f.count(), 1);
});
test("saved submissions poll delivery; terminal and interrupted submissions never duplicate", async () => {
  for (const status of ["published", "needs_review", "publishing"]) {
    const f = fixture({
      status,
      attempts: 1,
      updatedAt: new Date().toISOString(),
    });
    await runFacebookSlot(key, true, f.deps);
    assert.equal(f.count(), 0);
  }
  const f = fixture({
    status: "submitted",
    attempts: 1,
    bufferPostId: "post",
    updatedAt: new Date().toISOString(),
  });
  await runFacebookSlot(key, true, f.deps);
  assert.equal(f.record().status, "published");
  assert.equal(f.count(), 0);
});
test("checksum errors prevent submission; ambiguous submissions require manual review", async () => {
  const f = fixture();
  const originalGet = f.deps.linkedin.get;
  f.deps.linkedin.get = async (k) =>
    k === "image" ? Buffer.from("corrupted") : originalGet(k);
  await runFacebookSlot(key, true, f.deps);
  assert.equal(f.record().status, "failed");
  assert.equal(f.count(), 0);
  const g = fixture();
  g.deps.create = async () => {
    throw new XPublishError("Network interrupted", true);
  };
  await runFacebookSlot(key, true, g.deps);
  assert.equal(g.record().status, "needs_review");
  const h = fixture();
  h.deps.create = async () => {
    throw new XPublishError("Plan limit", false);
  };
  await runFacebookSlot(key, true, h.deps);
  assert.equal(h.record().status, "failed");
});
test("Facebook mutation preserves Buffer ID and rejected/ambiguous responses", async () => {
  const original = fetch;
  try {
    globalThis.fetch = async () =>
      Response.json({
        data: { createPost: { post: { id: "fb-post", status: "sending" } } },
      });
    assert.equal((await createFacebookPost("caption", imageUrl)).id, "fb-post");
    globalThis.fetch = async () =>
      Response.json({ data: { createPost: { message: "Plan limit" } } });
    await assert.rejects(
      createFacebookPost("caption", imageUrl),
      (e) => e.uncertain === false,
    );
    globalThis.fetch = async () => {
      throw new Error("network");
    };
    await assert.rejects(
      createFacebookPost("caption", imageUrl),
      (e) => e.uncertain === true,
    );
  } finally {
    globalThis.fetch = original;
  }
});
