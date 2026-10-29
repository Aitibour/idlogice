import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { referenceGraphicSvg, type GraphicInput } from "./reference-templates.ts";

export { GRAPHIC_VERSION, SOCIAL_TEMPLATES, type GraphicInput, type SocialTemplate } from "./reference-templates.ts";
export const socialGraphicSvg = referenceGraphicSvg;

// Bundled original background artwork; no per-post image API request or fee.
export async function generateSocialImage(input: GraphicInput) {
  const fontFiles = ["Lato-Regular.ttf", "Lato-Bold.ttf"].map(name => join(process.cwd(), "assets/social", name));
  if (!fontFiles.every(file => existsSync(file))) throw new Error("Bundled graphic fonts are missing; post held");
  const renderer = new Resvg(socialGraphicSvg(input), {font:{fontFiles, loadSystemFonts:false, defaultFontFamily:"Lato"}});
  const bytes = renderer.render().asPng();
  if (bytes.length < 1000 || bytes.subarray(0,8).toString("hex") !== "89504e470d0a1a0a") throw new Error("Graphic rendering failed; post held");
  return {bytes, hash:createHash("sha256").update(bytes).digest("hex")};
}
