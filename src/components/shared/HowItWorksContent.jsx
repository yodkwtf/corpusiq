import { UserRound, Coins, LayoutDashboard, TrendingUp, PieChart, TrendingDown, Banknote, Settings2 } from "lucide-react";
import Accordion from "./Accordion";
import { GLOSSARY } from "../../data/glossary";
import { branding } from "../../config/branding";

const STEPS = [
  {
    icon: UserRound,
    title: "About you",
    text: "Your age, when you want to retire, and (optionally) your income.",
  },
  {
    icon: Coins,
    title: "Your investments",
    text: "Current value and monthly contribution for NPS, PF and mutual funds. Zero is fine.",
  },
  {
    icon: LayoutDashboard,
    title: "Your results",
    text: "A dashboard that explains your retirement in sentences, not just numbers.",
  },
];

/** The 3-step visual, shared by the How It Works page and dashboard panel. */
export function StepsOverview({ compact = false }) {
  return (
    <ol className={`relative grid gap-4 ${compact ? "sm:grid-cols-3" : "md:grid-cols-3 md:gap-6"}`}>
      {/* Connector line behind the step numbers (desktop) */}
      {!compact && (
        <div
          aria-hidden="true"
          className="absolute left-[16%] right-[16%] top-7 hidden h-px bg-gradient-to-r from-primary/40 via-brand/40 to-secondary/40 md:block"
        />
      )}
      {STEPS.map((step, i) => (
        <li
          key={step.title}
          className={`group relative rounded-2xl bg-surface/80 ring-1 ring-ink-900/5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-surface-dark/80 dark:ring-white/5 ${
            compact ? "p-4" : "p-6 text-center shadow-card"
          }`}
        >
          <div className={`flex items-center gap-3 ${compact ? "" : "flex-col"}`}>
            <span
              className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-brand text-white shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-110 ${
                compact ? "h-10 w-10" : "h-14 w-14"
              }`}
            >
              <step.icon size={compact ? 18 : 24} aria-hidden="true" />
              <span
                className={`absolute -right-1.5 -top-1.5 flex items-center justify-center rounded-full bg-secondary text-[10px] font-extrabold text-white shadow ${
                  compact ? "h-5 w-5" : "h-6 w-6 text-xs"
                }`}
                aria-hidden="true"
              >
                {i + 1}
              </span>
            </span>
            <div>
              <h3 className={`font-bold ${compact ? "text-sm" : "mt-2"}`}>
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
            </div>
          </div>
          <p
            className={`leading-relaxed text-text-secondary dark:text-text-secondary-dark ${
              compact ? "mt-2 text-xs" : "mt-2 text-sm"
            }`}
          >
            {step.text}
          </p>
        </li>
      ))}
    </ol>
  );
}

const MATH_ITEMS = [
  {
    icon: TrendingUp,
    title: "How we project your future value",
    text: "Each month, your existing money grows at the expected return rate, and your monthly contribution is added on top. Contributions rise once a year by your step-up percentage, like a salary hike. Repeat for every month until retirement. That's the whole model, no black box.",
  },
  {
    icon: PieChart,
    title: "\"Money invested\" vs \"growth earned\"",
    text: "Money invested is everything you put in, added up. Growth earned is the rest of the corpus: what compounding produced. Early on, contributions dominate; over decades, growth usually overtakes them. That crossover is why starting early beats starting big.",
  },
  {
    icon: TrendingDown,
    title: "Inflation and \"today's money\"",
    text: "₹1 crore in 2050 won't buy what ₹1 crore buys today. We divide future values by inflation compounded over the years to show what they're really worth in today's prices. That's the honest number to plan around.",
  },
  {
    icon: Banknote,
    title: "How corpus becomes monthly income",
    text: "We apply a withdrawal rate (default 4% a year) to your corpus and divide by 12. For NPS, the rules are applied separately: at least 40% buys an annuity that pays a lifelong pension, and the rest is available as a lump sum.",
  },
  {
    icon: Settings2,
    title: "Every assumption is editable",
    text: "Return rates, inflation, withdrawal rate, step-up, annuity terms: all defaults are industry-standard starting points, and all of them live in Advanced Settings. Change any of them and every card recalculates instantly.",
  },
];

/** Plain-language explanation of the math, as icon cards. */
export function CalculationExplainer({ compact = false }) {
  return (
    <div className={compact ? "space-y-3" : "grid gap-4 sm:grid-cols-2"}>
      {MATH_ITEMS.map((item, i) => (
        <div
          key={item.title}
          className={`flex gap-3.5 rounded-2xl bg-surface/80 ring-1 ring-ink-900/5 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-surface-dark/80 dark:ring-white/5 ${
            compact ? "p-3.5" : "p-5"
          } ${!compact && i === MATH_ITEMS.length - 1 ? "sm:col-span-2" : ""}`}
        >
          <span className="icon-chip h-fit" aria-hidden="true">
            <item.icon size={compact ? 16 : 18} />
          </span>
          <div>
            <h3 className={`font-bold ${compact ? "text-sm" : ""}`}>{item.title}</h3>
            <p className={`mt-1 leading-relaxed text-text-secondary dark:text-text-secondary-dark ${compact ? "text-xs" : "text-sm"}`}>
              {item.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Glossary rendered from data/glossary.js as a card grid. */
export function GlossaryList({ compact = false }) {
  return (
    <dl className={`grid gap-3 ${compact ? "" : "md:grid-cols-2"}`}>
      {GLOSSARY.map((entry) => (
        <div
          key={entry.id}
          id={`glossary-${entry.id}`}
          className="group rounded-2xl border border-ink-100 bg-surface/60 p-4 transition-colors hover:border-primary/30 dark:border-ink-800 dark:bg-surface-dark/60"
        >
          <dt className="flex items-center gap-2 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-brand transition-transform group-hover:scale-150" aria-hidden="true" />
            {entry.term}
          </dt>
          <dd className="mt-1.5 text-sm leading-relaxed text-text-secondary dark:text-text-secondary-dark">
            {entry.definition}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Condensed help panel used near the top of the dashboard. */
export function HowItWorksPanel() {
  return (
    <Accordion
      title="How does this work?"
      subtitle={`A 60-second tour of how ${branding.appName} turns your inputs into this dashboard.`}
      className="print-hide"
    >
      <div className="space-y-6">
        <StepsOverview compact />
        <CalculationExplainer compact />
        <details className="rounded-2xl border border-ink-100 p-4 dark:border-ink-800">
          <summary className="cursor-pointer font-bold">Glossary of terms</summary>
          <div className="mt-4">
            <GlossaryList compact />
          </div>
        </details>
        <p className="text-xs leading-relaxed text-text-secondary dark:text-text-secondary-dark">
          {branding.footer.disclaimer} All figures are projections, not guarantees, and you can
          change every assumption in Advanced Settings at any time.
        </p>
      </div>
    </Accordion>
  );
}
