// ===========================================================
// RISCH Risk Profiler — question bank + mandate data.
// Methodology mirrors the Morningstar-style RTQ: time horizon
// and risk preference are scored independently, then cross-
// tabulated against a suitability matrix to reach a mandate.
// ===========================================================

export const QUESTIONS = [
  {
    id: 'q1', group: 'Time Horizon', groupIndex: 1, groupTotal: 2,
    prompt: 'When do you expect to begin withdrawing money from this account?',
    type: 'simple',
    options: [
      { label: 'Less than 2 years', points: 0 },
      { label: '2 years', points: 1 },
      { label: '3 to 4 years', points: 3 },
      { label: '5 to 7 years', points: 7 },
      { label: '8 to 10 years', points: 9 },
      { label: '11 years or more', points: 11 },
    ],
  },
  {
    id: 'q2', group: 'Time Horizon', groupIndex: 2, groupTotal: 2,
    prompt: 'Once withdrawals begin, how long do you expect them to last?',
    type: 'simple',
    options: [
      { label: 'Lump sum distribution', points: 0 },
      { label: '1 to 4 years', points: 2 },
      { label: '5 to 7 years', points: 4 },
      { label: '8 to 10 years', points: 5 },
      { label: '11 years or more', points: 6 },
    ],
  },
  {
    id: 'q3', group: 'Risk Preference', groupIndex: 1, groupTotal: 6,
    prompt: 'Which of the following best reflects your attitude toward inflation and risk?',
    type: 'simple',
    options: [
      { label: 'Protect capital; keep pace with inflation without risking loss.', points: 0 },
      { label: 'Earn slightly higher than inflation with minimal risk.', points: 6 },
      { label: 'Increase portfolio value; accept moderate short-term fluctuations.', points: 11 },
      { label: 'Maximize portfolio value; willing to accept significant risk and volatility for superior compounding.', points: 17 },
    ],
  },
  {
    id: 'q4', group: 'Risk Preference', groupIndex: 2, groupTotal: 6,
    prompt: 'Which hypothetical 1-year portfolio outcome would you prefer to hold?',
    type: 'payoff',
    sub: 'Range shown on your indicative investment amount.',
    options: [
      { label: 'Portfolio 1 — Conservative', points: 0, worst: -0.017, exp: 0.076, best: 0.148 },
      { label: 'Portfolio 2 — Moderate', points: 4, worst: -0.233, exp: 0.102, best: 0.357 },
      { label: 'Portfolio 3 — Balanced', points: 8, worst: -0.346, exp: 0.114, best: 0.464 },
      { label: 'Portfolio 4 — Growth', points: 12, worst: -0.456, exp: 0.124, best: 0.566 },
      { label: 'Portfolio 5 — Aggressive', points: 17, worst: -0.511, exp: 0.129, best: 0.616 },
    ],
  },
  {
    id: 'q5', group: 'Risk Preference', groupIndex: 3, groupTotal: 6,
    prompt: 'Which statement best describes your investment approach?',
    type: 'simple',
    options: [
      { label: 'Capital preservation; accept low returns.', points: 0 },
      { label: 'Low-risk income & modest growth.', points: 5 },
      { label: 'Balanced growth with risk controls.', points: 10 },
      { label: 'Maximize long-term returns; high risk tolerance.', points: 17 },
    ],
  },
  {
    id: 'q6', group: 'Risk Preference', groupIndex: 4, groupTotal: 6,
    prompt: 'Suppose a well-diversified portfolio fell 20% over a short period. With 10 years still to go before withdrawals, how would you react?',
    type: 'simple',
    options: [
      { label: 'Maintain current allocation — no changes.', points: 16 },
      { label: 'Wait at least three months before derisking.', points: 5 },
      { label: 'Wait at least one year before derisking.', points: 10 },
      { label: 'Immediately move to cash / debt.', points: 0 },
    ],
  },
  {
    id: 'q7', group: 'Risk Preference', groupIndex: 5, groupTotal: 6,
    prompt: 'Note that the option with the highest upside also carries the largest downside. Which return range would you prefer to hold?',
    type: 'range',
    options: [
      { label: 'Wide range', best: 62, worst: -51, points: 17 },
      { label: 'Broad range', best: 57, worst: -46, points: 13 },
      { label: 'Moderate range', best: 46, worst: -35, points: 9 },
      { label: 'Narrow range', best: 36, worst: -23, points: 5 },
      { label: 'Tight range', best: 15, worst: -2, points: 0 },
    ],
  },
  {
    id: 'q8', group: 'Risk Preference', groupIndex: 6, groupTotal: 6,
    prompt: '"I am comfortable with investments that may frequently experience large declines in value if there is potential for higher returns."',
    type: 'simple',
    options: [
      { label: 'Strongly disagree', points: 0 },
      { label: 'Disagree', points: 5 },
      { label: 'Somewhat agree', points: 9 },
      { label: 'Agree', points: 13 },
      { label: 'Strongly agree', points: 16 },
    ],
  },
];

