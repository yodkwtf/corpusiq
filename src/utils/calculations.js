/**
 * Pure calculation engine. No React, no DOM, no side effects.
 * All rates are annual percentages (9 means 9%) unless noted.
 * Every function defends against NaN / Infinity / negative inputs so the
 * UI never has to render a broken number.
 */

const MAX_AGE = 100;

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Future value of an existing lump sum plus a monthly SIP with annual step-up.
 * Compounds monthly; the contribution rises by stepUpPct once every 12 months.
 * Returns both the corpus and the total amount actually invested, so the
 * contribution-vs-growth split can be derived without re-simulating.
 */
export function calculateFutureValue(
  currentValue,
  monthlyContribution,
  annualReturn,
  years,
  stepUpPct = 0,
  delayYears = 0
) {
  const principal = Math.max(num(currentValue), 0);
  const baseContribution = Math.max(num(monthlyContribution), 0);
  const months = Math.round(clamp(num(years), 0, 120) * 12);
  const monthlyRate = num(annualReturn) / 100 / 12;
  const stepUp = Math.max(num(stepUpPct), -50) / 100;
  const delayMonths = Math.round(clamp(num(delayYears), 0, 120) * 12);

  let value = principal;
  let invested = principal;

  for (let m = 0; m < months; m++) {
    const contribution =
      m < delayMonths
        ? 0
        : baseContribution * Math.pow(1 + stepUp, Math.floor((m - delayMonths) / 12));
    value = value * (1 + monthlyRate) + contribution;
    invested += contribution;
  }

  return {
    futureValue: Number.isFinite(value) ? value : 0,
    totalInvested: Number.isFinite(invested) ? invested : 0,
  };
}

/** Split a corpus into what was paid in vs what compounding earned. */
export function splitContributionVsGrowth(totalCorpus, totalInvested) {
  const corpus = Math.max(num(totalCorpus), 0);
  const invested = clamp(num(totalInvested), 0, Math.max(corpus, num(totalInvested)));
  const growth = Math.max(corpus - invested, 0);
  const growthPct = corpus > 0 ? (growth / corpus) * 100 : 0;
  return { invested, growth, growthPct, investedPct: 100 - growthPct };
}

/** Corpus -> sustainable monthly income at a given safe withdrawal rate. */
export function calculateRetirementIncome(corpus, withdrawalRate) {
  const c = Math.max(num(corpus), 0);
  const rate = clamp(num(withdrawalRate), 0, 100) / 100;
  return (c * rate) / 12;
}

/**
 * NPS rules: at least `annuityPct` of the corpus must buy an annuity; the rest
 * is a tax-free lump sum. Pension = annuity portion * annuity rate / 12.
 */
export function calculateNPSPension(npsCorpus, annuityPct = 40, annuityRate = 6) {
  const corpus = Math.max(num(npsCorpus), 0);
  const annuityShare = clamp(num(annuityPct), 0, 100) / 100;
  const annuityCorpus = corpus * annuityShare;
  const lumpSum = corpus - annuityCorpus;
  const monthlyPension = (annuityCorpus * clamp(num(annuityRate), 0, 100)) / 100 / 12;
  return { corpus, lumpSum, annuityCorpus, monthlyPension };
}

/**
 * Simulate post-retirement drawdown: corpus earns postRetirementReturn,
 * spending starts at monthlySpend and inflates annually.
 * Returns how many years the corpus survives (capped at `capYears`).
 */
export function calculateCorpusLongevity(
  corpus,
  monthlySpend,
  postRetirementReturn = 7,
  inflation = 6,
  capYears = 75
) {
  let value = Math.max(num(corpus), 0);
  const baseSpend = Math.max(num(monthlySpend), 0);
  const monthlyRate = num(postRetirementReturn) / 100 / 12;
  const inflate = Math.max(num(inflation), 0) / 100;

  if (baseSpend <= 0) return { years: capYears, lastsForever: true };
  if (value <= 0) return { years: 0, lastsForever: false };

  const maxMonths = capYears * 12;
  for (let m = 0; m < maxMonths; m++) {
    const yearIndex = Math.floor(m / 12);
    const spend = baseSpend * Math.pow(1 + inflate, yearIndex);
    value = value * (1 + monthlyRate) - spend;
    if (value <= 0) return { years: (m + 1) / 12, lastsForever: false };
  }
  return { years: capYears, lastsForever: true };
}

/** Deflate a future rupee amount into today's purchasing power. Never negative. */
export function inflationAdjust(futureValue, inflationRate, years) {
  const fv = Math.max(num(futureValue), 0);
  const rate = Math.max(num(inflationRate), 0) / 100;
  const y = Math.max(num(years), 0);
  const adjusted = fv / Math.pow(1 + rate, y);
  return Number.isFinite(adjusted) ? Math.max(adjusted, 0) : 0;
}

