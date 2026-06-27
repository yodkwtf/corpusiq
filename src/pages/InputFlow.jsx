import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSEO } from "../utils/seo";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Landmark,
  PiggyBank,
  LineChart,
  Sparkles,
} from "lucide-react";
import AboutYouForm from "../components/forms/AboutYouForm";
import InvestmentCard from "../components/forms/InvestmentCard";
import AdvancedSettings from "../components/forms/AdvancedSettings";
import {
  usePlanner,
  validateProfile,
  hasAnyInvestment,
} from "../context/PlannerContext";

const STEPS = [
  {
    title: "About you",
    subtitle: "Two ages and an optional income. That's all we need.",
  },
  {
    title: "Your investments",
    subtitle: "Enter what you have today. Zero is a fine answer.",
  },
  {
    title: "Fine-tune (optional)",
    subtitle:
      "Industry-standard assumptions. Adjust if you like, or just continue.",
  },
];

const slide = {
  initial: { opacity: 0, x: 32 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -32 },
  transition: { duration: 0.25, ease: "easeOut" },
};

export default function InputFlow() {
  const { state, dispatch } = usePlanner();
  const navigate = useNavigate();
  const step = state.ui.inputStep;
  useSEO({
    title: "Build Your Plan",
    description:
      "Enter your age, income and investments to get a personalized retirement projection in under 3 minutes.",
    path: "/plan",
  });
  const [errors, setErrors] = useState({});

  const goTo = (next) => dispatch({ type: "SET_STEP", step: next });

  const handleNext = () => {
    if (step === 0) {
      const errs = validateProfile(state.profile);
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;
    }
    if (step < 2) {
      goTo(step + 1);
    } else {
      dispatch({ type: "MARK_RESULTS" });
      navigate("/dashboard");
    }
  };

  const noInvestments = step === 1 && !hasAnyInvestment(state.investments);

  return (
    <div className="mx-auto max-w-4xl">
      {/* Progress */}
      <nav aria-label="Progress" className="mb-8">
        <ol className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex flex-1 flex-col gap-1.5">
              <button
                type="button"
                onClick={() => i < step && goTo(i)}
                disabled={i > step}
                aria-current={i === step ? "step" : undefined}
                className={`h-1.5 w-full rounded-full transition-colors ${
                  i <= step ? "bg-primary" : "bg-ink-200 dark:bg-ink-700"
                } ${i < step ? "cursor-pointer" : ""}`}
                aria-label={`Step ${i + 1}: ${s.title}`}
              />
              <span
                className={`hidden text-xs font-medium sm:block ${
                  i === step
                    ? "text-primary"
                    : "text-text-secondary dark:text-text-secondary-dark"
                }`}
              >
                {s.title}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div key={step} {...slide}>
          <h1 className="text-xl font-bold sm:text-2xl">{STEPS[step].title}</h1>
          <p className="mb-6 mt-1 text-sm text-text-secondary dark:text-text-secondary-dark">
            {STEPS[step].subtitle}
          </p>

          {step === 0 && (
            <div className="rounded-2xl bg-surface p-5 shadow-card dark:bg-surface-dark sm:p-6">
              <AboutYouForm errors={errors} />
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-5 md:grid-cols-3">
              <InvestmentCard
                instrument="nps"
                title="NPS"
                icon={Landmark}
                description="National Pension System. Government-backed, locked until 60, part becomes a lifelong pension."
              />
              <InvestmentCard
                instrument="pf"
                title="Provident Fund"
                icon={PiggyBank}
                description="EPF/PPF. Steady, tax-friendly interest declared by the government each year."
              />
              <InvestmentCard
                instrument="mf"
                title="Mutual Funds"
                icon={LineChart}
                description="SIPs and lump sums in equity or hybrid funds. Higher growth, more ups and downs."
              />
            </div>
          )}

          {step === 2 && <AdvancedSettings />}

          {noInvestments && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-accent-50 p-3 text-sm text-accent-800 dark:bg-accent-900/40 dark:text-accent-200">
              <Sparkles
                size={16}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              />
              No investments yet? No problem. Continue anyway and we'll show you
              what starting today could look like.
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav buttons */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => (step === 0 ? navigate("/") : goTo(step - 1))}
          className="btn-ghost"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back
        </button>
        <button type="button" onClick={handleNext} className="btn-primary">
          {step === 2 ? "See my results" : "Continue"}
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
