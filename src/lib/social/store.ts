import { getStore } from "@netlify/blobs";
import { createCipheriv, createDecipheriv, randomBytes, timingSafeEqual } from "node:crypto";

export const socialStore = () => getStore({ name: "idlogice-linkedin", consistency: "strong" });

export function authorized(request: Request) {
  const secret = process.env.SOCIAL_AUTOMATION_SECRET;
  const auth = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  return !!secret && auth.length === expected.length && timingSafeEqual(Buffer.from(auth), Buffer.from(expected));
}

function encryptionKey() {
  const key = Buffer.from(process.env.SOCIAL_TOKEN_ENCRYPTION_KEY ?? "", "hex");
  if (key.length !== 32) throw new Error("SOCIAL_TOKEN_ENCRYPTION_KEY must be 32 random bytes in hex");
  return key;
}

export function encrypt(value: unknown) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), data]).toString("base64");
}

export function decrypt<T>(value: string): T {
  const bytes = Buffer.from(value, "base64");
  const cipher = createDecipheriv("aes-256-gcm", encryptionKey(), bytes.subarray(0, 12));
  cipher.setAuthTag(bytes.subarray(12, 28));
  return JSON.parse(Buffer.concat([cipher.update(bytes.subarray(28)), cipher.final()]).toString("utf8"));
}

export type Tokens = { access_token: string; refresh_token?: string; expires_at: number; refresh_expires_at?: number };

export async function saveTokens(data: { access_token: string; refresh_token?: string; expires_in: number; refresh_token_expires_in?: number }) {
  const tokens: Tokens = {
    access_token: data.access_token, refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
    refresh_expires_at: data.refresh_token_expires_in ? Date.now() + data.refresh_token_expires_in * 1000 : undefined,
  };
  await socialStore().set("credentials/linkedin", encrypt(tokens));
}

export async function accessToken() {
  const stored = await socialStore().get("credentials/linkedin", { type: "text" });
  const tokens = stored ? decrypt<Tokens>(stored) : null;
  if (tokens && tokens.expires_at > Date.now() + 86400000) return tokens.access_token;
  const refresh = tokens ? tokens.refresh_token : process.env.LINKEDIN_REFRESH_TOKEN;
  if (!refresh) {
    if (tokens && tokens.expires_at > Date.now()) return tokens.access_token;
    throw new Error("LinkedIn authorization required: connect the company page");
  }
  const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST", signal: AbortSignal.timeout(20000),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh,
      client_id: process.env.LINKEDIN_CLIENT_ID ?? "", client_secret: process.env.LINKEDIN_CLIENT_SECRET ?? "" }),
  });
  if (!response.ok) throw new Error(`LinkedIn refresh failed (${response.status}); reconnect the enabled LinkedIn app`);
  const data = await response.json();
  await saveTokens({ ...data, refresh_token: data.refresh_token ?? refresh });
  return data.access_token as string;
}
