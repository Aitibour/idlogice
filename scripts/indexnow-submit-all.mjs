#!/usr/bin/env node
/**
 * Submit every URL from sitemap.xml to IndexNow in one batch.
 * Run after major content updates:
 *   node scripts/indexnow-submit-all.mjs
 *
 * Bing/Yandex/DuckDuckGo/Naver typically crawl within minutes.
 * (Google is NOT in the IndexNow consortium — use Search Console for them.)
 */

const HOST = "idlogice.com";
const KEY = "325dbd9db00d84f011a667409276c0a8";
const SITEMAP = `https://${HOST}/sitemap.xml`;

async function main() {
  process.stdout.write(`Fetching ${SITEMAP}... `);
  const res = await fetch(SITEMAP);
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  console.log("ok");

  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  console.log(`Found ${urls.length} URLs in sitemap`);

  if (urls.length === 0) {
    console.error("No URLs found — aborting.");
    process.exit(1);
  }

  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  };

  process.stdout.write(`Submitting to IndexNow... `);
  const submit = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  if (submit.status === 200 || submit.status === 202) {
    console.log(`✓ ${submit.status} — ${urls.length} URLs submitted to Bing, Yandex, Naver, Seznam, Yep, DuckDuckGo`);
  } else {
    const text = await submit.text();
    console.error(`✗ ${submit.status}: ${text}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
