import { useId } from "react";

/**
 * Accessible labeled range slider with live value readout.
 */
export default function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue = (v) => String(v),
  disabled = false,
}) {
  const id = useId();
  return (
    <div className={disabled ? "opacity-50" : ""}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <output
          htmlFor={id}
          className="rounded-lg bg-ink-100 px-2 py-0.5 text-xs font-semibold tabular-nums dark:bg-ink-800"
        >
          {formatValue(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={formatValue(value)}
        className="h-5 w-full cursor-pointer"
      />
    </div>
  );
}
