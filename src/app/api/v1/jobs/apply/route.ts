import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const MAX_CV_BYTES = 5 * 1024 * 1024;

const applicationSchema = z.object({
  type: z.enum(["application", "eligibility"]),
  job: z.string().trim().min(1).max(160),
  noc: z.string().trim().min(1).max(40),
  name: z.string().trim().min(1).max(120),
  country: z.string().trim().min(1).max(100),
  age: z.string().trim().max(3).optional(),
  phone: z.string().trim().max(40).optional(),
  experience: z.string().trim().max(40).optional(),
  status: z.string().trim().max(80).optional(),
  profession: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2500).optional(),
});

function field(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

function escapeHtml(value = ""): string {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[char] ?? char);
}

function row(label: string, value?: string): string {
  if (!value) return "";
  return `<tr><td style="padding:6px 10px;border:1px solid #e5e7eb;font-weight:700;">${escapeHtml(label)}</td><td style="padding:6px 10px;border:1px solid #e5e7eb;">${escapeHtml(value)}</td></tr>`;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email || !user.email_confirmed_at) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }
  const parsed = applicationSchema.safeParse({
    type: field(formData, "type"),
    job: field(formData, "job"),
    noc: field(formData, "noc"),
    name: field(formData, "name"),
    country: field(formData, "country"),
    age: field(formData, "age"),
    phone: field(formData, "phone"),
    experience: field(formData, "experience"),
    status: field(formData, "status"),
    profession: field(formData, "profession"),
    message: field(formData, "message"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const cv = formData.get("cv");
  const attachments = [];
  if (cv instanceof File && cv.size > 0) {
    if (cv.size > MAX_CV_BYTES) {
      return NextResponse.json({ error: "CV file is too large" }, { status: 400 });
    }
    const allowed = new Set([
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]);
    if (!allowed.has(cv.type)) {
      return NextResponse.json({ error: "Unsupported CV file type" }, { status: 400 });
    }
    attachments.push({
      filename: cv.name.replace(/[^\w.\- ]/g, "_").slice(0, 120),
      content: Buffer.from(await cv.arrayBuffer()),
    });
  }

  const data = parsed.data;
  const title = data.type === "eligibility" ? "Job Eligibility Request" : "Job Application";
  const html = `<!doctype html>
<html><body style="font-family:Arial,sans-serif;color:#111827;">
  <h2>${title}</h2>
  <p>This submission was verified against a logged-in Supabase user.</p>
  <table style="border-collapse:collapse;">
    ${row("Job", data.job)}
    ${row("NOC", data.noc)}
    ${row("Account email", user.email)}
    ${row("Supabase user ID", user.id)}
    ${row("Name", data.name)}
    ${row("Phone", data.phone)}
    ${row("Country", data.country)}
    ${row("Age", data.age)}
    ${row("Profession", data.profession)}
    ${row("Experience", data.experience)}
    ${row("Immigration status", data.status)}
    ${row("Message", data.message)}
  </table>
</body></html>`;

  try {
    await resend.emails.send({
      from: "IDLOGICE <noreply@idlogice.com>",
      to: "contact@idlogice.com",
      replyTo: user.email,
      subject: `${title}: ${data.job}`,
      html,
      attachments,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Job application send error:", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
