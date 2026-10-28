import Parser from "rss-parser";

export type EditorialSource = { title: string; sourceUrl: string; publishedAt?: string; articleUrl?: string; sourceType: "news" | "article" };
const NOTICES = "https://www.canada.ca/en/immigration-refugees-citizenship/news/notices.html";
const FEED = "https://api.io.canada.ca/io-server/gc/news/en/v2?dept=departmentofcitizenshipandimmigration&format=atom&orderBy=desc&pick=30&sort=publishedDate&type=newsreleases";
const plain = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
const humanDatePattern = /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/;
function labelDate(label: string | undefined) {
  if (!label) return undefined;
  const [month, day, year] = label.replace(",", "").split(/\s+/);
  const index = ["January","February","March","April","May","June","July","August","September","October","November","December"].indexOf(month) + 1;
  return `${year}-${String(index).padStart(2,"0")}-${day.padStart(2,"0")}`;
}

export function isRecent(date: string | undefined, now = new Date(), days = 14) {
  const time = Date.parse(date ?? "");
  return Number.isFinite(time) && time <= now.getTime() && now.getTime() - time <= days * 86400000;
}

export function officialUrl(value: string) {
  try { const url = new URL(value, "https://www.canada.ca"); return url.protocol === "https:" && url.hostname === "www.canada.ca" && url.pathname.startsWith("/en/immigration-refugees-citizenship/") ? url.href : undefined; } catch { return undefined; }
}

export async function sourcePage(url: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20000), cache: "no-store", headers: { "User-Agent": "IDLOGICE-Editorial/1.0" } });
  if (!response.ok || new URL(response.url).hostname !== new URL(url).hostname) throw new Error(`Editorial source unavailable (${response.status})`);
  return response.text();
}

export function parseNotices(html: string, now = new Date()): EditorialSource[] {
  return [...html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].flatMap((match) => {
    const href = match[1].match(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
    const publishedAt = labelDate(plain(match[1]).match(humanDatePattern)?.[0]);
    const sourceUrl = href && officialUrl(href[1]);
    return href && sourceUrl && isRecent(publishedAt, now) ? [{ title: plain(href[2]).replace(/^Notice\s*[–-]\s*/i, ""), sourceUrl, publishedAt, sourceType: "news" as const }] : [];
  });
}

export async function recentNews(now = new Date()): Promise<EditorialSource[]> {
  const results = await Promise.allSettled([
    sourcePage(NOTICES).then((html) => parseNotices(html, now)),
    sourcePage(FEED).then(async (xml) => {
      const feed = await new Parser().parseString(xml);
      return feed.items.flatMap((item) => {
        const sourceUrl = item.link && officialUrl(item.link), publishedAt = item.isoDate ?? item.pubDate;
        return sourceUrl && item.title && isRecent(publishedAt, now) ? [{ title: item.title, sourceUrl, publishedAt, sourceType: "news" as const }] : [];
      });
    }),
  ]);
  const all = results.flatMap((result) => result.status === "fulfilled" ? result.value : []);
  return [...new Map(all.map((item) => [item.sourceUrl, item])).values()].sort((a, b) => Date.parse(b.publishedAt!) - Date.parse(a.publishedAt!));
}

export function parseArticleCards(html: string, now = new Date()) {
  return [...html.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/gi)].flatMap((match) => {
    const path = match[1].match(/href="(\/en\/blog\/[a-z0-9-]+)"/)?.[1];
    const date = labelDate(plain(match[1]).match(humanDatePattern)?.[0]);
    return path && isRecent(date, now) ? [`https://idlogice.com${path}`] : [];
  });
}

async function recentArticles(now: Date): Promise<EditorialSource[]> {
  try {
    const urls = parseArticleCards(await sourcePage("https://idlogice.com/en/blog"), now).slice(0, 4);
    const results = await Promise.allSettled(urls.map(async (articleUrl) => {
      const html = await sourcePage(articleUrl);
      const metadata = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => { try { return JSON.parse(match[1]); } catch { return null; } }).flat().find((item) => item?.["@type"] === "BlogPosting");
      const sourceUrl = [...html.matchAll(/href="([^"]+)"/g)].map((match) => officialUrl(match[1].replace(/&amp;/g, "&"))).find(Boolean);
      if (!sourceUrl || !metadata?.headline || !isRecent(metadata.datePublished, now)) return null;
      return { title: String(metadata.headline), sourceUrl, articleUrl, publishedAt: String(metadata.datePublished), sourceType: "article" as const };
    }));
    return results.flatMap((result) => result.status === "fulfilled" && result.value ? [result.value] : []);
  } catch { return []; }
}

export async function chooseEditorialSource(isUsed: (url: string) => Promise<boolean> = async () => false, now = new Date()): Promise<EditorialSource | undefined> {
  const [news, articles] = await Promise.all([recentNews(now), recentArticles(now)]);
  for (const item of news) {
    if (await isUsed(item.sourceUrl)) continue;
    const article = articles.find((candidate) => candidate.sourceUrl === item.sourceUrl);
    return { ...item, articleUrl: article?.articleUrl };
  }
  for (const article of articles) if (!(await isUsed(article.sourceUrl))) return article;
  // No recent announcement or matching live article: use dated evergreen guidance,
  // never invent a news item or a website article URL.
  return undefined;
}
