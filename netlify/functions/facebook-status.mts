import { authorized } from "../../src/lib/social/store";
import { facebookStore } from "../../src/lib/social/facebook-store";
import { TIME_ZONE, type DeployContext } from "../../src/lib/social/calendar";
export default async function facebookStatus(
  request: Request,
  context: DeployContext,
) {
  if (!authorized(request))
    return new Response("Unauthorized", { status: 401 });
  const store = facebookStore();
  const key = new URL(request.url).searchParams.get("key");
  if (key) {
    if (
      !/^(posts|drafts)\/\d{4}-\d{2}-\d{2}\/(informative|job|question)$/.test(
        key,
      )
    )
      return new Response("Invalid key", { status: 400 });
    return Response.json(await store.get(key, { type: "json" }), {
      headers: { "Cache-Control": "no-store" },
    });
  }
  return Response.json(
    {
      enabled: process.env.FACEBOOK_AUTOMATION_ENABLED === "true",
      pageId: process.env.FACEBOOK_PAGE_ID,
      channelId: process.env.BUFFER_FACEBOOK_CHANNEL_ID,
      timezone: TIME_ZONE,
      deployment: {
        id: context.deploy.id,
        published: context.deploy.published,
      },
      health: await store.get("health", { type: "json" }),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
