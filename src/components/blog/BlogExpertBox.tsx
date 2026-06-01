import Link from "next/link";
import type { BlogExpert } from "@/lib/blog/experts";

type Props = {
  locale: string;
  expert: BlogExpert;
  topicLabel: string;
};

export function BlogExpertBox({ locale, expert, topicLabel }: Props) {
  const labels = {
    reviewedBy: locale === "fr" ? "Verifie par" : locale === "es" ? "Revisado por" : locale === "ar" ? "تمت المراجعة بواسطة" : "Reviewed by",
    expertise: locale === "fr" ? "Expertise" : locale === "es" ? "Experiencia" : locale === "ar" ? "الخبرة" : "Expertise",
    languages: locale === "fr" ? "Langues" : locale === "es" ? "Idiomas" : locale === "ar" ? "اللغات" : "Languages",
    profile: locale === "fr" ? "Voir l'equipe" : locale === "es" ? "Ver equipo" : locale === "ar" ? "عرض الفريق" : "View team",
    consult: locale === "fr" ? "Consulter" : locale === "es" ? "Consultar" : locale === "ar" ? "استشارة" : "Consult",
  };

  return (
    <aside className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm not-prose">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-primary">{labels.reviewedBy}</p>
          <h2 className="mt-1 text-xl font-bold text-gray-900">{expert.name}</h2>
          <p className="mt-1 text-sm font-semibold text-gray-700">{expert.title} · {expert.credential}</p>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">{expert.summary}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            href={`/${locale}/author/${expert.id}`}
            className="rounded-full border border-gray-300 px-4 py-2 text-xs font-bold text-gray-800 transition-colors hover:border-primary hover:text-primary"
          >
            {labels.profile}
          </Link>
          <Link
            href={`/${locale}/book-consultation`}
            className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
          >
            {labels.consult}
          </Link>
        </div>
      </div>
      <div className="mt-4 grid gap-3 border-t border-gray-100 pt-4 text-sm text-gray-700 sm:grid-cols-2">
        <p><span className="font-bold text-gray-900">{topicLabel}</span> · RCIC {expert.rcic}</p>
        <p><span className="font-bold text-gray-900">{labels.languages}:</span> {expert.languages.join(", ")}</p>
        <p className="sm:col-span-2">
          <span className="font-bold text-gray-900">{labels.expertise}:</span> {expert.specialties.join(", ")}
        </p>
      </div>
    </aside>
  );
}
