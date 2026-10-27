import { authorized, decrypt, socialStore, type Tokens } from "../../src/lib/social/store";
import { COMPANY_URN, TIME_ZONE, dueSlots, type DeployContext } from "../../src/lib/social/calendar";

export default async function linkedinStatus(request: Request, context: DeployContext) {
  if (!authorized(request)) return new Response("Unauthorized", { status: 401 });
  const store = socialStore();
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (key) {
    if (!/^(posts|drafts|images|draft-images)\/\d{4}-\d{2}-\d{2}\/(informative|job|question)(\.png)?$/.test(key)) return new Response("Invalid key", { status: 400 });
    if (key.endsWith(".png")) {
      const bytes = await store.get(key, { type: "arrayBuffer" });
      return new Response(bytes, { status: bytes ? 200 : 404, headers: { "Content-Type": "image/png", "Cache-Control": "no-store" } });
    }
    return Response.json(await store.get(key, { type: "json" }), { headers: { "Cache-Control": "no-store" } });
  }
  const encrypted = await store.get("credentials/linkedin", { type: "text" });
  const tokens = encrypted ? decrypt<Tokens>(encrypted) : null;
  return Response.json({ company: COMPANY_URN, timezone: TIME_ZONE, enabled: process.env.LINKEDIN_AUTOMATION_ENABLED === "true",
    deployment: { context: context.deploy.context, published: context.deploy.published, id: context.deploy.id }, imageMode: "local-branded-graphics",
    connected: !!tokens, tokenExpiresAt: tokens ? new Date(tokens.expires_at).toISOString() : null,
    due: dueSlots(new Date(), process.env.LINKEDIN_START_DATE ?? "2026-10-28"), health: await store.get("health", { type: "json" }) },
    { headers: { "Cache-Control": "no-store" } });
}
