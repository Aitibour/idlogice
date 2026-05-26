import Link from "next/link";
import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { notFound } from "next/navigation";
import { COUNTRIES, COUNTRY_MAP } from "@/data/immigration-countries";

export const revalidate = false;

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;
type Locale = (typeof LOCALES)[number];
type Props = { params: Promise<{ locale: string; country: string }> };

const T = {
  title: {
    en: (c: string) => `Canada Immigration from ${c}`,
    fr: (c: string) => `Immigration Canada depuis ${c}`,
    es: (c: string) => `Inmigración a Canadá desde ${c}`,
    ar: (c: string) => `الهجرة إلى كندا من ${c}`,
  },
  desc: {
    en: (c: string) => `Complete guide to Canada immigration for ${c} nationals. Explore Express Entry, PNP, and work permits. Free profile evaluation.`,
    fr: (c: string) => `Guide complet de l'immigration canadienne pour les ressortissants de ${c}. Évaluation de profil gratuite.`,
    es: (c: string) => `Guía completa de inmigración canadiense para ciudadanos de ${c}. Evaluación de perfil gratuita.`,
    ar: (c: string) => `الدليل الشامل للهجرة إلى كندا لمواطني ${c}. تقييم مجاني للملف الشخصي.`,
  },
  h1: {
    en: (c: string) => `Canada Immigration from ${c}`,
    fr: (c: string) => `Immigration au Canada depuis ${c}`,
    es: (c: string) => `Inmigración a Canadá desde ${c}`,
    ar: (c: string) => `الهجرة إلى كندا من ${c}`,
  },
  lead: {
    en: (c: string, w: number) => `Thousands of ${c} nationals immigrate to Canada every year. Typical processing times are ${w - 2}–${w + 4} weeks depending on the program.`,
    fr: (c: string, w: number) => `Des milliers de ressortissants de ${c} immigrent chaque année au Canada. Les délais sont de ${w - 2} à ${w + 4} semaines.`,
    es: (c: string, w: number) => `Miles de ciudadanos de ${c} emigran a Canadá cada año. Los tiempos van de ${w - 2} a ${w + 4} semanas.`,
    ar: (c: string, w: number) => `يهاجر آلاف من مواطني ${c} إلى كندا سنوياً. تتراوح أوقات المعالجة من ${w - 2} إلى ${w + 4} أسابيع.`,
  },
  programsH: { en: "Main Programs Available", fr: "Principaux programmes", es: "Principales programas", ar: "البرامج الرئيسية" },
  stepsH: { en: "How to Apply: 5 Steps", fr: "Comment postuler : 5 étapes", es: "Cómo aplicar: 5 pasos", ar: "كيفية التقديم: 5 خطوات" },
  steps: {
    en: [
      "Get a free profile evaluation to identify the best program for you.",
      "Gather documents: passport, language test, education credentials, work experience letters.",
      "Create your profile in the IRCC portal (Express Entry or provincial nominee system).",
      "Receive an Invitation to Apply (ITA) and submit within 60 days.",
      "Provide biometrics, attend any interview, and wait for a final decision.",
    ],
    fr: [
      "Obtenez une évaluation gratuite pour identifier le meilleur programme.",
      "Rassemblez les documents : passeport, test de langue, diplômes, lettres d'expérience.",
      "Créez un profil dans le portail IRCC (Entrée express ou PCP).",
      "Recevez une invitation à présenter une demande et soumettez dans les 60 jours.",
      "Fournissez vos données biométriques et attendez la décision finale.",
    ],
    es: [
      "Obtenga una evaluación gratuita para identificar el mejor programa.",
      "Reúna documentos: pasaporte, prueba de idioma, credenciales educativas.",
      "Cree un perfil en el portal IRCC (Express Entry o nominación provincial).",
      "Reciba una Invitación a Aplicar y envíe su solicitud en 60 días.",
      "Proporcione datos biométricos y espere la decisión final.",
    ],
    ar: [
      "احصل على تقييم مجاني لتحديد أفضل برنامج.",
      "اجمع الوثائق: جواز السفر، اختبار اللغة، المؤهلات، خطابات الخبرة.",
      "أنشئ ملفًا في بوابة IRCC (Express Entry أو PNP).",
      "استلم دعوة التقديم وقدم طلبك خلال 60 يومًا.",
      "قدم البيانات البيومترية وانتظر القرار النهائي.",
    ],
  },
  langNote: {
    en: (r: boolean) => r
      ? "IELTS (English) or TEF Canada (French) results required — minimum CLB 7 for most skilled worker programs."
      : "Language test may be waived for certain PNP streams or the Francophone Express Entry stream.",
    fr: (r: boolean) => r
      ? "Résultats IELTS ou TEF Canada requis — minimum CLB 7 pour les programmes de travailleurs qualifiés."
      : "Le test de langue peut être dispensé pour certains volets PNP ou le volet francophone.",
    es: (r: boolean) => r
      ? "Se requieren resultados de IELTS o TEF Canada — mínimo CLB 7 para la mayoría de programas."
      : "La prueba de idioma puede eximirse para ciertos flujos de PNP o el flujo francófono.",
    ar: (r: boolean) => r
      ? "تُطلب نتائج IELTS أو TEF Canada — بحد أدنى CLB 7 لمعظم برامج العمال المهرة."
      : "قد يُعفى من اختبار اللغة في بعض مسارات PNP أو المسار الفرانكوفوني.",
  },
  ctaH: { en: "Find Out If You Qualify", fr: "Découvrez si vous êtes admissible", es: "Descubra si califica", ar: "اكتشف ما إذا كنت مؤهلاً" },
  ctaTxt: {
    en: "Our certified RCICs have helped hundreds of applicants successfully immigrate to Canada. Get a free, no-obligation profile evaluation.",
    fr: "Nos RCIC certifiés ont aidé des centaines de candidats à immigrer avec succès. Évaluation gratuite et sans engagement.",
    es: "Nuestros RCIC certificados han ayudado a cientos de solicitantes. Evaluación gratuita y sin compromiso.",
    ar: "ساعد مستشارو RCIC المعتمدون لدينا مئات المتقدمين. احصل على تقييم مجاني وغير ملزم.",
  },
  ctaBtn: { en: "Get Free Evaluation →", fr: "Évaluation gratuite →", es: "Evaluación gratuita →", ar: "تقييم مجاني →" },
  relatedH: { en: "Other Countries", fr: "Autres pays", es: "Otros países", ar: "دول أخرى" },
  breadHome: { en: "Home", fr: "Accueil", es: "Inicio", ar: "الرئيسية" },
  breadFrom: { en: "By Country", fr: "Par pays", es: "Por país", ar: "حسب البلد" },
} as const;

