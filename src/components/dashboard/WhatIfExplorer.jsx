import { useMemo, useState } from "react";
import { FlaskConical, RotateCcw } from "lucide-react";
import Card from "../shared/Card";
import Slider from "../shared/Slider";
import Badge from "../shared/Badge";
import { computeProjection } from "../../utils/calculations";
import { formatINR } from "../../utils/formatters";
import { explainWhatIfDelta } from "../../utils/explainers";

const DEFAULT_SCENARIO = {
  retireShiftYears: 0, // negative = earlier
  sipDelta: 0, // ₹/month added to (or removed from) total SIP
  returnsShift: 0, // percentage points on every instrument
  inflationShift: 0,
  delayStartYears: 0,
  stopInvesting: false,
  withdrawNow: false,
  mode: "both", // "both" | "lumpOnly" | "sipOnly"
};

/**
 * Builds a modified copy of the planner state for a scenario and reprojects.
 * All extremes are clamped inside computeProjection - sliders can't break it.
 */
function applyScenario(state, s) {
  const currentAge = Number(state.profile.currentAge) || 0;
  const retirementAge = Math.min(
    Math.max((Number(state.profile.retirementAge) || 60) + s.retireShiftYears, currentAge),
    100
  );

  const investments = {};
  const keys = ["nps", "pf", "mf"];
  const totalSip = keys.reduce(
    (acc, k) => acc + (Number(state.investments[k].monthlyContribution) || 0),
    0
  );

  for (const k of keys) {
    let currentValue = Number(state.investments[k].currentValue) || 0;
    let monthlyContribution = Number(state.investments[k].monthlyContribution) || 0;

    // Distribute the SIP delta proportionally; if no SIPs exist, add it to MF.
    if (s.sipDelta !== 0) {
      const share = totalSip > 0 ? monthlyContribution / totalSip : k === "mf" ? 1 : 0;
      monthlyContribution = Math.max(monthlyContribution + s.sipDelta * share, 0);
    }
    if (s.stopInvesting || s.mode === "lumpOnly") monthlyContribution = 0;
    if (s.withdrawNow || s.mode === "sipOnly") currentValue = 0;

    investments[k] = { currentValue, monthlyContribution };
  }

  const assumptions = {
    ...state.assumptions,
    returns: {
      nps: (Number(state.assumptions.returns.nps) || 0) + s.returnsShift,
      pf: (Number(state.assumptions.returns.pf) || 0) + s.returnsShift,
      mf: (Number(state.assumptions.returns.mf) || 0) + s.returnsShift,
    },
    inflationPct: Math.max((Number(state.assumptions.inflationPct) || 0) + s.inflationShift, 0),
    contributionDelayYears: s.delayStartYears,
  };

  return {
    profile: { ...state.profile, retirementAge },
    investments,
    assumptions,
  };
}

