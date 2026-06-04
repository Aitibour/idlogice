import Link from "next/link";
import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";

export const revalidate = false;

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;
type Locale = (typeof LOCALES)[number];
type Props = { params: Promise<{ locale: string }> };

const T = {
  title: {
    en: "Our RCIC Immigration Consultants",
    fr: "Nos consultants en immigration RCIC",
    es: "Nuestros consultores de inmigración RCIC",
    ar: "مستشارو الهجرة المعتمدون RCIC",
  },
  desc: {
    en: "Meet the CICC-registered immigration consultants (RCICs) at IDLOGICE. Expert guidance for Express Entry, PNP, work permits, and family sponsorship.",
    fr: "Rencontrez les consultants en immigration inscrits au CICC (RCIC) chez IDLOGICE. Expertise en Entrée express, PNP, permis de travail et parrainage familial.",
    es: "Conozca a los consultores de inmigración registrados en CICC (RCIC) de IDLOGICE. Expertos en Express Entry, PNP, permisos de trabajo y patrocinio familiar.",
    ar: "تعرف على مستشاري الهجرة المسجلين في CICC (RCIC) في IDLOGICE. خبراء في Express Entry وPNP وتصاريح العمل والتكفل العائلي.",
  },
  h1: {
    en: "Meet Our Immigration Consultants",
    fr: "Rencontrez nos consultants en immigration",
    es: "Conozca a nuestros consultores de inmigración",
    ar: "تعرف على مستشاري الهجرة لدينا",
  },
  lead: {
    en: "Every IDLOGICE consultant is a Regulated Canadian Immigration Consultant (RCIC) registered with the College of Immigration and Citizenship Consultants (CICC). We operate under strict professional standards with full accountability to Canada's immigration regulatory body.",
    fr: "Chaque consultant IDLOGICE est un Consultant réglementé en immigration canadienne (CRIC) inscrit au Collège des consultants en immigration et en citoyenneté (CICC).",
    es: "Cada consultor de IDLOGICE es un Consultor Regulado de Inmigración Canadiense (RCIC) registrado en el Colegio de Consultores de Inmigración y Ciudadanía (CICC).",
    ar: "كل مستشار في IDLOGICE هو مستشار هجرة كندي معتمد (RCIC) مسجل في كلية مستشاري الهجرة والمواطنة (CICC).",
  },
  ciccLabel: { en: "CICC Registration", fr: "Inscription CICC", es: "Registro CICC", ar: "تسجيل CICC" },
  specialtiesLabel: { en: "Specialties", fr: "Spécialités", es: "Especialidades", ar: "التخصصات" },
  langLabel: { en: "Languages", fr: "Langues", es: "Idiomas", ar: "اللغات" },
  bookBtn: { en: "Book a Consultation", fr: "Prendre rendez-vous", es: "Reservar consulta", ar: "احجز استشارة" },
  evalBtn: { en: "Free Evaluation", fr: "Évaluation gratuite", es: "Evaluación gratuita", ar: "تقييم مجاني" },
  trustH: { en: "Why Work With a Regulated RCIC?", fr: "Pourquoi travailler avec un CRIC réglementé ?", es: "¿Por qué trabajar con un RCIC regulado?", ar: "لماذا تعمل مع مستشار RCIC معتمد؟" },
  breadHome: { en: "Home", fr: "Accueil", es: "Inicio", ar: "الرئيسية" },
  breadAbout: { en: "About", fr: "À propos", es: "Acerca de", ar: "عن الشركة" },
} as const;

