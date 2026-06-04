import { ChevronDown, HelpCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { FaqJsonLd } from "@/components/seo/structured-data";

const FAQS = [
  {
    category: "Express Entry",
    items: [
      {
        q: "What is Express Entry and how does it work?",
        a: "Express Entry is Canada's main system for managing applications for permanent residence from skilled workers. You create a profile in the pool, receive a Comprehensive Ranking System (CRS) score based on your age, education, language skills, and work experience, then wait for an Invitation to Apply (ITA) in a draw. The highest-scoring candidates receive invitations.",
      },
      {
        q: "What is the minimum CRS score needed to get an ITA?",
        a: "There is no permanent minimum CRS score for an Invitation to Apply. The cutoff changes by draw type, candidate pool, number of invitations, and IRCC priorities. Check the latest official IRCC draw results and compare them with your profile before making decisions.",
      },
      {
        q: "Can I improve my CRS score?",
        a: "Yes. Common ways include: retaking IELTS/CELPIP to improve language scores, getting a provincial nomination (+600 points), obtaining a valid job offer, completing additional Canadian education, or transferring education credentials. Free profile evaluation to get a personalized improvement plan.",
      },
    ],
  },
  {
    category: "Study Permit",
    items: [
      {
        q: "Who needs a study permit in Canada?",
        a: "You need a study permit if you plan to study at a Designated Learning Institution (DLI) in Canada for more than 6 months. Short courses under 6 months do not require a permit, but a permit is still recommended for flexibility.",
      },
      {
        q: "Can I work while studying in Canada?",
        a: "Some eligible international students can work while studying, subject to the conditions on their study permit and current IRCC rules. Work-hour limits and Post-Graduation Work Permit eligibility can change, so verify the latest requirements before accepting employment or choosing a program.",
      },
      {
        q: "How long does a study permit application take?",
        a: "Study permit processing times vary by country, application completeness, biometrics, medical requirements, and IRCC workload. Check the official IRCC processing-time tool for the latest estimate and apply well before your program start date.",
      },
    ],
  },
  {
    category: "Work Permit",
    items: [
      {
        q: "What is the difference between an open work permit and a closed work permit?",
        a: "An open work permit lets you work for any employer in Canada (with some exceptions). A closed (employer-specific) work permit ties you to a specific employer, position, and location. Open permits are generally preferred for flexibility.",
      },
      {
        q: "Does my employer need an LMIA to hire me?",
        a: "In many cases, yes. A Labour Market Impact Assessment (LMIA) proves there is no Canadian citizen or permanent resident available to fill the role. However, many categories are LMIA-exempt under CUSMA/USMCA, intra-company transfers, or international agreements. We can determine which applies to your situation.",
      },
    ],
  },
  {
    category: "Provincial Nominee Program (PNP)",
    items: [
      {
        q: "How does a provincial nomination help my Express Entry?",
        a: "A valid provincial nomination under an Enhanced PNP stream adds 600 points to your CRS score — essentially guaranteeing an ITA at the next draw. This is the single most effective way to boost your chances if your base score is below the cutoff.",
      },
      {
        q: "Which province is best for my profile?",
        a: "It depends on your occupation, education, language skills, and connections to Canada. Ontario, British Columbia, Alberta, and Saskatchewan have active streams for tech workers, healthcare, and tradespeople. Our RCICs will match your profile to the best provincial stream.",
      },
    ],
  },
  {
    category: "General Immigration",
    items: [
      {
        q: "How much do your consultation services cost?",
        a: "IDLOGICE offers multiple consultation lengths with a CICC-registered immigration consultant. Current options and prices are shown on the booking page. Full representation fees depend on the pathway, application scope, and case complexity.",
      },
      {
        q: "Are you CICC registered?",
        a: "Yes. All our consultants are Regulated Canadian Immigration Consultants (RCICs) registered with the College of Immigration and Citizenship Consultants (CICC). You can verify our registration on the CICC public register.",
      },
      {
        q: "How do I start the immigration process?",
        a: "The first step is understanding your eligibility and the best pathway for your profile. Book a free evaluation or a paid consultation with one of our RCICs. We'll assess your CRS score, review your documents, and map out a clear action plan.",
      },
      {
        q: "Do you help with family sponsorship?",
        a: "Yes. We assist Canadian citizens and permanent residents in sponsoring their spouse, common-law partner, dependent children, or parents and grandparents. Family sponsorship timelines vary from 12 months (spouse) to several years (parents).",
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border border-border rounded-2xl overflow-hidden bg-white transition-shadow hover:shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-left">
        <span className="text-sm font-semibold" style={{ color: "#111827" }}>{q}</span>
        <ChevronDown className="size-4 shrink-0 text-primary transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="px-6 pb-5 border-t border-border/50">
        <p className="text-sm leading-relaxed pt-4" style={{ color: "#374151" }}>{a}</p>
      </div>
    </details>
  );
}

const FAQ_JSON_LD_ITEMS = FAQS.flatMap((cat) =>
  cat.items.map((it) => ({ question: it.q, answer: it.a })),
);

export default function FaqPage() {
  return (
    <>
      <FaqJsonLd items={FAQ_JSON_LD_ITEMS} />
      {/* Hero */}
      <section className="bg-white pt-16 pb-12 border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">FAQ</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4" style={{ color: "#111827" }}>
              Frequently Asked<br /><span className="text-primary">Questions</span>
            </h1>
            <p className="text-lg leading-relaxed mb-6" style={{ color: "#374151" }}>
              Everything you need to know about Canadian immigration — answered by our CICC-registered consultants.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/book-consultation"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
                Free Profile Evaluation
              </Link>
              <Link href="/book-consultation"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                style={{ color: "#374151" }}>
                Free Evaluation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          {FAQS.map(({ category, items }) => (
            <div key={category} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HelpCircle className="size-4 text-primary" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "#111827" }}>{category}</h2>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}

          {/* Still have questions */}
          <div className="mt-12 rounded-3xl border border-border bg-white p-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="size-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "#111827" }}>Still have questions?</h3>
            <p className="text-sm mb-6" style={{ color: "#374151" }}>
              Our CICC-registered consultants are here to help. Book a session or send us a message.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/book-consultation"
                className="px-6 py-3 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
                Free Profile Evaluation
              </Link>
              <Link href="/contact"
                className="px-6 py-3 rounded-full border border-border text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                style={{ color: "#374151" }}>
                Send a Message
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
