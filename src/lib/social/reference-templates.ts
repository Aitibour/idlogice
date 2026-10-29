import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { PostKind, PostPurpose } from "./calendar.ts";
import {
  TEMPLATE_CATALOG,
  SOCIAL_TEMPLATES,
  chooseTemplate,
  graphicTopic,
  type SocialTemplate,
} from "./template-catalog.ts";
export {
  SOCIAL_TEMPLATES,
  TEMPLATE_CATALOG,
  chooseTemplate,
  graphicTopic,
  templateLogoVariant,
  type SocialTemplate,
} from "./template-catalog.ts";
export const GRAPHIC_VERSION = "topic-templates-30-news-stock-v4";
export type GraphicInput = {
  title: string;
  headline?: string;
  kind: PostKind;
  date: string;
  ordinal: number;
  purpose?: PostPurpose;
  news?: boolean;
  template?: SocialTemplate;
  policy?: boolean;
};
const RED = "#e51729",
  INK = "#222222",
  NAVY = "#10243c",
  WHITE = "#ffffff";
const cache = new Map<string, string>();
const escapeXml = (text: string) =>
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
function asset(name: string) {
  if (!cache.has(name))
    cache.set(
      name,
      readFileSync(join(process.cwd(), "assets/social", name)).toString(
        "base64",
      ),
    );
  return cache.get(name)!;
}
const rect = (
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  rx = 0,
  extra = "",
) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const text = (
  value: string,
  x: number,
  y: number,
  size: number,
  fill = INK,
  align = "start",
  weight = 700,
) =>
  `<text x="${x}" y="${y}" text-anchor="${align}" font-size="${size}" font-weight="${weight}" fill="${fill}">${escapeXml(value)}</text>`;
