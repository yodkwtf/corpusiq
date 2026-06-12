import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Pencil, RotateCcw, Printer, FlaskConical, Sparkles } from "lucide-react";
import { usePlanner, hasAnyInvestment, validateProfile } from "../context/PlannerContext";
import { branding } from "../config/branding";
import { formatINRFull } from "../utils/formatters";
import ErrorBoundary from "../components/shared/ErrorBoundary";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import { SkeletonDashboard } from "../components/shared/Skeleton";
import { HowItWorksPanel } from "../components/shared/HowItWorksContent";
import TopSummaryCard from "../components/dashboard/TopSummaryCard";
import RetirementIncomeCard from "../components/dashboard/RetirementIncomeCard";
import NPSBreakdownCard from "../components/dashboard/NPSBreakdownCard";
import SurvivalCard from "../components/dashboard/SurvivalCard";
import MilestonesTimeline from "../components/dashboard/MilestonesTimeline";
import EmotionalMetricsCard from "../components/dashboard/EmotionalMetricsCard";
import HealthScoreCard from "../components/dashboard/HealthScoreCard";
import PeerComparisonCard from "../components/dashboard/PeerComparisonCard";
import FIRECard from "../components/dashboard/FIRECard";
import InflationCard from "../components/dashboard/InflationCard";
import WhatIfExplorer from "../components/dashboard/WhatIfExplorer";

const SECTIONS = [
  { id: "summary", label: "Summary" },
  { id: "income", label: "Income" },
  { id: "milestones", label: "Journey" },
  { id: "health", label: "Health" },
  { id: "fire", label: "FI Check" },
  { id: "whatif", label: "What If" },
];

export default function Dashboard() {
  const { state, dispatch, projection } = usePlanner();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // Brief skeleton while charts/animation libs mount - also smooths hydration.
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 350);
    return () => clearTimeout(t);
  }, []);

  // Guard: profile not filled in yet → send to input flow.
  const profileInvalid = Object.keys(validateProfile(state.profile)).length > 0;
  useEffect(() => {
    if (profileInvalid) navigate("/plan", { replace: true });
  }, [profileInvalid, navigate]);
  if (profileInvalid) return null;

  const empty = !hasAnyInvestment(state.investments);
  const hasNPS =
    Number(state.investments.nps.currentValue) > 0 ||
    Number(state.investments.nps.monthlyContribution) > 0;

  const handleReset = () => {
    dispatch({ type: "RESET" });
    navigate("/");
  };

  if (!ready) return <SkeletonDashboard />;
  if (!projection) {
    return (
      <ErrorBoundary>
        <ThrowProjectionError />
      </ErrorBoundary>
    );
  }

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header + actions */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">
            {projection.alreadyRetired ? "Your post-retirement picture" : "Your retirement story"}
          </h1>
          <p className="mt-0.5 text-sm text-text-secondary dark:text-text-secondary-dark">
            {projection.alreadyRetired
              ? "You're at or past your chosen retirement age. Here's what your corpus can do from today."
              : `${projection.yearsToRetirement} years to go. Here's where your money is headed.`}
          </p>
        </div>
        <div className="print-hide flex flex-wrap gap-2">
          <ActionButton onClick={() => { dispatch({ type: "SET_STEP", step: 0 }); navigate("/plan"); }} icon={Pencil}>
            Edit inputs
          </ActionButton>
          <ActionButton onClick={() => window.print()} icon={Printer}>
            Print summary
          </ActionButton>
          <ActionButton onClick={() => setConfirmReset(true)} icon={RotateCcw} tone="danger">
            Start over
          </ActionButton>
        </div>
      </div>

      {/* Sticky mini nav (desktop) */}
      <nav
        aria-label="Dashboard sections"
        className="print-hide sticky top-14 z-30 -mx-4 mb-6 hidden border-b border-ink-100 bg-canvas/95 px-4 py-2 backdrop-blur dark:border-ink-800 dark:bg-canvas-dark/95 lg:block"
      >
        <ul className="flex gap-1">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-ink-100 hover:text-primary dark:text-text-secondary-dark dark:hover:bg-ink-800"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mb-6">
        <HowItWorksPanel />
      </div>

      <ErrorBoundary>
        {empty ? (
          <EmptyState />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            {/* Print-only header */}
            <div className="hidden print:block">
              <h2 className="text-lg font-bold">{branding.appName} - Retirement Summary</h2>
              <p className="text-xs">
                Generated for age {projection.currentAge}, retiring at {projection.retirementAge}.
                Total invested to date: {formatINRFull(projection.currentTotalValue)}.
              </p>
            </div>

            <TopSummaryCard projection={projection} />

            <div className="grid gap-6 md:grid-cols-2">
              <RetirementIncomeCard projection={projection} />
              <SurvivalCard projection={projection} />
            </div>

            {hasNPS && <NPSBreakdownCard projection={projection} />}

            <MilestonesTimeline projection={projection} />
            <EmotionalMetricsCard projection={projection} />

            <div className="grid gap-6 md:grid-cols-2">
              <HealthScoreCard projection={projection} />
              <PeerComparisonCard projection={projection} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <FIRECard projection={projection} />
              <InflationCard projection={projection} />
            </div>

            <div className="print-hide">
              <WhatIfExplorer state={state} baseProjection={projection} />
            </div>

            <p className="rounded-xl bg-ink-100/60 p-4 text-xs leading-relaxed text-text-secondary dark:bg-ink-800/40 dark:text-text-secondary-dark">
              {branding.footer.disclaimer}
            </p>
          </motion.div>
        )}
      </ErrorBoundary>

      <ConfirmDialog
        open={confirmReset}
        danger
        title="Start over?"
        message="This clears every input and projection on this device. There's no undo."
        confirmLabel="Yes, start over"
        cancelLabel="Keep my plan"
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />

      {/* Sticky bottom bar - mobile access to What-If */}
      {!empty && (
        <div className="print-hide fixed inset-x-0 bottom-0 z-30 border-t border-ink-100 bg-surface/95 p-3 backdrop-blur dark:border-ink-800 dark:bg-surface-dark/95 lg:hidden">
          <a
            href="#whatif"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-brand py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25"
          >
            <FlaskConical size={16} aria-hidden="true" />
            Explore What-If scenarios
          </a>
        </div>
      )}
    </div>
  );
}

function ActionButton({ onClick, icon: Icon, tone = "default", children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        tone === "danger"
          ? "inline-flex items-center gap-1.5 rounded-full border border-risk-200 bg-surface/60 px-4 py-2 text-sm font-semibold text-risk-600 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-risk-50 dark:border-risk-800 dark:bg-surface-dark/60 dark:text-risk-300 dark:hover:bg-risk-900/30"
          : "btn-outline"
      }
    >
      <Icon size={15} aria-hidden="true" />
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl bg-surface p-10 text-center shadow-card dark:bg-surface-dark">
      <Sparkles className="mx-auto mb-4 text-secondary" size={36} aria-hidden="true" />
      <h2 className="text-xl font-bold">Your journey starts here</h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-text-secondary dark:text-text-secondary-dark">
        You haven't added any investments yet, and that's exactly where everyone starts.
        Even ₹500 a month, started today, grows into something real. Add your first
        number and watch what compounding does with it.
      </p>
      <Link to="/plan" className="btn-primary mt-6">
        Add my first investment
      </Link>
    </div>
  );
}

/** Renders nothing - exists so a null projection trips the ErrorBoundary fallback. */
function ThrowProjectionError() {
  throw new Error("Projection failed");
}
