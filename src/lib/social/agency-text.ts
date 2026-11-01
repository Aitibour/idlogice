import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { GraphicInput } from "./reference-templates.ts";

// A deterministic alternate edition, shared by all three networks.
export const usesAgencyText = (input: GraphicInput) =>
  !!input.caption?.trim() && input.ordinal % 2 === 0;

const xml = (text: string) =>
  text.replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c]!,
  );
const clean = (text: string) =>
  text
    .replace(
      /[\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u200D]/gu,
      "",
    )
    .trim();

export function agencyBody(input: GraphicInput) {
  if (!input.caption)
    throw new Error("Text graphic requires the approved caption");
  // Remove only dedicated contact/CTA/hashtag lines reproduced in the footer.
  // Keep complete paragraphs, numbers, dates, restrictions and qualifications.
  return input.caption
    .split("\n")
    .filter(
      (line) =>
        !/^\s*(?:#|Email:|Call:|Book your immigration consultation:|Read the full IDLOGICE article:)/i.test(
          line,
        ),
    )
    .map(clean)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Conservative Lato width estimate; long unbroken words also wrap safely.
function width(text: string, size: number) {
  return [...text].reduce(
    (sum, c) =>
      sum +
      (/\s/.test(c)
        ? 0.3
        : /[MW@%]/.test(c)
          ? 1
          : /[mw]/.test(c)
            ? 0.86
            : /[ilI.,:;'!|]/.test(c)
              ? 0.3
              : /[A-Z]/.test(c)
                ? 0.76
                : 0.62) *
        size,
    0,
  );
}
function wrap(text: string, size: number, max: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (width(word, size) > max) {
      if (line) lines.push(line);
      line = "";
      for (const char of word) {
        if (width(line + char, size) > max) {
          lines.push(line);
          line = "";
        }
        line += char;
      }
    } else if (line && width(`${line} ${word}`, size) > max) {
      lines.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines;
}
const text = (
  value: string,
  x: number,
  y: number,
  size: number,
  fill = "#142840",
  bold = false,
) =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="${bold ? 700 : 400}" fill="${fill}">${xml(value)}</text>`;

export function agencyTextLayout(input: GraphicInput) {
  const title = clean(input.headline ?? input.title);
  let titleSize = 52;
  while (
    wrap(title, titleSize, 884).length * titleSize * 1.14 > 224 &&
    titleSize > 30
  )
    titleSize--;
  const titleLines = wrap(title, titleSize, 884);
  if (titleLines.length * titleSize * 1.14 > 224)
    throw new Error("Text graphic headline does not fit; post held");
  const paragraphs = agencyBody(input)
    .split(/\n\s*\n/)
    .filter(Boolean);
  let bodySize = 34;
  const layout = (size: number) =>
    paragraphs.map((p) =>
      p.split("\n").flatMap((line) => wrap(line, size, 850)),
    );
  let blocks = layout(bodySize);
  const height = () =>
    blocks.reduce((sum, lines) => sum + lines.length * bodySize * 1.32 + 22, 0);
  while (height() > 786 && bodySize > 24) {
    bodySize--;
    blocks = layout(bodySize);
  }
  if (!blocks.length || height() > 786)
    throw new Error(
      "Approved caption does not fit the image legibly; post held without truncation",
    );
  return { titleSize, titleLines, bodySize, blocks };
}

export function agencyTextSvg(input: GraphicInput) {
  const { titleSize, titleLines, bodySize, blocks } = agencyTextLayout(input);
  const logo = readFileSync(
    join(process.cwd(), "assets/social/logo-dark.png"),
  ).toString("base64");
  const article = input.purpose === "article";
  if (
    article &&
    !/^https:\/\/idlogice\.com\/en\/blog\/[a-z0-9-]+$/.test(
      input.articleUrl ?? "",
    )
  )
    throw new Error(
      "Article graphic requires the verified IDLOGICE article URL",
    );
  const label =
    input.kind === "job"
      ? "CANADA JOB SPOTLIGHT"
      : input.kind === "question"
        ? "YOUR CANADIAN JOURNEY"
        : "CANADA IMMIGRATION BRIEF";
  const edition = new Date(`${input.date}T12:00:00Z`).toLocaleDateString(
    "en-CA",
    { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" },
  );
  let y = 516;
  const body = blocks
    .map((lines) => {
      const rendered = lines
        .map((line) => {
          const result = text(line, 102, y, bodySize);
          y += bodySize * 1.32;
          return result;
        })
        .join("");
      y += 22;
      return rendered;
    })
    .join("");
  // 2:3 portrait keeps the full approved text readable in the feed.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1620" viewBox="0 0 1080 1620" data-style="agency-text" font-family="Lato">
    <rect width="1080" height="1620" fill="#f3f1ed"/>
    <rect width="1080" height="14" fill="#cf142b"/>
    <image x="76" y="28" width="240" height="134" preserveAspectRatio="xMinYMid meet" href="data:image/png;base64,${logo}"/>
    ${text("IMMIGRATION CANADA", 650, 81, 25, "#142840", true)}
    ${text(edition.toUpperCase(), 650, 120, 22, "#66717f")}
    <rect x="76" y="184" width="928" height="40" rx="5" fill="#cf142b"/>
    ${text(label, 94, 212, 23, "#ffffff", true)}
    ${titleLines.map((line, i) => text(line, 76, 282 + i * titleSize * 1.14, titleSize, "#142840", true)).join("")}
    <rect x="76" y="460" width="928" height="854" rx="20" fill="#ffffff"/>
    <rect x="76" y="484" width="5" height="76" fill="#cf142b"/>
    ${body}
    <rect x="0" y="1340" width="1080" height="280" fill="#142840"/>
    ${text(article ? "READ THE FULL IDLOGICE ARTICLE" : "PLAN YOUR NEXT STEP WITH IDLOGICE", 76, 1396, 28, "#ffffff", true)}
    <rect x="76" y="1420" width="928" height="52" rx="8" fill="#cf142b"/>
    ${text(article ? "Read the article • Link in caption" : "Book your immigration consultation", 100, 1455, 27, "#ffffff", true)}
    ${text("contact@idlogice.com  |  +1 581-634-0224", 76, 1520, 29, "#ffffff", true)}
    ${text(article ? "idlogice.com • Verified article link in caption" : "idlogice.com/en/book-consultation", 76, 1566, 26, "#d4dce5")}
    </svg>`;
}