/** Corpus needed so that withdrawalRate% of it pays the desired monthly income. */
export function calculateFIRENumber(desiredMonthlyIncome, withdrawalRate = 4) {
  const income = Math.max(num(desiredMonthlyIncome), 0);
  const rate = clamp(num(withdrawalRate), 0.1, 100) / 100;
  return (income * 12) / rate;
}

/** What today's corpus alone grows to by retirement if contributions stop now. */
export function calculateCoastFIRE(currentValue, returnRate, yearsToRetirement) {
  const value = Math.max(num(currentValue), 0);
  const years = Math.max(num(yearsToRetirement), 0);
  const grown = value * Math.pow(1 + num(returnRate) / 100, years);
  return Number.isFinite(grown) ? grown : 0;
}

/**
 * Gap between the FI number and the projected corpus, plus the extra monthly
 * SIP needed to close it in the remaining years.
 * gap <= 0 means the user is already at/over their FI number (surplus).
 */
export function calculateGapAndCatchUp(fiNumber, projectedCorpus, yearsLeft, returnRate) {
  const target = Math.max(num(fiNumber), 0);
  const projected = Math.max(num(projectedCorpus), 0);
  const gap = target - projected;
  const years = Math.max(num(yearsLeft), 0);

  if (gap <= 0) {
    return { gap, surplus: -gap, catchUpMonthly: 0, achievable: true };
  }
  if (years <= 0) {
    return { gap, surplus: 0, catchUpMonthly: null, achievable: false };
  }

  const r = num(returnRate) / 100 / 12;
  const n = Math.round(years * 12);
  const factor = r > 0 ? (Math.pow(1 + r, n) - 1) / r : n;
  const catchUpMonthly = factor > 0 ? gap / factor : null;
  return {
    gap,
    surplus: 0,
    catchUpMonthly: Number.isFinite(catchUpMonthly) ? catchUpMonthly : null,
    achievable: catchUpMonthly !== null,
  };
}

/**
 * Financial Health Score, 0-100. Documented formula:
 *
 *   1. Corpus adequacy (0-50):  projectedCorpus / fiNumber, capped at 1, x50.
 *      Measures whether the plan funds the target retirement income.
 *   2. Longevity (0-30):  how far past retirement the corpus lasts.
 *      Surviving to age 90+ scores full marks; depleting at retirement scores 0.
 *   3. Savings momentum (0-10):  total monthly contribution as a share of
 *      income (if income given, 15%+ of income = full marks). Without income,
 *      any non-zero contribution earns 6/10 (we can't judge the rate).
 *   4. Diversification (0-10):  number of instruments in use / 3 x10.
 *
 * Bands: 70+ On Track (green), 40-69 Needs Improvement (amber), <40 At Risk (red).
 */
export function calculateHealthScore({
  projectedCorpus,
  fiNumber,
  depletionAge,
  retirementAge,
  monthlyContributionTotal,
  monthlyIncome,
  instrumentsUsed,
}) {
  const adequacyRatio = num(fiNumber) > 0 ? clamp(num(projectedCorpus) / num(fiNumber), 0, 1) : 0;
  const adequacy = adequacyRatio * 50;

  const targetAge = 90;
  const span = Math.max(targetAge - num(retirementAge), 1);
  const survived = clamp(num(depletionAge) - num(retirementAge), 0, span);
  const longevity = (survived / span) * 30;

  let momentum;
  const contribution = Math.max(num(monthlyContributionTotal), 0);
  const income = Math.max(num(monthlyIncome), 0);
  if (income > 0) {
    momentum = clamp(contribution / income / 0.15, 0, 1) * 10;
  } else {
    momentum = contribution > 0 ? 6 : 0;
  }

  const diversification = (clamp(num(instrumentsUsed), 0, 3) / 3) * 10;

  const score = Math.round(adequacy + longevity + momentum + diversification);
  const band = score >= 70 ? "onTrack" : score >= 40 ? "needsWork" : "atRisk";
  return {
    score: clamp(score, 0, 100),
    band,
    parts: { adequacy, longevity, momentum, diversification },
  };
}

/**
 * Percentile of the user's invested amount inside an age-bracketed benchmark
 * table (see data/benchmarks.js). Falls back to the nearest bracket when the
 * age is outside the table, and interpolates linearly between known points.
 */
