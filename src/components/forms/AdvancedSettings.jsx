import Accordion from "../shared/Accordion";
import NumberField from "../shared/NumberField";
import Tooltip from "../shared/Tooltip";
import { usePlanner } from "../../context/PlannerContext";

function SettingRow({ label, tooltip, glossaryId, children }) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-medium">{label}</span>
        <Tooltip text={tooltip} glossaryId={glossaryId} label={`About ${label}`} />
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export default function AdvancedSettings() {
  const { state, dispatch } = usePlanner();
  const a = state.assumptions;

  const setAssumption = (field) => (value) =>
    dispatch({ type: "SET_ASSUMPTIONS", payload: { [field]: value === "" ? "" : value } });
  const setReturn = (instrument) => (value) =>
    dispatch({ type: "SET_RETURN", instrument, value });

  return (
    <Accordion
      title="Advanced settings"
      subtitle="Industry-standard assumptions. Tap to adjust."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <SettingRow
          label="NPS expected return"
          tooltip="Long-term NPS equity-debt blends have historically returned 8-10% a year. Default: 9%."
        >
          <NumberField srOnlyLabel label="NPS return" value={a.returns.nps} onChange={setReturn("nps")} suffix="% / yr" max={30} />
        </SettingRow>
        <SettingRow
          label="PF expected return"
          tooltip="EPF interest is declared by the government each year; recently around 7.1-8.25%. Default: 7.1%."
        >
          <NumberField srOnlyLabel label="PF return" value={a.returns.pf} onChange={setReturn("pf")} suffix="% / yr" max={30} />
        </SettingRow>
        <SettingRow
          label="Mutual fund expected return"
          tooltip="Diversified Indian equity funds have averaged 11-13% over long periods. Default: 12%. Past performance is not a guarantee."
        >
          <NumberField srOnlyLabel label="MF return" value={a.returns.mf} onChange={setReturn("mf")} suffix="% / yr" max={30} />
        </SettingRow>
        <SettingRow
          label="Annual SIP step-up"
          glossaryId="step-up"
        >
          <NumberField srOnlyLabel label="Step-up" value={a.stepUpPct} onChange={setAssumption("stepUpPct")} suffix="% / yr" max={50} />
        </SettingRow>
        <SettingRow
          label="Inflation rate"
          tooltip="India's long-run consumer inflation has averaged about 5-6%. Used to show values in today's money. Default: 6%."
        >
          <NumberField srOnlyLabel label="Inflation" value={a.inflationPct} onChange={setAssumption("inflationPct")} suffix="% / yr" max={20} />
        </SettingRow>
        <SettingRow
          label="Withdrawal rate after retirement"
          glossaryId="withdrawal-rate"
        >
          <NumberField srOnlyLabel label="Withdrawal rate" value={a.withdrawalRatePct} onChange={setAssumption("withdrawalRatePct")} suffix="% / yr" max={20} />
        </SettingRow>
        <SettingRow
          label="NPS annuity purchase"
          glossaryId="annuity"
        >
          <NumberField srOnlyLabel label="Annuity purchase" value={a.npsAnnuityPct} onChange={setAssumption("npsAnnuityPct")} suffix="% of corpus" max={100} />
        </SettingRow>
        <SettingRow
          label="Assumed annuity rate"
          tooltip="The yearly payout rate annuity providers offer, typically 5.5-7%. Default: 6%."
        >
          <NumberField srOnlyLabel label="Annuity rate" value={a.annuityRatePct} onChange={setAssumption("annuityRatePct")} suffix="% / yr" max={15} />
        </SettingRow>
        <SettingRow
          label="Post-retirement portfolio return"
          tooltip="After retiring, money is usually moved to safer assets earning less. Default: 7%."
        >
          <NumberField srOnlyLabel label="Post-retirement return" value={a.postRetirementReturnPct} onChange={setAssumption("postRetirementReturnPct")} suffix="% / yr" max={20} />
        </SettingRow>
      </div>
      <p className="mt-5 rounded-xl bg-ink-50 p-3 text-xs leading-relaxed text-text-secondary dark:bg-ink-800/50 dark:text-text-secondary-dark">
        These defaults reflect commonly used long-term assumptions for Indian markets.
        Every projection on the dashboard updates instantly when you change them.
      </p>
    </Accordion>
  );
}
