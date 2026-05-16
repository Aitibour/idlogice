export type UnsplashPhoto = {
  url: string;
  alt: string;
  credit: string;
};

export async function fetchUnsplashPhoto(keyword: string): Promise<UnsplashPhoto | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    console.warn("UNSPLASH_ACCESS_KEY not set — skipping image");
    return null;
  }

  // Pull a page of 30 results and pick one randomly so successive calls
  // with the same keyword don't always return the same hero image.
  const encoded = encodeURIComponent(keyword);
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encoded}&per_page=30&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${key}` } },
  );

  if (!res.ok) {
    console.warn(`Unsplash fetch failed: ${res.status}`);
    return null;
  }

  type UnsplashResult = {
    urls?: { regular?: string; full?: string };
    alt_description?: string;
    user?: { name?: string };
  };
  const data = await res.json();
  const results: UnsplashResult[] = data?.results ?? [];
  if (results.length === 0) return null;
  const photo = results[Math.floor(Math.random() * results.length)];

  const url = photo.urls?.regular ?? photo.urls?.full;
  if (!url) return null;
  return {
    url,
    alt: photo.alt_description ?? keyword,
    credit: `Photo by ${photo.user?.name ?? "Unsplash"} on Unsplash`,
  };
}
