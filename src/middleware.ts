// Next.js requires this file to be named middleware.ts (not proxy.ts).
// Implementation lives in proxy.ts to avoid rename conflicts with the
// netlify-plugin-nextjs edge handler build cache.
export { proxy as middleware, config } from "./proxy";
