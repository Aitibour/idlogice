import test from "node:test";
import assert from "node:assert/strict";
import {
  bufferPostInput,
  verifyBufferChannel,
  createBufferPost,
  getBufferPost,
} from "../src/lib/social/buffer.ts";
test("Buffer threads retain every part and attach the image to the first part only", () => {
  const parts = ["Official headline", "Scoped details", "CTA and hashtags"];
  const input = bufferPostInput(
    parts,
    "https://idlogice.com/.netlify/functions/buffer-media?id=" + "a".repeat(64),
  );
  assert.equal(input.mode, "shareNow");
  assert.equal(input.saveToDraft, false);
  assert.equal(input.text, parts[0]);
  assert.deepEqual(
    input.metadata.twitter.thread.map((p) => p.text),
    parts,
  );
  assert.equal(input.metadata.twitter.thread[0].assets.length, 1);
  assert.equal(input.metadata.twitter.thread[1].assets.length, 0);
  assert.equal(
    bufferPostInput(parts, "https://idlogice.com/example.png", true)
      .saveToDraft,
    true,
  );
  assert.throws(
    () => bufferPostInput(parts, "https://elsewhere.example/photo.png"),
    /image/,
  );
});
test("Buffer pins the intended X account and never accepts a disconnected channel", async () => {
  const original = fetch;
  process.env.BUFFER_API_KEY = "test";
  process.env.BUFFER_X_CHANNEL_ID = "channel";
  process.env.X_ACCOUNT_ID = "1829195467151822848";
  const channel = {
    id: "channel",
    name: "idlogicecanada",
    service: "twitter",
    serviceId: process.env.X_ACCOUNT_ID,
    isDisconnected: false,
    isLocked: false,
    isQueuePaused: false,
  };
  try {
    globalThis.fetch = async () => Response.json({ data: { channel } });
    assert.equal((await verifyBufferChannel()).id, "channel");
    for (const change of [
      { service: "linkedin" },
      { serviceId: "other" },
      { isDisconnected: true },
      { isLocked: true },
      { isQueuePaused: true },
    ]) {
      globalThis.fetch = async () =>
        Response.json({ data: { channel: { ...channel, ...change } } });
      await assert.rejects(verifyBufferChannel());
    }
  } finally {
    globalThis.fetch = original;
  }
});
test("Buffer preserves returned IDs and distinguishes rejected mutations from uncertain submissions", async () => {
  const original = fetch;
  process.env.BUFFER_API_KEY = "test";
  try {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, "https://api.buffer.com");
      assert.equal(options.headers.Authorization, "Bearer test");
      return Response.json({
        data: { createPost: { post: { id: "post-a", status: "sending" } } },
      });
    };
    assert.equal(
      (await createBufferPost(["News"], "https://idlogice.com/image.png")).id,
      "post-a",
    );
    globalThis.fetch = async () =>
      Response.json({
        data: { createPost: { message: "Plan limit reached" } },
      });
    await assert.rejects(
      createBufferPost(["News"], "https://idlogice.com/image.png"),
      (e) => e.uncertain === false,
    );
    globalThis.fetch = async () => {
      throw new Error("network");
    };
    await assert.rejects(
      createBufferPost(["News"], "https://idlogice.com/image.png"),
      (e) => e.uncertain === true,
    );
    globalThis.fetch = async () =>
      Response.json({
        data: {
          post: {
            id: "post-a",
            status: "sent",
            externalLink: "https://x.com/idlogicecanada/status/1",
          },
        },
      });
    assert.equal((await getBufferPost("post-a")).status, "sent");
  } finally {
    globalThis.fetch = original;
  }
});
