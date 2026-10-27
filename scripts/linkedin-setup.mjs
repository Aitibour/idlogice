// Configure the linked Netlify site without printing credentials.
// Run: node scripts/linkedin-setup.mjs [--credentials]
import fs from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { parseEnv } from "node:util";

const siteId = "613f23ed-2a89-4a10-9e55-2142f29d7461";
const config = JSON.parse(fs.readFileSync(path.join(process.env.APPDATA, "netlify/Config/config.json"), "utf8"));
const headers = { Authorization: `Bearer ${config.users[config.userId].auth.token}`, "Content-Type": "application/json" };
async function api(route, options = {}) {
  const response = await fetch(`https://api.netlify.com/api/v1${route}`, { ...options, headers, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Netlify API request failed (${response.status}) for ${route.split("?")[0]}`);
  return response.status === 204 ? null : response.json();
}
const site = await api(`/sites/${siteId}`);
const base = `/accounts/${site.account_id}/env`;
const query = `?site_id=${siteId}`;
const entries = await api(base + query);
async function save(key, value) {
  const old = entries.find((e) => e.key === key);
  const body = { key, values: [{ context: "all", value }] };
  if (old) await api(`${base}/${key}${query}`, { method: "PUT", body: JSON.stringify(body) });
  else await api(base + query, { method: "POST", body: JSON.stringify([body]) });
  console.log(`${key}: saved`);
}
for (const key of ["SOCIAL_AUTOMATION_SECRET", "SOCIAL_TOKEN_ENCRYPTION_KEY"]) {
  if (!entries.some((e) => e.key === key)) await save(key, randomBytes(32).toString("hex"));
}
await save("LINKEDIN_AUTOMATION_ENABLED", "true");
await save("LINKEDIN_START_DATE", "2026-10-28");
await save("LINKEDIN_API_VERSION", "202610");
if (process.argv.includes("--credentials")) {
  const local = parseEnv(fs.readFileSync(new URL("../.env.linkedin.local", import.meta.url), "utf8"));
  if (local.LINKEDIN_CLIENT_ID !== "784lavctz4gscn" || !local.LINKEDIN_CLIENT_SECRET?.trim()) throw new Error("Fill in the new app secret in .env.linkedin.local first");
  await save("LINKEDIN_CLIENT_ID", local.LINKEDIN_CLIENT_ID);
  await save("LINKEDIN_CLIENT_SECRET", local.LINKEDIN_CLIENT_SECRET.trim());
}
console.log("Configuration saved. Redeploy to apply function environment changes.");
