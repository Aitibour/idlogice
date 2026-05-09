import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { createServerClient } from "@supabase/ssr";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 1. Run next-intl routing first to get the response with locale headers
  const response = intlMiddleware(request);

  // 2. Refresh Supabase session on every request so cookies stay fresh
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Write to the response so the browser gets updated cookies
            (response as NextResponse).cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Refresh session + get current user
  const { data: { user } } = await supabase.auth.getUser();

  // Server-side route protection — redirect unauthenticated users to login
  const pathname = request.nextUrl.pathname;
  const PROTECTED = ["/evaluation"];
  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(p + "/") ||
           pathname.match(new RegExp(`^/(en|fr)${p}(/|$)`))
  );

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except:
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /_vercel (Vercel internals)
    // - /monitoring (Sentry tunnel)
    // - Static files (favicon, images, etc.)
    "/((?!api|_next|_vercel|monitoring|auth|.*\\..*).*)",
  ],
};
