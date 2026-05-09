import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface StepsSectionProps {
  title: string;
  subtitle?: string;
  steps: Array<{
    number: number;
    title: string;
    description: string;
  }>;
  dark?: boolean;
}

export function StepsSection({ title, subtitle, steps, dark = false }: StepsSectionProps) {
  const textClass = dark ? "text-white" : "";
  const subtitleClass = dark ? "text-white/70" : "text-muted-foreground";
  const cardClass = dark
    ? "bg-white/10 border-white/20 backdrop-blur-sm"
    : "bg-card border";
  const descClass = dark ? "text-white/65" : "text-muted-foreground";

  return (
    <section className={dark ? "py-16" : "py-16 bg-muted/30"}>
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-12">
          <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${textClass}`}>{title}</h2>
          {subtitle && (
            <p className={`max-w-xl mx-auto ${subtitleClass}`}>{subtitle}</p>
          )}
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 120}>
              <div className={`flex gap-4 rounded-xl border p-6 ${cardClass}`}>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  {step.number}
                </span>
                <div>
                  <h3 className={`font-semibold mb-1 ${textClass}`}>{step.title}</h3>
                  <p className={`text-sm leading-relaxed ${descClass}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
