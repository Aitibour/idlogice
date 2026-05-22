/**
 * LinkedIn auto-publish module
 * Posts a summary of each new blog article as a LinkedIn post with a backlink.
 * Requires LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSON_URN env vars.
 *
 * To get credentials:
 * 1. Create a LinkedIn app at https://www.linkedin.com/developers/apps
 * 2. Request the r_liteprofile, w_member_social, and r_emailaddress scopes
 * 3. Exchange the OAuth code for an access token
 * 4. Set LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSON_URN (urn:li:person:XXXXXX) in Netlify env vars
 */

const LINKEDIN_API = "https://api.linkedin.com/v2";

export interface LinkedInPostPayload {
  title: string;
  summary: string;
  slug: string;
  locale?: string;
}

function buildPostText(payload: LinkedInPostPayload): string {
  const { title, summary, slug, locale = "en" } = payload;
  const url = `https://idlogice.com/${locale}/blog/${slug}`;

  const intros: Record<string, string> = {
    en: "New immigration insight just published:",
    fr: "Nouvel article immigration publié :",
    es: "Nuevo artículo de inmigración publicado:",
    ar: "مقال هجرة جديد تم نشره:",
  };

  const hashtags: Record<string, string> = {
    en: "#CanadaImmigration #ExpressEntry #CanadaPR #RCIC #Immigration",
    fr: "#ImmigrationCanada #EntréeExpress #CanadaRP #RCIC #Immigration",
    es: "#InmigraciónCanadá #ExpressEntry #CanadaRP #RCIC #Inmigración",
    ar: "#هجرة_كندا #Express_Entry #إقامة_دائمة #RCIC #هجرة",
  };

  const intro = intros[locale] ?? intros.en;
  const tags = hashtags[locale] ?? hashtags.en;

  return `${intro}\n\n📌 ${title}\n\n${summary}\n\n🔗 Read full guide: ${url}\n\n${tags}`;
}

export async function publishToLinkedIn(payload: LinkedInPostPayload): Promise<boolean> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const personUrn = process.env.LINKEDIN_PERSON_URN;

  if (!token || !personUrn) {
    console.log("LinkedIn: missing LINKEDIN_ACCESS_TOKEN or LINKEDIN_PERSON_URN — skipping");
    return false;
  }

  const text = buildPostText(payload);
  const url = `https://idlogice.com/${payload.locale ?? "en"}/blog/${payload.slug}`;

  const body = {
    author: personUrn,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text },
        shareMediaCategory: "ARTICLE",
        media: [
          {
            status: "READY",
            description: { text: payload.summary.slice(0, 256) },
            originalUrl: url,
            title: { text: payload.title },
          },
        ],
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  try {
    const res = await fetch(`${LINKEDIN_API}/ugcPosts`, {
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
      console.error("LinkedIn publish failed:", res.status, err);
      return false;
    }

    const data = await res.json() as { id: string };
    console.log("LinkedIn post published:", data.id);
    return true;
  } catch (err) {
    console.error("LinkedIn publish error:", err);
    return false;
  }
}
