import { CheckCircle2 } from "lucide-react";

interface RequirementsSectionProps {
  title: string;
  qualifications: string[];
  qualificationsLabel?: string;
  facts: Array<{ label: string; value: string }>;
  factsLabel?: string;
}

export function RequirementsSection({
  title,
  qualifications,
  qualificationsLabel = "You may qualify if:",
  facts,
  factsLabel = "Key Facts",
}: RequirementsSectionProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-4 text-lg">{qualificationsLabel}</h3>
            <ul className="space-y-3">
              {qualifications.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-4 text-lg">{factsLabel}</h3>
            <dl className="space-y-3">
              {facts.map((f, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm border-b pb-2 last:border-0 last:pb-0"
                >
                  <dt className="text-muted-foreground">{f.label}</dt>
                  <dd className="font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
