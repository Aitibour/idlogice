/**
 * LinkedIn auto-publish module
 * 1. Uploads DALL-E cover image to LinkedIn media
 * 2. Creates a humanized post with the image attached (no URL in body)
 * 3. Posts the article URL as the first comment
 */

export interface LinkedInPostPayload {
  title: string;
  summary: string;
  slug: string;
  locale?: string;
  coverImage?: Buffer | null; // PNG/JPEG buffer from DALL-E
}

const BASE_URL = "https://idlogice.com";
const LI_API = "https://api.linkedin.com/v2";

// ─── Post copy ────────────────────────────────────────────────────────────────

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

  return [
    `Something worth reading if you are on the path to Canadian immigration ✍️`,
    ``,
    `${title}`,
    ``,
    `${clean}`,
    ``,
    `Whether you are just starting out or deep in the process, understanding the details makes all the difference. Drop your questions in the comments and our RCIC consultants will get back to you. 👇`,
    ``,
    `#CanadaImmigration #ExpressEntry #CanadaPR #RCIC #ImmigrationTips #MoveToCanada`,
  ].join("\n");
}

// ─── Upload image to LinkedIn ─────────────────────────────────────────────────

async function uploadImageToLinkedIn(
  token: string,
  personUrn: string,
  imageBuffer: Buffer
): Promise<string | null> {
  // Step 1: register the upload
  const registerRes = await fetch(`${LI_API}/assets?action=registerUpload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
        owner: personUrn,
        serviceRelationships: [
          {
            relationshipType: "OWNER",
            identifier: "urn:li:userGeneratedContent",
          },
        ],
      },
    }),
  });

  if (!registerRes.ok) {
    const err = await registerRes.text();
    console.error("LinkedIn register upload failed:", registerRes.status, err);
    return null;
  }

  const registerData = (await registerRes.json()) as {
    value: {
      asset: string;
      uploadMechanism: {
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest": {
          uploadUrl: string;
        };
      };
    };
  };

  const assetUrn = registerData.value.asset;
  const uploadUrl =
    registerData.value.uploadMechanism[
      "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
    ].uploadUrl;

  // Step 2: upload binary to S3
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "image/png",
    },
    body: imageBuffer,
  });

  if (!uploadRes.ok) {
    console.error("LinkedIn image upload failed:", uploadRes.status);
    return null;
  }

  console.log("LinkedIn image uploaded:", assetUrn);
  return assetUrn;
}

// ─── Create post ──────────────────────────────────────────────────────────────

async function createPost(
  token: string,
  personUrn: string,
  text: string,
  assetUrn: string | null,
  title: string
): Promise<string | null> {
  const mediaContent = assetUrn
    ? {
        shareMediaCategory: "IMAGE",
        media: [
          {
            status: "READY",
            description: { text: title },
            media: assetUrn,
            title: { text: title },
          },
        ],
      }
    : { shareMediaCategory: "NONE" };

  const body = {
    author: personUrn,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text },
        ...mediaContent,
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

  const postUrn =
    res.headers.get("x-restli-id") ?? res.headers.get("X-RestLi-Id");
  if (postUrn) return postUrn;

  try {
    const data = (await res.json()) as { id?: string };
    return data.id ?? null;
  } catch {
    return null;
  }
}

// ─── First comment with article URL ──────────────────────────────────────────

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
    console.log("LinkedIn first comment posted:", articleUrl);
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

  // Upload cover image if provided
  let assetUrn: string | null = null;
  if (payload.coverImage) {
    assetUrn = await uploadImageToLinkedIn(token, personUrn, payload.coverImage);
  }

  // Create post (with or without image)
  const postUrn = await createPost(token, personUrn, text, assetUrn, payload.title);
  if (!postUrn) return false;

  console.log("LinkedIn post created:", postUrn);

  // Wait for post to be indexed, then add URL as first comment
  await new Promise((r) => setTimeout(r, 3000));
  await postComment(token, personUrn, postUrn, articleUrl);

  return true;
}
