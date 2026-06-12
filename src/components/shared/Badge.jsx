const STYLES = {
  onTrack: "bg-track-100 text-track-800 dark:bg-track-900/60 dark:text-track-200",
  needsWork: "bg-warn-100 text-warn-800 dark:bg-warn-900/60 dark:text-warn-200",
  atRisk: "bg-risk-100 text-risk-800 dark:bg-risk-900/60 dark:text-risk-200",
  neutral: "bg-ink-100 text-ink-800 dark:bg-ink-800 dark:text-ink-200",
};

export default function Badge({ tone = "neutral", children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STYLES[tone] || STYLES.neutral} ${className}`}
    >
      {children}
    </span>
  );
}
