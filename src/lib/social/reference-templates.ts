import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { PostKind, PostPurpose } from "./calendar.ts";

export const GRAPHIC_VERSION = "reference-templates-v2";
export const SOCIAL_TEMPLATES = ["editorial", "skyline", "phone", "photo", "flag", "photo-accent", "skyline-accent", "flag-accent"] as const;
export type SocialTemplate = typeof SOCIAL_TEMPLATES[number];
export type GraphicInput = { title: string; headline?: string; kind: PostKind; date: string; ordinal: number; purpose?: PostPurpose; news?: boolean; template?: SocialTemplate };
const RED = "#e51729", INK = "#222222";
const cache = new Map<string, string>();
const escapeXml = (text: string) => text.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[c]!);
function asset(name: string) {
  if (!cache.has(name)) cache.set(name, readFileSync(join(process.cwd(), "assets/social", name)).toString("base64"));
  return cache.get(name)!;
}
function logo(light: boolean, x: number, y: number, width = 250) {
  // No plaque or background rectangle: alpha PNGs derived from the official logo.
  const variant = light ? "light" : "dark";
  return `<image data-logo-variant="${variant}" x="${x}" y="${y}" width="${width}" height="${width * .58}" preserveAspectRatio="xMinYMid meet" href="data:image/png;base64,${asset(`logo-${variant}.png`)}"/>`;
}
function background(name: string) {
  return `<image width="1080" height="1350" preserveAspectRatio="none" href="data:image/jpeg;base64,${asset(`backgrounds/${name}.jpg`)}"/>`;
}
const textWidth = (text: string, size: number) => [...text].reduce((sum, c) => sum +
  (/\s/.test(c) ? .3 : /[MW@%]/.test(c) ? 1 : /[mw]/.test(c) ? .86 : /[ilI.,:;'!|]/.test(c) ? .3 : /[A-Z]/.test(c) ? .76 : .62) * size, 0);
function wrap(text: string, width: number, size: number) {
  const lines: string[] = []; let line = "";
  for (const word of text.trim().split(/\s+/)) {
    if (textWidth(word, size) > width) {
      if (line) { lines.push(line); line = ""; }
      for (const c of word) {
        if (textWidth(line + c, size) > width) { lines.push(line); line = ""; }
        line += c;
      }
    } else if (line && textWidth(`${line} ${word}`, size) > width) { lines.push(line); line = word; }
    else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines;
}
function fitted(text: string, x: number, y: number, width: number, height: number, maxSize: number, colors: string[], align = "start") {
  let size = maxSize, lines = wrap(text, width, size);
  while (lines.length * size * 1.08 > height && size > 26) lines = wrap(text, width, --size);
  if (lines.length * size * 1.08 > height) throw new Error("Graphic headline does not fit; post held");
  return lines.map((line, i) => `<text x="${x}" y="${y + i * size * 1.08}" text-anchor="${align}" font-size="${size}" font-weight="700" fill="${colors[i % colors.length]}">${escapeXml(line)}</text>`).join("");
}
function footer(input: GraphicInput, fill: string, ink: string) {
  const article = input.purpose === "article";
  return `<rect y="1170" width="1080" height="180" fill="${fill}"/>
    <g fill="${ink}">
      <text x="56" y="1223" font-size="39" font-weight="700">idlogice.com</text>
      <text x="1024" y="1223" text-anchor="end" font-size="30" font-weight="700">${article ? "Read the full article" : "Book your consultation"}</text>
      <text x="56" y="1268" font-size="28">${article ? "idlogice.com · Article link in the caption" : "idlogice.com/en/book-consultation"}</text>
      <text x="56" y="1320" font-size="28">contact@idlogice.com</text>
      <text x="1024" y="1320" text-anchor="end" font-size="28">+1 581-634-0224</text>
    </g>`;
}
function badge(label: string, x: number, y: number, fill = RED, ink = "#ffffff") {
  const width = textWidth(label, 23) + 40;
  return `<rect x="${x}" y="${y - 29}" width="${width}" height="45" rx="5" fill="${fill}"/><text x="${x + 20}" y="${y}" font-size="23" fill="${ink}" font-weight="700" letter-spacing="1">${label}</text>`;
}
function icon(x: number, label: string, path: string) {
  return `<rect x="${x - 99}" y="890" width="198" height="199" rx="22" fill="#ffffff" stroke="#e3e3e3" stroke-width="2"/>
    <circle cx="${x}" cy="928" r="50" fill="${RED}"/>
    <g transform="translate(${x},928)" fill="none" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">${path}</g>
    ${fitted(label, x, 1024, 178, 58, 23, ["#b31520"], "middle")}`;
}

export function referenceGraphicSvg(input: GraphicInput) {
  const headline = (input.headline || input.title).trim();
  if (!headline || headline.length > 350) throw new Error("Graphic headline is missing or too long");
  if (!Number.isInteger(input.ordinal) || input.ordinal < 0) throw new Error("Invalid graphic ordinal");
  const template = input.template ?? SOCIAL_TEMPLATES[(input.ordinal + (input.kind === "job" ? 2 : input.kind === "question" ? 4 : 0)) % SOCIAL_TEMPLATES.length];
  if (!SOCIAL_TEMPLATES.includes(template)) throw new Error("Unknown graphic template");
  const edition = new Intl.DateTimeFormat("en-CA", {month:"short", day:"numeric", year:"numeric", timeZone:"UTC"}).format(new Date(`${input.date}T12:00:00Z`)).toUpperCase();
  const label = input.kind === "job" ? "WEBSITE JOB SPOTLIGHT" : input.kind === "question" ? "LET'S TALK CANADA" : input.news ? "IRCC UPDATE" : input.purpose === "article" ? "IDLOGICE ARTICLE" : "CANADA GUIDE";
  const note = input.kind === "job" ? "Confirm availability and requirements with IDLOGICE." : input.kind === "question" ? "Share your thoughts in the comments." : "Clear guidance. Practical next steps.";
  let body: string;
  if (template.startsWith("skyline")) {
    body = background("skyline") + logo(false, 802, 30, 222) + badge(label, 300, 258, INK)
      + fitted(headline, 300, 366, 700, 400, 82, template.endsWith("accent") ? [RED, INK] : [RED])
      + fitted(note, 300, 800, 700, 68, 29, [INK])
      + icon(393, "WORK PERMITS", '<rect x="-27" y="-17" width="54" height="36" rx="4"/><path d="M-12-17v-12h24v12M-27 0h54"/>')
      + icon(635, "STUDY PERMITS", '<path d="m-32-8 32-17 32 17L0 9ZM-20 0v19q20 15 40 0V0M32-8v29"/>')
      + icon(877, "YOUR NEXT STEP", '<rect x="-23" y="-29" width="46" height="58" rx="5"/><path d="M-12-9h24M-12 3h24M-12 15h16"/>')
      + footer(input, "#b6101f", "#ffffff");
  } else if (template === "phone") {
    body = background("phone") + logo(false, 54, 34, 270) + badge(label, 56, 288, "#142342")
      + fitted(headline, 56, 407, 475, 500, 86, [RED])
      + fitted(note, 56, 991, 475, 105, 32, ["#10234d"])
      + footer(input, "#ffffff", "#10234d");
  } else if (template.startsWith("photo")) {
    const student = /study|student|education|language|credential/i.test(headline);
    body = background(student ? "student" : "woman") + logo(true, 54, 20, 237)
      + '<rect y="830" width="1080" height="340" fill="#000000" fill-opacity=".7"/>'
      + badge(label, 56, 864)
      + fitted(headline, 56, 949, 960, 205, 65, template.endsWith("accent") ? ["#ffffff", "#ea3bae", "#19c8ef"] : ["#ffffff", "#19c8ef"])
      + footer(input, "#08090b", "#ffffff");
  } else if (template.startsWith("flag")) {
    body = background("flag") + logo(true, 54, 35, 255) + badge(label, 56, 390, "#ffffff", "#b91122")
      + fitted(headline, 56, 518, 950, 490, 103, ["#ffffff"])
      + (template.endsWith("accent") ? '<rect x="56" y="1050" width="860" height="77" rx="38" fill="#0759b1"/>' : "")
      + fitted(note, 82, 1101, 870, 44, 31, ["#ffffff"])
      + footer(input, "#9f0b1c", "#ffffff");
  } else {
    body = '<rect width="1080" height="1350" fill="#f8f7f3"/><rect width="1080" height="22" fill="#ec1525"/>'
      + logo(false, 54, 55, 260) + badge(label, 56, 330, INK)
      + fitted(headline, 56, 470, 960, 408, 89, [INK])
      + '<rect x="56" y="890" width="190" height="11" fill="#ec1525"/>'
      + fitted(note, 56, 1015, 960, 85, 46, [RED])
      + footer(input, "#ec1525", "#ffffff");
  }
  const dateColor = template === "editorial" || template === "phone" ? INK : "#ffffff";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350" data-template="${template}" data-graphic-version="${GRAPHIC_VERSION}"><g font-family="Lato">${body}<text x="1024" y="1152" text-anchor="end" font-size="18" fill="${dateColor}">${escapeXml(edition)}</text></g></svg>`;
}
