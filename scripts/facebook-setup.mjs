import fs from "node:fs";
import path from "node:path";
import { parseEnv } from "node:util";
const local = parseEnv(
  fs.readFileSync(new URL("../.env.buffer.local", import.meta.url), "utf8"),
);
if (!local.BUFFER_API_KEY) throw new Error("Buffer key missing");
const channelId = "6ae6a81be29c69a1711e4766",
  accountId = "1399791626553928";
const response = await fetch("https://api.buffer.com", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${local.BUFFER_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query:
      "query($input:ChannelInput!){channel(input:$input){id name service serviceId isDisconnected isLocked isQueuePaused}}",
    variables: { input: { id: channelId } },
  }),
  signal: AbortSignal.timeout(30000),
});
const channel = (await response.json()).data?.channel;
if (
  !channel ||
  channel.service !== "facebook" ||
  channel.serviceId !== accountId ||
  channel.name.trim().toLowerCase() !== "idlogice immigration canada" ||
  channel.isDisconnected ||
  channel.isLocked ||
  channel.isQueuePaused
)
  throw new Error("Buffer IDLOGICE Facebook connection could not be verified");
console.log("Verified Buffer channel: IDLOGICE Facebook Page");
const site = "613f23ed-2a89-4a10-9e55-2142f29d7461";
const config = JSON.parse(
  fs.readFileSync(
    path.join(process.env.APPDATA, "netlify/Config/config.json"),
    "utf8",
  ),
);
const headers = {
  Authorization: `Bearer ${config.users[config.userId].auth.token}`,
  "Content-Type": "application/json",
};
const base =
    "https://api.netlify.com/api/v1/accounts/59026eb6cf321c7359e9f482/env",
  query = `?site_id=${site}`;
const entries = await fetch(base + query, {
  headers,
  signal: AbortSignal.timeout(30000),
}).then((r) => r.json());
for (const [key, value] of Object.entries({
  BUFFER_API_KEY: local.BUFFER_API_KEY,
  BUFFER_FACEBOOK_CHANNEL_ID: channelId,
  FACEBOOK_PAGE_ID: accountId,
  FACEBOOK_START_DATE: "2026-10-28",
  FACEBOOK_AUTOMATION_ENABLED: "true",
})) {
  const exists = entries.some((e) => e.key === key),
    body = { key, values: [{ context: "all", value }] };
  const result = await fetch(base + (exists ? `/${key}` : "") + query, {
    method: exists ? "PUT" : "POST",
    headers,
    body: JSON.stringify(exists ? body : [body]),
    signal: AbortSignal.timeout(30000),
  });
  if (!result.ok) throw new Error(`Could not save ${key} (${result.status})`);
  console.log(`${key}: saved`);
}
console.log("Redeploy required for Facebook automation.");
