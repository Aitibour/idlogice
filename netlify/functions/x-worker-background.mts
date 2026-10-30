import { authorized } from "../../src/lib/social/store";
import { runXSlot } from "../../src/lib/social/x-worker";
import {
  isPublishedProduction,
  type DeployContext,
} from "../../src/lib/social/calendar";

export default async function xWorker(
  request: Request,
  context: DeployContext,
) {
  if (!authorized(request))
    return new Response("Unauthorized", { status: 401 });
  const body = (await request.json()) as { key: string; draft?: boolean };
  const draft = body.draft === true;
  if (
    !draft &&
    (!isPublishedProduction(context) ||
      process.env.X_AUTOMATION_ENABLED !== "true")
  )
    return;
  await runXSlot(body.key, draft);
}