export const TIME_HORIZON_COLS = ['1–2 Yrs', '3–5 Yrs', '6–7 Yrs', '8–10 Yrs', '11+ Yrs'];
export const RISK_ROWS = ['0–14', '15–35', '36–64', '65–83', '84–100'];

// grid[riskRowIdx][timeColIdx] -> tier 1-4. RISCH runs four live mandates only
// (Balanced / Growth / Aggressive / Aggressive Plus) — the floor is always
// Balanced, never a "sit in cash" result.
export const GRID = [
  [1, 1, 1, 1, 1],
  [1, 1, 1, 2, 2],
  [1, 1, 1, 2, 3],
  [1, 1, 2, 3, 4],
  [1, 1, 2, 3, 4],
];

export const AMBIGUOUS = [
  [false, true, false, false, false],
  [false, true, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
];

export const TIER_ORDER = [1, 2, 3, 4];

export const TIERS = {
  1: {
    name: 'RISCH Active Balanced',
    short: 'Active Balanced', tag: 'TIER 1',
    india: 38.21, intl: 12.10, debt: 43.81, cash: 5.88,
  },
  2: {
    name: 'RISCH Active Growth',
    short: 'Active Growth', tag: 'TIER 2',
    india: 52.74, intl: 15.79, debt: 28.02, cash: 3.45,
  },
  3: {
    name: 'RISCH Active Aggressive',
    short: 'Active Aggressive', tag: 'TIER 3',
    india: 66.69, intl: 19.36, debt: 11.71, cash: 2.24,
  },
  4: {
    name: 'RISCH Active Aggressive Plus',
    short: 'Active Aggressive Plus', tag: 'TIER 4',
    india: 78.61, intl: 0, debt: 19.43, cash: 1.96,
    note: 'Domestic-only equity concentration. This may carry higher volatility than a globally diversified aggressive mandate.',
  },
};

// sub-splits derived from the reference Active Aggressive allocation
export const SPLIT = {
  domesticEquity: { large: 0.795, mid: 0.127, small: 0.078 },
  intlEquity: { europe: 0.436, us: 0.349, asia: 0.215 },
  debt: { medium: 0.435, long: 0.316, short: 0.249 },
};

export const PAYOFF_PORTFOLIOS = QUESTIONS.find((q) => q.id === 'q4').options;

export const CHART = {
  macro: { india: '#B24A0E', intl: '#F1650C', debt: '#FFB25B', cash: '#C9BFA6' },
  granular: { large: '#B24A0E', mid: '#D9711F', small: '#FF9A4D', europe: '#F1650C', us: '#FFA35C', asia: '#FFC48A', medium: '#D9A056', long: '#E8BD84', short: '#F2D3AC', cash: '#C9BFA6' },
};