const CONSULTANTS = [
  {
    name: "Sarah Benali",
    title: { en: "Senior Immigration Consultant", fr: "Consultante principale en immigration", es: "Consultora principal de inmigración", ar: "مستشارة هجرة أولى" },
    bio: {
      en: "Sarah has 8+ years of experience guiding clients through Express Entry and PNP programs. Fluent in English, French, and Arabic, she specializes in Francophone immigration and North African applicant profiles.",
      fr: "Sarah a plus de 8 ans d'expérience dans l'Entrée express et les programmes PNP. Spécialisée en immigration francophone et profils maghrébins.",
      es: "Sarah tiene más de 8 años de experiencia guiando clientes a través de Express Entry y programas PNP. Especialista en inmigración francófona.",
      ar: "تتمتع سارة بخبرة تزيد على 8 سنوات في توجيه العملاء عبر برامج Express Entry وPNP. متخصصة في الهجرة الناطقة بالفرنسية.",
    },
    specialties: {
      en: ["Express Entry", "PNP Programs", "Francophone Immigration", "Work Permits"],
      fr: ["Entrée express", "Programmes PNP", "Immigration francophone", "Permis de travail"],
      es: ["Express Entry", "Programas PNP", "Inmigración francófona", "Permisos de trabajo"],
      ar: ["Express Entry", "برامج PNP", "الهجرة الناطقة بالفرنسية", "تصاريح العمل"],
    },
    languages: { en: ["English", "French", "Arabic"], fr: ["Anglais", "Français", "Arabe"], es: ["Inglés", "Francés", "Árabe"], ar: ["الإنجليزية", "الفرنسية", "العربية"] },
  },
  {
    name: "Mohamed Ait Ibour",
    title: { en: "Founder & Lead Immigration Consultant", fr: "Fondateur et consultant principal en immigration", es: "Fundador y consultor principal de inmigración", ar: "المؤسس والمستشار الرئيسي للهجرة" },
    bio: {
      en: "Mohamed founded IDLOGICE to bring transparent, expert immigration consulting to clients from 50+ countries. He specializes in complex cases including inadmissibility, refusals, and skilled trades immigration.",
      fr: "Mohamed a fondé IDLOGICE pour apporter une consultation en immigration transparente et experte à des clients de 50+ pays. Spécialisé dans les cas complexes.",
      es: "Mohamed fundó IDLOGICE para brindar consultoría de inmigración transparente a clientes de 50+ países. Especializado en casos complejos.",
      ar: "أسس محمد IDLOGICE لتقديم استشارات هجرة شفافة ومتخصصة لعملاء من أكثر من 50 دولة. متخصص في الحالات المعقدة.",
    },
    specialties: {
      en: ["Skilled Trades Immigration", "Refusal Appeals", "Study Permits", "Family Sponsorship"],
      fr: ["Immigration des métiers", "Appels de refus", "Permis d'études", "Parrainage familial"],
      es: ["Inmigración de oficios", "Apelaciones de rechazo", "Permisos de estudio", "Patrocinio familiar"],
      ar: ["هجرة المهن الحرفية", "استئناف رفض الطلبات", "تصاريح الدراسة", "التكفل العائلي"],
    },
    languages: { en: ["English", "French", "Arabic", "Spanish"], fr: ["Anglais", "Français", "Arabe", "Espagnol"], es: ["Inglés", "Francés", "Árabe", "Español"], ar: ["الإنجليزية", "الفرنسية", "العربية", "الإسبانية"] },
  },
];

const TRUST_POINTS = {
  en: [
    "RCICs are legally authorized to provide Canadian immigration advice and representation",
    "Regulated by the College of Immigration and Citizenship Consultants (CICC)",
    "Bound by a Code of Professional Conduct with strict accountability",
    "Carry mandatory professional liability insurance",
    "Required to maintain current knowledge of Canadian immigration law",
    "Unauthorized representatives cannot legally charge fees for immigration advice",
  ],
  fr: [
    "Les CRIC sont légalement autorisés à fournir des conseils en immigration canadienne",
    "Réglementés par le Collège des consultants en immigration et en citoyenneté (CICC)",
    "Soumis à un Code de conduite professionnelle strict",
    "Doivent souscrire une assurance responsabilité professionnelle",
    "Doivent maintenir leurs connaissances à jour du droit de l'immigration canadienne",
    "Les représentants non autorisés ne peuvent pas légalement facturer des honoraires",
  ],
  es: [
    "Los RCIC están legalmente autorizados para brindar asesoramiento en inmigración canadiense",
    "Regulados por el Colegio de Consultores de Inmigración y Ciudadanía (CICC)",
    "Sujetos a un Código de Conducta Profesional estricto",
    "Deben tener seguro de responsabilidad profesional obligatorio",
    "Deben mantener conocimientos actualizados de la ley de inmigración canadiense",
    "Los representantes no autorizados no pueden cobrar honorarios legalmente",
  ],
  ar: [
    "مستشارو RCIC مخولون قانونياً بتقديم المشورة في مجال الهجرة الكندية",
    "خاضعون لتنظيم كلية مستشاري الهجرة والمواطنة (CICC)",
    "ملتزمون بمدونة سلوك مهنية صارمة مع محاسبة كاملة",
    "يجب أن يحملوا تأمين المسؤولية المهنية الإلزامي",
    "مطالبون بالحفاظ على معرفة محدثة بقانون الهجرة الكندي",
    "لا يحق للممثلين غير المرخصين قانونياً تحصيل رسوم مقابل المشورة",
  ],
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;
  return {
    title: T.title[l],
    description: T.desc[l],
    alternates: generatePageAlternates(locale, "/team"),
    openGraph: { title: T.title[l], description: T.desc[l], url: `${BASE}/${l}/team`, type: "website" },
  };
}

