/**
 * LinkedIn auto-publish module
 * Publishes a text post (no URL in body) then drops the article link
 * as the first comment — maximising organic reach on LinkedIn.
 */

export interface LinkedInPostPayload {
  title: string;
  summary: string;
  slug: string;
  locale?: string;
}

const BASE_URL = "https://idlogice.com";
const LI_API = "https://api.linkedin.com/v2";

// ─── Post body copy ───────────────────────────────────────────────────────────

function buildPostText(payload: LinkedInPostPayload): string {
  const { title, summary, locale = "en" } = payload;
  const clean = summary.replace(/[-–—]/g, " ").replace(/\s{2,}/g, " ").trim();

  if (locale === "fr") {
    return [
      `Nouveau sur notre blog ✍️`,
      ``,
      `${title}`,
      ``,
      `${clean}`,
      ``,
      `Si vous réfléchissez à immigrer au Canada, cet article est fait pour vous. Lisez, partagez et posez vos questions en commentaire — notre équipe de consultants RCIC est là pour vous répondre. 👇`,
      ``,
      `#ImmigrationCanada #EntréeExpress #VisaCanada #ConsultantImmigration #RCIC`,
    ].join("\n");
  }

  if (locale === "es") {
    return [
      `Nuevo en nuestro blog ✍️`,
      ``,
      `${title}`,
      ``,
      `${clean}`,
      ``,
      `Si estás pensando en emigrar a Canadá, este artículo es para ti. Léelo, compártelo y deja tus preguntas en los comentarios. Nuestro equipo de consultores RCIC responderá. 👇`,
      ``,
      `#InmigraciónCanadá #EntradaExprés #VisaCanadá #ConsultorImmigración`,
    ].join("\n");
  }

  if (locale === "ar") {
    return [
      `جديد على مدونتنا ✍️`,
      ``,
      `${title}`,
      ``,
      `${clean}`,
      ``,
      `إذا كنت تفكر في الهجرة إلى كندا، هذا المقال لك. اقرأه وشاركه واترك أسئلتك في التعليقات وسيجيبك فريقنا من المستشارين المعتمدين. 👇`,
      ``,
      `#هجرة_كندا #الدخول_السريع #تأشيرة_كندا #مستشار_هجرة`,
    ].join("\n");
  }

  // Default: English
  return [
    `Something worth reading if you're on the path to Canadian immigration ✍️`,
    ``,
    `${title}`,
    ``,
    `${clean}`,
    ``,
    `Whether you're just starting out or deep in the process, understanding the details makes all the difference. Drop your questions in the comments and our RCIC consultants will get back to you. 👇`,
    ``,
    `#CanadaImmigration #ExpressEntry #CanadaPR #RCIC #ImmigrationTips #MoveToCanada`,
  ].join("\n");
}

// ─── Publish post ─────────────────────────────────────────────────────────────

async function createPost(
  token: string,
  personUrn: string,
  text: string
): Promise<string | null> {
  const body = {
    author: personUrn,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text },
        shareMediaCategory: "NONE",
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  const res = await fetch(`${LI_API}/ugcPosts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("LinkedIn post failed:", res.status, err);
    return null;
  }

  // LinkedIn returns the post URN in the X-RestLi-Id header
  const postUrn = res.headers.get("x-restli-id") ?? res.headers.get("X-RestLi-Id");
  if (postUrn) return postUrn;

  // Fallback: parse from response body
  try {
    const data = (await res.json()) as { id?: string };
    return data.id ?? null;
  } catch {
    return null;
  }
}

// ─── Post first comment with article URL ─────────────────────────────────────

async function postComment(
  token: string,
  personUrn: string,
  postUrn: string,
  articleUrl: string
): Promise<void> {
  const encodedUrn = encodeURIComponent(postUrn);
  const res = await fetch(`${LI_API}/socialActions/${encodedUrn}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      actor: personUrn,
      message: { text: `Read the full article here 👉 ${articleUrl}` },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("LinkedIn comment failed:", res.status, err);
  } else {
    console.log("LinkedIn first comment posted with URL:", articleUrl);
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function publishToLinkedIn(payload: LinkedInPostPayload): Promise<boolean> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const personUrn = process.env.LINKEDIN_PERSON_URN;

  if (!token || !personUrn || personUrn === "UNKNOWN") {
    console.log("LinkedIn credentials not configured — skipping publish");
    return false;
  }

  const text = buildPostText(payload);
  const articleUrl = `${BASE_URL}/en/blog/${payload.slug}`;

  console.log("Publishing to LinkedIn:", payload.title);

  const postUrn = await createPost(token, personUrn, text);
  if (!postUrn) return false;

  console.log("LinkedIn post created:", postUrn);

  // Small delay to ensure the post is indexed before commenting
  await new Promise((r) => setTimeout(r, 3000));

  await postComment(token, personUrn, postUrn, articleUrl);

  return true;
}