type TKey = keyof typeof T;
function tr<K extends TKey>(key: K, locale: Locale): (typeof T)[K][Locale] {
  const s = T[key] as Record<Locale, unknown>;
  return (s[locale] ?? s.en) as (typeof T)[K][Locale];
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => COUNTRIES.map((c) => ({ locale, country: c.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, country } = await params;
  const c = COUNTRY_MAP[country];
  if (!c) return {};
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;
  const name = c.name[l];
  const title = (tr("title", l) as (c: string) => string)(name);
  const description = (tr("desc", l) as (c: string) => string)(name);
  // Absolute title bypasses template — keeps under 60 chars for all countries
  const seoTitles: Record<Locale, string> = {
    en: `${name}: Canada Immigration | IDLOGICE`,
    fr: `${name}: Immigration Canada | IDLOGICE`,
    es: `${name}: Inmigración a Canadá | IDLOGICE`,
    ar: `${name}: الهجرة إلى كندا | IDLOGICE`,
  };
  const seoTitle = seoTitles[l] ?? seoTitles.en;
  return {
    title: { absolute: seoTitle },
    description,
    alternates: generatePageAlternates(locale, `/from/${country}`),
    openGraph: { title, description, url: `${BASE}/${l}/from/${country}`, type: "article", images: [{ url: `${BASE}/images/cta-bg.jpg`, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function FromCountryPage({ params }: Props) {
  const { locale, country } = await params;
  const c = COUNTRY_MAP[country];
  if (!c) notFound();
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;
  const name = c.name[l];

  // JSON-LD built from in-code constants only — no user input, XSS-safe
  const jsonLdStr = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: (tr("title", l) as (c: string) => string)(name),
    description: (tr("desc", l) as (c: string) => string)(name),
    author: { "@type": "Organization", name: "IDLOGICE", url: BASE },
    publisher: { "@type": "Organization", name: "IDLOGICE", logo: { "@type": "ImageObject", url: `${BASE}/logo.png` } },
    url: `${BASE}/${l}/from/${country}`,
    inLanguage: l,
  });

  const related = COUNTRIES.filter((rc) => rc.slug !== country && rc.continent === c.continent).slice(0, 5);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdStr }} />
      <article dir={l === "ar" ? "rtl" : "ltr"} className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <nav aria-label="breadcrumb" className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1">
          <Link href={`/${l}`} className="hover:text-primary">{tr("breadHome", l) as string}</Link>
          <span aria-hidden>/</span>
          <Link href={`/${l}/from`} className="hover:text-primary">{tr("breadFrom", l) as string}</Link>
          <span aria-hidden>/</span>
          <span className="text-gray-800 font-medium">{name}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          {(tr("h1", l) as (c: string) => string)(name)}
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          {(tr("lead", l) as (c: string, w: number) => string)(name, c.processingWeeks)}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{tr("programsH", l) as string}</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {c.programs.map((prog) => (
              <li key={prog} className="flex items-start gap-2 bg-blue-50 rounded-lg px-4 py-3 text-sm font-medium text-blue-900">
                <span className="mt-0.5 text-blue-600 shrink-0">✓</span>{prog}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 bg-amber-50 border border-amber-200 rounded-xl p-5">
          <p className="text-sm text-amber-900 leading-relaxed">
            {(tr("langNote", l) as (r: boolean) => string)(c.englishRequired)}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">{tr("stepsH", l) as string}</h2>
          <ol className="space-y-4">
            {(tr("steps", l) as readonly string[]).map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">{i + 1}</span>
                <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <aside className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold mb-3">{tr("ctaH", l) as string}</h2>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">{tr("ctaTxt", l) as string}</p>
          <Link href={`/${l}/book-consultation`} className="inline-block bg-white text-blue-900 font-semibold px-7 py-3 rounded-full hover:bg-blue-50 transition-colors">
            {tr("ctaBtn", l) as string}
          </Link>
        </aside>

        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{tr("relatedH", l) as string}</h2>
            <div className="flex flex-wrap gap-2">
              {related.map((rc) => (
                <Link key={rc.slug} href={`/${l}/from/${rc.slug}`} className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  {rc.name[l]}
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}


