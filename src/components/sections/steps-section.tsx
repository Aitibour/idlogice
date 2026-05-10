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
  const sectionBg = dark ? "" : "bg-white";
  const cardBg = dark ? "bg-white/10 border-white/20 backdrop-blur-sm" : "bg-white border-border shadow-sm";

  return (
    <section className={`py-16 ${sectionBg}`}>
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-12">
          <h2
            className="text-2xl md:text-3xl font-bold mb-3"
            style={{ color: dark ? "#ffffff" : "#111827" }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className="max-w-xl mx-auto"
              style={{ color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}
            >
              {subtitle}
            </p>
          )}
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 120}>
              <div className={`flex gap-4 rounded-xl border p-6 ${cardBg}`}>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                  {step.number}
                </span>
                <div>
                  <h3
                    className="font-semibold mb-1"
                    style={{ color: dark ? "#ffffff" : "#111827" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: dark ? "rgba(255,255,255,0.65)" : "#374151" }}
                  >
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
