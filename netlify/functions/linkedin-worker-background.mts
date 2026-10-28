import { authorized } from "../../src/lib/social/store";
import { runSlot } from "../../src/lib/social/worker";
import { isPublishedProduction, type DeployContext } from "../../src/lib/social/calendar";

export default async function linkedinWorker(request: Request, context: DeployContext) {
  if (!authorized(request)) return new Response("Unauthorized", { status: 401 });
  const body = await request.json() as { key: string; draft?: boolean; publishNow?: boolean };
  const { key } = body;
  const draft = body.draft === true, publishNow = body.publishNow === true;
  if (!draft && (!isPublishedProduction(context) || process.env.LINKEDIN_AUTOMATION_ENABLED !== "true")) return;
  await runSlot(key, draft, publishNow);
}
