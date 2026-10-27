import { COMPANY_URN } from "./calendar.ts";

const API = "https://api.linkedin.com/rest";
export function toLinkedInText(text: string) {
  // LinkedIn's little-text grammar reserves @ and parentheses, including in email/job titles.
  return text.split(/(#[A-Za-z][A-Za-z0-9_]*)/g).map((part) =>
    /^#[A-Za-z][A-Za-z0-9_]*$/.test(part) ? `{hashtag|\\#|${part.slice(1)}}` :
      part.replace(/[|{}@\[\]()<>#\\*_~]/g, "\\$&"),
  ).join("");
}
export function linkedInHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json",
    "LinkedIn-Version": process.env.LINKEDIN_API_VERSION ?? "202610", "X-Restli-Protocol-Version": "2.0.0" };
}

export async function uploadSocialImage(token: string, bytes: Buffer) {
  const headers = linkedInHeaders(token);
  const response = await fetch(`${API}/images?action=initializeUpload`, {
    method: "POST", headers, signal: AbortSignal.timeout(20000),
    body: JSON.stringify({ initializeUploadRequest: { owner: COMPANY_URN } }),
  });
  if (!response.ok) throw new Error(`LinkedIn image initialization failed (${response.status})`);
  const { value } = await response.json() as { value: { uploadUrl: string; image: string } };
  // The signed upload URL is supplied by LinkedIn; never log it.
  const uploaded = await fetch(value.uploadUrl, { method: "PUT", signal: AbortSignal.timeout(60000),
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "image/png" }, body: new Uint8Array(bytes) });
  if (!uploaded.ok) throw new Error(`LinkedIn image upload failed (${uploaded.status})`);
  for (let attempt = 0; attempt < 15; attempt++) {
    const status = await fetch(`${API}/images/${encodeURIComponent(value.image)}`, { headers, signal: AbortSignal.timeout(15000) });
    if (!status.ok) throw new Error(`LinkedIn image status failed (${status.status})`);
    const image = await status.json() as { status: string };
    if (image.status === "AVAILABLE") return value.image;
    if (image.status === "PROCESSING_FAILED") throw new Error("LinkedIn image processing failed");
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error("LinkedIn image is not ready; no text-only post was published");
}

export class PublishError extends Error {
  uncertain: boolean;
  constructor(message: string, uncertain: boolean) { super(message); this.uncertain = uncertain; }
}

export async function publishSocialPost(token: string, text: string, imageUrn: string, altText: string) {
  if (!imageUrn.startsWith("urn:li:image:")) throw new Error("A ready LinkedIn image is required");
  let response: Response;
  try {
    response = await fetch(`${API}/posts`, { method: "POST", headers: linkedInHeaders(token),
      signal: AbortSignal.timeout(30000), body: JSON.stringify({
        author: COMPANY_URN, commentary: toLinkedInText(text), visibility: "PUBLIC",
        distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
        content: { media: { id: imageUrn, altText } }, lifecycleState: "PUBLISHED", isReshareDisabledByAuthor: false,
      }),
    });
  } catch { throw new PublishError("LinkedIn publish response unknown; check the company page before retrying", true); }
  if (!response.ok) throw new PublishError(`LinkedIn publish rejected (${response.status})`, response.status >= 500);
  const urn = response.headers.get("x-restli-id");
  if (!urn) throw new PublishError("LinkedIn accepted the post without an ID; check the company page", true);
  return urn;
}
