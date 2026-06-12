import NumberField from "../shared/NumberField";
import { usePlanner } from "../../context/PlannerContext";

/**
 * One card per instrument (NPS / PF / MF). Zero is a perfectly valid value -
 * the dashboard simply hides instrument-specific sections.
 */
export default function InvestmentCard({ instrument, title, description, icon: Icon }) {
  const { state, dispatch } = usePlanner();
  const values = state.investments[instrument];

  const set = (field) => (value) =>
    dispatch({ type: "SET_INVESTMENT", instrument, payload: { [field]: value } });

  return (
    <div className="rounded-2xl bg-surface/80 p-5 shadow-card ring-1 ring-ink-900/5 backdrop-blur transition-all duration-300 hover:shadow-lg dark:bg-surface-dark/80 dark:ring-white/5">
      <div className="mb-4 flex items-start gap-3">
        <span className="icon-chip" aria-hidden="true">
          <Icon size={20} />
        </span>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-text-secondary dark:text-text-secondary-dark">
            {description}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <NumberField
          label="Current value"
          value={values.currentValue}
          onChange={set("currentValue")}
          prefix="₹"
          placeholder="0"
          hint="Enter 0 if you don't have this yet."
        />
        <NumberField
          label="Monthly contribution"
          value={values.monthlyContribution}
          onChange={set("monthlyContribution")}
          prefix="₹"
          placeholder="0"
        />
      </div>
    </div>
  );
}
