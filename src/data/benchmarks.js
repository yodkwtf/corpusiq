/**
 * Illustrative benchmark of total amount invested (across NPS + PF + MF)
 * by Indian retail investors, bucketed by age. Values in rupees.
 * These are hardcoded, directional figures for the peer-comparison card -
 * not survey data. p50 = median.
 */
export const BENCHMARKS = [
  { ageMin: 18, ageMax: 24, p10: 0, p25: 10000, p50: 50000, p75: 200000, p90: 600000 },
  { ageMin: 25, ageMax: 29, p10: 20000, p25: 100000, p50: 350000, p75: 900000, p90: 2000000 },
  { ageMin: 30, ageMax: 34, p10: 80000, p25: 300000, p50: 900000, p75: 2200000, p90: 4500000 },
  { ageMin: 35, ageMax: 39, p10: 200000, p25: 700000, p50: 1800000, p75: 4000000, p90: 8000000 },
  { ageMin: 40, ageMax: 44, p10: 400000, p25: 1200000, p50: 3000000, p75: 6500000, p90: 13000000 },
  { ageMin: 45, ageMax: 49, p10: 700000, p25: 2000000, p50: 4500000, p75: 9500000, p90: 19000000 },
  { ageMin: 50, ageMax: 54, p10: 1000000, p25: 2800000, p50: 6000000, p75: 13000000, p90: 26000000 },
  { ageMin: 55, ageMax: 60, p10: 1300000, p25: 3500000, p50: 7500000, p75: 16000000, p90: 32000000 },
  { ageMin: 61, ageMax: 100, p10: 1500000, p25: 4000000, p50: 8000000, p75: 17000000, p90: 35000000 },
];
