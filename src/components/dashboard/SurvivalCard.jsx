import { useState } from "react";
import { Hourglass } from "lucide-react";
import Card from "../shared/Card";
import Slider from "../shared/Slider";
import Badge from "../shared/Badge";
import { calculateCorpusLongevity } from "../../utils/calculations";
import { explainLongevity } from "../../utils/explainers";
import { formatINR } from "../../utils/formatters";

/** "How long will my money last?" - live slider over monthly spend. */
export default function SurvivalCard({ projection }) {
  const { totalCorpus, retirementAge, postRetirementReturn, inflation, monthlyRetirementIncome } = projection;

  const defaultSpend = Math.max(Math.round(monthlyRetirementIncome / 1000) * 1000, 10000);
  const [spend, setSpend] = useState(defaultSpend);

  const maxSpend = Math.max(defaultSpend * 3, 50000);
  const longevity = calculateCorpusLongevity(totalCorpus, spend, postRetirementReturn, inflation);
  const depletionAge = retirementAge + longevity.years;
  const lifelong = longevity.lastsForever || depletionAge >= 100;
  const runsOutEarly = !lifelong && depletionAge <= retirementAge + 1;

  return (
    <Card
      id="longevity"
      icon={Hourglass}
      title="How long will it last?"
      subtitle="Drag the slider to your expected monthly spending"
    >
      <div className="mb-5">
        <Slider
          label="Monthly spending in retirement"
          value={Math.min(spend, maxSpend)}
          min={10000}
          max={maxSpend}
          step={5000}
          onChange={setSpend}
          formatValue={(v) => `${formatINR(v)}/mo`}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-2xl font-bold tabular-nums">
          {lifelong ? "100+ / lifelong" : `Until age ~${Math.round(depletionAge)}`}
        </p>
        {runsOutEarly ? (
          <Badge tone="atRisk">May not last through retirement</Badge>
        ) : lifelong ? (
          <Badge tone="onTrack">Outlives you, in the best way</Badge>
        ) : depletionAge >= 85 ? (
          <Badge tone="onTrack">Comfortable runway</Badge>
        ) : (
          <Badge tone="needsWork">Watch this number</Badge>
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary dark:text-text-secondary-dark">
        {explainLongevity(depletionAge, retirementAge, lifelong, spend)}
      </p>
    </Card>
  );
}
