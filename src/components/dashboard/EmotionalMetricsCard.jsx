import { HeartHandshake } from "lucide-react";
import Card from "../shared/Card";
import { calculateCorpusLongevity } from "../../utils/calculations";
import { explainEmotionalMetric } from "../../utils/explainers";
import { formatINR } from "../../utils/formatters";

/**
 * Makes the corpus feel real: "₹X/month for Y years" at three lifestyles.
 */
export default function EmotionalMetricsCard({ projection }) {
  const { totalCorpus, monthlyRetirementIncome, postRetirementReturn, inflation } = projection;

  const base = Math.max(monthlyRetirementIncome, 20000);
  const levels = [
    { label: "Modest", spend: Math.round(base * 0.7) },
    { label: "Comfortable", spend: Math.round(base) },
    { label: "Generous", spend: Math.round(base * 1.5) },
  ];

  return (
    <Card
      id="lifestyle"
      icon={HeartHandshake}
      title="What this means for daily life"
      subtitle="The same corpus, three lifestyles"
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {levels.map((level) => {
          const longevity = calculateCorpusLongevity(
            totalCorpus,
            level.spend,
            postRetirementReturn,
            inflation
          );
          const lifelong = longevity.lastsForever || longevity.years >= 60;
          return (
            <div
              key={level.label}
              className="rounded-xl border border-ink-100 p-4 dark:border-ink-800"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary dark:text-text-secondary-dark">
                {level.label}
              </p>
              <p className="mt-1 text-lg font-bold tabular-nums">{formatINR(level.spend)}<span className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark">/mo</span></p>
              <p className="mt-1.5 text-xs leading-relaxed text-text-secondary dark:text-text-secondary-dark">
                {explainEmotionalMetric(level.spend, longevity.years, lifelong)}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
