import test from "node:test";
import assert from "node:assert/strict";
import {
  agencyBody,
  agencyTextLayout,
  agencyTextSvg,
  usesAgencyText,
} from "../src/lib/social/agency-text.ts";
import {
  generateSocialImage,
  socialGraphicSvg,
} from "../src/lib/social/image.ts";
import { completePost } from "../src/lib/social/calendar.ts";
const approved =
  "Only eligible applicants in the named category may qualify.\n\nThis listing was originally posted February 14, 2026. Confirm whether it is still open and whether the listed pay still applies.\n\nA job listing does not guarantee employment, a work permit, or permanent residence.";
const input = {
  title: "Planning your next steps in Canada",
  caption: completePost(approved),
  kind: "informative",
  date: "2026-11-01",
  ordinal: 0,
  purpose: "marketing",
};
test("text editions preserve every approved paragraph, date and qualifier; contacts move into the footer", () => {
  assert.equal(agencyBody(input), approved);
  const svg = agencyTextSvg(input);
  for (const phrase of [
    "contact@idlogice.com",
    "+1 581-634-0224",
    "idlogice.com/en/book-consultation",
    "Book your immigration consultation",
  ])
    assert.ok(svg.includes(phrase));
  const layout = agencyTextLayout(input);
  assert.equal(layout.blocks.map((b) => b.join(" ")).join("\n\n"), approved);
  assert.ok(layout.bodySize >= 24);
});
test("alternates text editions with existing styles and overrides stock only for selected news editions", () => {
  assert.equal(usesAgencyText(input), true);
  assert.equal(usesAgencyText({ ...input, ordinal: 1 }), false);
  assert.equal(usesAgencyText({ ...input, caption: undefined }), false);
  assert.match(
    socialGraphicSvg({ ...input, news: true }),
    /data-style="agency-text"/,
  );
  assert.match(
    socialGraphicSvg({ ...input, news: true, ordinal: 1 }),
    /data-stock-photo=/,
  );
});
test("article CTA retains article intent, escapes caption markup, and rejects unverifiable links", () => {
  const article = {
    ...input,
    purpose: "article",
    articleUrl: "https://idlogice.com/en/blog/verified-guide",
    caption: completePost("Keep A < B & C > D.", {
      purpose: "article",
      articleUrl: "https://idlogice.com/en/blog/verified-guide",
    }),
  };
  const svg = agencyTextSvg(article);
  assert.match(svg, /READ THE FULL IDLOGICE ARTICLE/);
  assert.match(svg, /A &lt; B &amp; C &gt; D/);
  assert.doesNotMatch(svg, /Book your immigration consultation/);
  assert.throws(
    () =>
      agencyTextSvg({ ...article, articleUrl: "https://other.example/story" }),
    /verified/,
  );
});
test("long captions hold rather than cutting off restrictions; emoji flags never become missing glyphs", () => {
  assert.throws(
    () =>
      agencyTextLayout({
        ...input,
        caption: "A complete required condition. ".repeat(300),
      }),
    /without truncation/,
  );
  assert.doesNotMatch(
    agencyBody({ ...input, caption: "Canada 🇨🇦 guidance 🛂" }),
    /🇨🇦|🛂/,
  );
});
test("renders a real PNG with the new portrait dimensions and no stock-photo designation", async () => {
  const image = await generateSocialImage(input);
  assert.equal(image.style, "agency-text");
  assert.equal(image.stockPhoto, undefined);
  assert.equal(image.bytes.readUInt32BE(16), 1080);
  assert.equal(image.bytes.readUInt32BE(20), 1620);
  assert.ok(image.bytes.length > 1000);
});
