import {
  dueSlots,
  isPublishedProduction,
  type DeployContext,
} from "../../src/lib/social/calendar";
import { facebookStore } from "../../src/lib/social/facebook-store";
export default async function facebookScheduler(
  _request: Request,
  context: DeployContext,
) {
  if (
    !isPublishedProduction(context) ||
    process.env.FACEBOOK_AUTOMATION_ENABLED !== "true"
  )
    return;
  if (!process.env.FACEBOOK_PAGE_ID || !process.env.BUFFER_FACEBOOK_CHANNEL_ID)
    throw new Error("Facebook Page configuration missing");
  for (const slot of dueSlots(
    new Date(),
    process.env.FACEBOOK_START_DATE ??
      process.env.LINKEDIN_START_DATE ??
      "2026-10-28",
  )) {
    const response = await fetch(
      `${process.env.URL}/.netlify/functions/facebook-worker-background`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SOCIAL_AUTOMATION_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: slot.key }),
        signal: AbortSignal.timeout(10000),
      },
    );
    if (response.status !== 202)
      throw new Error(`Facebook worker dispatch failed (${response.status})`);
  }
  await facebookStore().setJSON("health", {
    status: "scheduled",
    checkedAt: new Date().toISOString(),
  });
}
// Run after LinkedIn so the matching edition is usually ready; retry every half hour.
export const config = { schedule: "10,40 * * * *" };