export function getPeerPercentile(age, currentInvested, benchmarkTable) {
  if (!Array.isArray(benchmarkTable) || benchmarkTable.length === 0) return null;
  const a = num(age);

  let bracket =
    benchmarkTable.find((b) => a >= b.ageMin && a <= b.ageMax) ||
    (a < benchmarkTable[0].ageMin
      ? benchmarkTable[0]
      : benchmarkTable[benchmarkTable.length - 1]);

  const invested = Math.max(num(currentInvested), 0);
  const points = [
    { pct: 10, value: bracket.p10 },
    { pct: 25, value: bracket.p25 },
    { pct: 50, value: bracket.p50 },
    { pct: 75, value: bracket.p75 },
    { pct: 90, value: bracket.p90 },
  ];

  if (invested <= points[0].value) {
    const pct = points[0].value > 0 ? (invested / points[0].value) * 10 : 0;
    return { percentile: Math.round(clamp(pct, 0, 10)), bracket };
  }
  for (let i = 0; i < points.length - 1; i++) {
    const lo = points[i];
    const hi = points[i + 1];
    if (invested <= hi.value) {
      const t = hi.value > lo.value ? (invested - lo.value) / (hi.value - lo.value) : 1;
      return { percentile: Math.round(lo.pct + t * (hi.pct - lo.pct)), bracket };
    }
  }
  // Above p90: ease toward 99 as the amount doubles past the p90 mark.
  const over = points[4].value > 0 ? invested / points[4].value - 1 : 1;
  return { percentile: Math.round(clamp(90 + over * 9, 90, 99)), bracket };
}

/**
 * Projected corpus at a series of ages: every 5 years from current age to
 * retirement (always including both endpoints), plus two post-retirement
 * checkpoints showing the drawdown phase.
 */
export function generateWealthMilestones({
  currentAge,
  retirementAge,
  instruments, // [{ currentValue, monthlyContribution, annualReturn }]
  stepUpPct,
  withdrawalRate,
  inflation,
  postRetirementReturn = 7,
}) {
  const start = num(currentAge);
  const end = Math.max(num(retirementAge), start);
  const milestones = [];

  const ages = new Set([start]);
  for (let a = start + 5; a < end; a += 5) ages.add(a);
  ages.add(end);

  const sortedAges = [...ages].sort((x, y) => x - y);
  for (const age of sortedAges) {
    const years = age - start;
    let total = 0;
    for (const inst of instruments) {
      const { futureValue } = calculateFutureValue(
        inst.currentValue,
        inst.monthlyContribution,
        inst.annualReturn,
        years,
        stepUpPct
      );
      total += futureValue;
    }
    milestones.push({ age, value: total, phase: "accumulation" });
  }

  // Post-retirement: corpus draws down at the chosen withdrawal income.
  const corpusAtRetirement = milestones[milestones.length - 1]?.value ?? 0;
  const monthlyIncome = calculateRetirementIncome(corpusAtRetirement, withdrawalRate);
  const postAges = [end + 5, end + 10].filter((a) => a <= MAX_AGE);
  for (const age of postAges) {
    const value = simulateDrawdownValue(
      corpusAtRetirement,
      monthlyIncome,
      postRetirementReturn,
      inflation,
      age - end
    );
    milestones.push({ age, value, phase: "drawdown" });
  }

  return milestones;
}

function simulateDrawdownValue(corpus, monthlySpend, annualReturn, inflation, years) {
  let value = Math.max(num(corpus), 0);
  const monthlyRate = num(annualReturn) / 100 / 12;
  const inflate = Math.max(num(inflation), 0) / 100;
  const months = Math.round(Math.max(num(years), 0) * 12);
  const base = Math.max(num(monthlySpend), 0);
  for (let m = 0; m < months; m++) {
    const spend = base * Math.pow(1 + inflate, Math.floor(m / 12));
    value = value * (1 + monthlyRate) - spend;
    if (value <= 0) return 0;
  }
  return value;
}

/**
 * One call that turns raw planner inputs into everything the dashboard needs.
 * Used by both the live dashboard and the What-If explorer (with overrides).
 */
