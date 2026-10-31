import type { SocialContent } from "./content.ts";
import { completePost, type PostKind } from "./calendar.ts";
// Different platform copy, same verified topic and exact official news headline.
export function xCaption(content: SocialContent, kind: PostKind) {
  let body: string;
  if (kind === "question") {
    body = [
      "Canada plans on your mind? Let's hear from you.",
      content.graphicHeadline ?? content.title,
      "Reply with your general questions. Keep application details and personal documents private.",
      "Want to discuss your own next steps? Speak with IDLOGICE.",
    ].join("\n\n");
  } else if (kind === "job") {
    const details = content.text
      .split(/\n\n/)
      .filter((p) =>
        /^(Listed pay:|This listing was originally posted|An eligibility consultation|See the website for)/.test(
          p,
        ),
      );
    body = [
      `Canada job spotlight: ${content.title}`,
      ...details,
      "Check current availability, pay and requirements with IDLOGICE before applying. A listing does not guarantee a job, work permit or permanent residence.",
    ].join("\n\n");
  } else if (
    content.sourceType === "news" ||
    content.sourceType === "article"
  ) {
    body = [
      `${content.sourceKind === "ministerial" ? "Express Entry / ministerial briefing" : "Canada immigration briefing"}: ${content.title}`,
      content.sourcePublishedAt
        ? `Source date: ${content.sourcePublishedAt.slice(0, 10)}.`
        : "",
      "Before changing your plans, check the official scope, conditions and dates. An announcement is not an individual eligibility decision.",
      content.purpose === "article"
        ? "Explore the context in our IDLOGICE article, then consider how it relates to your circumstances."
        : "Questions about what this means for you? Book an IDLOGICE consultation to discuss your situation.",
      "General information; individual requirements apply.",
    ]
      .filter(Boolean)
      .join("\n\n");
  } else {
    const bodyOnly = content.text.split(
      /\n\n(?:Book your immigration consultation:|Read the full IDLOGICE article:)/,
    )[0];
    body = [
      `Your Canada planning note: ${content.title}`,
      bodyOnly,
      "Bring your questions to IDLOGICE and plan your next step.",
    ].join("\n\n");
  }
  return completePost(body, {
    purpose: content.purpose,
    articleUrl: content.articleUrl,
    kind,
    title: content.title,
  });
}
