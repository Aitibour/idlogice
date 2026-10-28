import { createHash } from "node:crypto";
import { canClaimPost, executionSlot } from "./calendar";
import { createContent, type SocialContent } from "./content";
import { generateSocialImage } from "./image";
import { publishSocialPost, PublishError, uploadSocialImage } from "./linkedin";
import { accessToken, socialStore } from "./store";

export type PostRecord = {
  status: "generating" | "prepared" | "publishing" | "published" | "failed" | "needs_review";
  updatedAt: string; attempts: number; content?: SocialContent; imageKey?: string;
  imageHash?: string; imageUrn?: string; postUrn?: string; error?: string;
};

export async function runSlot(key: string, draft = false, publishNow = false) {
  const slot = executionSlot(key, process.env.LINKEDIN_START_DATE ?? "2026-10-28", { draft, publishNow });
  const { date, kind, ordinal } = slot;
  const store = socialStore();
  const recordKey = `${draft ? "drafts" : "posts"}/${key}`;
  const previous = await store.getWithMetadata(recordKey, { type: "json" }) as { data: PostRecord; etag: string } | null;
  if (previous?.data.status === "published" || previous?.data.status === "needs_review") return;
  // An interrupted network publish can have succeeded. Never publish it again automatically.
  if (previous?.data.status === "publishing") {
    if (Date.now() - Date.parse(previous.data.updatedAt) > 20 * 60000) {
      await store.setJSON(recordKey, { ...previous.data, status: "needs_review", error: "Interrupted publish: inspect LinkedIn before retrying" }, { onlyIfMatch: previous.etag });
    }
    return;
  }
  if (!canClaimPost(previous?.data)) return;
  let record: PostRecord = { ...previous?.data, error: undefined, status: "generating", updatedAt: new Date().toISOString(), attempts: (previous?.data.attempts ?? 0) + 1 };
  const lock = await store.setJSON(recordKey, record, previous ? { onlyIfMatch: previous.etag } : { onlyIfNew: true });
  if (!lock.modified) return;
  try {
    // Check authorization before preparing assets. Draft mode never publishes.
    const token = draft ? "" : await accessToken();
    record.content ??= await createContent(kind, date, ordinal);
    if (!record.imageKey) {
      const image = await generateSocialImage({ title: record.content.title, headline: record.content.graphicHeadline, kind, date, ordinal });
      const reservation = await store.setJSON(`image-hashes/${image.hash}`, { slot: recordKey }, { onlyIfNew: true });
      if (!reservation.modified) throw new Error("Duplicate image detected; refusing to reuse it");
      record.imageHash = image.hash;
      record.imageKey = `${draft ? "draft-images" : "images"}/${key}.png`;
      await store.set(record.imageKey, new Uint8Array(image.bytes).buffer);
    }
    record.status = "prepared";
    await store.setJSON(recordKey, { ...record, updatedAt: new Date().toISOString() });
    if (draft) return;
    const image = await store.get(record.imageKey, { type: "arrayBuffer" });
    if (!image || createHash("sha256").update(Buffer.from(image)).digest("hex") !== record.imageHash) throw new Error("Stored image missing or corrupted");
    const content = record.content;
    const imageUrn = record.imageUrn ?? await uploadSocialImage(token, Buffer.from(image));
    record.imageUrn = imageUrn;
    record = { ...record, status: "publishing", updatedAt: new Date().toISOString() };
    await store.setJSON(recordKey, record);
    const postUrn = await publishSocialPost(token, content.text, imageUrn, content.title);
    record = { ...record, postUrn, status: "published", updatedAt: new Date().toISOString() };
    await store.setJSON(recordKey, record);
    console.log("LinkedIn post published", key, postUrn);
  } catch (error) {
    // A failed checkpoint AFTER a successful POST must never lead to duplicate posts.
    const uncertain = (error instanceof PublishError && error.uncertain) || record.status === "published" || (record.status === "publishing" && !(error instanceof PublishError));
    record = { ...record, status: uncertain ? "needs_review" : "failed", updatedAt: new Date().toISOString(), error: error instanceof Error ? error.message : "Unknown failure" };
    await store.setJSON(recordKey, record);
    console.error("LinkedIn slot held", key, record.error);
  }
}
