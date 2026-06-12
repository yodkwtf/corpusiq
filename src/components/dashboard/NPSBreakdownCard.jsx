import { Landmark } from "lucide-react";
import Card from "../shared/Card";
import Tooltip from "../shared/Tooltip";
import { explainNPSPension } from "../../utils/explainers";
import { formatINR, formatPct } from "../../utils/formatters";

/** Rendered only when the user actually has NPS money (value or SIP > 0). */
export default function NPSBreakdownCard({ projection }) {
  const { nps } = projection;
  const annuityPctOfCorpus = nps.corpus > 0 ? (nps.annuityCorpus / nps.corpus) * 100 : 0;

  const rows = [
    { label: "NPS corpus at 60", value: nps.corpus },
    { label: `Lump sum you can withdraw (${formatPct(100 - annuityPctOfCorpus, 0)})`, value: nps.lumpSum },
    { label: `Goes into annuity (${formatPct(annuityPctOfCorpus, 0)})`, value: nps.annuityCorpus },
  ];

  return (
    <Card
      id="nps"
      icon={Landmark}
      title="Your NPS, decoded"
      subtitle="What actually happens to it at retirement"
    >
      <dl className="space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 text-sm">
            <dt className="text-text-secondary dark:text-text-secondary-dark">{row.label}</dt>
            <dd className="font-semibold tabular-nums">{formatINR(row.value)}</dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 border-t border-ink-100 pt-2.5 text-sm dark:border-ink-800">
          <dt className="inline-flex items-center gap-1.5 font-medium">
            Monthly pension for life
            <Tooltip glossaryId="annuity" />
          </dt>
          <dd className="text-base font-bold tabular-nums text-primary">
            {formatINR(nps.monthlyPension)}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary dark:text-text-secondary-dark">
        {explainNPSPension(nps.lumpSum, nps.monthlyPension)}
      </p>
    </Card>
  );
}
