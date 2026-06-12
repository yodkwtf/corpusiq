export default function Card({ id, title, subtitle, icon: Icon, children, className = "" }) {
  return (
    <section
      id={id}
      className={`print-block scroll-mt-24 rounded-2xl bg-surface/80 p-5 shadow-card ring-1 ring-ink-900/5 backdrop-blur transition-all duration-300 hover:shadow-lg dark:bg-surface-dark/80 dark:ring-white/5 sm:p-6 ${className}`}
    >
      {(title || Icon) && (
        <header className="mb-4 flex items-start gap-3">
          {Icon && (
            <span className="icon-chip mt-0.5" aria-hidden="true">
              <Icon size={20} />
            </span>
          )}
          <div>
            {title && (
              <h2 className="text-base font-bold sm:text-lg">{title}</h2>
            )}
            {subtitle && (
              <p className="mt-0.5 text-sm text-text-secondary dark:text-text-secondary-dark">
                {subtitle}
              </p>
            )}
          </div>
        </header>
      )}
      {children}
    </section>
  );
}
