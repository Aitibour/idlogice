import type { getStore } from "@netlify/blobs";

type Store = Pick<ReturnType<typeof getStore>, "setJSON" | "getWithMetadata">;

export async function reserveImage(store: Store, hash: string, recordKey: string, draft: boolean) {
  const key = `${draft ? "draft-image-hashes" : "image-hashes"}/${hash}`;
  const claim = await store.setJSON(key, { slot: recordKey }, { onlyIfNew: true });
  if (claim.modified) return;
  const existing = await store.getWithMetadata(key, { type: "json" });
  const owner = (existing?.data as { slot?: string } | undefined)?.slot;
  // Retrying an interrupted cache write for the same post is safe.
  if (owner === recordKey) return;
  // Older versions placed preview reservations in the publication namespace.
  // Promote those atomically; a preview is not a previously published image.
  if (!draft && owner?.startsWith("drafts/") && existing) {
    const promoted = await store.setJSON(key, { slot: recordKey }, { onlyIfMatch: existing.etag });
    if (promoted.modified) return;
  }
  throw new Error("Duplicate image detected; refusing to reuse a published edition");
}
