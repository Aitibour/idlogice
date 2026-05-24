import Link from "next/link";
import type { Metadata } from "next";
import { generatePageAlternates } from "@/lib/seo/alternates";
import { ServiceJsonLd } from "@/components/seo/structured-data";

export const revalidate = false;

const BASE = "https://idlogice.com";
const LOCALES = ["en", "fr", "es", "ar"] as const;
type Locale = (typeof LOCALES)[number];
type Props = { params: Promise<{ locale: string }> };

const T = {
  title: {
    en: "Canadian Permanent Residency Pathways",
    fr: "Voies vers la résidence permanente au Canada",
    es: "Vías hacia la residencia permanente en Canadá",
    ar: "مسارات الإقامة الدائمة الكندية",
  },
  desc: {
    en: "Explore all Canadian permanent residency pathways: Express Entry, PNP, work experience, study, Francophone, and family routes. Free profile evaluation.",
    fr: "Explorez toutes les voies vers la résidence permanente canadienne : Entrée express, PNP, expérience de travail, études, francophone. Évaluation gratuite.",
    es: "Explore todas las vías de residencia permanente canadiense: Express Entry, PNP, experiencia laboral, estudios, francofonía. Evaluación gratuita.",
    ar: "استكشف جميع مسارات الإقامة الدائمة الكندية: Express Entry وPNP والعمل والدراسة. تقييم مجاني.",
  },
  h1: {
    en: "Canadian PR Pathways",
    fr: "Voies vers la RP canadienne",
    es: "Vías hacia la RP canadiense",
    ar: "مسارات الإقامة الدائمة الكندية",
  },
  lead: {
    en: "Canada offers over 100 pathways to permanent residency. Our RCIC-certified consultants help you identify the fastest, most accessible route based on your profile, work experience, and language skills.",
    fr: "Le Canada offre plus de 100 voies vers la résidence permanente. Nos consultants certifiés RCIC vous aident à identifier le chemin le plus rapide selon votre profil.",
    es: "Canadá ofrece más de 100 vías hacia la residencia permanente. Nuestros consultores certificados RCIC le ayudan a identificar el camino más rápido según su perfil.",
    ar: "تقدم كندا أكثر من 100 مسار للإقامة الدائمة. يساعدك مستشارونا المعتمدون RCIC في تحديد المسار الأسرع والأكثر سهولة وفقاً لملفك.",
  },
  pathwaysH: {
    en: "PR Pathways at a Glance",
    fr: "Aperçu des voies vers la RP",
    es: "Vías hacia la RP de un vistazo",
    ar: "نظرة عامة على مسارات الإقامة الدائمة",
  },
  requirementsH: {
    en: "General Eligibility Requirements",
    fr: "Conditions générales d'admissibilité",
    es: "Requisitos generales de elegibilidad",
    ar: "متطلبات الأهلية العامة",
  },
  ctaH: {
    en: "Find Your PR Pathway",
    fr: "Trouvez votre voie vers la RP",
    es: "Encuentre su vía hacia la RP",
    ar: "ابحث عن مسار الإقامة الدائمة الخاص بك",
  },
  ctaTxt: {
    en: "Not sure which pathway suits you? Our RCIC consultants assess your profile across all available programs and recommend the fastest route to Canadian permanent residency.",
    fr: "Vous ne savez pas quelle voie vous convient ? Nos consultants RCIC évaluent votre profil et recommandent le chemin le plus rapide vers la résidence permanente.",
    es: "¿No sabe qué vía le conviene? Nuestros consultores RCIC evalúan su perfil y recomiendan el camino más rápido hacia la residencia permanente.",
    ar: "غير متأكد من المسار المناسب لك؟ يقيّم مستشارونا RCIC ملفك عبر جميع البرامج المتاحة ويوصون بأسرع طريق للإقامة الدائمة.",
  },
  ctaBtn: {
    en: "Get Free PR Assessment",
    fr: "Évaluation RP gratuite",
    es: "Evaluación de RP gratuita",
    ar: "تقييم الإقامة الدائمة المجاني",
  },
  breadHome: { en: "Home", fr: "Accueil", es: "Inicio", ar: "الرئيسية" },
  breadServices: { en: "Services", fr: "Services", es: "Servicios", ar: "الخدمات" },
} as const;

