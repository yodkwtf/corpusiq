import { useId, useState } from "react";
import { Info } from "lucide-react";
import { getGlossaryTerm } from "../../data/glossary";

/**
 * Lightweight tooltip: hover/focus toggles a small popover.
 * Pass `text`, or `glossaryId` to pull the definition from data/glossary.js.
 */
export default function Tooltip({ text, glossaryId, label = "More info" }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  const entry = glossaryId ? getGlossaryTerm(glossaryId) : null;
  const content = entry ? `${entry.term}: ${entry.definition}` : text;
  if (!content) return null;

  return (
    <span className="relative inline-flex print-hide">
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        className="inline-flex text-ink-400 transition-colors hover:text-primary focus:text-primary focus:outline-none"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
      >
        <Info size={14} aria-hidden="true" />
      </button>
      {open && (
        <span
          role="tooltip"
          id={id}
          className="absolute bottom-full left-1/2 z-30 mb-2 w-60 -translate-x-1/2 rounded-xl bg-ink-900 p-3 text-xs leading-relaxed text-white shadow-lg dark:bg-ink-100 dark:text-ink-900"
        >
          {content}
        </span>
      )}
    </span>
  );
}
