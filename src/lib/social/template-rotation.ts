import type { getStore } from "@netlify/blobs";
import { GRAPHIC_VERSION, type GraphicInput } from "./reference-templates.ts";
import { chooseTemplate, type SocialTemplate } from "./template-catalog.ts";
type Store = Pick<ReturnType<typeof getStore>, "getWithMetadata" | "setJSON">;
type Entry = { slot: string; template: SocialTemplate };

// Drafts cannot consume live rotation positions. Conditional writes prevent two
// workers from independently selecting the same next template.
export async function reserveTemplate(
  store: Store,
  input: GraphicInput,
  slot: string,
  draft: boolean,
) {
  const key = `template-rotation/${GRAPHIC_VERSION}/${draft ? "drafts" : "posts"}`;
  for (let attempt = 0; attempt < 12; attempt++) {
    const previous = await store.getWithMetadata(key, { type: "json" });
    const history =
      (previous?.data as { entries: Entry[] } | undefined)?.entries ?? [];
    const existing = history.find((entry) => entry.slot === slot);
    if (existing) return existing.template;
    const template = chooseTemplate(
      input,
      history.map((entry) => entry.template),
    );
    const result = await store.setJSON(
      key,
      { entries: [...history, { slot, template }].slice(-180) },
      previous ? { onlyIfMatch: previous.etag } : { onlyIfNew: true },
    );
    if (result.modified) return template;
  }
  throw new Error("Template rotation contention; post held for a safe retry");
}
