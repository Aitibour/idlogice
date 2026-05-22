import { type NextRequest, NextResponse } from "next/server";

const REDIRECT_URI = "https://idlogice.com/api/linkedin/callback";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDesc = searchParams.get("error_description");

  if (error) {
    return new NextResponse(
      html(`<h2 style="color:red">LinkedIn error: ${error}</h2><p>${errorDesc ?? ""}</p>`),
      { headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }

  if (!code) {
    return new NextResponse(
      html(`<h2 style="color:red">No authorization code received.</h2><p>Did you complete the LinkedIn authorization?</p>`),
      { headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new NextResponse(
      html(`<h2 style="color:red">Missing LINKEDIN_CLIENT_ID or LINKEDIN_CLIENT_SECRET env vars.</h2>`),
      { headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }

  // Exchange code for access token — use Basic Auth (LinkedIn requirement)
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!tokenRes.ok) {
    const txt = await tokenRes.text();
    return new NextResponse(
      html(`<h2 style="color:red">Token exchange failed (${tokenRes.status})</h2><pre>${txt}</pre>`),
      { headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }

  const tokenData = (await tokenRes.json()) as { access_token: string; expires_in: number };
  const accessToken = tokenData.access_token;

  // Fetch person ID via /v2/me (works with w_member_social scope)
  let personUrn = "UNKNOWN";
  const meRes = await fetch("https://api.linkedin.com/v2/me?projection=(id)", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (meRes.ok) {
    const me = (await meRes.json()) as { id?: string };
    if (me.id) personUrn = `urn:li:person:${me.id}`;
  }

  const expiresInDays = Math.floor((tokenData.expires_in ?? 0) / 86400);

  return new NextResponse(
    html(`
      <h2 style="color:green">&#10003; LinkedIn OAuth successful!</h2>
      <p>Run these two commands in your terminal, then redeploy:</p>
      <pre>netlify env:set LINKEDIN_ACCESS_TOKEN "${accessToken}"
netlify env:set LINKEDIN_PERSON_URN "${personUrn}"
netlify deploy --prod --build</pre>
      <hr/>
      <table>
        <tr><td><strong>LINKEDIN_ACCESS_TOKEN</strong></td><td><code style="word-break:break-all">${accessToken}</code></td></tr>
        <tr><td><strong>LINKEDIN_PERSON_URN</strong></td><td><code>${personUrn}</code></td></tr>
        <tr><td><strong>Expires</strong></td><td>${expiresInDays} days</td></tr>
      </table>
    `),
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
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