const PATHWAYS = [
  {
    title: { en: "Express Entry (Federal)", fr: "Entrée express (fédéral)", es: "Express Entry (federal)", ar: "Express Entry (فيدرالي)" },
    desc: { en: "The fastest federal pathway for skilled workers. CRS-based ranking with typical processing under 6 months.", fr: "La voie fédérale la plus rapide pour les travailleurs qualifiés. Classement basé sur le CRS.", es: "La vía federal más rápida para trabajadores calificados. Clasificación basada en CRS.", ar: "أسرع مسار فيدرالي للعمال المهرة. تصنيف قائم على CRS مع معالجة تحت 6 أشهر." },
    href: "/programs/express-entry",
    tags: { en: ["6 months avg", "No job offer required", "All provinces"], fr: ["Moy. 6 mois", "Pas d'offre d'emploi requise", "Toutes provinces"], es: ["Promedio 6 meses", "Sin oferta de trabajo", "Todas las provincias"], ar: ["متوسط 6 أشهر", "لا يشترط عرض عمل", "جميع المقاطعات"] },
  },
  {
    title: { en: "Provincial Nominee Program (PNP)", fr: "Programme des candidats des provinces (PCP)", es: "Programa de Nominados Provinciales (PNP)", ar: "برنامج المرشحين الإقليميين (PNP)" },
    desc: { en: "Each province nominates workers for their specific labour needs. Adds 600 CRS points when done via Express Entry.", fr: "Chaque province nomme des travailleurs selon ses besoins. Ajoute 600 points CRS via Entrée express.", es: "Cada provincia nomina trabajadores según sus necesidades. Añade 600 puntos CRS vía Express Entry.", ar: "كل مقاطعة ترشح عمالاً لاحتياجاتها. يضيف 600 نقطة CRS عبر Express Entry." },
    href: "/programs/provincial-nominee-program",
    tags: { en: ["600 CRS bonus", "Province-specific", "50+ streams"], fr: ["Bonus 600 CRS", "Spécifique à la province", "50+ voies"], es: ["Bono 600 CRS", "Específico por provincia", "50+ corrientes"], ar: ["مكافأة 600 CRS", "خاص بالمقاطعة", "50+ مسار"] },
  },
  {
    title: { en: "PR Through Work Experience", fr: "RP via expérience de travail", es: "RP a través de experiencia laboral", ar: "الإقامة الدائمة عبر الخبرة العملية" },
    desc: { en: "Canadian Caregiver Program, Home Support Worker, and Aging-in-Place pilots offer PR after 2 years of Canadian work experience.", fr: "Le Programme des aides familiaux et les projets pilotes offrent la RP après 2 ans d'expérience canadienne.", es: "El Programa de Cuidadores y proyectos piloto ofrecen RP tras 2 años de experiencia canadiense.", ar: "برنامج مقدمي الرعاية ومشاريع تجريبية تقدم الإقامة الدائمة بعد سنتين من العمل في كندا." },
    href: "/services/work-permit",
    tags: { en: ["2 yrs Canadian work exp", "In-demand occupations", "LMIA-exempt paths"], fr: ["2 ans expérience canadienne", "Professions en demande", "Chemins sans EIMT"], es: ["2 años exp. canadiense", "Ocupaciones en demanda", "Vías sin LMIA"], ar: ["سنتان خبرة كندية", "مهن مطلوبة", "مسارات معفاة من LMIA"] },
  },
  {
    title: { en: "PR Through Study", fr: "RP via études", es: "RP a través de estudios", ar: "الإقامة الدائمة عبر الدراسة" },
    desc: { en: "International graduates can use PGWP work experience to qualify for Express Entry or PNP streams targeting Canadian graduates.", fr: "Les diplômés internationaux peuvent utiliser le PTPD pour se qualifier à l'Entrée express ou aux voies PNP.", es: "Los graduados internacionales pueden usar la PGWP para calificar a Express Entry o corrientes PNP.", ar: "يمكن للخريجين الدوليين استخدام تصريح العمل بعد التخرج للتأهل لـ Express Entry أو PNP." },
    href: "/services/study-permit",
    tags: { en: ["PGWP eligible", "CEC pathway", "Provincial graduate streams"], fr: ["Éligible au PTPD", "Voie ECC", "Voies diplômés provinciaux"], es: ["Elegible PGWP", "Vía CEC", "Corrientes graduados provinciales"], ar: ["مؤهل لـ PGWP", "مسار CEC", "مسارات خريجي المقاطعات"] },
  },
  {
    title: { en: "Francophone Immigration", fr: "Immigration francophone", es: "Inmigración francófona", ar: "الهجرة الناطقة بالفرنسية" },
    desc: { en: "French speakers get CRS bonus points, dedicated draws, and access to LMIA-exempt Mobilité Francophone work permits outside Quebec.", fr: "Les francophones obtiennent des points CRS supplémentaires, des tirages dédiés et le Programme Mobilité francophone.", es: "Los francófonos obtienen puntos CRS adicionales, sorteos dedicados y permisos de trabajo sin LMIA.", ar: "يحصل الناطقون بالفرنسية على نقاط CRS إضافية وسحوبات مخصصة وتصاريح عمل معفاة من LMIA." },
    href: "/programs/francophone-mobility",
    tags: { en: ["CRS French bonus", "Dedicated draws", "LMIA-exempt work permit"], fr: ["Bonus CRS français", "Tirages dédiés", "Permis sans EIMT"], es: ["Bono CRS francés", "Sorteos dedicados", "Permiso sin LMIA"], ar: ["مكافأة CRS للفرنسية", "سحوبات مخصصة", "تصريح عمل معفى"] },
  },
  {
    title: { en: "Family Sponsorship", fr: "Parrainage familial", es: "Patrocinio familiar", ar: "التكفل العائلي" },
    desc: { en: "Canadian PRs and citizens can sponsor spouses, parents, and dependent children for permanent residency.", fr: "Les RP et citoyens canadiens peuvent parrainer conjoints, parents et enfants à charge pour la résidence permanente.", es: "Los RP y ciudadanos canadienses pueden patrocinar cónyuges, padres e hijos dependientes.", ar: "يمكن لحاملي الإقامة الدائمة والمواطنين الكنديين كفالة الأزواج والوالدين والأطفال التابعين." },
    href: "/services/family-sponsorship",
    tags: { en: ["Spouse & common-law", "Parents & grandparents", "Dependent children"], fr: ["Époux et conjoint de fait", "Parents et grands-parents", "Enfants à charge"], es: ["Cónyuge y pareja de hecho", "Padres y abuelos", "Hijos dependientes"], ar: ["الزوج أو الشريك", "الوالدان والأجداد", "الأطفال التابعون"] },
  },
];