function logo(light: boolean, x = 54, y = 35, w = 250) {
  return `<image data-logo-variant="${light ? "light" : "dark"}" x="${x}" y="${y}" width="${w}" height="${w * 0.58}" preserveAspectRatio="xMinYMid meet" href="data:image/png;base64,${asset(`logo-${light ? "light" : "dark"}.png`)}"/>`;
}
function photo(name: string, x = 0, y = 0, w = 1080, h = 1350) {
  return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" overflow="hidden"><image width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" href="data:image/jpeg;base64,${asset(`backgrounds/${name}.jpg`)}"/></svg>`;
}
const textWidth = (value: string, size: number) =>
  [...value].reduce(
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
function wrap(value: string, width: number, size: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of value.trim().split(/\s+/)) {
    if (textWidth(word, size) > width) {
      if (line) {
        lines.push(line);
        line = "";
      }
      for (const c of word) {
        if (textWidth(line + c, size) > width) {
          lines.push(line);
          line = "";
        }
        line += c;
      }
    } else if (line && textWidth(`${line} ${word}`, size) > width) {
      lines.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines;
}
function fitted(
  value: string,
  x: number,
  y: number,
  w: number,
  h: number,
  max: number,
  colors: string[] = [INK],
  align = "start",
) {
  let size = max,
    lines = wrap(value, w, size);
  while (
    (lines.length * size * 1.08 > h ||
      value.split(/\s+/).some((word) => textWidth(word, size) > w)) &&
    size > 24
  )
    lines = wrap(value, w, --size);
  if (lines.length * size * 1.08 > h)
    throw new Error("Graphic headline does not fit; post held");
  return lines
    .map((line, i) =>
      text(
        line,
        x,
        y + i * size * 1.08,
        size,
        colors[i % colors.length],
        align,
      ),
    )
    .join("");
}
function badge(label: string, x: number, y: number, fill = RED, ink = WHITE) {
  return (
    rect(x, y - 29, Math.min(950, textWidth(label, 23) + 40), 46, fill, 5) +
    text(label, x + 20, y, 23, ink)
  );
}
function footer(input: GraphicInput, fill: string, ink: string) {
  const article = input.purpose === "article";
  return (
    rect(0, 1170, 1080, 180, fill) +
    text("idlogice.com", 56, 1223, 39, ink) +
    text(
      article ? "Read the full article" : "Book your consultation",
      1024,
      1223,
      30,
      ink,
      "end",
    ) +
    text(
      article
        ? "idlogice.com · Article link in the caption"
        : "idlogice.com/en/book-consultation",
      56,
      1268,
      28,
      ink,
      "start",
      400,
    ) +
    text("contact@idlogice.com", 56, 1320, 28, ink, "start", 400) +
    text("+1 581-634-0224", 1024, 1320, 28, ink, "end", 400)
  );
}
function checkCards(labels: readonly string[], y = 920) {
  return labels
    .map(
      (label, i) =>
        rect(
          56 + i * 328,
          y,
          306,
          145,
          WHITE,
          16,
          'stroke="#d9dfe6" stroke-width="2"',
        ) +
        text(String(i + 1).padStart(2, "0"), 78 + i * 328, y + 42, 24, RED) +
        fitted(label, 78 + i * 328, y + 83, 260, 55, 24, [NAVY]),
    )
    .join("");
}

export function referenceGraphicSvg(input: GraphicInput) {
  const headline = (input.headline || input.title).trim();
  if (!headline || headline.length > 350)
    throw new Error("Graphic headline is missing or too long");
  if (!Number.isInteger(input.ordinal) || input.ordinal < 0)
    throw new Error("Invalid graphic ordinal");
  const id = input.template ?? chooseTemplate(input),
    def = TEMPLATE_CATALOG.find((t) => t.id === id);
  if (!def || !SOCIAL_TEMPLATES.includes(id))
    throw new Error("Unknown graphic template");
  const { family, variant: v } = def,
    topic = graphicTopic(input);
  const topicLabel = {
    study: "STUDY IN CANADA",
    work: "WORK IN CANADA",
    "express-entry": "EXPRESS ENTRY & PR",
    family: "FAMILY SPONSORSHIP",
    policy: "IMMIGRATION POLICY",
    safety: "IMMIGRATION AWARENESS",
    citizenship: "CANADIAN CITIZENSHIP",
    settlement: "YOUR CANADA JOURNEY",
    jobs: "WEBSITE JOB SPOTLIGHT",
    question: "LET'S TALK CANADA",
  }[topic];
  const label = input.policy
    ? "MINISTERIAL UPDATE"
    : input.news
      ? "IRCC UPDATE"
      : input.purpose === "article"
        ? "IDLOGICE ARTICLE"
        : topicLabel;
  const note =
    input.kind === "job"
      ? "Confirm availability and requirements with IDLOGICE."
      : input.kind === "question"
        ? "Share your thoughts in the comments."
        : "Clear guidance. Practical next steps.";
  const cards =
    topic === "study"
      ? ["Review your goals", "Check official guidance", "Plan your next step"]
      : topic === "jobs"
        ? ["Review the listing", "Confirm availability", "Discuss your options"]
        : topic === "policy"
          ? [
              "Read the update",
              "Check dates and scope",
              "Review your situation",
            ]
          : [
              "Understand your options",
              "Check the requirements",
              "Plan your next step",
            ];
  const shot = topic === "study" ? "student" : "woman";
  let body = "",
    dateInk = INK,
    footFill = RED,
    footInk = WHITE;
  if (family === "editorial") {
    body = rect(0, 0, 1080, 1350, "#f8f7f3");
    if (v === 0)
      body +=
        rect(0, 0, 1080, 22, RED) +
        badge(label, 56, 330, INK) +
        fitted(headline, 56, 470, 960, 408, 89) +
        rect(56, 890, 190, 11, RED) +
        fitted(note, 56, 1015, 960, 85, 46, [RED]);
    if (v === 1)
      body +=
        rect(0, 0, 40, 1170, RED) +
        text("IDLOGICE EDITORIAL", 110, 285, 25, RED) +
        badge(label, 110, 370, INK) +
        fitted(headline, 110, 500, 870, 410, 83) +
        rect(110, 965, 870, 3, INK) +
        fitted(note, 110, 1050, 870, 65, 34, [RED]);
    if (v === 2)
      body +=
        badge(label, 340, 300) +
        fitted(headline, 540, 450, 950, 430, 83, [INK], "middle") +
        rect(430, 930, 220, 9, RED) +
        fitted(note, 540, 1050, 950, 70, 36, [RED], "middle");
    if (v === 3)
      body +=
        rect(
          56,
          280,
          968,
          800,
          "none",
          0,
          'stroke="#e51729" stroke-width="5"',
        ) +
        badge(label, 86, 345) +
        fitted(headline, 100, 490, 875, 420, 86) +
        text("IDLOGICE IMMIGRATION CANADA", 100, 1000, 25, RED);
    if (v === 4)
      body +=
        rect(0, 260, 1080, 220, RED) +
        text(topicLabel, 56, 350, 40, WHITE) +
        text("GUIDANCE FOR YOUR NEXT STEP", 56, 415, 24, WHITE) +
        fitted(headline, 56, 625, 960, 400, 86) +
        rect(56, 1094, 968, 5, INK);
    body += logo(false, v === 2 ? 410 : 54, 45, v === 2 ? 260 : 250);
  } else if (family === "skyline") {
    body = photo("skyline");
    dateInk = WHITE;
    footFill = "#b6101f";
    if (v === 0)
      body +=
        badge(label, 300, 258, INK) +
        fitted(headline, 300, 366, 700, 400, 82, [RED]) +
        fitted(note, 300, 800, 700, 68, 29) +
        checkCards(cards, 920);
    if (v === 1)
      body +=
        rect(56, 255, 968, 600, WHITE, 24) +
        badge(label, 90, 320) +
        fitted(headline, 90, 435, 880, 355, 80, [RED, INK]) +
        fitted(note, 90, 935, 900, 100, 35);
    if (v === 2)
      body +=
        rect(270, 235, 754, 830, "#ffffff", 100) +
        badge(label, 320, 340, INK) +
        fitted(headline, 320, 475, 650, 430, 76, [RED]) +
        fitted(note, 320, 990, 650, 70, 28);
    if (v === 3)
      body +=
        rect(485, 210, 595, 880, WHITE) +
        rect(485, 210, 14, 880, RED) +
        badge(label, 525, 315, INK) +
        fitted(headline, 525, 440, 495, 450, 77, [RED]) +
        fitted(note, 525, 985, 495, 90, 28);
    if (v === 4)
      body +=
        rect(110, 265, 860, 730, WHITE, 40) +
        badge(label, 160, 355) +
        fitted(headline, 540, 500, 770, 400, 78, [INK], "middle") +
        fitted(note, 540, 1060, 940, 65, 32, [INK], "middle");
    body += logo(false, 802, 30, 222);
  } else if (family === "phone") {
    body = photo("phone");
    footFill = WHITE;
    footInk = NAVY;
    if (v === 0)
      body +=
        badge(label, 56, 288, NAVY) +
        fitted(headline, 56, 407, 475, 500, 86, [RED]) +
        fitted(note, 56, 991, 475, 105, 32, [NAVY]);
    if (v === 1)
      body +=
        rect(30, 300, 510, 690, NAVY, 26) +
        badge(label, 56, 362) +
        fitted(headline, 56, 480, 450, 430, 74, [WHITE]) +
        fitted(note, 56, 1070, 475, 80, 29, [NAVY]);
    if (v === 2)
      body =
        rect(0, 0, 1080, 1170, WHITE) +
        photo("phone", 80, 425, 1000, 745) +
        rect(0, 235, 1080, 230, RED) +
        fitted(headline, 56, 310, 970, 160, 56, [WHITE]) +
        badge(label, 56, 515, NAVY) +
        fitted(note, 56, 1040, 430, 100, 28, [NAVY]);
    if (v === 3)
      body =
        rect(0, 0, 1080, 1170, WHITE) +
        photo("phone", 485, 300, 595, 830) +
        rect(40, 330, 10, 735, RED) +
        badge(label, 56, 285, NAVY) +
        fitted(headline, 80, 440, 405, 460, 77, [RED]) +
        fitted(note, 80, 1020, 405, 90, 28, [NAVY]);
    if (v === 4)
      body =
        rect(0, 0, 1080, 1170, WHITE) +
        photo("phone", 260, 180, 820, 720) +
        rect(0, 795, 1080, 340, RED) +
        badge(label, 56, 745, NAVY) +
        fitted(headline, 56, 880, 960, 240, 68, [WHITE]);
    body += logo(false, 54, 34, 270);
  } else if (family === "photo") {
    dateInk = WHITE;
    footFill = "#08090b";
    body = photo(shot);
    if (v === 0)
      body +=
        rect(0, 830, 1080, 340, "#000000", 0, 'fill-opacity=".72"') +
        badge(label, 56, 864) +
        fitted(headline, 56, 949, 960, 205, 65, [WHITE, "#19c8ef"]);
    if (v === 1)
      body =
        rect(0, 0, 1080, 1170, NAVY) +
        photo(shot, 0, 180, 1080, 650) +
        badge(label, 56, 885) +
        fitted(headline, 56, 970, 960, 180, 62, [WHITE, "#ea3bae"]);
    if (v === 2)
      body =
        rect(0, 0, 1080, 1170, NAVY) +
        photo(shot, 560, 200, 520, 970) +
        rect(525, 200, 10, 880, RED) +
        badge(label, 56, 325) +
        fitted(headline, 56, 445, 440, 530, 71, [WHITE, "#19c8ef"]);
    if (v === 3)
      body =
        rect(0, 0, 1080, 1170, NAVY) +
        photo(shot, 490, 255, 535, 720) +
        rect(490, 980, 535, 8, RED) +
        badge(label, 56, 320) +
        fitted(headline, 56, 460, 390, 530, 71, [WHITE, "#ea3bae"]);
    if (v === 4)
      body +=
        rect(
          40,
          785,
          1000,
          350,
          "#10243c",
          30,
          'stroke="#ffffff" stroke-width="2"',
        ) +
        badge(label, 72, 838) +
        fitted(headline, 72, 930, 930, 195, 64, [WHITE, "#19c8ef"]);
    if (v === 0 || v === 4) body += rect(0, 0, 1080, 180, NAVY);
    body += logo(true, 54, 20, 237);
  } else if (family === "flag") {
    body = photo("flag");
    dateInk = WHITE;
    footFill = "#9f0b1c";
    if (v === 0)
      body +=
        badge(label, 56, 390, WHITE, "#b91122") +
        fitted(headline, 56, 518, 950, 490, 103, [WHITE]) +
        fitted(note, 56, 1100, 960, 44, 31, [WHITE]);
    if (v === 1)
      body +=
        badge(label, 56, 375, WHITE, "#b91122") +
        rect(40, 445, 1000, 590, "#0759b1", 46) +
        fitted(headline, 80, 555, 915, 440, 94, [WHITE]) +
        fitted(note, 56, 1105, 960, 44, 31, [WHITE]);
    if (v === 2)
      body +=
        rect(56, 425, 968, 620, WHITE, 40) +
        '<path d="M170 1040v70l95-70Z" fill="#ffffff"/>' +
        badge(label, 90, 495) +
        fitted(headline, 90, 605, 890, 400, 88, [INK]);
    if (v === 3)
      body +=
        rect(
          55,
          410,
          970,
          650,
          "none",
          5,
          'stroke="#ffffff" stroke-width="5"',
        ) +
        badge(label, 85, 480, WHITE, RED) +
        fitted(headline, 85, 600, 905, 415, 91, [WHITE]);
    if (v === 4) {
      body +=
        rect(0, 535, 1080, 635, WHITE) +
        badge(label, 56, 605) +
        fitted(headline, 56, 735, 960, 320, 86, [INK]) +
        fitted(note, 56, 1110, 960, 50, 31, [RED]);
      dateInk = INK;
    }
    body += logo(true, 54, 35, 255);
  } else {
    const dark = [0, 4].includes(v);
    body = rect(0, 0, 1080, 1170, dark ? NAVY : "#f8f7f3");
    dateInk = dark ? WHITE : INK;
    if (v === 0)
      body +=
        rect(0, 220, 1080, 15, RED) +
        badge(label, 56, 340) +
        fitted(headline, 56, 470, 960, 390, 87, [WHITE]) +
        checkCards(cards, 950);
    if (v === 1)
      body +=
        rect(56, 245, 968, 8, RED) +
        badge(label, 56, 335, INK) +
        fitted(headline, 56, 465, 960, 390, 85) +
        checkCards(cards, 950);
    if (v === 2)
      body +=
        text("“", 56, 380, 170, RED) +
        rect(
          56,
          395,
          968,
          640,
          WHITE,
          50,
          'stroke="#e51729" stroke-width="3"',
        ) +
        badge(label, 90, 465) +
        fitted(headline, 90, 590, 890, 400, 85) +
        fitted(note, 56, 1110, 960, 50, 30, [RED]);
    if (v === 3)
      body +=
        rect(0, 255, 1080, 175, RED) +
        text(topicLabel, 56, 330, 36, WHITE) +
        text("INFORMATION · PLANNING · NEXT STEPS", 56, 389, 24, WHITE) +
        fitted(headline, 56, 575, 960, 315, 82) +
        checkCards(cards, 950);
    if (v === 4)
      body +=
        rect(55, 370, 920, 640, RED, 10) +
        rect(100, 325, 920, 640, WHITE, 10) +
        badge(label, 140, 405) +
        fitted(headline, 140, 535, 830, 380, 81) +
        fitted(note, 56, 1110, 960, 50, 30, [WHITE]);
    body += logo(dark, 54, 35, 250);
  }
  const edition = new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(`${input.date}T12:00:00Z`))
    .toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350" data-template="${id}" data-topic="${topic}" data-graphic-version="${GRAPHIC_VERSION}"><g font-family="Lato">${body}${text(edition, 1024, 1152, 18, dateInk, "end", 400)}${footer(input, footFill, footInk)}</g></svg>`;
}
