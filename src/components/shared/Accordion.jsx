import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Accessible collapsible section (button + region pattern).
 * Used for Advanced Settings, the dashboard help panel, and the glossary.
 */
export default function Accordion({ title, subtitle, defaultOpen = false, children, className = "" }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className={`overflow-hidden rounded-2xl bg-surface shadow-card dark:bg-surface-dark ${className}`}>
      <button
        type="button"
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-6"
      >
        <span>
          <span className="block text-base font-semibold">{title}</span>
          {subtitle && (
            <span className="mt-0.5 block text-sm text-text-secondary dark:text-text-secondary-dark">
              {subtitle}
            </span>
          )}
        </span>
        <ChevronDown
          size={20}
          aria-hidden="true"
          className={`shrink-0 text-ink-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 sm:px-6 sm:pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
