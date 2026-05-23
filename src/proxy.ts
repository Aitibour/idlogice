import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const response = intlMiddleware(request) as NextResponse;
  // Forward the original pathname so layouts can derive per-page hreflang
  // without needing each individual page to repeat alternates logic.
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: [
    // Match all paths except API routes, Next.js internals, and static files
    "/((?!api|_next|_vercel|monitoring|auth|.*\\..*).*)",
  ],
};
