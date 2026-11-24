import { dueSlots, isPublishedProduction, type DeployContext } from "../../src/lib/social/calendar";
import { socialStore, type Tokens, decrypt } from "../../src/lib/social/store";

// Netlify scheduled functions cannot be invoked through their public HTTP URL.
export default async function linkedinScheduler(_request: Request, context: DeployContext) {
  if (!isPublishedProduction(context) || process.env.LINKEDIN_AUTOMATION_ENABLED !== "true") return;
  const store = socialStore();
  const encrypted = await store.get("credentials/linkedin", { type: "text" });
  const tokens = encrypted ? decrypt<Tokens>(encrypted) : null;
  if (!tokens) {
    await store.setJSON("health", { status: "authorization_required", checkedAt: new Date().toISOString() });
    return;
  }
  for (const slot of dueSlots(new Date(), process.env.LINKEDIN_START_DATE ?? "2026-10-28")) {
    const response = await fetch(`${process.env.URL}/.netlify/functions/linkedin-worker-background`, {
      method: "POST", signal: AbortSignal.timeout(10000),
      headers: { Authorization: `Bearer ${process.env.SOCIAL_AUTOMATION_SECRET}`, "Content-Type": "application/json" },
      body: JSON.stringify({ key: slot.key }),
    });
    if (response.status !== 202) throw new Error(`LinkedIn worker dispatch failed (${response.status})`);
  }
  await store.setJSON("health", { status: "scheduled", checkedAt: new Date().toISOString(), tokenExpiresAt: new Date(tokens.expires_at).toISOString() });
}

// Retired: scheduled publishing now runs in Aitibour/idlogice-linkedin-automation.
