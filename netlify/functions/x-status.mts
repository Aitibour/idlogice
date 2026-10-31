import { authorized } from "../../src/lib/social/store";
import { xStore } from "../../src/lib/social/x-store";
import { TIME_ZONE, type DeployContext } from "../../src/lib/social/calendar";

export default async function xStatus(
  request: Request,
  context: DeployContext,
) {
  if (!authorized(request))
    return new Response("Unauthorized", { status: 401 });
  const store = xStore(),
    key = new URL(request.url).searchParams.get("key");
  if (key) {
    if (
      !/^(posts|drafts|images|draft-images)\/\d{4}-\d{2}-\d{2}\/(informative|job|question)(\.png)?$/.test(
        key,
      )
    )
      return new Response("Invalid key", { status: 400 });
    if (key.endsWith(".png")) {
      const bytes = await store.get(key, { type: "arrayBuffer" });
      return new Response(bytes, {
        status: bytes ? 200 : 404,
        headers: { "Content-Type": "image/png", "Cache-Control": "no-store" },
      });
    }
    return Response.json(await store.get(key, { type: "json" }), {
      headers: { "Cache-Control": "no-store" },
    });
  }
  return Response.json(
    {
      enabled: process.env.X_AUTOMATION_ENABLED === "true",
      provider: process.env.X_PUBLISH_PROVIDER ?? "direct",
      bufferChannelId: process.env.BUFFER_X_CHANNEL_ID ?? null,
      accountId: process.env.X_ACCOUNT_ID ?? null,
      timezone: TIME_ZONE,
      deployment: context.deploy,
      credentialsConfigured: [
        "TWITTER_API_KEY",
        "TWITTER_API_SECRET",
        "TWITTER_ACCESS_TOKEN",
        "TWITTER_ACCESS_SECRET",
      ].every((key) => !!process.env[key]),
      health: await store.get("health", { type: "json" }),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
