import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const payloadSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  crsScore: z.coerce.number().int().min(0).max(1200),
  eligible: z.boolean(),
  improvements: z.array(z.string().trim().min(1).max(220)).max(5).default([]),
});

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[char] ?? char);
}

export async function POST(req: NextRequest) {
  // Verify the user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = payloadSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { firstName, crsScore, eligible, improvements } = parsed.data;
  const safeFirstName = escapeHtml(firstName);
  const subjectFirstName = firstName.replace(/[\r\n]/g, " ");

  const scoreColor = crsScore >= 470 ? "#16a34a" : crsScore >= 400 ? "#d97706" : "#dc2626";
  const scoreLabel = crsScore >= 470 ? "Competitive" : crsScore >= 400 ? "Developing" : "Needs Improvement";

  const topImprovements = improvements.slice(0, 3).map(escapeHtml);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your CRS Evaluation Results</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#c2272d 0%,#8b1a1f 100%);padding:32px 40px;text-align:center;">
            <img src="https://idlogice.com/logo.png" alt="IDLOGICE" height="40" style="height:40px;filter:brightness(0)invert(1);margin-bottom:16px;" />
            <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 4px;">Your CRS Evaluation Results</h1>
            <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;">Express Entry — Free Profile Assessment</p>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:32px 40px 0;">
            <p style="font-size:16px;color:#111827;margin:0 0 8px;">Hi <strong>${safeFirstName}</strong> 👋</p>
            <p style="font-size:14px;color:#6b7280;margin:0;">
              Here are the results of your free Express Entry CRS evaluation. Our certified consultants have reviewed your profile and prepared personalised next steps for you.
            </p>
          </td>
        </tr>

        <!-- Score Card -->
        <tr>
          <td style="padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
              <tr>
                <td style="padding:24px;text-align:center;">
                  <p style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6b7280;margin:0 0 8px;">Your Estimated CRS Score</p>
                  <p style="font-size:64px;font-weight:900;color:${scoreColor};margin:0;line-height:1;">${crsScore}</p>
                  <span style="display:inline-block;margin-top:8px;padding:4px 14px;border-radius:999px;background:${scoreColor}1a;color:${scoreColor};font-size:12px;font-weight:700;">${scoreLabel}</span>
                  ${eligible
                    ? `<p style="margin:16px 0 0;font-size:13px;color:#16a34a;font-weight:600;">✓ You may be eligible for Express Entry invitations</p>`
                    : `<p style="margin:16px 0 0;font-size:13px;color:#dc2626;font-weight:600;">Your score is below the current cutoff — but we can help improve it</p>`
                  }
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Improvements -->
        ${topImprovements.length > 0 ? `
        <tr>
          <td style="padding:0 40px 24px;">
            <p style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#374151;margin:0 0 12px;">Top Ways to Boost Your Score</p>
            ${topImprovements.map(tip => `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
              <tr>
                <td style="padding:10px 14px;background:#fff7ed;border-left:3px solid #f97316;border-radius:0 6px 6px 0;font-size:13px;color:#374151;">${tip}</td>
              </tr>
            </table>`).join("")}
          </td>
        </tr>` : ""}

        <!-- CTA -->
        <tr>
          <td style="padding:0 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#fef2f2 0%,#fff7ed 100%);border:1px solid #fecaca;border-radius:12px;">
              <tr>
                <td style="padding:24px;text-align:center;">
                  <p style="font-size:16px;font-weight:700;color:#111827;margin:0 0 8px;">Ready to Take the Next Step?</p>
                  <p style="font-size:13px;color:#6b7280;margin:0 0 20px;">Speak with a CICC-registered consultant and get a personalised immigration strategy — completely free.</p>
                  <a href="https://idlogice.com/en/book-consultation"
                    style="display:inline-block;background:#c2272d;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:999px;letter-spacing:0.02em;">
                    Get My Free Evaluation →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
            <p style="font-size:12px;color:#9ca3af;margin:0 0 4px;">IDLOGICE Immigration Consulting · 410 Saint-Catherine St, Montreal, Canada</p>
            <p style="font-size:12px;color:#9ca3af;margin:0 0 4px;">
              <a href="https://idlogice.com" style="color:#c2272d;text-decoration:none;">idlogice.com</a> ·
              <a href="mailto:contact@idlogice.com" style="color:#c2272d;text-decoration:none;">contact@idlogice.com</a>
            </p>
            <p style="font-size:11px;color:#d1d5db;margin:12px 0 0;">
              You received this email because you completed a free CRS evaluation on IDLOGICE.<br/>
              This score is an estimate. For a precise assessment, consult a Regulated Canadian Immigration Consultant (RCIC).
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: "IDLOGICE <noreply@idlogice.com>",
      to: user.email!,
      subject: `Your CRS Score: ${crsScore} — ${subjectFirstName}, here are your next steps`,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
