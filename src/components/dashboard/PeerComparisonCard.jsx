import { Users } from "lucide-react";
import Card from "../shared/Card";
import { getPeerPercentile } from "../../utils/calculations";
import { explainPeerComparison } from "../../utils/explainers";
import { formatINR } from "../../utils/formatters";
import { BENCHMARKS } from "../../data/benchmarks";

export default function PeerComparisonCard({ projection }) {
  const invested = projection.currentTotalValue;
  const result = getPeerPercentile(projection.currentAge, invested, BENCHMARKS);
  if (!result) return null;
  const { percentile, bracket } = result;

  return (
    <Card
      id="peers"
      icon={Users}
      title="You vs investors your age"
      subtitle={`Compared with the ${bracket.ageMin}-${bracket.ageMax} age group (illustrative benchmarks)`}
    >
      <p className="text-2xl font-bold">
        Ahead of <span className="text-primary">{percentile}%</span> of peers
      </p>

      <div className="mt-4">
        <div className="relative h-2 w-full rounded-full bg-gradient-to-r from-risk-200 via-warn-200 to-track-300">
          <div
            className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary shadow"
            style={{ left: `${percentile}%` }}
            role="img"
            aria-label={`Your position: ${percentile}th percentile`}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] text-text-secondary dark:text-text-secondary-dark">
          <span>Median: {formatINR(bracket.p50)}</span>
          <span>Top 10%: {formatINR(bracket.p90)}</span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary dark:text-text-secondary-dark">
        {explainPeerComparison(percentile)} (You've invested {formatINR(invested)} so far.)
      </p>
    </Card>
  );
}
