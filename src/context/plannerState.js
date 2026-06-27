/**
 * Plain-module side of the planner: default state shape and validation
 * helpers. Kept out of PlannerContext.jsx so that file only exports
 * components/hooks (react-refresh requirement).
 */
export const DEFAULT_STATE = {
  profile: {
    currentAge: "",
    retirementAge: 60,
    monthlyIncome: "",
  },
  investments: {
    nps: { currentValue: "", monthlyContribution: "" },
    pf: { currentValue: "", monthlyContribution: "" },
    mf: { currentValue: "", monthlyContribution: "" },
  },
  assumptions: {
    // Expected long-term annual returns (%)
    returns: {
      nps: 10, // Equity-heavy NPS allocation
      pf: 8.25, // Current EPF interest rate
      mf: 12, // Diversified equity mutual funds
    },

    // Salary / SIP increase every year (%)
    stepUpPct: 8,

    // Long-term average inflation (%)
    inflationPct: 6,

    // Safe Withdrawal Rate (%)
    withdrawalRatePct: 4,

    // NPS
    npsAnnuityPct: 40, // Minimum mandatory annuity at retirement
    annuityRatePct: 6, // Expected annuity payout

    // Portfolio return after retirement
    postRetirementReturnPct: 8,
  },
  ui: {
    darkMode: null, // null = follow the device's color scheme
    themeChosen: false, // true once the user toggles the theme manually
    inputStep: 0, // 0 = About You, 1 = Investments, 2 = Advanced
    hasResults: false,
  },
};

/** Validation for the input flow. Returns { fieldName: "message" }. */
export function validateProfile(profile) {
  const errors = {};
  const age = Number(profile.currentAge);
  const retAge = Number(profile.retirementAge);

  if (profile.currentAge === "" || !Number.isFinite(age)) {
    errors.currentAge = "Please enter your current age.";
  } else if (age < 18 || age > 100) {
    errors.currentAge = "Age must be between 18 and 100.";
  }

  if (profile.retirementAge === "" || !Number.isFinite(retAge)) {
    errors.retirementAge = "Please enter a retirement age.";
  } else if (retAge < 18 || retAge > 100) {
    errors.retirementAge = "Retirement age must be between 18 and 100.";
  } else if (Number.isFinite(age) && retAge <= age) {
    errors.retirementAge =
      "Retirement age must be greater than your current age.";
  }

  return errors;
}

/** True when any investment field is non-zero - drives the empty state. */
export function hasAnyInvestment(investments) {
  return Object.values(investments).some(
    (inv) =>
      Number(inv.currentValue) > 0 || Number(inv.monthlyContribution) > 0,
  );
}
