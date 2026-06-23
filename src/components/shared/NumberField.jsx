import { useId } from "react";
import { sanitizeNumericInput } from "../../utils/formatters";

/**
 * Sanitized non-negative number input. Strips pasted text, blocks negatives,
 * caps extreme values, and keeps "" as a valid (empty) state.
 */
export default function NumberField({
  label,
  value,
  onChange,
  placeholder = "0",
  prefix,
  suffix,
  error,
  hint,
  allowDecimal = true,
  max = 1e12,
  required = false,
  srOnlyLabel = false,
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className={srOnlyLabel ? "sr-only" : "mb-1 block text-sm font-medium"}>
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <div
        className={`flex items-center overflow-hidden rounded-xl border bg-surface transition-colors focus-within:ring-2 focus-within:ring-primary dark:bg-surface-dark ${
          error ? "border-danger" : "border-ink-200 dark:border-ink-700"
        }`}
      >
        {prefix && <span className="shrink-0 pl-3 text-sm text-ink-400">{prefix}</span>}
        <input
          id={id}
          type="text"
          inputMode={allowDecimal ? "decimal" : "numeric"}
          autoComplete="off"
          min="0"
          value={value}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => onChange(sanitizeNumericInput(e.target.value, { allowDecimal, max }))}
          className="no-spinner w-full min-w-0 bg-transparent px-3 py-2.5 text-sm outline-none"
        />
        {suffix && (
          <span className="shrink-0 whitespace-nowrap pr-3 text-sm text-ink-400">{suffix}</span>
        )}
      </div>
      {hint && !error && (
        <p className="mt-1 text-xs text-text-secondary dark:text-text-secondary-dark">{hint}</p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
