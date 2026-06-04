/**
 * Structured-data helpers — emit JSON-LD <script> tags for rich snippets.
 * The JSON is built from in-code constants (no user input), so it is
 * safe to render directly as script children.
 */

const BASE = "https://idlogice.com";

const ORG_NODE = {
  "@type": ["ProfessionalService", "LegalService"],
  "@id": `${BASE}#organization`,
  name: "IDLOGICE Immigration Consulting",
  alternateName: "IDLOGICE",
  url: BASE,
  logo: `${BASE}/logo.png`,
  image: `${BASE}/images/cta-bg.jpg`,
  description:
    "CICC-registered immigration consultants (RCICs) in Montréal. Expert guidance for Express Entry, PNP, study permits, work permits and family sponsorship.",
  telephone: "+1-581-634-0224",
  email: "contact@idlogice.com",
  priceRange: "$$",
  foundingDate: "2014",
  knowsAbout: [
    "Canadian immigration",
    "Express Entry Canada",
    "Comprehensive Ranking System (CRS)",
    "Provincial Nominee Programs",
    "Canada work permits",
    "Canada study permits",
    "Family sponsorship Canada",
    "Francophone immigration to Canada",
  ],
  publishingPrinciples: `${BASE}/en/editorial-standards`,
  correctionsPolicy: `${BASE}/en/corrections-policy`,
  ethicsPolicy: `${BASE}/en/immigration-disclaimer`,
  subjectOf: [
    { "@type": "WebPage", name: "IDLOGICE Immigration Consultants", url: `${BASE}/en/team` },
    { "@type": "CollectionPage", name: "Official Canadian Immigration Resources", url: `${BASE}/en/official-resources` },
    { "@type": "FAQPage", name: "Canadian Immigration FAQ", url: `${BASE}/en/faq` },
    { "@type": "DefinedTermSet", name: "Canadian Immigration Glossary", url: `${BASE}/en/glossary` },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "410 Saint-Catherine St",
    addressLocality: "Montreal",
    addressRegion: "QC",
    addressCountry: "CA",
  },
  areaServed: [
    { "@type": "Country", name: "Canada" },
    { "@type": "Country", name: "Morocco" },
    { "@type": "Country", name: "Algeria" },
    { "@type": "Country", name: "Tunisia" },
    { "@type": "Country", name: "France" },
    { "@type": "Country", name: "Senegal" },
    { "@type": "Country", name: "Nigeria" },
    { "@type": "Country", name: "India" },
    { "@type": "Country", name: "Brazil" },
    { "@type": "Country", name: "Colombia" },
  ],
  knowsLanguage: ["English", "French", "Spanish", "Arabic"],
  sameAs: [
    "https://www.linkedin.com/company/idlogice-immigration-canada",
    "https://www.tiktok.com/@idlogice.canada",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "127",
    bestRating: "5",
    worstRating: "1",
  },
};

/** Escape `</script>` and U+2028/2029 line separators that would break JSON-in-HTML. */
function safeJson(obj: unknown): string {
  const LS = String.fromCharCode(0x2028);
  const PS = String.fromCharCode(0x2029);
  return JSON.stringify(obj)
    .split("<").join("\u003c")
    .split(LS).join("\u2028")
    .split(PS).join("\u2029");
}

export function OrganizationJsonLd() {
  const json = safeJson({ "@context": "https://schema.org", ...ORG_NODE });
  return <script type="application/ld+json">{json}</script>;
}

export function WebsiteJsonLd() {
  const json = safeJson({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}#website`,
    url: BASE,
    name: "IDLOGICE",
    description: "Canadian immigration consultancy — Express Entry, PNP, work and study permits.",
    publisher: { "@id": `${BASE}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE}/en/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    inLanguage: ["en-CA", "fr-CA", "es", "ar"],
  });
  return <script type="application/ld+json">{json}</script>;
}

export function FaqJsonLd({ items }: { items: Array<{ question: string; answer: string }> }) {
  const json = safeJson({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  });
  return <script type="application/ld+json">{json}</script>;
}

export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; url: string }> }) {
  const json = safeJson({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  });
  return <script type="application/ld+json">{json}</script>;
}

export function ServiceJsonLd({ name, description, url }: { name: string; description: string; url: string }) {
  const json = safeJson({
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: { "@id": `${BASE}#organization` },
    areaServed: { "@type": "Country", name: "Canada" },
    serviceType: "Immigration Consulting",
  });
  return <script type="application/ld+json">{json}</script>;
}
