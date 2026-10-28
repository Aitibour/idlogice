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
const palettes = [
  { bg: "#f8f3eb", ink: "#132f3c", accent: "#bf283b", soft: "#ead9c8" },
  { bg: "#122f3d", ink: "#fff7eb", accent: "#ffb29f", soft: "#274752" },
  { bg: "#eff5f0", ink: "#153f39", accent: "#a5283f", soft: "#d8e6db" },
  { bg: "#faf1ed", ink: "#552636", accent: "#b82c43", soft: "#f0dcd5" },
  { bg: "#f2f1f8", ink: "#282d50", accent: "#a72543", soft: "#dddeed" },
  { bg: "#edf4f7", ink: "#18384c", accent: "#b5263f", soft: "#d3e3eb" },
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

export function socialGraphicSvg(input: GraphicInput) {
  const headline = (input.headline || input.title).trim();
  if (!headline || headline.length > 350) throw new Error("Graphic headline is missing or too long");
  const seed = createHash("sha256").update(`${input.date}/${input.kind}/${input.title}`).digest();
  const layout = (input.ordinal + (input.kind === "job" ? 2 : input.kind === "question" ? 4 : 0)) % 6;
  const p = palettes[seed[0] % palettes.length];
  const label = input.kind === "job" ? "WEBSITE JOB SPOTLIGHT" : input.kind === "question" ? "LET'S TALK CANADA" : input.news ? "CANADA IMMIGRATION UPDATE" : "YOUR CANADA GUIDE";
  const note = input.kind === "job" ? "Explore the listing. Confirm availability." : input.kind === "question" ? "Your experience could help someone else." : "Understand your options. Plan your next step.";
  const width = layout === 1 || layout === 3 ? 660 : 880;
  let size = input.kind === "question" ? 61 : 76;
  let lines = headlineLines(headline, width, size);
  while ((lines.length > 5 || lines.length * size * 1.12 > 395) && size > 40) lines = headlineLines(headline, width, --size);
  if (lines.length * size * 1.12 > 395) throw new Error("Graphic headline does not fit");
  const x = layout === 2 ? 112 : 80;
  const text = lines.map((line, i) => `<text x="${x}" y="${310 + i * size * 1.12}" font-size="${size}" font-weight="700">${escapeXml(line)}</text>`).join("");
  const illustration = symbol(input.kind, input.title, p.accent);
  const decorations = [
    `<path d="M0 725Q350 570 710 800L1080 650V875H0Z" fill="${p.soft}"/><g transform="translate(850,716)">${illustration}</g>`,
    `<rect x="824" y="190" width="256" height="680" rx="125" fill="${p.soft}"/><g transform="translate(943,470)">${illustration}</g><circle cx="943" cy="735" r="33" fill="${p.accent}"/>`,
    `<rect x="64" y="224" width="954" height="459" rx="26" fill="${p.soft}"/><path d="M80 225h150" stroke="${p.accent}" stroke-width="9"/><g transform="translate(860,740) scale(.8)">${illustration}</g>`,
    `<path d="M850 875V315a130 130 0 0 1 260 0v560Z" fill="${p.soft}"/><g transform="translate(955,465) scale(.9)">${illustration}</g><path d="M800 777h205" stroke="${p.accent}" stroke-width="8"/>`,
    `<path d="m-30 680 520-55 600 137v113H0Z" fill="${p.soft}"/><rect x="746" y="656" width="205" height="145" rx="20" transform="rotate(-9 850 730)" fill="${p.bg}"/><g transform="translate(850,729) scale(.7)">${illustration}</g>`,
    `<circle cx="980" cy="800" r="280" fill="${p.soft}"/><circle cx="925" cy="745" r="112" fill="${p.bg}"/><g transform="translate(925,745) scale(.8)">${illustration}</g><path d="M80 680h400" stroke="${p.accent}" stroke-width="6"/>`,
  ];
  const edition = new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${input.date}T12:00:00Z`));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
    <rect width="1080" height="1080" fill="${p.bg}"/>
    <g font-family="Lato" fill="${p.ink}">
      ${decorations[layout]}
      ${officialLogo()}
      <text x="1000" y="103" font-size="22" text-anchor="end">IMMIGRATION CANADA</text>
      <text x="80" y="195" fill="${p.accent}" font-size="23" font-weight="700" letter-spacing="2">${label}</text>
      ${text}
      <text x="80" y="${Math.max(718, 342 + lines.length * size * 1.12)}" font-size="27">${escapeXml(note)}</text>
      <text x="80" y="811" font-size="21" letter-spacing="1">${escapeXml(edition)} · ${input.kind === "job" ? "DETAILS IN THE CAPTION" : "JOIN THE CONVERSATION"}</text>
    </g>
    <rect y="864" width="1080" height="216" fill="#102b38"/>
    <g font-family="Lato" fill="#ffffff">
      <text x="80" y="925" font-size="37" font-weight="700">${input.purpose === "article" ? "Read the full article" : "Book your consultation"}</text>
      <path d="M932 911h56m-16-16 16 16-16 16" fill="none" stroke="#ffb29f" stroke-width="5"/>
      <text x="80" y="971" font-size="27" fill="#f6c6b7">${input.purpose === "article" ? "idlogice.com · Article link in the caption" : "idlogice.com/en/book-consultation"}</text>
      <text x="80" y="1032" font-size="29">contact@idlogice.com</text>
      <text x="1000" y="1032" font-size="29" text-anchor="end">+1 581-634-0224</text>
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
