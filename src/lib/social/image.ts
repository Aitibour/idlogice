import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import {
  referenceGraphicSvg,
  type GraphicInput,
} from "./reference-templates.ts";
import { agencyTextSvg, usesAgencyText } from "./agency-text.ts";
import { stockPhotoFor } from "./stock-photos.ts";

export {
  GRAPHIC_VERSION,
  SOCIAL_TEMPLATES,
  TEMPLATE_CATALOG,
  chooseTemplate,
  graphicTopic,
  templateLogoVariant,
  type GraphicInput,
  type SocialTemplate,
} from "./reference-templates.ts";
export function socialGraphicSvg(input: GraphicInput) {
  if (usesAgencyText(input)) return agencyTextSvg(input);
  if (!input.news) return referenceGraphicSvg(input);
  const photo = stockPhotoFor(input);
  const bytes = readFileSync(
    join(process.cwd(), "assets/social/stock", `${photo.id}.jpg`),
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350" data-stock-photo="${photo.id}"><image width="1080" height="1350" preserveAspectRatio="xMidYMid slice" href="data:image/jpeg;base64,${bytes.toString("base64")}"/></svg>`;
}

// Bundled original background artwork; no per-post image API request or fee.
export async function generateSocialImage(input: GraphicInput) {
  const fontFiles = ["Lato-Regular.ttf", "Lato-Bold.ttf"].map((name) =>
    join(process.cwd(), "assets/social", name),
  );
  if (!fontFiles.every((file) => existsSync(file)))
    throw new Error("Bundled graphic fonts are missing; post held");
  const renderer = new Resvg(socialGraphicSvg(input), {
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Lato" },
  });
  const bytes = renderer.render().asPng();
  if (
    bytes.length < 1000 ||
    bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a"
  )
    throw new Error("Graphic rendering failed; post held");
  return {
    bytes,
    hash: createHash("sha256").update(bytes).digest("hex"),
    style: usesAgencyText(input)
      ? "agency-text"
      : input.news
        ? "stock"
        : "reference",
    stockPhoto:
      input.news && !usesAgencyText(input) ? stockPhotoFor(input) : undefined,
  };
}
