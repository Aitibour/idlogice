import { graphicTopic } from "./template-catalog.ts";
import type { PostKind } from "./calendar.ts";

// Reviewed free Pexels photographs, downloaded once; no runtime scraping or fee.
// Source pages, photographers and license are retained with the bundled assets.
export const STOCK_PHOTOS = [
  {
    id: "parliament",
    pexelsId: 15715832,
    photographer: "Tetyana Kovyrina",
    page: "https://www.pexels.com/photo/parliament-hill-in-ottawa-canada-15715832/",
    topics: ["policy", "safety", "citizenship", "express-entry"],
  },
  {
    id: "library",
    pexelsId: 18361685,
    photographer: "Beyzaa",
    page: "https://www.pexels.com/photo/stacks-of-old-books-in-a-library-18361685/",
    topics: ["study"],
  },
  {
    id: "family",
    pexelsId: 8945222,
    photographer: "Anastasia Shuraeva",
    page: "https://www.pexels.com/photo/hands-of-mother-father-and-child-placed-on-top-of-each-other-8945222/",
    topics: ["family", "question"],
  },
  {
    id: "toronto",
    pexelsId: 11819103,
    photographer: "alex ohan",
    page: "https://www.pexels.com/photo/the-toronto-skyline-11819103/",
    topics: ["settlement", "express-entry", "work"],
  },
  {
    id: "peace-tower",
    pexelsId: 4062549,
    photographer: "Erik Mclean",
    page: "https://www.pexels.com/photo/peace-tower-building-under-blue-sky-4062549/",
    topics: ["policy", "safety", "citizenship"],
  },
  {
    id: "work",
    pexelsId: 11321790,
    photographer: "Safari Consoler",
    page: "https://www.pexels.com/photo/construction-man-wearing-a-safety-helmet-11321790/",
    topics: ["jobs", "work"],
  },
] as const;
export function stockPhotoFor(input: {
  kind: PostKind;
  title: string;
  headline?: string;
  ordinal: number;
}) {
  const topic = graphicTopic(input);
  const relevant = STOCK_PHOTOS.filter((photo) =>
    (photo.topics as readonly string[]).includes(topic),
  );
  // A construction photo must not illustrate an unrelated occupation or imply
  // that the model is an IDLOGICE client. General work stories use a city image.
  const choices = relevant.filter(
    (photo) =>
      photo.id !== "work" ||
      /construction|builder|carpenter|roofer|electrician/i.test(input.title),
  );
  return (choices.length ? choices : [STOCK_PHOTOS[3]])[
    input.ordinal % (choices.length || 1)
  ];
}
