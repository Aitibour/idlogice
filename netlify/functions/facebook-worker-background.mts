import { authorized } from "../../src/lib/social/store";
import { runFacebookSlot } from "../../src/lib/social/facebook-worker";
import {
  isPublishedProduction,
  type DeployContext,
} from "../../src/lib/social/calendar";
export default async function facebookWorker(
  request: Request,
  context: DeployContext,
) {
  if (!authorized(request))
    return new Response("Unauthorized", { status: 401 });
  const body = (await request.json()) as { key: string; draft?: boolean };
  if (
    !isPublishedProduction(context) ||
    process.env.FACEBOOK_AUTOMATION_ENABLED !== "true"
  )
    return;
  await runFacebookSlot(body.key, body.draft === true);
}
