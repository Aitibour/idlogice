import { type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const response = intlMiddleware(request);

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|monitoring|auth|.*\\..*).*)",
  ],
};
