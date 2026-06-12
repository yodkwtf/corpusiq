import { Activity } from "lucide-react";
import Card from "../shared/Card";
import Badge from "../shared/Badge";
import AnimatedNumber from "../shared/AnimatedNumber";
import Tooltip from "../shared/Tooltip";
import { explainHealthScore } from "../../utils/explainers";

const BANDS = {
  onTrack: { label: "On Track", emoji: "🟢", barColor: "bg-track-500" },
  needsWork: { label: "Needs Improvement", emoji: "🟡", barColor: "bg-warn-500" },
  atRisk: { label: "At Risk", emoji: "🔴", barColor: "bg-risk-500" },
};

export default function HealthScoreCard({ projection }) {
  const { health } = projection;
  const band = BANDS[health.band];

  const parts = [
    { label: "Corpus vs FI target", value: health.parts.adequacy, max: 50 },
    { label: "Corpus longevity", value: health.parts.longevity, max: 30 },
    { label: "Savings momentum", value: health.parts.momentum, max: 10 },
    { label: "Diversification", value: health.parts.diversification, max: 10 },
  ];

  return (
    <Card
      id="health"
      icon={Activity}
      title="Financial health score"
      subtitle="One number for your retirement readiness"
    >
      <div className="flex items-center gap-4">
        <AnimatedNumber
          value={health.score}
          format={(v) => `${Math.round(v)}`}
          className="text-4xl font-bold tabular-nums"
        />
        <div className="space-y-1.5">
          <Badge tone={health.band}>
            <span aria-hidden="true">{band.emoji}</span> {band.label}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-text-secondary dark:text-text-secondary-dark">
            out of 100 <Tooltip glossaryId="health-score" />
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {parts.map((part) => (
          <div key={part.label}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-text-secondary dark:text-text-secondary-dark">{part.label}</span>
              <span className="font-medium tabular-nums">
                {Math.round(part.value)}/{part.max}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
              <div
                className={`h-full rounded-full ${band.barColor}`}
                style={{ width: `${(part.value / part.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary dark:text-text-secondary-dark">
        {explainHealthScore(health.band, health.score)}
      </p>
    </Card>
  );
}