export default function WhatIfExplorer({ state, baseProjection }) {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const set = (key) => (value) => setScenario((s) => ({ ...s, [key]: value }));
  const isDirty = JSON.stringify(scenario) !== JSON.stringify(DEFAULT_SCENARIO);

  const scenarioProjection = useMemo(() => {
    if (!isDirty) return baseProjection;
    try {
      return computeProjection(applyScenario(state, scenario));
    } catch {
      return baseProjection; // never let a slider extreme crash the page
    }
  }, [state, scenario, baseProjection, isDirty]);

  return (
    <Card
      id="whatif"
      icon={FlaskConical}
      title="What if…?"
      subtitle="Move the levers. Every number recalculates instantly."
    >
      <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
        <Slider
          label="Retire earlier / later"
          value={scenario.retireShiftYears}
          min={-10}
          max={10}
          onChange={set("retireShiftYears")}
          formatValue={(v) => (v === 0 ? "as planned" : v > 0 ? `+${v} yrs later` : `${v} yrs earlier`)}
        />
        <Slider
          label="Change monthly SIP"
          value={scenario.sipDelta}
          min={-50000}
          max={1000000}
          step={5000}
          onChange={set("sipDelta")}
          formatValue={(v) => (v === 0 ? "no change" : `${v > 0 ? "+" : "-"}${formatINR(Math.abs(v))}/mo`)}
          disabled={scenario.stopInvesting || scenario.mode === "lumpOnly"}
        />
        <Slider
          label="Market returns"
          value={scenario.returnsShift}
          min={-4}
          max={4}
          step={0.5}
          onChange={set("returnsShift")}
          formatValue={(v) => (v === 0 ? "as assumed" : `${v > 0 ? "+" : ""}${v}% pts`)}
        />
        <Slider
          label="Inflation"
          value={scenario.inflationShift}
          min={0}
          max={4}
          step={0.5}
          onChange={set("inflationShift")}
          formatValue={(v) => (v === 0 ? "as assumed" : `+${v}% pts`)}
        />
        <Slider
          label="Delay starting SIPs by"
          value={scenario.delayStartYears}
          min={0}
          max={10}
          onChange={set("delayStartYears")}
          formatValue={(v) => (v === 0 ? "start now" : `${v} year${v > 1 ? "s" : ""}`)}
          disabled={scenario.stopInvesting || scenario.mode === "lumpOnly"}
        />
        <div className="flex flex-wrap items-end gap-2">
          <Toggle
            active={scenario.stopInvesting}
            onClick={() => set("stopInvesting")(!scenario.stopInvesting)}
          >
            Stop investing today
          </Toggle>
          <Toggle
            active={scenario.withdrawNow}
            onClick={() => set("withdrawNow")(!scenario.withdrawNow)}
          >
            Withdraw everything now
          </Toggle>
          <Toggle
            active={scenario.mode === "lumpOnly"}
            onClick={() => set("mode")(scenario.mode === "lumpOnly" ? "both" : "lumpOnly")}
          >
            Lump sum only
          </Toggle>
          <Toggle
            active={scenario.mode === "sipOnly"}
            onClick={() => set("mode")(scenario.mode === "sipOnly" ? "both" : "sipOnly")}
          >
            SIP only
          </Toggle>
        </div>
      </div>

      {/* Before / after */}
      <div className="mt-6 overflow-hidden rounded-xl border border-ink-100 dark:border-ink-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ink-50 text-left text-xs uppercase tracking-wide text-text-secondary dark:bg-ink-800/50 dark:text-text-secondary-dark">
              <th scope="col" className="px-4 py-2.5 font-semibold">Metric</th>
              <th scope="col" className="px-4 py-2.5 font-semibold">Current plan</th>
              <th scope="col" className="px-4 py-2.5 font-semibold">This scenario</th>
            </tr>
          </thead>
          <tbody>
            <CompareRow
              label="Corpus at retirement"
              before={formatINR(baseProjection.totalCorpus)}
              after={formatINR(scenarioProjection.totalCorpus)}
              better={scenarioProjection.totalCorpus >= baseProjection.totalCorpus}
              changed={isDirty}
            />
            <CompareRow
              label="Monthly income"
              before={`${formatINR(baseProjection.monthlyRetirementIncome)}/mo`}
              after={`${formatINR(scenarioProjection.monthlyRetirementIncome)}/mo`}
              better={scenarioProjection.monthlyRetirementIncome >= baseProjection.monthlyRetirementIncome}
              changed={isDirty}
            />
            <CompareRow
              label="Money lasts until"
              before={ageLabel(baseProjection)}
              after={ageLabel(scenarioProjection)}
              better={scenarioProjection.depletionAge >= baseProjection.depletionAge}
              changed={isDirty}
            />
            <CompareRow
              label="Health score"
              before={`${baseProjection.health.score}/100`}
              after={`${scenarioProjection.health.score}/100`}
              better={scenarioProjection.health.score >= baseProjection.health.score}
              changed={isDirty}
            />
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-relaxed text-text-secondary dark:text-text-secondary-dark">
          {isDirty
            ? explainWhatIfDelta("This scenario", baseProjection.totalCorpus, scenarioProjection.totalCorpus)
            : "Adjust any lever above to compare against your current plan."}
        </p>
        {isDirty && (
          <button
            type="button"
            onClick={() => setScenario(DEFAULT_SCENARIO)}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            <RotateCcw size={14} aria-hidden="true" />
            Reset scenario
          </button>
        )}
      </div>
    </Card>
  );
}

function ageLabel(projection) {
  const age = projection.depletionAge;
  if (projection.longevityAtPlannedSpend.lastsForever || age >= 100) return "100+ (lifelong)";
  return `age ${Math.round(age)}`;
}

function Toggle({ active, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "border-primary bg-primary text-white"
          : "border-ink-200 text-text-secondary hover:border-primary hover:text-primary dark:border-ink-700 dark:text-text-secondary-dark"
      }`}
    >
      {children}
    </button>
  );
}

function CompareRow({ label, before, after, better, changed }) {
  return (
    <tr className="border-t border-ink-100 dark:border-ink-800">
      <th scope="row" className="px-4 py-2.5 text-left font-medium">{label}</th>
      <td className="px-4 py-2.5 tabular-nums text-text-secondary dark:text-text-secondary-dark">{before}</td>
      <td className="px-4 py-2.5">
        <span className="inline-flex items-center gap-2 font-semibold tabular-nums">
          {after}
          {changed && before !== after && (
            <Badge tone={better ? "onTrack" : "atRisk"}>{better ? "▲" : "▼"}</Badge>
          )}
        </span>
      </td>
    </tr>
  );
}
