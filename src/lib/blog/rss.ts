import Parser from "rss-parser";

export type RssItem = {
  title: string;
  link: string;
  contentSnippet: string;
  pubDate: string;
};

const FEEDS = [
  "https://www.immigration.ca/feed",
  "https://moving2canada.com/feed/",
  "https://www.cicnews.com/feed/",
];

const parser = new Parser({ timeout: 10000 });

export async function fetchLatestItems(): Promise<RssItem[]> {
  const results = await Promise.allSettled(FEEDS.map((url) => parser.parseURL(url)));

  const items: RssItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      for (const item of result.value.items.slice(0, 5)) {
        if (item.title && item.link) {
          items.push({
            title: item.title,
            link: item.link,
            contentSnippet: item.contentSnippet ?? item.title,
            pubDate: item.pubDate ?? new Date().toISOString(),
          });
        }
      }
    }
  }

  return items.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
  );
}
