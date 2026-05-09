import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PhoneCall, Calendar, CheckCircle } from "lucide-react";

interface ConsultantCtaProps {
  title: string;
  subtitle: string;
  bookLabel: string;
  bookHref: string;
  callLabel: string;
  callHref: string;
  benefits: string[];
}

export function ConsultantCta({
  title,
  subtitle,
  bookLabel,
  bookHref,
  callLabel,
  callHref,
  benefits,
}: ConsultantCtaProps) {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6">
              <Calendar className="size-4" />
              Free Consultation Available
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {title}
            </h2>
            <p className="text-white/75 text-lg max-w-2xl mx-auto mb-10">
              {subtitle}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-10">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-white/80 text-sm">
                  <CheckCircle className="size-4 text-emerald-400 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={250}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={bookHref}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-black hover:bg-white/90 text-base px-8 py-6 shadow-xl gap-2",
                )}
              >
                <Calendar className="size-5" />
                {bookLabel}
              </Link>
              <Link
                href={callHref}
                className="inline-flex items-center justify-center h-12 gap-2 px-8 rounded-lg border border-white/50 text-white hover:bg-white/10 transition-all text-base font-medium"
              >
                <PhoneCall className="size-5" />
                {callLabel}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