const REQUIREMENTS = {
  en: ["Valid passport and travel history", "Language test results (IELTS/TEF/CELPIP)", "Educational Credential Assessment (ECA) if applicable", "Proof of work experience (reference letters, pay stubs)", "Police clearance certificates", "Medical examination by IRCC-designated physician"],
  fr: ["Passeport valide et historique de voyages", "Résultats de test de langue (IELTS/TEF/CELPIP)", "Évaluation des diplômes (EDE) si applicable", "Preuve d'expérience de travail (lettres de référence)", "Certificats de police", "Examen médical par un médecin désigné IRCC"],
  es: ["Pasaporte válido e historial de viajes", "Resultados de prueba de idioma (IELTS/TEF/CELPIP)", "Evaluación de credenciales educativas (ECA)", "Prueba de experiencia laboral (cartas de referencia)", "Certificados de antecedentes penales", "Examen médico por médico designado IRCC"],
  ar: ["جواز سفر ساري وتاريخ السفر", "نتائج اختبار اللغة (IELTS/TEF/CELPIP)", "تقييم الشهادات التعليمية (ECA) إن لزم", "إثبات الخبرة العملية (خطابات مرجعية)", "شهادات حسن السيرة والسلوك", "الفحص الطبي من قبل طبيب معين من IRCC"],
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
    alternates: generatePageAlternates(locale, "/services/pr-pathways"),
    openGraph: { title: T.title[l], description: T.desc[l], url: `${BASE}/${l}/services/pr-pathways`, type: "website" },
  };
}

