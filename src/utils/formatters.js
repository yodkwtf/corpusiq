/**
 * Currency + number formatting for the Indian numbering system.
 * Single source of truth - use these everywhere, never inline toLocaleString.
 */

const CRORE = 1e7;
const LAKH = 1e5;

function toFiniteNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Format a rupee amount as a human-friendly Indian-system string.
 *   1250        -> "₹1,250"
 *   8500000     -> "₹85 Lakh"
 *   42000000    -> "₹4.2 Cr"
 *   999999999999 -> "₹1,00,000 Cr"
 */
export function formatINR(value) {
  let n = toFiniteNumber(value);
  const sign = n < 0 ? "-" : "";
  n = Math.abs(n);

  if (n >= CRORE) {
    const crores = n / CRORE;
    const display =
      crores >= 1000
        ? Math.round(crores).toLocaleString("en-IN")
        : crores >= 100
          ? crores.toFixed(0)
          : trimZeros(crores.toFixed(crores >= 10 ? 1 : 2));
    return `${sign}₹${display} Cr`;
  }
  if (n >= LAKH) {
    const lakhs = n / LAKH;
    const display = trimZeros(lakhs.toFixed(lakhs >= 10 ? 1 : 2));
    return `${sign}₹${display} Lakh`;
  }
  return `${sign}₹${Math.round(n).toLocaleString("en-IN")}`;
}

/** Full precision Indian-grouped rupees, e.g. "₹85,00,000" - for inputs/print. */
export function formatINRFull(value) {
  const n = toFiniteNumber(value);
  const sign = n < 0 ? "-" : "";
  return `${sign}₹${Math.round(Math.abs(n)).toLocaleString("en-IN")}`;
}

/** "9%" / "7.1%" */
export function formatPct(value, decimals = 1) {
  const n = toFiniteNumber(value);
  return `${trimZeros(n.toFixed(decimals))}%`;
}

/** Round years to one decimal for display; integers stay clean. */
export function formatYears(value) {
  const n = toFiniteNumber(value);
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);
}

function trimZeros(numStr) {
  // Only trim trailing zeros in the fractional part ("7.10" -> "7.1",
  // "9.00" -> "9"). Whole numbers must stay intact ("80" must not become "8").
  return numStr.includes(".") ? numStr.replace(/\.?0+$/, "") : numStr;
}

/**
 * Strip a typed/pasted value down to a non-negative numeric *string* (or "").
 * Returns a string rather than a number so in-progress decimals stay editable:
 * coercing "7." to the number 7 on every keystroke would drop the dot and make
 * the field reject decimals entirely. Callers already coerce with Number()/num().
 */
export function sanitizeNumericInput(raw, { allowDecimal = true, max = 1e12 } = {}) {
  if (raw === "" || raw === null || raw === undefined) return "";
  let cleaned = String(raw).replace(allowDecimal ? /[^0-9.]/g : /[^0-9]/g, "");
  if (allowDecimal) {
    // Keep only the first decimal point; fold any extra digits behind it.
    const [intPart, ...rest] = cleaned.split(".");
    cleaned = rest.length ? `${intPart}.${rest.join("")}` : intPart;
  }
  if (cleaned === "" || cleaned === ".") return "";
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return "";
  // Clamp to max, but otherwise preserve the typed string (incl. a trailing "."
  // or trailing zeros like "7.0") so partial decimal entry keeps working.
  if (n > max) return String(max);
  // Drop redundant leading zeros in the integer part ("07" -> "7", "0.5" stays).
  return cleaned.replace(/^0+(?=\d)/, "");
}
