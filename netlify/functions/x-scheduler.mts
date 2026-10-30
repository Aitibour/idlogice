import {
  dueSlots,
  isPublishedProduction,
  type DeployContext,
} from "../../src/lib/social/calendar";
import { xStore } from "../../src/lib/social/x-store";

export default async function xScheduler(
  _request: Request,
  context: DeployContext,
) {
  if (
    !isPublishedProduction(context) ||
    process.env.X_AUTOMATION_ENABLED !== "true"
  )
    return;
  const store = xStore();
  if (!process.env.X_ACCOUNT_ID) {
    await store.setJSON("health", {
      status: "account_verification_required",
      checkedAt: new Date().toISOString(),
    });
    return;
  }
  for (const slot of dueSlots(
    new Date(),
    process.env.X_START_DATE ?? process.env.LINKEDIN_START_DATE ?? "2026-10-28",
  )) {
    const response = await fetch(
      `${process.env.URL}/.netlify/functions/x-worker-background`,
      {
        method: "POST",
        signal: AbortSignal.timeout(10000),
        headers: {
          Authorization: `Bearer ${process.env.SOCIAL_AUTOMATION_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: slot.key }),
      },
    );
    if (response.status !== 202)
      throw new Error(`X worker dispatch failed (${response.status})`);
  }
  await store.setJSON("health", {
    status: "scheduled",
    checkedAt: new Date().toISOString(),
  });
}
export const config = { schedule: "0,30 * * * *" };
