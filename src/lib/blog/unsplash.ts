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

  const encoded = encodeURIComponent(keyword);
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encoded}&per_page=1&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${key}` } },
  );

  if (!res.ok) {
    console.warn(`Unsplash fetch failed: ${res.status}`);
    return null;
  }

  const data = await res.json();
  const photo = data?.results?.[0];
  if (!photo) return null;

  return {
    url: photo.urls?.regular ?? photo.urls?.full,
    alt: photo.alt_description ?? keyword,
    credit: `Photo by ${photo.user?.name ?? "Unsplash"} on Unsplash`,
  };
}
