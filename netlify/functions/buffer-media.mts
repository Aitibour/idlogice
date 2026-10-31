import { xStore } from "../../src/lib/social/x-store";
// Only exported public graphics are addressable, never credentials or records.
export default async function bufferMedia(request: Request) {
  const hash = new URL(request.url).searchParams.get("id");
  if (!hash || !/^([a-f0-9]{64})$/.test(hash))
    return new Response("Not found", { status: 404 });
  const bytes = await xStore().get(`public-media/${hash}.png`, {
    type: "arrayBuffer",
  });
  return new Response(bytes, {
    status: bytes ? 200 : 404,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
