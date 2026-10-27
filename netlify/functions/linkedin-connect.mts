import { randomBytes, timingSafeEqual } from "node:crypto";
import { socialStore } from "../../src/lib/social/store";

export default async function linkedinConnect(request: Request) {
  const key = new URL(request.url).searchParams.get("key") ?? "";
  const expected = process.env.SOCIAL_AUTOMATION_SECRET ?? "";
  if (!expected || key.length !== expected.length || !timingSafeEqual(Buffer.from(key), Buffer.from(expected))) return new Response("Unauthorized", { status: 401 });
  if (!process.env.LINKEDIN_CLIENT_ID) return new Response("LinkedIn client ID is not configured", { status: 503 });
  const state = randomBytes(32).toString("hex");
  await socialStore().setJSON(`oauth/${state}`, { expiresAt: Date.now() + 10 * 60000 }, { onlyIfNew: true });
  const params = new URLSearchParams({ response_type: "code", client_id: process.env.LINKEDIN_CLIENT_ID,
    redirect_uri: "https://idlogice.com/api/linkedin/callback", state,
    scope: "w_organization_social rw_organization_admin" });
  return new Response(null, { status: 302, headers: {
    Location: `https://www.linkedin.com/oauth/v2/authorization?${params}`,
    "Set-Cookie": `idlogice_li_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/api/linkedin; Max-Age=600`,
    "Cache-Control": "no-store", "Referrer-Policy": "no-referrer",
  } });
}
export const config = { path: "/api/linkedin/connect" };
