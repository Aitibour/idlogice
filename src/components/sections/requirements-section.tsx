import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface RequirementsSectionProps {
  title: string;
  qualifications: string[];
  facts: Array<{ label: string; value: string }>;
}

export function RequirementsSection({
  title,
  qualifications,
  facts,
}: RequirementsSectionProps) {
  const t = useTranslations("services");
  const qualificationsLabel = t("shared.qualificationsLabel");
  const factsLabel = t("shared.factsLabel");
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center" style={{ color: "#111827" }}>
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <h3 className="font-semibold mb-4 text-lg" style={{ color: "#111827" }}>{qualificationsLabel}</h3>
            <ul className="space-y-3">
              {qualifications.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span style={{ color: "#374151" }}>{q}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <h3 className="font-semibold mb-4 text-lg" style={{ color: "#111827" }}>{factsLabel}</h3>
            <dl className="space-y-3">
              {facts.map((f, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm border-b border-border pb-2 last:border-0 last:pb-0"
                >
                  <dt style={{ color: "#6b7280" }}>{f.label}</dt>
                  <dd className="font-medium" style={{ color: "#111827" }}>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
