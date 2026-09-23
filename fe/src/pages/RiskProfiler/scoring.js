import { GRID, AMBIGUOUS, SPLIT } from './data';

export function fmtINR(n) {
  n = Math.round(n);
  return '₹' + n.toLocaleString('en-IN');
}

export function pct(n, digits = 1) {
  return n.toFixed(digits) + '%';
}

export function computeScores(answers) {
  const q1 = answers.q1 ? answers.q1.points : 0;
  const q2 = answers.q2 ? answers.q2.points : 0;
  const timeHorizonScore = q1 + q2;

  let riskPreferenceScore = 0;
  ['q3', 'q4', 'q5', 'q6', 'q7', 'q8'].forEach((id) => {
    riskPreferenceScore += answers[id] ? answers[id].points : 0;
  });

  return { timeHorizonScore, riskPreferenceScore };
}

export function bucketTimeHorizon(score) {
  if (score <= 2) return 0;
  if (score <= 5) return 1;
  if (score <= 7) return 2;
  if (score <= 10) return 3;
  return 4;
}

export function bucketRiskPreference(score) {
  if (score <= 14) return 0;
  if (score <= 35) return 1;
  if (score <= 64) return 2;
  if (score <= 83) return 3;
  return 4;
}

export function mapToTier(timeHorizonScore, riskPreferenceScore) {
  const col = bucketTimeHorizon(timeHorizonScore);
  const row = bucketRiskPreference(riskPreferenceScore);
  const tier = GRID[row][col];
  const ambiguous = AMBIGUOUS[row][col];
  return { tier, row, col, ambiguous };
}

export function granularBreakdown(mandate) {
  const { india, intl, debt } = mandate;
  return {
    large: india * SPLIT.domesticEquity.large,
    mid: india * SPLIT.domesticEquity.mid,
    small: india * SPLIT.domesticEquity.small,
    europe: intl * SPLIT.intlEquity.europe,
    us: intl * SPLIT.intlEquity.us,
    asia: intl * SPLIT.intlEquity.asia,
    medium: debt * SPLIT.debt.medium,
    long: debt * SPLIT.debt.long,
    short: debt * SPLIT.debt.short,
  };
}
