import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ReferenceLine,
} from "recharts";
import { Flag } from "lucide-react";
import Card from "../shared/Card";
import { formatINR } from "../../utils/formatters";
import { explainMilestone } from "../../utils/explainers";

export default function MilestonesTimeline({ projection }) {
  const { milestones, retirementAge } = projection;
  const chartData = milestones.map((m) => ({ age: m.age, value: Math.round(m.value) }));
  const keyMilestones = milestones.filter(
    (m, i) => i === 0 || m.age === retirementAge || i === milestones.length - 1
  );

  return (
    <Card
      id="milestones"
      icon={Flag}
      title="Your wealth journey, year by year"
      subtitle="Projected corpus at each milestone age"
    >
      <div className="h-56 w-full sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="wealthFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="age"
              tickFormatter={(age) => `${age}`}
              tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => formatINR(v)}
              tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
              axisLine={false}
              tickLine={false}
              width={70}
            />
            <RechartsTooltip
              formatter={(value) => [formatINR(value), "Corpus"]}
              labelFormatter={(age) => `Age ${age}`}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--color-text-secondary)",
                background: "var(--color-surface)",
                fontSize: 13,
              }}
            />
            <ReferenceLine
              x={retirementAge}
              stroke="var(--color-secondary)"
              strokeDasharray="4 4"
              label={{ value: "Retirement", fontSize: 11, fill: "var(--color-text-secondary)", position: "insideTopRight" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              fill="url(#wealthFill)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {keyMilestones.map((m) => (
          <div
            key={m.age}
            className="rounded-xl border border-ink-100 p-3 text-sm dark:border-ink-800"
          >
            <p className="font-semibold">Age {m.age}</p>
            <p className="mt-0.5 text-lg font-bold tabular-nums text-primary">{formatINR(m.value)}</p>
            <p className="mt-1 text-xs leading-relaxed text-text-secondary dark:text-text-secondary-dark">
              {explainMilestone(m.age, m.value, retirementAge)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
