import { NextRequest, NextResponse } from "next/server";

// Business hours: Mon–Fri 9 AM – 5 PM Eastern Time
function getCallContext(): "open" | "weekend" | "after-hours" {
  const now = new Date();
  // Convert to Eastern Time
  const eastern = new Date(now.toLocaleString("en-US", { timeZone: "America/Toronto" }));
  const day = eastern.getDay();   // 0=Sun, 1=Mon … 6=Sat
  const hour = eastern.getHours();
  const minute = eastern.getMinutes();
  const timeAsMinutes = hour * 60 + minute;
  const open = 9 * 60;   // 9:00 AM
  const close = 17 * 60; // 5:00 PM

  if (day === 0 || day === 6) return "weekend";
  if (timeAsMinutes < open || timeAsMinutes >= close) return "after-hours";
  return "open";
}

// ── Greetings ──────────────────────────────────────────────────────────────

const OPEN_EN = `
  Thank you for calling I D Logice — your trusted Canadian immigration consultants.
  We are delighted to assist you on your path to Canada.
  All of our services — whether remote or in our office — are conducted by appointment only.
  To book your consultation and begin your immigration journey, please visit our website at:
  www dot idlogice dot com. That is: I, D, L, O, G, I, C, E dot com.
  Our certified consultants will review your profile and guide you through every step of the process.
  We look forward to helping you achieve your Canadian dream.
  Have a wonderful day, and we hope to speak with you soon!
`.trim();

const OPEN_FR = `
  Merci d'avoir appelé I D Logice — vos consultants en immigration canadienne de confiance.
  Nous sommes ravis de vous aider dans votre parcours vers le Canada.
  Tous nos services — à distance ou en personne dans notre bureau — se déroulent sur rendez-vous uniquement.
  Pour réserver votre consultation et commencer votre démarche d'immigration, visitez notre site web :
  www point idlogice point com. C'est : I, D, L, O, G, I, C, E point com.
  Nos consultants certifiés analyseront votre profil et vous guideront à chaque étape du processus.
  Nous avons hâte de vous aider à réaliser votre rêve canadien. Bonne journée !
`.trim();

const WEEKEND_EN = `
  Thank you for calling I D Logice — your trusted Canadian immigration consultants.
  Our office is currently closed for the weekend.
  Our business hours are Monday to Friday, 9 AM to 5 PM Eastern Time.
  To book a consultation or an appointment to visit us at our office,
  please visit our website at www dot idlogice dot com — I, D, L, O, G, I, C, E dot com —
  where you can schedule your session online at any time.
  We look forward to assisting you and helping you begin your journey to Canada.
  Have a wonderful weekend, and we will be happy to speak with you on Monday!
`.trim();

const WEEKEND_FR = `
  Merci d'avoir appelé I D Logice — vos consultants en immigration canadienne de confiance.
  Notre bureau est actuellement fermé pour le week-end.
  Nos heures d'ouverture sont du lundi au vendredi, de 9h à 17h, heure de l'Est.
  Pour réserver une consultation ou un rendez-vous pour nous rendre visite à notre bureau,
  visitez notre site web à www point idlogice point com — I, D, L, O, G, I, C, E point com —
  où vous pouvez planifier votre rendez-vous en ligne à tout moment.
  Nous avons hâte de vous aider dans votre parcours vers le Canada.
  Bon week-end, et nous serons heureux de vous parler lundi !
`.trim();

const AFTER_HOURS_EN = `
  Thank you for calling I D Logice — your trusted Canadian immigration consultants.
  You have reached us outside of our business hours.
  Our office is open Monday to Friday, from 9 AM to 5 PM Eastern Time.
  To book a consultation or schedule an appointment to visit us at our office,
  please visit our website at www dot idlogice dot com — I, D, L, O, G, I, C, E dot com —
  where you can reserve your spot online at any time, 24 hours a day.
  Our certified consultants will be happy to assist you during business hours.
  We look forward to helping you achieve your Canadian dream. Have a great evening!
`.trim();

const AFTER_HOURS_FR = `
  Merci d'avoir appelé I D Logice — vos consultants en immigration canadienne de confiance.
  Vous nous avez contactés en dehors de nos heures d'ouverture.
  Notre bureau est ouvert du lundi au vendredi, de 9h à 17h, heure de l'Est.
  Pour réserver une consultation ou un rendez-vous pour nous rendre visite à notre bureau,
  visitez notre site web à www point idlogice point com — I, D, L, O, G, I, C, E point com —
  où vous pouvez prendre rendez-vous en ligne à tout moment, 24 heures sur 24.
  Nos consultants certifiés seront ravis de vous aider pendant les heures d'ouverture.
  Nous avons hâte de vous aider à réaliser votre rêve canadien. Bonne soirée !
`.trim();

// ── TwiML builder ──────────────────────────────────────────────────────────

function getTexts(context: "open" | "weekend" | "after-hours", lang: "en" | "fr") {
  if (context === "weekend") return lang === "fr" ? WEEKEND_FR : WEEKEND_EN;
  if (context === "after-hours") return lang === "fr" ? AFTER_HOURS_FR : AFTER_HOURS_EN;
  return lang === "fr" ? OPEN_FR : OPEN_EN;
}

function repeatPrompt(lang: "en" | "fr") {
  return lang === "fr"
    ? "Pour répéter ce message, appuyez sur 1. Pour raccrocher, restez en ligne ou appuyez sur 2."
    : "To repeat this message, press 1. To hang up, stay on the line or press 2.";
}

function buildTwiML(lang: "en" | "fr", context: "open" | "weekend" | "after-hours") {
  const text = getTexts(context, lang);
  const voice = lang === "fr" ? "Polly.Chantal" : "Polly.Joanna";
  const voiceLang = lang === "fr" ? "fr-CA" : "en-CA";

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${voice}" language="${voiceLang}">${text}</Say>
  <Pause length="1"/>
  <Say voice="${voice}" language="${voiceLang}">${repeatPrompt(lang)}</Say>
  <Gather numDigits="1" action="/api/voice/menu?lang=${lang}&amp;ctx=${context}" method="POST" timeout="6">
  </Gather>
  <Hangup/>
</Response>`;
}

// ── Handlers ───────────────────────────────────────────────────────────────

function xmlResponse(twiml: string) {
  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const digits = params.get("Digits");
  const lang: "en" | "fr" = req.nextUrl.searchParams.get("lang") === "fr" ? "fr" : "en";
  const context = (req.nextUrl.searchParams.get("ctx") ?? getCallContext()) as
    "open" | "weekend" | "after-hours";

  if (digits === "1") {
    return xmlResponse(buildTwiML(lang, context));
  }

  return xmlResponse(buildTwiML(lang, getCallContext()));
}

export async function GET() {
  return xmlResponse(buildTwiML("en", getCallContext()));
}
