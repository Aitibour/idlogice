import { COMPANY_URN } from "../../src/lib/social/calendar";
import { linkedInHeaders } from "../../src/lib/social/linkedin";
import { saveTokens, socialStore } from "../../src/lib/social/store";

export default async function linkedinCallback(request: Request) {
  const params = new URL(request.url).searchParams;
  const state = params.get("state") ?? "";
  const cookie = /(?:^|;\s*)idlogice_li_state=([^;]+)/.exec(request.headers.get("cookie") ?? "")?.[1];
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow",
    "Set-Cookie": "idlogice_li_state=; HttpOnly; Secure; SameSite=Lax; Path=/api/linkedin; Max-Age=0" };
  if (!/^[a-f0-9]{64}$/.test(state) || cookie !== state) return new Response("Invalid OAuth state. Restart the connection.", { status: 403, headers });
  const store = socialStore();
  const pending = await store.get(`oauth/${state}`, { type: "json" }) as { expiresAt: number } | null;
  if (!pending || pending.expiresAt < Date.now()) return new Response("Authorization expired. Restart the connection.", { status: 403, headers });
  const consumed = await store.setJSON(`oauth-used/${state}`, {}, { onlyIfNew: true });
  if (!consumed.modified) return new Response("Authorization already used", { status: 403, headers });
  if (params.has("error") || !params.get("code")) return new Response("LinkedIn authorization was not completed. Check the app is enabled and has Community Management API access.", { status: 400, headers });
  const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST", signal: AbortSignal.timeout(20000), headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", code: params.get("code")!,
      redirect_uri: "https://idlogice.com/api/linkedin/callback", client_id: process.env.LINKEDIN_CLIENT_ID ?? "",
      client_secret: process.env.LINKEDIN_CLIENT_SECRET ?? "" }),
  });
  if (!response.ok) return new Response(`LinkedIn token exchange failed (${response.status}). Verify the app credentials and enabled status.`, { status: 502, headers });
  const data = await response.json();
  const roles = await fetch("https://api.linkedin.com/rest/organizationAcls?q=roleAssignee&state=APPROVED", {
    headers: linkedInHeaders(data.access_token), signal: AbortSignal.timeout(20000),
  });
  const acls = roles.ok ? await roles.json() as { elements?: { organization: string; role: string }[] } : null;
  if (!acls?.elements?.some((r) => r.organization === COMPANY_URN && ["ADMINISTRATOR", "CONTENT_ADMIN"].includes(r.role))) {
    return new Response("This LinkedIn account does not have verified publishing access to the IDLOGICE company page. Sign in as its page administrator.", { status: 403, headers });
  }
  await saveTokens(data);
  await store.setJSON("health", { status: "connected", connectedAt: new Date().toISOString() });
  return new Response("IDLOGICE company page connected. Scheduled English posts can now publish with generated images and your booking, email, and phone CTA. You can close this tab.", { headers });
}
export const config = { path: "/api/linkedin/callback" };
