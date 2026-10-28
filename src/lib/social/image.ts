import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import type { PostKind, PostPurpose } from "./calendar.ts";

export type GraphicInput = { title: string; headline?: string; kind: PostKind; date: string; ordinal: number; purpose?: PostPurpose; news?: boolean };
let logoData: string | undefined;
function officialLogo() {
  logoData ??= readFileSync(join(process.cwd(), "public/logo.png")).toString("base64");
  return `<rect x="64" y="28" width="226" height="140" rx="15" fill="#ffffff"/><image x="80" y="40" width="194" height="116" href="data:image/png;base64,${logoData}"/>`;
}
const escapeXml = (text: string) => text.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[c]!);
// A consistent editorial system gives the feed a recognizable IDLOGICE look while
// the composition changes from post to post. The red is deliberately used as an
// accent, not as an imitation of a government notice or a Canada.ca publication.
const palettes = [
  { bg: "#fbfaf8", ink: "#17191d", accent: "#e31b2b", soft: "#f7e4e5", deep: "#9f1320" },
  { bg: "#f7f7f7", ink: "#111820", accent: "#d91c2b", soft: "#e6edf1", deep: "#9f1320" },
  { bg: "#fffaf9", ink: "#242020", accent: "#e31b2b", soft: "#f3e3e1", deep: "#a4111d" },
  { bg: "#f9f8f5", ink: "#17242c", accent: "#ce1526", soft: "#e3ebed", deep: "#8e101b" },
  { bg: "#fcfbfa", ink: "#1b1a1c", accent: "#dc1829", soft: "#f3e7e8", deep: "#9b111d" },
  { bg: "#fafafa", ink: "#1a2026", accent: "#d51729", soft: "#e6edf2", deep: "#94101c" },
];