export function computeProjection(inputs) {
  const currentAge = clamp(num(inputs.profile.currentAge, 25), 0, MAX_AGE);
  const retirementAge = clamp(num(inputs.profile.retirementAge, 60), 0, MAX_AGE);
  const monthlyIncome = Math.max(num(inputs.profile.monthlyIncome), 0);
  const yearsToRetirement = Math.max(retirementAge - currentAge, 0);
  const alreadyRetired = retirementAge <= currentAge;

  const a = inputs.assumptions;
  const stepUpPct = num(a.stepUpPct, 5);
  const contributionDelayYears = Math.max(num(a.contributionDelayYears), 0);
  const inflation = num(a.inflationPct, 6);
  const withdrawalRate = clamp(num(a.withdrawalRatePct, 4), 0.1, 100);
  const postRetirementReturn = num(a.postRetirementReturnPct, 7);

  const instrumentDefs = [
    { key: "nps", returnPct: num(a.returns.nps, 9) },
    { key: "pf", returnPct: num(a.returns.pf, 7.1) },
    { key: "mf", returnPct: num(a.returns.mf, 12) },
  ];

  const perInstrument = {};
  let totalCorpus = 0;
  let totalInvested = 0;
  let totalMonthlyContribution = 0;
  let currentTotalValue = 0;
  let instrumentsUsed = 0;

  for (const def of instrumentDefs) {
    const inv = inputs.investments[def.key] || {};
    const currentValue = Math.max(num(inv.currentValue), 0);
    const monthlyContribution = Math.max(num(inv.monthlyContribution), 0);
    const { futureValue, totalInvested: invInvested } = calculateFutureValue(
      currentValue,
      monthlyContribution,
      def.returnPct,
      yearsToRetirement,
      stepUpPct,
      contributionDelayYears
    );
    perInstrument[def.key] = {
      currentValue,
      monthlyContribution,
      returnPct: def.returnPct,
      futureValue,
      invested: invInvested,
    };
    totalCorpus += futureValue;
    totalInvested += invInvested;
    totalMonthlyContribution += monthlyContribution;
    currentTotalValue += currentValue;
    if (currentValue > 0 || monthlyContribution > 0) instrumentsUsed += 1;
  }

  const split = splitContributionVsGrowth(totalCorpus, totalInvested);
  const monthlyRetirementIncome = calculateRetirementIncome(totalCorpus, withdrawalRate);

  const nps = calculateNPSPension(
    perInstrument.nps.futureValue,
    num(a.npsAnnuityPct, 40),
    num(a.annuityRatePct, 6)
  );

  const longevityAtPlannedSpend = calculateCorpusLongevity(
    totalCorpus,
    monthlyRetirementIncome,
    postRetirementReturn,
    inflation
  );
  const depletionAge = retirementAge + longevityAtPlannedSpend.years;

  const milestones = generateWealthMilestones({
    currentAge,
    retirementAge,
    instruments: instrumentDefs.map((d) => ({
      currentValue: perInstrument[d.key].currentValue,
      monthlyContribution: perInstrument[d.key].monthlyContribution,
      annualReturn: d.returnPct,
    })),
    stepUpPct,
    withdrawalRate,
    inflation,
    postRetirementReturn,
  });

  // FI target: desired income = 70% of current income (income replacement rule)
  // when income is known, otherwise the corpus-derived income itself vs a
  // sensible middle-class floor of Rs 1L/month in future rupees.
  const desiredMonthlyIncomeToday =
    monthlyIncome > 0 ? monthlyIncome * 0.7 : 100000 / Math.pow(1 + inflation / 100, 0);
  const desiredMonthlyIncomeAtRetirement =
    desiredMonthlyIncomeToday * Math.pow(1 + inflation / 100, yearsToRetirement);
  const fiNumber = calculateFIRENumber(desiredMonthlyIncomeAtRetirement, withdrawalRate);

  const weightedReturn =
    currentTotalValue > 0
      ? instrumentDefs.reduce(
          (acc, d) => acc + perInstrument[d.key].currentValue * d.returnPct,
          0
        ) / currentTotalValue
      : num(a.returns.mf, 12);

  const coastFIRE = calculateCoastFIRE(currentTotalValue, weightedReturn, yearsToRetirement);
  const gapAnalysis = calculateGapAndCatchUp(
    fiNumber,
    totalCorpus,
    yearsToRetirement,
    weightedReturn
  );

  const inflationAdjustedCorpus = inflationAdjust(totalCorpus, inflation, yearsToRetirement);
  const inflationAdjustedIncome = inflationAdjust(
    monthlyRetirementIncome,
    inflation,
    yearsToRetirement
  );

  const health = calculateHealthScore({
    projectedCorpus: totalCorpus,
    fiNumber,
    depletionAge,
    retirementAge,
    monthlyContributionTotal: totalMonthlyContribution,
    monthlyIncome,
    instrumentsUsed,
  });

  return {
    currentAge,
    retirementAge,
    yearsToRetirement,
    alreadyRetired,
    monthlyIncome,
    perInstrument,
    totalCorpus,
    totalInvested,
    totalMonthlyContribution,
    currentTotalValue,
    instrumentsUsed,
    split,
    monthlyRetirementIncome,
    withdrawalRate,
    inflation,
    postRetirementReturn,
    nps,
    longevityAtPlannedSpend,
    depletionAge,
    milestones,
    desiredMonthlyIncomeAtRetirement,
    fiNumber,
    weightedReturn,
    coastFIRE,
    gapAnalysis,
    inflationAdjustedCorpus,
    inflationAdjustedIncome,
    health,
  };
}
