import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const PERMANENT_EN_PREFIXES = new Set([
  "about",
  "author",
  "blog",
  "book-consultation",
  "calculator",
  "compare-pathways",
  "contact",
  "corrections-policy",
  "draws",
  "editorial-standards",
  "evaluation",
  "faq",
  "for",
  "from",
  "glossary",
  "guides",
  "immigration-disclaimer",
  "in",
  "jobs",
  "news",
  "official-resources",
  "programs",
  "province",
  "services",
  "stats",
  "team",
  "testimonials",
  "tools",
]);

export function proxy(request: NextRequest) {
  const firstSegment = request.nextUrl.pathname.split("/")[1];
  if (PERMANENT_EN_PREFIXES.has(firstSegment)) {
    const destination = request.nextUrl.clone();
    destination.pathname = `/en${request.nextUrl.pathname}`;
    return NextResponse.redirect(destination, 308);
  }

  const intlResponse = intlMiddleware(request) as NextResponse;

  // For redirects (e.g. locale-less paths → /en/*), let them through unchanged.
  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  // Inject x-pathname into the *request* headers so server-component layouts
  // can read it via `headers()` and generate correct per-page hreflang alternates.
  // (Setting it on the response object only adds a browser response header —
  // it is NOT visible to server components reading the incoming request.)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const nextResponse = NextResponse.next({ request: { headers: requestHeaders } });

  // Preserve any cookies / internal headers that next-intl adds.
  intlResponse.headers.forEach((value, key) => {
    const lk = key.toLowerCase();
    // Avoid overwriting content-type set by NextResponse.next()
    // Skip the `link` header — next-intl emits hreflang="en"/"fr" (bare codes)
    // which conflicts with the BCP-47 HTML <link> tags (en-CA, fr-CA) we render
    // in every page's generateMetadata. Having both causes SEO tools to count 7
    // language versions instead of 5.
    if (lk !== "content-type" && lk !== "link") {
      nextResponse.headers.set(key, value);
    }
  });

  return nextResponse;
}

export const config = {
  matcher: [
    // Match all paths except API routes, Next.js internals, and static files
    "/((?!api|_next|_vercel|monitoring|auth|.*\\..*).*)",
  ],
};
