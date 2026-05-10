/**
 * IndexNow client — instant notification to Bing, Yandex, Naver,
 * Seznam, Yep, and DuckDuckGo (powered by Bing) that a URL changed.
 *
 * Submit one URL or up to 10,000 at once. Bing typically crawls within
 * minutes; Google does NOT use IndexNow yet (use GSC sitemap for them).
 *
 * Setup: the API key MUST be served at https://idlogice.com/<KEY>.txt
 * (already done via /public/<KEY>.txt).
 */

const HOST = "idlogice.com";
const KEY = "325dbd9db00d84f011a667409276c0a8";

export async function indexNow(urls: string | string[]) {
  const list = Array.isArray(urls) ? urls : [urls];
  if (list.length === 0) return { ok: true, count: 0 };
  if (list.length > 10000) {
    throw new Error("IndexNow accepts at most 10,000 URLs per call");
  }

  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: list,
  };

  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  // 200 = accepted, 202 = accepted + processed async, 422 = invalid URLs
  return { ok: res.status === 200 || res.status === 202, status: res.status, count: list.length };
}
