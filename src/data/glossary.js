/**
 * Glossary used by the How It Works page, the dashboard help panel,
 * and metric tooltips. Add terms here - UI renders whatever exists.
 * `id` lets tooltips deep-link to a term.
 */
export const GLOSSARY = [
  {
    id: "nps",
    term: "NPS (National Pension System)",
    definition:
      "A government-backed retirement scheme. Money grows until 60; at least 40% must then buy an annuity (a lifelong monthly pension) and the rest can be withdrawn as a lump sum.",
  },
  {
    id: "pf",
    term: "PF (Provident Fund)",
    definition:
      "Employee Provident Fund: a salary-linked savings scheme where you and your employer contribute monthly. Earns a government-declared interest rate (around 7-8%) and is largely tax-free.",
  },
  {
    id: "sip",
    term: "SIP (Systematic Investment Plan)",
    definition:
      "Investing a fixed amount into mutual funds every month, automatically. Removes timing decisions and builds the habit that compounding rewards.",
  },
  {
    id: "corpus",
    term: "Corpus",
    definition:
      "The total pot of money your investments grow into. Your retirement corpus is everything you've accumulated by the day you retire.",
  },
  {
    id: "inflation-adjusted",
    term: "Inflation-adjusted value (today's money)",
    definition:
      "What a future amount is really worth in terms of today's prices. ₹4 crore in 30 years buys far less than ₹4 crore today, and this number tells you how much less.",
  },
  {
    id: "fi-number",
    term: "FI Number",
    definition:
      "The corpus size at which investment income alone can fund your lifestyle: financial independence. Calculated as your desired yearly income divided by your withdrawal rate.",
  },
  {
    id: "coast-fire",
    term: "Coast FIRE",
    definition:
      "The point where your existing investments, with zero further contributions, would still grow into a sufficient retirement corpus. After this point you only need to cover living costs, not save.",
  },
  {
    id: "health-score",
    term: "Financial Health Score",
    definition:
      "Our 0-100 summary of your retirement readiness: 50 points for corpus adequacy vs your FI number, 30 for how long the corpus lasts, 10 for savings rate, 10 for diversification.",
  },
  {
    id: "annuity",
    term: "Annuity",
    definition:
      "A product you buy with a lump sum that pays you a fixed income for life, essentially a self-purchased pension. NPS requires part of your corpus to buy one.",
  },
  {
    id: "withdrawal-rate",
    term: "Withdrawal rate",
    definition:
      "The percentage of your corpus you withdraw each year in retirement. 4% is a widely used 'safe' starting point intended to make the money last decades.",
  },
  {
    id: "step-up",
    term: "Step-up",
    definition:
      "Increasing your SIP amount every year (say 5%), typically alongside salary increments. A small annual step-up dramatically raises the final corpus.",
  },
];

export function getGlossaryTerm(id) {
  return GLOSSARY.find((g) => g.id === id) || null;
}
