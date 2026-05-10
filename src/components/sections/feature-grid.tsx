import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface FeatureGridItem {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href?: string;
}

interface FeatureGridProps {
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  items: FeatureGridItem[];
}

export function FeatureGrid({
  title,
  subtitle,
  columns = 3,
  items,
}: FeatureGridProps) {
  const colClass =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
        ? "md:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-3";

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <ScrollReveal className="text-center mb-12">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "#111827" }}>{title}</h2>
            )}
            {subtitle && (
              <p className="max-w-xl mx-auto" style={{ color: "#374151" }}>{subtitle}</p>
            )}
          </ScrollReveal>
        )}
        <div className={cn("grid grid-cols-1 gap-6", colClass)}>
          {items.map((item, i) => {
            const content = (
              <>
                {item.icon && (
                  <item.icon className="h-8 w-8 text-primary mb-3" />
                )}
                <h3 className="font-semibold text-lg mb-2" style={{ color: "#111827" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                  {item.description}
                </p>
              </>
            );

            if (item.href) {
              return (
                <ScrollReveal key={i} delay={i * 80}>
                  <Link
                    href={item.href}
                    className="rounded-xl border border-border bg-white p-6 hover:shadow-md hover:border-primary/30 transition-all block h-full"
                  >
                    {content}
                  </Link>
                </ScrollReveal>
              );
            }

            return (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="rounded-xl border border-border bg-white p-6 h-full shadow-sm hover:shadow-md transition-shadow">
                  {content}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
