import { bufferQuery } from "./buffer.ts";
import { XPublishError } from "./x.ts";

export async function verifyFacebookChannel() {
  const id = process.env.BUFFER_FACEBOOK_CHANNEL_ID;
  if (!id || !process.env.FACEBOOK_PAGE_ID)
    throw new Error("Facebook Page must be pinned");
  const { channel } = await bufferQuery<{
    channel: {
      id: string;
      service: string;
      serviceId: string;
      isDisconnected: boolean;
      isLocked: boolean;
      isQueuePaused: boolean;
    };
  }>(
    "query($input:ChannelInput!){channel(input:$input){id service serviceId isDisconnected isLocked isQueuePaused}}",
    { input: { id } },
  );
  if (
    channel.id !== id ||
    channel.service !== "facebook" ||
    channel.serviceId !== process.env.FACEBOOK_PAGE_ID ||
    channel.isDisconnected ||
    channel.isLocked ||
    channel.isQueuePaused
  )
    throw new Error(
      "Verified Facebook Page is unavailable, paused or mismatched",
    );
  return channel;
}

export function facebookPostInput(
  text: string,
  imageUrl: string,
  draft = false,
) {
  if (
    !process.env.BUFFER_FACEBOOK_CHANNEL_ID ||
    !text.trim() ||
    text.length > 3000 ||
    !/^https:\/\/idlogice\.com\/\.netlify\/functions\/facebook-media\?id=[a-f0-9]{64}$/.test(
      imageUrl,
    )
  )
    throw new Error(
      "Facebook requires approved caption, pinned Page and verified image URL",
    );
  return {
    channelId: process.env.BUFFER_FACEBOOK_CHANNEL_ID,
    text,
    assets: [{ image: { url: imageUrl } }],
    schedulingType: "automatic",
    mode: draft ? "addToQueue" : "shareNow",
    saveToDraft: draft,
    needsApproval: false,
  };
}

export async function createFacebookPost(
  text: string,
  imageUrl: string,
  draft = false,
) {
  const { createPost } = await bufferQuery<{
    createPost: {
      post?: { id: string; status: string; externalLink?: string | null };
      message?: string;
    };
  }>(
    "mutation($input:CreatePostInput!){createPost(input:$input){...on PostActionSuccess{post{id status externalLink}} ...on MutationError{message}}}",
    { input: facebookPostInput(text, imageUrl, draft) },
    true,
  );
  if (!createPost.post?.id)
    throw new XPublishError(
      createPost.message ?? "Buffer returned no Facebook post ID",
      !createPost.message,
    );
  return createPost.post;
}
