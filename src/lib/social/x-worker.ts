import { createHash } from "node:crypto";
import { canClaimPost, executionSlot } from "./calendar.ts";
import { createContent, type SocialContent } from "./content.ts";
import { generateSocialImage, GRAPHIC_VERSION } from "./image.ts";
import { reserveTemplate } from "./template-rotation.ts";
import { socialStore } from "./store.ts";
import { xClient, xThread, publishXPart, XPublishError } from "./x.ts";
import { xStore } from "./x-store.ts";
import { usesAgencyText } from "./agency-text.ts";
import { xCaption } from "./x-content.ts";
import {
  verifyBufferChannel,
  createBufferPost,
  getBufferPost,
} from "./buffer.ts";

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
  bufferPostId?: string;
  bufferStatus?: string;
  externalLink?: string | null;
  provider?: string;
  captionVersion?: string;
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
  if (previous?.data.bufferPostId) {
    if (
      previous.data.status === "published" ||
      previous.data.status === "needs_review"
    )
      return;
    const post = await getBufferPost(previous.data.bufferPostId);
    await store.setJSON(
      recordKey,
      {
        ...previous.data,
        status:
          post.status === "sent"
            ? "published"
            : post.status === "error"
              ? "needs_review"
              : "submitted",
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
    const useBuffer = process.env.X_PUBLISH_PROVIDER === "buffer";
    if (!draft) {
      if (!process.env.X_ACCOUNT_ID)
        throw new Error(
          "X account must be verified and pinned before enabling publication",
        );
      if (useBuffer) await verifyBufferChannel();
      else {
        client = xClient();
        const account = await client.v2.me();
        if (account.data.id !== process.env.X_ACCOUNT_ID)
          throw new Error("X credentials belong to a different account");
      }
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
    if (!record.postIds?.length && record.captionVersion !== "x-distinct-v1") {
      record.parts = xThread(xCaption(record.content, kind));
      record.captionVersion = "x-distinct-v1";
    }
    record.parts ??= xThread(xCaption(record.content, kind));
    if (!record.imageKey || record.imageVersion !== GRAPHIC_VERSION) {
      const linkedImage = (await socialStore().get(`posts/${key}`, {
        type: "json",
      })) as {
        imageKey?: string;
        imageHash?: string;
        imageVersion?: string;
        templateId?: string;
        content?: SocialContent;
      } | null;
      const sharedBytes =
        linkedImage?.imageKey &&
        linkedImage.imageVersion === GRAPHIC_VERSION &&
        linkedImage.content?.title === record.content.title
          ? await socialStore().get(linkedImage.imageKey, {
              type: "arrayBuffer",
            })
          : null;
      if (
        sharedBytes &&
        createHash("sha256").update(Buffer.from(sharedBytes)).digest("hex") ===
          linkedImage?.imageHash
      ) {
        record.imageKey = `${draft ? "draft-images" : "images"}/${key}.png`;
        await store.set(record.imageKey, sharedBytes);
        record.imageHash = linkedImage.imageHash;
        record.imageVersion = GRAPHIC_VERSION;
        record.templateId = linkedImage.templateId;
      } else {
        const input = {
          title: record.content.title,
          caption: record.content.text,
          articleUrl: record.content.articleUrl,
          sourcePublishedAt: record.content.sourcePublishedAt,
          headline: record.content.graphicHeadline,
          kind,
          date,
          ordinal,
          purpose: record.content.purpose,
          news: record.content.sourceType === "news",
          policy: record.content.sourceKind === "ministerial",
        };
        const template =
          input.news || usesAgencyText(input)
            ? undefined
            : await reserveTemplate(store, input, recordKey, draft);
        const image = await generateSocialImage({ ...input, template });
        record.imageKey = `${draft ? "draft-images" : "images"}/${key}.png`;
        await store.set(record.imageKey, new Uint8Array(image.bytes).buffer);
        record.imageHash = image.hash;
        record.imageVersion = GRAPHIC_VERSION;
        record.templateId =
          image.style === "agency-text"
            ? "agency-text"
            : image.stockPhoto
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
    if (useBuffer) {
      if (record.postIds.length)
        throw new Error(
          "A partially published direct X thread cannot switch providers",
        );
      await store.set(`public-media/${record.imageHash}.png`, bytes);
      const imageUrl = `https://idlogice.com/.netlify/functions/buffer-media?id=${record.imageHash}`;
      record = {
        ...record,
        status: "publishing",
        provider: "buffer",
        updatedAt: new Date().toISOString(),
      };
      await store.setJSON(recordKey, record);
      const post = await createBufferPost(record.parts!, imageUrl);
      record = {
        ...record,
        bufferPostId: post.id,
        bufferStatus: post.status,
        externalLink: post.externalLink,
        status: post.status === "sent" ? "published" : "submitted",
        updatedAt: new Date().toISOString(),
      };
      await store.setJSON(recordKey, record);
      if (
        record.content?.sourceUrl &&
        record.content.sourceType !== "evergreen"
      )
        await store.setJSON(
          `used-news/${createHash("sha256").update(record.content.sourceUrl).digest("hex")}`,
          { bufferPostId: post.id, submittedAt: record.updatedAt },
        );
      return;
    }
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
