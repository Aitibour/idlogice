import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
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
    // Avoid overwriting content-type set by NextResponse.next()
    if (key.toLowerCase() !== "content-type") {
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
