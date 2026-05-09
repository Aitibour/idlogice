// Server Component — only AnimatedStats is client-side
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { AnimatedStats } from "@/components/ui/animated-stats";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AboutSectionProps {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  ctaLabel: string;
  ctaHref: string;
  stats: { value: string; label: string }[];
}

export function AboutSection({ eyebrow, title, paragraphs, ctaLabel, ctaHref, stats }: AboutSectionProps) {
  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <ScrollReveal>
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="h-px w-12 bg-primary" />
            <span className="text-primary text-xs font-semibold uppercase tracking-widest whitespace-nowrap">{eyebrow}</span>
            <div className="h-px w-12 bg-primary" />
          </div>
          <h2 className="text-center mb-6">{title}</h2>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="max-w-2xl mx-auto text-center mb-10">
            <p className="text-muted-foreground leading-relaxed mb-6">{paragraphs[0]}</p>
            <Link href={ctaHref} className={cn(buttonVariants(), "gap-2 group")}>
              {ctaLabel}
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <AnimatedStats stats={stats} />
        </ScrollReveal>
      </div>
    </section>
  );
}
