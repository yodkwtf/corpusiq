import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Wallet } from "lucide-react";
import Card from "../shared/Card";
import AnimatedNumber from "../shared/AnimatedNumber";
import Tooltip from "../shared/Tooltip";
import { explainCorpusBreakdown } from "../../utils/explainers";
import { formatPct } from "../../utils/formatters";

const COLORS = ["var(--color-primary)", "var(--color-secondary)"];

export default function TopSummaryCard({ projection }) {
  const { totalInvested, split, totalCorpus } = projection;
  const data = [
    { name: "Your contributions", value: Math.max(split.invested, 0) },
    { name: "Growth earned", value: Math.max(split.growth, 0) },
  ];
  const hasData = totalCorpus > 0;

  return (
    <Card
      id="summary"
      icon={Wallet}
      title="Your wealth at retirement"
      subtitle={`Projected at age ${projection.retirementAge}`}
    >
      <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Stat label="You invested" value={totalInvested} />
          <Stat label="Growth earned" value={split.growth} accent />
          <Stat label="Total wealth" value={totalCorpus} big />
        </div>
        {hasData && (
          <div className="mx-auto h-40 w-40" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius="65%"
                  outerRadius="100%"
                  paddingAngle={2}
                  strokeWidth={0}
                  isAnimationActive={false}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      {hasData && (
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-text-secondary dark:text-text-secondary-dark">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
            Contributions {formatPct(split.investedPct, 0)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-secondary" aria-hidden="true" />
            Growth {formatPct(split.growthPct, 0)}
          </span>
          <Tooltip glossaryId="corpus" />
        </div>
      )}
      <p className="mt-4 text-sm leading-relaxed text-text-secondary dark:text-text-secondary-dark">
        {explainCorpusBreakdown(split.invested, split.growth, totalCorpus)}
      </p>
    </Card>
  );
}

function Stat({ label, value, big = false, accent = false }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-text-secondary dark:text-text-secondary-dark">
        {label}
      </p>
      <AnimatedNumber
        value={value}
        className={`mt-1 block font-bold tabular-nums ${
          big ? "text-2xl text-primary sm:text-3xl" : accent ? "text-xl text-secondary sm:text-2xl" : "text-xl sm:text-2xl"
        }`}
      />
    </div>
  );
}
