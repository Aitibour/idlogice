import { Link } from "@/i18n/navigation";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ArrowUpRight } from "lucide-react";
import { type ComponentType } from "react";

interface ServiceCard {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href?: string;
  image: string; // CSS background-image URL
  accent: string; // tailwind gradient class
}

interface ServicesGridProps {
  title: string;
  subtitle?: string;
  cards: ServiceCard[];
}

export function ServicesGrid({ title, subtitle, cards }: ServicesGridProps) {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-14">
          <h2 className="mb-3">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">{subtitle}</p>
          )}
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card, i) => {
            const inner = (
              <div
                className="group relative overflow-hidden rounded-2xl h-72 cursor-pointer"
                style={{
                  backgroundImage: `url(${card.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 transition-all duration-500 group-hover:from-black/90 group-hover:via-black/55" />
                {/* Accent colour tint on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${card.accent}`} />

                {/* Icon */}
                <div className="absolute top-5 left-5">
                  <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <card.icon className="size-5 text-white" />
                  </div>
                </div>

                {/* Arrow */}
                {card.href && (
                  <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                    <ArrowUpRight className="size-4 text-white" />
                  </div>
                )}

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-semibold text-base mb-1.5 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-white/65 text-sm leading-relaxed line-clamp-2 transition-all duration-300 group-hover:text-white/80">
                    {card.description}
                  </p>
                </div>
              </div>
            );

            return (
              <ScrollReveal key={i} delay={i * 90}>
                {card.href ? (
                  <Link href={card.href} className="block">{inner}</Link>
                ) : (
                  inner
                )}
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
