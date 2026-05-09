export const dynamic = "force-static";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const digits = params.get("Digits");
  const lang = req.nextUrl.searchParams.get("lang") === "fr" ? "fr" : "en";

  if (digits === "1") {
    // Replay main greeting
    return NextResponse.redirect(new URL("/api/voice", req.url), { status: 303 });
  }

  const goodbye =
    lang === "fr"
      ? `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Chantal" language="fr-CA">Merci d'avoir appelé I D Logice. À bientôt !</Say>
  <Hangup/>
</Response>`
      : `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-CA">Thank you for calling I D Logice. Have a great day!</Say>
  <Hangup/>
</Response>`;

  return new NextResponse(goodbye, {
    headers: { "Content-Type": "text/xml" },
  });
}
