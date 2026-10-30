import { createHash } from "node:crypto";
import { canClaimPost, executionSlot } from "./calendar.ts";
import { createContent, type SocialContent } from "./content.ts";
import { generateSocialImage, GRAPHIC_VERSION } from "./image.ts";
import { reserveTemplate } from "./template-rotation.ts";
import { socialStore } from "./store.ts";
import { xClient, xThread, publishXPart, XPublishError } from "./x.ts";
import { xStore } from "./x-store.ts";

type Record = {
  status: string;
  updatedAt: string;
  attempts: number;
  content?: SocialContent;
  parts?: string[];
  postIds?: string[];
  imageKey?: string;
  imageHash?: string;
  imageVersion?: string;
  templateId?: string;
  stockPhoto?: { id: string; page: string; photographer: string };
  error?: string;
};

export async function runXSlot(key: string, draft = false) {
  const { date, kind, ordinal } = executionSlot(
    key,
    process.env.X_START_DATE ?? process.env.LINKEDIN_START_DATE ?? "2026-10-28",
    { draft },
  );
  const store = xStore(),
    recordKey = `${draft ? "drafts" : "posts"}/${key}`;
  const previous = (await store.getWithMetadata(recordKey, {
    type: "json",
  })) as { data: Record; etag: string } | null;
  if (previous?.data.status === "publishing") {
    if (Date.now() - Date.parse(previous.data.updatedAt) > 20 * 60000)
      await store.setJSON(
        recordKey,
        {
          ...previous.data,
          status: "needs_review",
          error: "Interrupted X publication; inspect account before retrying",
        },
        { onlyIfMatch: previous.etag },
      );
    return;
  }
  if (!canClaimPost(previous?.data)) return;
  let record: Record = {
    ...previous?.data,
    status: "generating",
    error: undefined,
    attempts: (previous?.data.attempts ?? 0) + 1,
    updatedAt: new Date().toISOString(),
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
    let client: ReturnType<typeof xClient> | undefined;
    if (!draft) {
      if (!process.env.X_ACCOUNT_ID)
        throw new Error(
          "X account must be verified and pinned before enabling publication",
        );
      client = xClient();
      const account = await client.v2.me();
      if (account.data.id !== process.env.X_ACCOUNT_ID)
        throw new Error("X credentials belong to a different account");
    }
    if (!record.content) {
      const linked = (await socialStore().get(`posts/${key}`, {
        type: "json",
      })) as { content?: SocialContent } | null;
      record.content =
        linked?.content ??
        (await createContent(kind, date, ordinal, {
          isSourceUsed: async (url) =>
            !!(await store.get(
              `used-news/${createHash("sha256").update(url).digest("hex")}`,
              { type: "json" },
            )),
        }));
    }
    record.parts ??= xThread(record.content.text);
    if (!record.imageKey || record.imageVersion !== GRAPHIC_VERSION) {
      const input = {
        title: record.content.title,
        headline: record.content.graphicHeadline,
        kind,
        date,
        ordinal,
        purpose: record.content.purpose,
        news: record.content.sourceType === "news",
        policy: record.content.sourceKind === "ministerial",
      };
      const template = input.news
        ? undefined
        : await reserveTemplate(store, input, recordKey, draft);
      const image = await generateSocialImage({ ...input, template });
      record.imageKey = `${draft ? "draft-images" : "images"}/${key}.png`;
      await store.set(record.imageKey, new Uint8Array(image.bytes).buffer);
      record.imageHash = image.hash;
      record.imageVersion = GRAPHIC_VERSION;
      record.templateId = image.stockPhoto
        ? `stock:${image.stockPhoto.id}`
        : template;
      record.stockPhoto = image.stockPhoto
        ? {
            id: image.stockPhoto.id,
            page: image.stockPhoto.page,
            photographer: image.stockPhoto.photographer,
          }
        : undefined;
    }
    record = {
      ...record,
      status: "prepared",
      updatedAt: new Date().toISOString(),
    };
    await store.setJSON(recordKey, record);
    if (draft) return;
    const bytes = await store.get(record.imageKey!, { type: "arrayBuffer" });
    if (
      !bytes ||
      createHash("sha256").update(Buffer.from(bytes)).digest("hex") !==
        record.imageHash
    )
      throw new Error("Stored X image is missing or corrupted");
    record.postIds ??= [];
    const mediaId = record.postIds.length
      ? undefined
      : await client!.v2.uploadMedia(Buffer.from(bytes), {
          media_type: "image/png",
          media_category: "tweet_image",
        });
    if (!record.postIds.length && !mediaId)
      throw new Error("X requires a ready uploaded image");
    for (let i = record.postIds.length; i < record.parts!.length; i++) {
      record = {
        ...record,
        status: "publishing",
        updatedAt: new Date().toISOString(),
      };
      await store.setJSON(recordKey, record);
      const id = await publishXPart(
        client!,
        record.parts![i],
        i === 0 ? mediaId : undefined,
        record.postIds!.at(-1),
      );
      record.postIds!.push(id);
      await store.setJSON(recordKey, {
        ...record,
        updatedAt: new Date().toISOString(),
      });
    }
    record = {
      ...record,
      status: "published",
      updatedAt: new Date().toISOString(),
    };
    await store.setJSON(recordKey, record);
    if (record.content?.sourceUrl && record.content.sourceType !== "evergreen")
      await store.setJSON(
        `used-news/${createHash("sha256").update(record.content.sourceUrl).digest("hex")}`,
        { postId: record.postIds![0], publishedAt: record.updatedAt },
      );
  } catch (error) {
    const uncertain =
      record.status === "published" ||
      (record.status === "publishing" &&
        (!(error instanceof XPublishError) || error.uncertain));
    await store.setJSON(recordKey, {
      ...record,
      status: uncertain ? "needs_review" : "failed",
      error: error instanceof Error ? error.message : "X preparation failed",
      updatedAt: new Date().toISOString(),
    });
  }
}
