import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, ShieldCheck, Sparkles, BookOpen, TrendingUp, IndianRupee, CalendarClock } from "lucide-react";
import { branding } from "../config/branding";
import { usePlanner } from "../context/PlannerContext";

const FEATURES = [
  {
    icon: Clock,
    title: "3 minutes, not 3 spreadsheets",
    text: "Two ages and a few amounts. We translate the math into plain sentences.",
  },
  {
    icon: Sparkles,
    title: "Every number answers \"so what?\"",
    text: "Not just \"₹4 crore\", but what it pays you monthly and until what age it lasts.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    text: "Everything is calculated in your browser. Nothing is uploaded, ever.",
  },
];

const PREVIEW_STATS = [
  { icon: TrendingUp, label: "Total wealth at 60", value: "₹4.2 Cr" },
  { icon: IndianRupee, label: "Monthly income it pays", value: "₹1.4 Lakh" },
  { icon: CalendarClock, label: "Money lasts until", value: "Age 92" },
];

export default function Landing() {
  const navigate = useNavigate();
  const { state } = usePlanner();

  return (
    <div className="mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pb-12 pt-10 text-center sm:pt-16"
      >
        <span className="pill">
          <Sparkles size={13} aria-hidden="true" />
          Free. Private. No sign-up.
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-[1.1] sm:text-6xl">
          Your retirement,
          <br />
          <span className="text-gradient">finally explained.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-text-secondary dark:text-text-secondary-dark sm:text-lg">
          {branding.appName} turns your NPS, PF and mutual fund numbers into a story
          you can actually understand. Whether you're 20 or 60.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => navigate("/plan")} className="btn-primary px-8 text-base">
            {state.ui.hasResults ? "Continue my plan" : "Start my journey"}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          <Link to="/how-it-works" className="btn-ghost text-base">
            <BookOpen size={18} aria-hidden="true" />
            How it works
          </Link>
        </div>

        {/* Preview strip: the kind of answers you'll get */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mx-auto mt-14 max-w-3xl rounded-3xl bg-surface/70 p-2 shadow-card ring-1 ring-ink-900/5 backdrop-blur dark:bg-surface-dark/70 dark:ring-white/5"
        >
          <div className="grid divide-y divide-ink-100 rounded-2xl bg-gradient-to-br from-primary/5 to-brand/5 dark:divide-ink-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {PREVIEW_STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 px-6 py-5">
                <stat.icon className="mb-1 text-primary" size={18} aria-hidden="true" />
                <span className="text-2xl font-extrabold tabular-nums">{stat.value}</span>
                <span className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
          <p className="px-4 py-2.5 text-center text-[11px] text-text-secondary dark:text-text-secondary-dark">
            Sample output. Yours takes about 3 minutes.
          </p>
        </motion.div>
      </motion.div>

      <div className="grid gap-5 pb-12 sm:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
            className="group rounded-2xl bg-surface/80 p-6 shadow-card ring-1 ring-ink-900/5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-surface-dark/80 dark:ring-white/5"
          >
            <span className="icon-chip mb-4 transition-transform duration-300 group-hover:scale-110">
              <f.icon size={20} aria-hidden="true" />
            </span>
            <h2 className="mb-1.5 font-bold">{f.title}</h2>
            <p className="text-sm leading-relaxed text-text-secondary dark:text-text-secondary-dark">
              {f.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
