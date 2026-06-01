import Link from "next/link";
import { BLOG_TOPICS, type BlogTopicId } from "@/lib/blog/topics";

type Props = {
  locale: string;
  counts: Partial<Record<BlogTopicId, number>>;
};

const topicDescriptions: Partial<Record<BlogTopicId, string>> = {
  "express-entry": "CRS scores, draws, French points, skilled worker eligibility, and PR strategy.",
  "work-permit": "Open work permits, LMIA, employer-specific permits, Francophone Mobility, and job-backed pathways.",
  "study-permit": "Study permits, SDS, refusals, student work rules, PGWP planning, and PR after studies.",
  pnp: "Provincial nominee options, low CRS strategies, occupation streams, and province-by-province pathways.",
  "family-sponsorship": "Spousal sponsorship, parents and grandparents, inland and outland files, and refusal prevention.",
  "immigration-news": "IRCC updates, Express Entry draws, PNP changes, processing times, and immigration policy trends.",
};

const ctaLinks = [
  { href: "/book-consultation", label: "Book Consultation" },
  { href: "/evaluation", label: "Free Eligibility Check" },
  { href: "/calculator", label: "CRS Calculator" },
];

export function BlogAuthorityHub({ locale, counts }: Props) {
  const topics = BLOG_TOPICS.filter((topic) => topic.id !== "all");

  return (
    <section className="mb-12 border-y border-gray-200 py-8" aria-labelledby="blog-authority-hub">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="blog-authority-hub" className="text-2xl font-bold text-gray-950">
            Canada Immigration Topic Hubs
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-700">
            Explore the main IDLOGICE immigration pillars, then move into the latest supporting guides and news.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ctaLinks.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              className="rounded-full border border-gray-300 px-4 py-2 text-xs font-bold text-gray-900 transition-colors hover:border-primary hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <article key={topic.id} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-bold leading-snug text-gray-950">{topic.label}</h3>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {counts[topic.id] ?? 0} posts
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">{topicDescriptions[topic.id]}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
              <Link href={`/${locale}${topic.href}`} className="text-primary underline-offset-4 hover:underline">
                {topic.anchor}
              </Link>
              <Link href={`/${locale}/blog?topic=${topic.id}`} className="text-gray-800 underline-offset-4 hover:text-primary hover:underline">
                Latest {topic.label}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
