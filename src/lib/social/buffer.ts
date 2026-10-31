import { XPublishError } from "./x.ts";
type BufferPost = { id: string; status: string; externalLink?: string | null };
export async function bufferQuery<T>(
  query: string,
  variables: object = {},
  mutation = false,
): Promise<T> {
  if (!process.env.BUFFER_API_KEY) throw new Error("Buffer API key missing");
  let response: Response;
  try {
    response = await fetch("https://api.buffer.com", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.BUFFER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(45000),
    });
  } catch {
    throw new XPublishError("Buffer request interrupted", mutation);
  }
  if (!response.ok)
    throw new XPublishError(
      `Buffer request failed (${response.status})`,
      mutation && response.status >= 500,
    );
  let result: { data: T; errors?: { message: string }[] };
  try {
    result = await response.json();
  } catch {
    throw new XPublishError("Unreadable Buffer response", mutation);
  }
  if (result.errors?.length)
    throw new XPublishError(
      `Buffer GraphQL request rejected: ${result.errors
        .map((e) => e.message)
        .join("; ")
        .slice(0, 400)}`,
      mutation,
    );
  return result.data;
}
export async function verifyBufferChannel() {
  const id = process.env.BUFFER_X_CHANNEL_ID;
  if (!id || !process.env.X_ACCOUNT_ID)
    throw new Error("Buffer X channel must be pinned");
  const { channel } = await bufferQuery<{
    channel: {
      id: string;
      name: string;
      service: string;
      serviceId: string;
      isDisconnected: boolean;
      isLocked: boolean;
      isQueuePaused: boolean;
    };
  }>(
    "query($input:ChannelInput!){channel(input:$input){id name service serviceId isDisconnected isLocked isQueuePaused}}",
    { input: { id } },
  );
  if (
    channel.service !== "twitter" ||
    channel.serviceId !== process.env.X_ACCOUNT_ID ||
    channel.name.toLowerCase() !== "idlogicecanada"
  )
    throw new Error("Buffer channel does not match IDLOGICE X account");
  if (channel.isDisconnected || channel.isLocked || channel.isQueuePaused)
    throw new Error("Buffer X channel is disconnected, locked or paused");
  return channel;
}
export function bufferPostInput(
  parts: string[],
  imageUrl: string,
  draft = false,
) {
  if (!parts.length || !/^https:\/\/idlogice\.com\//.test(imageUrl))
    throw new Error("Buffer requires caption and IDLOGICE image URL");
  const assets = [{ image: { url: imageUrl } }];
  return {
    channelId: process.env.BUFFER_X_CHANNEL_ID,
    schedulingType: "automatic",
    mode: draft ? "addToQueue" : "shareNow",
    saveToDraft: draft,
    needsApproval: false,
    text: parts[0],
    assets,
    metadata: {
      twitter: {
        thread: parts.map((text, i) => ({
          text,
          assets: i === 0 ? assets : [],
        })),
      },
    },
  };
}
export async function createBufferPost(
  parts: string[],
  imageUrl: string,
  draft = false,
) {
  const input = bufferPostInput(parts, imageUrl, draft);
  const { createPost } = await bufferQuery<{
    createPost: { post?: BufferPost; message?: string };
  }>(
    "mutation($input:CreatePostInput!){createPost(input:$input){...on PostActionSuccess{post{id status externalLink}} ...on MutationError{message}}}",
    { input },
    true,
  );
  if (!createPost.post?.id)
    throw new XPublishError(
      createPost.message ?? "Buffer returned no post ID",
      !createPost.message,
    );
  return createPost.post;
}
export async function getBufferPost(id: string) {
  const result = await bufferQuery<{ post: BufferPost }>(
    "query($input:PostInput!){post(input:$input){id status externalLink}}",
    { input: { id } },
  );
  return result.post;
}
