import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export function verifyTwilioRequest(req: NextRequest, body: string): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) return process.env.NODE_ENV !== "production";

  const signature = req.headers.get("x-twilio-signature") ?? "";
  if (!signature) return false;

  const params: Record<string, string> = {};
  new URLSearchParams(body).forEach((value, key) => {
    params[key] = value;
  });
  const sortedParams = Object.keys(params).sort().map((key) => key + params[key]).join("");
  const expected = createHmac("sha1", authToken)
    .update(req.url + sortedParams, "utf8")
    .digest("base64");

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}
