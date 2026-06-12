import { Target } from "lucide-react";
import Card from "../shared/Card";
import Badge from "../shared/Badge";
import Tooltip from "../shared/Tooltip";
import { explainFIGap, explainCoastFIRE } from "../../utils/explainers";
import { formatINR } from "../../utils/formatters";

export default function FIRECard({ projection }) {
  const { fiNumber, totalCorpus, gapAnalysis, coastFIRE, desiredMonthlyIncomeAtRetirement } = projection;
  const surplus = gapAnalysis.gap <= 0;

  return (
    <Card
      id="fire"
      icon={Target}
      title="Financial independence check"
      subtitle="Your FI number, your gap, and your Coast FIRE status"
    >
      <dl className="space-y-2.5 text-sm">
        <Row
          label={<>FI number <Tooltip glossaryId="fi-number" /></>}
          value={formatINR(fiNumber)}
          note={`Target income: ${formatINR(desiredMonthlyIncomeAtRetirement)}/mo at retirement`}
        />
        <Row label="Projected corpus" value={formatINR(totalCorpus)} />
        <div className="flex items-center justify-between gap-3 border-t border-ink-100 pt-2.5 dark:border-ink-800">
          <dt className="font-medium">{surplus ? "Surplus" : "Shortfall"}</dt>
          <dd>
            <Badge tone={surplus ? "onTrack" : "needsWork"}>
              {surplus ? `+${formatINR(gapAnalysis.surplus)}` : `-${formatINR(gapAnalysis.gap)}`}
            </Badge>
          </dd>
        </div>
        {!surplus && gapAnalysis.catchUpMonthly !== null && (
          <Row
            label="Catch-up SIP needed"
            value={`${formatINR(gapAnalysis.catchUpMonthly)}/mo`}
            note="Extra monthly investment, starting now, to close the gap"
          />
        )}
        <Row
          label={<>Coast FIRE value <Tooltip glossaryId="coast-fire" /></>}
          value={formatINR(coastFIRE)}
          note="What today's money alone becomes if you never invest another rupee"
        />
      </dl>

      <div className="mt-4 space-y-2 text-sm leading-relaxed text-text-secondary dark:text-text-secondary-dark">
        <p>{explainFIGap(gapAnalysis, fiNumber)}</p>
        <p>{explainCoastFIRE(coastFIRE, fiNumber, totalCorpus)}</p>
      </div>
    </Card>
  );
}

function Row({ label, value, note }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-text-secondary dark:text-text-secondary-dark">
        <span className="inline-flex items-center gap-1.5">{label}</span>
        {note && <span className="mt-0.5 block text-xs opacity-80">{note}</span>}
      </dt>
      <dd className="shrink-0 font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
