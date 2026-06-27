import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { branding } from "../config/branding";
import { useSEO } from "../utils/seo";
import {
  StepsOverview,
  CalculationExplainer,
  GlossaryList,
} from "../components/shared/HowItWorksContent";

function SectionHeader({ icon: Icon, kicker, title, id }) {
  return (
    <div className="mb-6 flex flex-col items-center text-center">
      <span className="pill mb-3">
        <Icon size={13} aria-hidden="true" />
        {kicker}
      </span>
      <h2 id={id} className="text-2xl font-extrabold sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, ease: "easeOut" },
};

export default function HowItWorks() {
  useSEO({
    title: "How It Works",
    description:
      "Learn how CorpusIQ calculates your retirement corpus, monthly income, and survival odds - with plain-language explanations of every assumption.",
    path: "/how-it-works",
  });

  return (
    <div className="mx-auto max-w-4xl">
      {/* Hero */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="py-12 text-center sm:py-16"
      >
        <span className="pill">
          <BookOpen size={13} aria-hidden="true" />
          The guide
        </span>
        <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-tight sm:text-5xl">
          How <span className="text-gradient">{branding.appName}</span> works
        </h1>
        <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-text-secondary dark:text-text-secondary-dark">
          One promise: {branding.tagline.toLowerCase()}. You enter a handful of
          numbers about your NPS, PF and mutual funds, and we turn them into
          plain-language answers. What you'll have, what it pays you monthly,
          and how long it lasts. Everything runs in your browser; nothing is
          uploaded or stored anywhere else.
        </p>
      </motion.header>

      {/* Steps */}
      <motion.section
        {...fadeUp}
        aria-labelledby="steps-heading"
        className="pb-14"
      >
        <SectionHeader
          icon={Sparkles}
          kicker="The flow"
          title="Three steps, three minutes"
          id="steps-heading"
        />
        <StepsOverview />
      </motion.section>

      {/* Math */}
      <motion.section
        {...fadeUp}
        aria-labelledby="math-heading"
        className="pb-14"
      >
        <SectionHeader
          icon={Calculator}
          kicker="Under the hood"
          title="How the numbers are calculated"
          id="math-heading"
        />
        <CalculationExplainer />
      </motion.section>

      {/* Glossary */}
      <motion.section
        {...fadeUp}
        aria-labelledby="glossary-heading"
        className="pb-14"
      >
        <SectionHeader
          icon={BookOpen}
          kicker="Speak the language"
          title="Glossary"
          id="glossary-heading"
        />
        <GlossaryList />
      </motion.section>

      {/* Disclaimer */}
      <motion.section
        {...fadeUp}
        aria-labelledby="disclaimer-heading"
        className="mb-14 overflow-hidden rounded-3xl bg-gradient-to-br from-warn-50 to-warn-100/60 p-6 ring-1 ring-warn-200 dark:from-warn-900/30 dark:to-warn-900/10 dark:ring-warn-800 sm:p-8"
      >
        <div className="flex items-start gap-4">
          <span
            className="rounded-2xl bg-warn-500/15 p-2.5 text-warn-700 dark:text-warn-300"
            aria-hidden="true"
          >
            <AlertTriangle size={22} />
          </span>
          <div>
            <h2 id="disclaimer-heading" className="text-lg font-extrabold">
              The important fine print
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary dark:text-text-secondary-dark">
              {branding.footer.disclaimer} Every figure here is a projection
              built on the assumptions you choose. Markets don't move in
              straight lines, and real returns will differ. You can change any
              assumption at any time in Advanced Settings, and the entire
              dashboard recalculates instantly.
            </p>
          </div>
        </div>
      </motion.section>

      {/* CTA banner */}
      <motion.div
        {...fadeUp}
        className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-brand p-8 text-center text-white shadow-xl shadow-primary/25 sm:p-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl"
        />
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          Ready to see your future?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
          Three minutes from now, you'll know your number, what it pays you, and
          how long it lasts.
        </p>
        <Link
          to="/plan"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-primary shadow-lg transition-transform hover:-translate-y-0.5"
        >
          Start my journey
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </motion.div>
    </div>
  );
}
