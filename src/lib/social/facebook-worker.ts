import { createHash } from "node:crypto";
import { canClaimPost, executionSlot } from "./calendar.ts";
import { socialStore } from "./store.ts";
import { facebookStore } from "./facebook-store.ts";
import { verifyFacebookChannel, createFacebookPost } from "./facebook.ts";
import { getBufferPost } from "./buffer.ts";
import { XPublishError } from "./x.ts";
import type { SocialContent } from "./content.ts";

type FacebookRecord = {
  status: string;
  updatedAt: string;
  attempts: number;
  bufferPostId?: string;
  bufferStatus?: string;
  externalLink?: string | null;
  content?: SocialContent;
  imageHash?: string;
  error?: string;
};
type LinkedRecord = {
  status: string;
  content?: SocialContent;
  imageKey?: string;
  imageHash?: string;
};
export const deliveryStatus = (status: string) =>
  status === "sent"
    ? "published"
    : status === "error"
      ? "needs_review"
      : "submitted";
const dependencies = () => ({
  store: facebookStore(),
  linkedin: socialStore(),
  verify: verifyFacebookChannel,
  create: createFacebookPost,
  get: getBufferPost,
});

export async function runFacebookSlot(
  key: string,
  draft = false,
  deps = dependencies(),
) {
  executionSlot(
    key,
    process.env.FACEBOOK_START_DATE ??
      process.env.LINKEDIN_START_DATE ??
      "2026-10-28",
    { draft },
  );
  const { store, linkedin } = deps;
  const recordKey = `${draft ? "drafts" : "posts"}/${key}`;
  const previous = (await store.getWithMetadata(recordKey, {
    type: "json",
  })) as { data: FacebookRecord; etag: string } | null;
  if (["published", "needs_review"].includes(previous?.data.status ?? ""))
    return;
  if (previous?.data.bufferPostId) {
    const post = await deps.get(previous.data.bufferPostId);
    await store.setJSON(
      recordKey,
      {
        ...previous.data,
        status: deliveryStatus(post.status),
        bufferStatus: post.status,
        externalLink: post.externalLink,
        updatedAt: new Date().toISOString(),
      },
      { onlyIfMatch: previous.etag },
    );
    return;
  }
  if (previous?.data.status === "publishing") {
    if (Date.now() - Date.parse(previous.data.updatedAt) > 20 * 60000)
      await store.setJSON(
        recordKey,
        {
          ...previous.data,
          status: "needs_review",
          error:
            "Interrupted Facebook submission; inspect Buffer before retrying",
        },
        { onlyIfMatch: previous.etag },
      );
    return;
  }
  if (!canClaimPost(previous?.data)) return;
  // Wait for the matching published LinkedIn edition, without spending retry attempts.
  const linked = (await linkedin.get(`posts/${key}`, {
    type: "json",
  })) as LinkedRecord | null;
  if (
    linked?.status !== "published" ||
    !linked.content?.text ||
    !linked.imageKey ||
    !linked.imageHash
  )
    return;
  let record: FacebookRecord = {
    status: "generating",
    attempts: (previous?.data.attempts ?? 0) + 1,
    updatedAt: new Date().toISOString(),
    content: linked.content,
    imageHash: linked.imageHash,
  };
  if (
    !(
      await store.setJSON(
        recordKey,
        record,
        previous ? { onlyIfMatch: previous.etag } : { onlyIfNew: true },
      )
    ).modified
  )
    return;
  try {
    await deps.verify();
    const bytes = await linkedin.get(linked.imageKey, { type: "arrayBuffer" });
    if (
      !bytes ||
      createHash("sha256").update(Buffer.from(bytes)).digest("hex") !==
        linked.imageHash
    )
      throw new Error("LinkedIn image missing or corrupted");
    await store.set(`public-media/${linked.imageHash}.png`, bytes);
    const imageUrl = `https://idlogice.com/.netlify/functions/facebook-media?id=${linked.imageHash}`;
    record = {
      ...record,
      status: "publishing",
      updatedAt: new Date().toISOString(),
    };
    await store.setJSON(recordKey, record);
    const post = await deps.create(linked.content.text, imageUrl, draft);
    record = {
      ...record,
      bufferPostId: post.id,
      bufferStatus: post.status,
      externalLink: post.externalLink,
      status: draft ? "draft" : deliveryStatus(post.status),
      updatedAt: new Date().toISOString(),
    };
    await store.setJSON(recordKey, record);
  } catch (error) {
    const uncertain =
      !!record.bufferPostId ||
      (record.status === "publishing" &&
        (!(error instanceof XPublishError) || error.uncertain));
    await store.setJSON(recordKey, {
      ...record,
      status: uncertain ? "needs_review" : "failed",
      error:
        error instanceof Error ? error.message : "Facebook publication failed",
      updatedAt: new Date().toISOString(),
    });
  }
}
