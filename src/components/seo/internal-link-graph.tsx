import Link from "next/link";
import { COUNTRIES } from "@/data/immigration-countries";
import { getProgramMaillage, localizeHref, type MaillageLink } from "@/data/seo-maillage";

type InternalLinkGraphProps = {
  locale: string;
  programSlug: string;
  countrySlug?: string;
};

const labels: Record<string, {
  eyebrow: string;
  heading: string;
  parent: string;
  siblings: string;
  children: string;
  countries: string;
  action: string;
}> = {
  en: {
    eyebrow: "Immigration knowledge graph",
    heading: "Related Canadian immigration pathways",
    parent: "Parent pillar",
    siblings: "Sibling topics",
    children: "Deep-dive pages",
    countries: "Country intent pages",
    action: "Next step",
  },
  fr: {
    eyebrow: "Maillage immigration",
    heading: "Parcours d'immigration relies",
    parent: "Pilier parent",
    siblings: "Sujets voisins",
    children: "Pages approfondies",
    countries: "Pages par pays",
    action: "Prochaine etape",
  },
  es: {
    eyebrow: "Grafo de inmigracion",
    heading: "Rutas relacionadas de inmigracion canadiense",
    parent: "Pilar principal",
    siblings: "Temas relacionados",
    children: "Guias profundas",
    countries: "Paginas por pais",
    action: "Siguiente paso",
  },
  ar: {
    eyebrow: "Immigration knowledge graph",
    heading: "Related Canadian immigration pathways",
    parent: "Parent pillar",
    siblings: "Sibling topics",
    children: "Deep-dive pages",
    countries: "Country intent pages",
    action: "Next step",
  },
};

function CardLink({ locale, link }: { locale: string; link: MaillageLink }) {
  return (
    <Link
      href={localizeHref(locale, link.href)}
      className="group block rounded-xl border border-border bg-white p-4 transition-colors hover:border-primary/50"
    >
      <span className="text-sm font-bold text-gray-900 group-hover:text-primary">
        {link.label}
      </span>
      <span className="mt-1 block text-xs leading-relaxed text-gray-600">
        {link.description}
      </span>
    </Link>
  );
}

export function InternalLinkGraph({ locale, programSlug, countrySlug }: InternalLinkGraphProps) {
  const graph = getProgramMaillage(programSlug);
  if (!graph) return null;

  const t = labels[locale] ?? labels.en;
  const countryLinks = graph.countryTargets
    .filter((slug) => slug !== countrySlug)
    .map((slug) => COUNTRIES.find((country) => country.slug === slug))
    .filter(Boolean)
    .slice(0, 6);

  return (
    <section className="border-t border-border pt-10">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
        {t.eyebrow}
      </p>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">{t.heading}</h2>

      <div className="space-y-8">
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
            {t.parent}
          </h3>
          <CardLink locale={locale} link={graph.pillar} />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
            {t.siblings}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {graph.siblings.map((link) => (
              <CardLink key={link.href} locale={locale} link={link} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
            {t.children}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {graph.children.map((link) => (
              <CardLink key={link.href} locale={locale} link={link} />
            ))}
          </div>
        </div>

        {countryLinks.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
              {t.countries}
            </h3>
            <div className="flex flex-wrap gap-2">
              {countryLinks.map((country) => {
                if (!country) return null;
                const countryName = country.name[locale as keyof typeof country.name] ?? country.name.en;
                return (
                  <Link
                    key={country.slug}
                    href={`/${locale}/from/${country.slug}/${programSlug}`}
                    className="rounded-full border border-border px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    {countryName}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-primary/25 bg-primary/5 p-5">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">
            {t.action}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[graph.service, ...graph.ctas].map((link) => (
              <CardLink key={link.href} locale={locale} link={link} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
