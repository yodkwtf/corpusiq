import { TrendingDown } from "lucide-react";
import Card from "../shared/Card";
import AnimatedNumber from "../shared/AnimatedNumber";
import Tooltip from "../shared/Tooltip";
import { explainInflation } from "../../utils/explainers";
import { formatPct } from "../../utils/formatters";

export default function InflationCard({ projection }) {
  const { totalCorpus, inflationAdjustedCorpus, yearsToRetirement, inflation } = projection;

  return (
    <Card
      id="inflation"
      icon={TrendingDown}
      title="Inflation reality check"
      subtitle={`At ${formatPct(inflation)} inflation over ${yearsToRetirement} years`}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-ink-50 p-4 dark:bg-ink-800/50">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary dark:text-text-secondary-dark">
            On paper
          </p>
          <AnimatedNumber value={totalCorpus} className="mt-1 block text-xl font-bold tabular-nums sm:text-2xl" />
        </div>
        <div className="rounded-xl border-2 border-warn-300 bg-warn-50 p-4 dark:border-warn-700 dark:bg-warn-900/30">
          <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-warn-800 dark:text-warn-200">
            In today's money <Tooltip glossaryId="inflation-adjusted" />
          </p>
          <AnimatedNumber
            value={inflationAdjustedCorpus}
            className="mt-1 block text-xl font-bold tabular-nums text-warn-800 dark:text-warn-200 sm:text-2xl"
          />
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary dark:text-text-secondary-dark">
        {explainInflation(totalCorpus, inflationAdjustedCorpus, yearsToRetirement)}
      </p>
    </Card>
  );
}
