import { type NextRequest, NextResponse } from "next/server";

const REDIRECT_URI = "https://idlogice.com/api/linkedin/callback";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDesc = searchParams.get("error_description");
  const expectedState = process.env.LINKEDIN_OAUTH_STATE;
  const headers = {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store",
    "x-robots-tag": "noindex, nofollow",
  };

  if (error) {
    return new NextResponse(
      html(`<h2 style="color:red">LinkedIn error: ${escapeHtml(error)}</h2><p>${escapeHtml(errorDesc ?? "")}</p>`),
      { headers }
    );
  }

  if (!expectedState || state !== expectedState) {
    return new NextResponse(
      html("<h2 style=\"color:red\">Invalid OAuth state.</h2><p>Restart the LinkedIn authorization flow with a valid state token.</p>"),
      { status: 403, headers }
    );
  }

  if (!code) {
    return new NextResponse(
      html(`<h2 style="color:red">No authorization code received.</h2><p>Did you complete the LinkedIn authorization?</p>`),
      { headers }
    );
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new NextResponse(
      html(`<h2 style="color:red">Missing LINKEDIN_CLIENT_ID or LINKEDIN_CLIENT_SECRET env vars.</h2>`),
      { headers }
    );
  }

  // Exchange code for access token — LinkedIn requires credentials in body
  const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!tokenRes.ok) {
    const txt = await tokenRes.text();
    return new NextResponse(
      html(`<h2 style="color:red">Token exchange failed (${tokenRes.status})</h2><pre>${escapeHtml(txt)}</pre>`),
      { headers }
    );
  }

  const tokenData = (await tokenRes.json()) as { access_token: string; expires_in: number };
  const accessToken = tokenData.access_token;

  // Fetch person URN — try OpenID userinfo first, fallback to /v2/me
  let personUrn = "UNKNOWN";
  let urnError = "";
  const uiRes = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (uiRes.ok) {
    const ui = (await uiRes.json()) as { sub?: string; name?: string };
    if (ui.sub) personUrn = `urn:li:person:${ui.sub}`;
  } else {
    const uiBody = await uiRes.json().catch(() => ({})) as { message?: string };
    urnError = `userinfo: ${uiRes.status} ${uiBody.message ?? ""}`;
    // Fallback: /v2/me
    const meRes = await fetch("https://api.linkedin.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}`, "LinkedIn-Version": "202401" },
    });
    if (meRes.ok) {
      const me = (await meRes.json()) as { id?: string };
      if (me.id) personUrn = `urn:li:person:${me.id}`;
    } else {
      const meBody = await meRes.json().catch(() => ({})) as { message?: string };
      urnError += ` | me: ${meRes.status} ${meBody.message ?? ""}`;
    }
  }

  const expiresInDays = Math.floor((tokenData.expires_in ?? 0) / 86400);

  return new NextResponse(
    html(`
      <h2 style="color:green">&#10003; LinkedIn OAuth successful!</h2>
      <p>The token exchange succeeded. For security, this page does not print bearer tokens.</p>
      <p>Store the access token directly from a trusted server-side OAuth flow, then redeploy.</p>
      <hr/>
      <table>
        <tr><td><strong>LINKEDIN_PERSON_URN</strong></td><td><code>${escapeHtml(personUrn)}</code></td></tr>
        <tr><td><strong>Expires</strong></td><td>${expiresInDays} days</td></tr>
        ${urnError ? `<tr><td><strong>URN debug</strong></td><td><code style="color:red">${escapeHtml(urnError)}</code></td></tr>` : ""}
      </table>
    `),
    { headers }
  );
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[char] ?? char);
}

function html(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>LinkedIn OAuth - IDLOGICE</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 860px; margin: 60px auto; padding: 0 20px; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    td { border: 1px solid #ddd; padding: 10px 14px; vertical-align: top; }
    td:first-child { white-space: nowrap; width: 220px; }
    pre { background: #f5f5f5; padding: 14px; border-radius: 6px; overflow-x: auto; font-size: 0.82em; }
    code { background: #f5f5f5; padding: 2px 5px; border-radius: 4px; font-size: 0.85em; }
  </style>
</head>
<body>${body}</body>
</html>`;
}
