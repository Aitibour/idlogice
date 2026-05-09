import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  origin: string;
  text: string;
  result: string;
  rating: number;
}

interface TestimonialsSectionProps {
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export function TestimonialsSection({
  title,
  subtitle,
  testimonials,
}: TestimonialsSectionProps) {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-14">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="bg-card border rounded-2xl p-6 flex flex-col gap-4 h-full hover:shadow-md transition-shadow">
                <StarRating count={t.rating} />
                <p className="text-muted-foreground leading-relaxed flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="pt-2 border-t">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.origin}</p>
                  <p className="text-xs font-medium text-primary mt-1">
                    {t.result}
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
