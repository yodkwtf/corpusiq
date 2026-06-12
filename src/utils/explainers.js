/**
 * The "so what?" layer. One plain-language sentence generator per metric.
 * These are rule-based. Tone: calm, concrete, no jargon.
 */
import { formatINR, formatYears } from "./formatters";

export function explainCorpusBreakdown(invested, growth, total) {
  if (total <= 0) return "Start contributing and compounding will do the heavy lifting over time.";
  const growthPct = Math.round((growth / total) * 100);
  if (growthPct >= 50) {
    return `Nearly ${growthPct}% of this wealth comes from compounding, not your contributions. Time in the market is doing most of the work.`;
  }
  if (growthPct >= 20) {
    return `About ${growthPct}% of this comes from market growth. The longer you stay invested, the more this share grows.`;
  }
  return `Right now most of this is your own money (${100 - growthPct}%). Compounding needs a few more years to show its magic.`;
}

export function explainRetirementIncome(monthlyIncome, withdrawalRate) {
  if (monthlyIncome <= 0) return "Add some investments to see what monthly income your corpus could pay you.";
  return `Withdrawing ${withdrawalRate}% of your corpus each year, a widely used "safe" pace, works out to about ${formatINR(monthlyIncome)} every month. Think of it as a self-funded salary.`;
}

export function explainNPSPension(lumpSum, monthlyPension) {
  return `At 60, you can take ${formatINR(lumpSum)} as a tax-free lump sum; the rest buys an annuity that pays you roughly ${formatINR(monthlyPension)} every month for life.`;
}

export function explainLongevity(depletionAge, retirementAge, lastsForever, monthlySpend) {
  if (lastsForever || depletionAge >= 100) {
    return `At ${formatINR(monthlySpend)}/month, your corpus outlives you. It may never run out, so you could even spend a little more.`;
  }
  if (depletionAge <= retirementAge + 1) {
    return `At ${formatINR(monthlySpend)}/month this corpus may not last through retirement. Lowering spending or growing the corpus would change this picture.`;
  }
  const years = Math.round(depletionAge - retirementAge);
  return `Spending ${formatINR(monthlySpend)}/month, your money works for about ${years} years after retirement, lasting until roughly age ${Math.round(depletionAge)}.`;
}

export function explainMilestone(age, value, retirementAge) {
  if (age >= retirementAge) {
    return `By ${age}, in the drawdown phase, you'd still hold about ${formatINR(value)}.`;
  }
  return `By age ${age}, your investments could grow to about ${formatINR(value)}.`;
}

export function explainHealthScore(band, score) {
  switch (band) {
    case "onTrack":
      return `A score of ${score} means your plan likely funds the retirement you're aiming for. Keep contributions steady and review yearly.`;
    case "needsWork":
      return `A score of ${score} means you're building wealth, but there's a gap between where you're headed and a comfortable retirement. Small increases now compound into big differences.`;
    default:
      return `A score of ${score} signals your current pace may fall well short. Don't panic: starting or increasing SIPs even modestly moves this fast.`;
  }
}

export function explainPeerComparison(percentile) {
  if (percentile === null || percentile === undefined) return "";
  if (percentile >= 75) {
    return `You are ahead of ${percentile}% of investors your age, which puts you in the top quarter. Consistency from here matters more than chasing returns.`;
  }
  if (percentile >= 40) {
    return `You are ahead of ${percentile}% of investors your age, solidly in the pack. A small SIP increase could push you into the top quartile.`;
  }
  return `You are ahead of ${percentile}% of investors your age. Most people start exactly here, and the gap closes faster than you'd think once SIPs begin.`;
}

export function explainFIGap(gapAnalysis, fiNumber) {
  if (gapAnalysis.gap <= 0) {
    return `Your projected corpus already exceeds your FI number of ${formatINR(fiNumber)} by ${formatINR(gapAnalysis.surplus)}. You're on course for financial independence; extra investing now buys flexibility, not necessity.`;
  }
  if (!gapAnalysis.achievable || gapAnalysis.catchUpMonthly === null) {
    return `You're short of your FI number by ${formatINR(gapAnalysis.gap)}, and with no accumulation years left the gap can't be closed by new SIPs alone. Consider working part-time longer or adjusting the income target.`;
  }
  return `You're projected to fall ${formatINR(gapAnalysis.gap)} short of your FI number. Adding about ${formatINR(gapAnalysis.catchUpMonthly)}/month from today closes that gap by retirement.`;
}

export function explainCoastFIRE(coastValue, fiNumber, totalCorpus) {
  if (fiNumber > 0 && coastValue >= fiNumber) {
    return `Even if you stopped investing today, your existing money alone grows past your FI number by retirement. You've "coasted" past the hardest part.`;
  }
  if (totalCorpus > 0 && coastValue > 0) {
    const pct = Math.round((coastValue / Math.max(totalCorpus, 1)) * 100);
    return `If you stopped all SIPs today, your existing investments would still grow to ${formatINR(coastValue)}, about ${pct}% of your projected corpus. Your future contributions carry the rest.`;
  }
  return `With nothing invested yet, there's nothing to coast on. The first SIP is the one that starts the engine.`;
}

export function explainInflation(nominal, real, years) {
  if (nominal <= 0) return "Inflation quietly shrinks money that isn't growing. Investing is how you outrun it.";
  return `${formatINR(nominal)} sounds large, but after ${formatYears(years)} years of rising prices it buys what ${formatINR(real)} buys today. Always judge your corpus in today's money.`;
}

export function explainEmotionalMetric(monthlyAmount, years, lastsForever) {
  if (lastsForever) {
    return `${formatINR(monthlyAmount)} every month, for life. Your corpus earns it back faster than you spend it.`;
  }
  return `${formatINR(monthlyAmount)} every month for about ${Math.round(years)} years.`;
}

export function explainWhatIfDelta(label, before, after) {
  const diff = after - before;
  if (Math.abs(diff) < 1) return `${label} barely moves the outcome.`;
  const direction = diff > 0 ? "adds" : "costs";
  return `${label} ${direction} ${formatINR(Math.abs(diff))} to your retirement corpus.`;
}

export function explainStepUp(stepUpPct) {
  return `A ${stepUpPct}% yearly increase in your SIP, roughly matching salary hikes, is one of the most powerful and painless wealth levers available.`;
}
