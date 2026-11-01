import { facebookStore } from "../../src/lib/social/facebook-store";
export default async function facebookMedia(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !/^[a-f0-9]{64}$/.test(id))
    return new Response("Not found", { status: 404 });
  const bytes = await facebookStore().get(`public-media/${id}.png`, {
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
