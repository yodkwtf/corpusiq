import NumberField from "../shared/NumberField";
import { usePlanner } from "../../context/PlannerContext";

export default function AboutYouForm({ errors }) {
  const { state, dispatch } = usePlanner();
  const { profile } = state;

  const set = (field) => (value) => dispatch({ type: "SET_PROFILE", payload: { [field]: value } });

  return (
    <div className="space-y-5">
      <NumberField
        label="Current age"
        required
        value={profile.currentAge}
        onChange={set("currentAge")}
        placeholder="e.g. 28"
        suffix="years"
        allowDecimal={false}
        max={100}
        error={errors.currentAge}
      />
      <NumberField
        label="Planned retirement age"
        required
        value={profile.retirementAge}
        onChange={set("retirementAge")}
        placeholder="60"
        suffix="years"
        allowDecimal={false}
        max={100}
        error={errors.retirementAge}
        hint="Most people in India retire between 58 and 62."
      />
      <NumberField
        label="Current monthly income (optional)"
        value={profile.monthlyIncome}
        onChange={set("monthlyIncome")}
        placeholder="e.g. 80000"
        prefix="₹"
        hint="Used only to personalise your FI target and health score. It never leaves this browser."
      />
    </div>
  );
}
