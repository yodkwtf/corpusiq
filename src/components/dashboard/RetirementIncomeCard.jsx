import { Banknote } from "lucide-react";
import Card from "../shared/Card";
import AnimatedNumber from "../shared/AnimatedNumber";
import Tooltip from "../shared/Tooltip";
import { explainRetirementIncome } from "../../utils/explainers";
import { formatINR, formatPct } from "../../utils/formatters";

export default function RetirementIncomeCard({ projection }) {
  const { totalCorpus, monthlyRetirementIncome, withdrawalRate } = projection;

  return (
    <Card
      id="income"
      icon={Banknote}
      title="Your retirement salary"
      subtitle="What the corpus pays you each month"
    >
      <div className="flex items-baseline gap-2">
        <AnimatedNumber
          value={monthlyRetirementIncome}
          className="text-2xl font-bold tabular-nums text-primary sm:text-3xl"
        />
        <span className="text-sm text-text-secondary dark:text-text-secondary-dark">/ month</span>
        <Tooltip glossaryId="withdrawal-rate" />
      </div>
      <p className="mt-2 text-xs text-text-secondary dark:text-text-secondary-dark">
        Derivation: {formatINR(totalCorpus)} corpus × {formatPct(withdrawalRate)} yearly withdrawal ÷ 12 months.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary dark:text-text-secondary-dark">
        {explainRetirementIncome(monthlyRetirementIncome, withdrawalRate)}
      </p>
    </Card>
  );
}
