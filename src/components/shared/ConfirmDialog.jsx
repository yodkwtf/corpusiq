import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

/**
 * Accessible confirmation modal: focus moves in on open, Escape and
 * backdrop click cancel, Tab is trapped inside while open.
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}) {
  const titleId = useId();
  const messageId = useId();
  const panelRef = useRef(null);
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();

    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll("button");
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/50 p-4 backdrop-blur-sm sm:items-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onCancel();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={messageId}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full max-w-sm rounded-3xl bg-surface p-6 shadow-2xl ring-1 ring-ink-900/10 dark:bg-surface-dark dark:ring-white/10"
          >
            {danger && (
              <span className="mb-4 inline-flex rounded-2xl bg-risk-100 p-2.5 text-risk-600 dark:bg-risk-900/40 dark:text-risk-300" aria-hidden="true">
                <AlertTriangle size={22} />
              </span>
            )}
            <h2 id={titleId} className="text-lg font-extrabold">
              {title}
            </h2>
            <p id={messageId} className="mt-2 text-sm leading-relaxed text-text-secondary dark:text-text-secondary-dark">
              {message}
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button ref={cancelRef} type="button" onClick={onCancel} className="btn-ghost">
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={
                  danger
                    ? "inline-flex items-center justify-center gap-2 rounded-full bg-danger px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-danger/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-danger/30"
                    : "btn-primary"
                }
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