export default async function TeamPage({ params }: Props) {
  const { locale } = await params;
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;

  // JSON-LD built from in-code constants only — no user input, XSS-safe
  const jsonLdStr = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": CONSULTANTS.map((c) => ({
      "@type": "Person",
      name: c.name,
      jobTitle: c.title.en,
      worksFor: { "@type": "Organization", name: "IDLOGICE Immigration Consulting", url: BASE },
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        name: "Regulated Canadian Immigration Consultant (RCIC)",
        credentialCategory: "Professional License",
        recognizedBy: { "@type": "Organization", name: "College of Immigration and Citizenship Consultants (CICC)" },
      },
      knowsLanguage: c.languages.en,
    })),
  });

  return (
    <>
      {/* JSON-LD from static constants only — no user input reaches __html */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdStr }} />
      <div dir={l === "ar" ? "rtl" : "ltr"} className="max-w-4xl mx-auto px-4 py-12 sm:py-16">

        <nav aria-label="breadcrumb" className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1">
          <Link href={`/${l}`} className="hover:text-primary">{T.breadHome[l]}</Link>
          <span aria-hidden>/</span>
          <Link href={`/${l}/about`} className="hover:text-primary">{T.breadAbout[l]}</Link>
          <span aria-hidden>/</span>
          <span className="text-gray-800 font-medium">{T.h1[l]}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{T.h1[l]}</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-12 max-w-2xl">{T.lead[l]}</p>

        <div className="space-y-8 mb-16">
          {CONSULTANTS.map((c) => (
            <div key={c.name} className="border border-gray-200 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-6 mb-5">
                <div className="shrink-0">
                  <div className="w-20 h-20 rounded-full bg-blue-100 border-2 border-primary/20 flex items-center justify-center">
                    <svg className="w-12 h-12 text-blue-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{c.name}</h2>
                  <p className="text-primary font-medium text-sm mb-2">{c.title[l]}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-0.5 rounded">{T.ciccLabel[l]}: verify on the CICC public register</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed text-sm mb-5">{c.bio[l]}</p>

              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{T.specialtiesLabel[l]}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.specialties[l].map((s) => (
                      <span key={s} className="text-xs bg-blue-50 text-blue-800 font-medium px-2.5 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{T.langLabel[l]}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.languages[l].map((lang) => (
                      <span key={lang} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">{lang}</span>
                    ))}
                  </div>
                </div>
              </div>

              <Link href={`/${l}/book-consultation`}
                className="inline-block text-sm font-semibold text-white bg-primary hover:bg-primary/90 px-5 py-2 rounded-full transition-colors">
                {T.bookBtn[l]}
              </Link>
            </div>
          ))}
        </div>

        <section className="bg-gray-50 rounded-2xl p-6 sm:p-8 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">{T.trustH[l]}</h2>
          <ul className="space-y-3">
            {TRUST_POINTS[l].map((point, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span className="text-green-600 shrink-0 mt-0.5">&#10003;</span>
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-gray-500">
            {l === "en" && <>Verify any RCIC registration at <a href="https://college-ic.ca" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">college-ic.ca</a></>}
            {l === "fr" && <>Vérifiez toute inscription CRIC sur <a href="https://college-ic.ca" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">college-ic.ca</a></>}
            {l === "es" && <>Verifique cualquier registro RCIC en <a href="https://college-ic.ca" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">college-ic.ca</a></>}
            {l === "ar" && <>تحقق من أي تسجيل RCIC على <a href="https://college-ic.ca" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">college-ic.ca</a></>}
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href={`/${l}/evaluation`} className="text-sm font-medium text-primary hover:underline border border-primary/30 rounded-full px-4 py-1.5">
            {T.evalBtn[l]}
          </Link>
          <Link href={`/${l}/about`} className="text-sm font-medium text-gray-600 hover:text-primary border border-gray-200 rounded-full px-4 py-1.5">
            {T.breadAbout[l]}
          </Link>
          <Link href={`/${l}/book-consultation`} className="text-sm font-medium text-gray-600 hover:text-primary border border-gray-200 rounded-full px-4 py-1.5">
            {T.bookBtn[l]}
          </Link>
        </div>
      </div>
    </>
  );
}