export default async function PRPathwaysPage({ params }: Props) {
  const { locale } = await params;
  const l = (LOCALES.includes(locale as Locale) ? locale : "en") as Locale;

  return (
    <>
      <ServiceJsonLd
        name="Canadian Permanent Residency Pathways"
        description="RCIC-certified immigration consultants helping clients achieve Canadian permanent residency through Express Entry, PNP, work, study, and family sponsorship routes."
        url={`${BASE}/${l}/services/pr-pathways`}
      />
      <article dir={l === "ar" ? "rtl" : "ltr"} className="max-w-4xl mx-auto px-4 py-12 sm:py-16">

        <nav aria-label="breadcrumb" className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1">
          <Link href={`/${l}`} className="hover:text-primary">{T.breadHome[l]}</Link>
          <span aria-hidden>/</span>
          <Link href={`/${l}/services`} className="hover:text-primary">{T.breadServices[l]}</Link>
          <span aria-hidden>/</span>
          <span className="text-gray-800 font-medium">{T.h1[l]}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{T.h1[l]}</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-10">{T.lead[l]}</p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{T.pathwaysH[l]}</h2>
          <div className="space-y-5">
            {PATHWAYS.map((p, i) => (
              <Link key={i} href={`/${l}${p.href}`}
                className="block border border-gray-200 rounded-2xl p-6 hover:border-primary/40 hover:shadow-sm transition-all group">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <p className="font-bold text-gray-900 group-hover:text-primary text-lg">{p.title[l]}</p>
                  <span className="text-primary shrink-0 mt-1">&#8594;</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{p.desc[l]}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags[l].map((tag) => (
                    <span key={tag} className="text-xs bg-blue-50 text-blue-700 font-medium px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">{T.requirementsH[l]}</h2>
          <ul className="space-y-3">
            {REQUIREMENTS[l].map((req, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                <p className="text-gray-700 leading-relaxed">{req}</p>
              </li>
            ))}
          </ul>
        </section>

        <aside className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold mb-3">{T.ctaH[l]}</h2>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">{T.ctaTxt[l]}</p>
          <Link href={`/${l}/evaluation`}
            className="inline-block bg-white text-blue-900 font-semibold px-7 py-3 rounded-full hover:bg-blue-50 transition-colors">
            {T.ctaBtn[l]}
          </Link>
        </aside>

        <div className="flex flex-wrap gap-3">
          <Link href={`/${l}/programs`} className="text-sm font-medium text-gray-600 hover:text-primary border border-gray-200 rounded-full px-4 py-1.5">
            {l === "en" ? "All Programs" : l === "fr" ? "Tous les programmes" : l === "es" ? "Todos los programas" : "جميع البرامج"}
          </Link>
          <Link href={`/${l}/calculator`} className="text-sm font-medium text-gray-600 hover:text-primary border border-gray-200 rounded-full px-4 py-1.5">
            {l === "en" ? "CRS Calculator" : l === "fr" ? "Calculateur CRS" : l === "es" ? "Calculadora CRS" : "حاسبة CRS"}
          </Link>
          <Link href={`/${l}/draws`} className="text-sm font-medium text-gray-600 hover:text-primary border border-gray-200 rounded-full px-4 py-1.5">
            {l === "en" ? "Latest Draws" : l === "fr" ? "Derniers tirages" : l === "es" ? "Últimos sorteos" : "أحدث السحوبات"}
          </Link>
        </div>
      </article>
    </>
  );
}

