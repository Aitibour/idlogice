import Link from "next/link";
import { Calculator, CalendarCheck, MessageCircle, Phone } from "lucide-react";

type Props = {
  locale: string;
  topicLabel?: string;
  compact?: boolean;
};

const WHATSAPP_URL =
  "https://wa.me/15816340224?text=Hello%20IDLOGICE%2C%20I%20would%20like%20help%20with%20my%20Canada%20immigration%20options.";

export function BlogConversionCta({ locale, topicLabel = "Canada immigration", compact = false }: Props) {
  return (
    <aside className={`not-prose rounded-2xl border border-primary/25 bg-white shadow-sm ${compact ? "p-5" : "p-6 sm:p-7"}`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
            Free RCIC profile review
          </p>
          <h2 className={`${compact ? "text-xl" : "text-2xl"} font-black leading-tight text-gray-950`}>
            Turn this {topicLabel.toLowerCase()} update into a clear Canada plan.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Get a personalized eligibility check for Express Entry, PNP, work permits, study permits, or family sponsorship before you make your next move.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[430px]">
          <Link
            href={`/${locale}/evaluation`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-md shadow-primary/20 hover:opacity-90"
          >
            <Calculator className="size-4" />
            Check Eligibility
          </Link>
          <Link
            href={`/${locale}/book-consultation`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-5 py-3 text-sm font-bold text-primary hover:bg-primary/10"
          >
            <CalendarCheck className="size-4" />
            Book Consultation
          </Link>
          <a
            href={WHATSAPP_URL}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-green-200 bg-green-50 px-5 py-3 text-sm font-bold text-green-700 hover:bg-green-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
          <a
            href="tel:+15816340224"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-sm font-bold text-gray-900 hover:border-primary hover:text-primary"
          >
            <Phone className="size-4" />
            Call IDLOGICE
          </a>
        </div>
      </div>
    </aside>
  );
}