// Conservative glyph widths keep headlines inside the canvas without host fonts.
const textWidth = (text: string, size: number) => [...text].reduce((sum, c) => sum +
  (/\s/.test(c) ? .3 : /[MW@%]/.test(c) ? 1 : /[mw]/.test(c) ? .86 : /[ilI.,:;'!|]/.test(c) ? .3 : /[A-Z]/.test(c) ? .76 : .62) * size, 0);

function headlineLines(text: string, width: number, size: number) {
  const lines: string[] = []; let line = "";
  for (const word of text.trim().split(/\s+/)) {
    if (textWidth(word, size) > width) {
      if (line) { lines.push(line); line = ""; }
      for (const char of word) {
        if (textWidth(line + char, size) > width) { lines.push(line); line = ""; }
        line += char;
      }
    } else if (line && textWidth(`${line} ${word}`, size) > width) {
      lines.push(line); line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines;
}

function symbol(kind: PostKind, title: string, color: string) {
  const leaf = '<path d="m0-48 12 24 14-7-4 27 22-8-9 20 15 10-35 9 3 21h-36l3-21-35-9 15-10-9-20 22 8-4-27 14 7Z" fill="currentColor" stroke="none"/>';
  const paths = kind === "question"
    ? '<path d="M-76-48h127q20 0 20 20v59q0 20-20 20h-44l-37 31V51h-46q-20 0-20-20v-59q0-20 20-20Z"/><circle cx="-43" cy="1" r="5" fill="currentColor"/><circle cx="-7" cy="1" r="5" fill="currentColor"/><circle cx="29" cy="1" r="5" fill="currentColor"/>'
    : kind === "job"
      ? '<rect x="-86" y="-42" width="172" height="112" rx="15"/><path d="M-33-42v-23h66v23M-86 4q86 38 172 0M-10 9v23h20V9"/>'
      : /study|language|education|credential|citizenship/i.test(title)
        ? '<path d="M0-43q-43-35-85-10v118q44-25 85 10 41-35 85-10V-53Q43-78 0-43Zm0 0V75M-63-20l38 14M-63 8l38 14M25-6l38-14M25 22l38-14"/>'
        : '<rect x="-65" y="-85" width="130" height="170" rx="15"/><path d="M-39 56h78"/><g transform="translate(0,-10) scale(.7)">' + leaf + '</g>';
  return `<g fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" color="${color}">${paths}</g>`;
}

function mapleMark(color: string, opacity = 1) {
  return `<g fill="${color}" opacity="${opacity}" transform="scale(1.35)">
    <path d="m0-48 12 24 14-7-4 27 22-8-9 20 15 10-35 9 3 21h-36l3-21-35-9 15-10-9-20 22 8-4-27 14 7Z"/>
  </g>`;
}

export function socialGraphicSvg(input: GraphicInput) {
  const headline = (input.headline || input.title).trim();
  if (!headline || headline.length > 350) throw new Error("Graphic headline is missing or too long");
  const seed = createHash("sha256").update(`${input.date}/${input.kind}/${input.title}`).digest();
  const layout = (input.ordinal + (input.kind === "job" ? 2 : input.kind === "question" ? 4 : 0)) % 6;
  const p = palettes[seed[0] % palettes.length];
  const label = input.kind === "job" ? "CANADA JOB SPOTLIGHT" : input.kind === "question" ? "YOUR CANADA QUESTION" : input.news ? "LATEST IRCC UPDATE" : "CANADA IMMIGRATION GUIDE";
  const note = input.kind === "job" ? "See the details and confirm availability." : input.kind === "question" ? "Share your thoughts in the comments." : "Clear information for your Canadian journey.";
  const width = layout === 1 || layout === 3 ? 610 : 820;
  let size = input.kind === "question" ? 58 : 74;
  let lines = headlineLines(headline, width, size);
  while ((lines.length > 5 || lines.length * size * 1.12 > 395) && size > 40) lines = headlineLines(headline, width, --size);
  if (lines.length * size * 1.12 > 395) throw new Error("Graphic headline does not fit");
  const x = 80;
  const text = lines.map((line, i) => `<text x="${x}" y="${300 + i * size * 1.08}" font-size="${size}" font-weight="900" fill="${i % 3 === 0 ? p.accent : p.ink}">${escapeXml(line)}</text>`).join("");
  const illustration = symbol(input.kind, input.title, p.accent);
  const decorations = [
    `<rect x="748" y="206" width="270" height="495" rx="34" fill="${p.soft}"/><g transform="translate(883,420) scale(1.25)">${illustration}</g><g transform="translate(925,620)">${mapleMark(p.accent,.24)}</g>`,
    `<path d="M710 190h370v584H710Z" fill="${p.deep}"/><g transform="translate(894,414) scale(1.32)">${symbol(input.kind,input.title,"#ffffff")}</g><g transform="translate(1010,670)">${mapleMark("#ffffff",.22)}</g>`,
    `<rect x="66" y="650" width="948" height="132" rx="28" fill="${p.soft}"/><g transform="translate(860,690) scale(.78)">${illustration}</g><g transform="translate(967,235)">${mapleMark(p.accent,.2)}</g>`,
    `<path d="M738 178h280v592H738Z" fill="${p.soft}"/><path d="M738 178h280v82H738Z" fill="${p.accent}"/><g transform="translate(878,462) scale(1.26)">${illustration}</g><g transform="translate(964,685)">${mapleMark(p.accent,.28)}</g>`,
    `<path d="M0 683q270-112 538 2t542-36v167H0Z" fill="${p.soft}"/><g transform="translate(880,675) scale(.83)">${illustration}</g><g transform="translate(1000,238)">${mapleMark(p.accent,.18)}</g>`,
    `<rect x="746" y="206" width="272" height="458" rx="136" fill="${p.soft}"/><g transform="translate(882,430) scale(1.15)">${illustration}</g><path d="M80 697h500" stroke="${p.accent}" stroke-width="11"/><g transform="translate(945,655)">${mapleMark(p.accent,.18)}</g>`,
  ];
  const edition = new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${input.date}T12:00:00Z`));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
    <rect width="1080" height="1080" fill="${p.bg}"/>
    <rect width="1080" height="18" fill="${p.accent}"/>
    <g font-family="Lato" fill="${p.ink}">
      ${decorations[layout]}
      ${officialLogo()}
      <text x="1000" y="78" font-size="21" text-anchor="end" font-weight="700" letter-spacing="1.5">CANADA IMMIGRATION</text>
      <rect x="80" y="190" width="${input.kind === "job" ? 330 : input.kind === "question" ? 350 : 315}" height="38" rx="8" fill="${p.ink}"/>
      <text x="98" y="216" fill="#ffffff" font-size="19" font-weight="900" letter-spacing="1.2">${label}</text>
      ${text}
      <text x="80" y="${Math.max(675, 330 + lines.length * size * 1.08)}" font-size="27" font-weight="700">${escapeXml(note)}</text>
      <text x="80" y="748" fill="${p.accent}" font-size="24" font-weight="900" letter-spacing="1">${escapeXml(edition).toUpperCase()}</text>
      <text x="80" y="788" font-size="20" letter-spacing="1">${input.kind === "job" ? "FULL LISTING IN THE CAPTION" : "IDLOGICE IMMIGRATION CANADA"}</text>
    </g>
    <rect y="844" width="1080" height="236" fill="${p.accent}"/>
    <g font-family="Lato" fill="#ffffff">
      <text x="80" y="914" font-size="39" font-weight="900">${input.purpose === "article" ? "Read the full article" : "Book your consultation"}</text>
      <path d="M925 898h66m-20-20 20 20-20 20" fill="none" stroke="#ffffff" stroke-width="6"/>
      <text x="80" y="965" font-size="26" font-weight="700">${input.purpose === "article" ? "idlogice.com · Link in the caption" : "idlogice.com/en/book-consultation"}</text>
      <text x="80" y="1032" font-size="27">contact@idlogice.com</text>
      <text x="1000" y="1032" font-size="27" text-anchor="end">+1 581-634-0224</text>
    </g>
  </svg>`;
}

// Render locally: no image API key, external requests, or per-image provider charges.
export async function generateSocialImage(input: GraphicInput) {
  const fontFiles = ["Lato-Regular.ttf", "Lato-Bold.ttf"].map((name) => join(process.cwd(), "assets/social", name));
  if (!fontFiles.every((file) => existsSync(file))) throw new Error("Bundled graphic fonts are missing; post held");
  const renderer = new Resvg(socialGraphicSvg(input), { font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Lato" } });
  const bytes = renderer.render().asPng();
  if (bytes.length < 1000 || bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") throw new Error("Graphic rendering failed; post held");
  return { bytes, hash: createHash("sha256").update(bytes).digest("hex") };
}
