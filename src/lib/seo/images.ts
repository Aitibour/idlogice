/**
 * Utilities for handling external blog images.
 *
 * Problem: Unsplash URLs stored in the database often include query parameters
 * (w=, q=, fit=, etc.). When Next.js /_next/image proxy fetches these, the
 * resulting URL has DOUBLE width/quality params which causes Unsplash to return
 * 403 Forbidden — producing 300+ broken images in site audits.
 *
 * Solution: Strip all query parameters from Unsplash URLs and let Next.js
 * image optimization add its own sizing. For non-Unsplash URLs, pass through.
 */

/**
 * Returns a clean image URL safe to pass to Next.js <Image>.
 * Strips Unsplash query params so _next/image doesn't double-encode them.
 */
export function cleanImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    // Strip query params from Unsplash URLs only — they add their own sizing
    if (parsed.hostname === "images.unsplash.com") {
      return `${parsed.origin}${parsed.pathname}`;
    }
    return url;
  } catch {
    return url;
  }
}

/**
 * Returns true for Unsplash image URLs.
 * Use to pass unoptimized={true} to Next.js <Image> for Unsplash sources —
 * Unsplash blocks the _next/image proxy (returns 403 Forbidden). Bypassing
 * the optimizer lets browsers load directly from Unsplash's own CDN.
 */
export function isUnsplashUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    return new URL(url).hostname === "images.unsplash.com";
  } catch {
    return false;
  }
}
