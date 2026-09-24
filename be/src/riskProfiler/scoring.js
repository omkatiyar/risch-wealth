// Pure scoring functions — the "brain" of the risk profiler. No HTTP,
// no Express here, so these are easy to unit test on their own.

export function computeScores(answers) {
  const q1 = answers.q1 || 0;
  const q2 = answers.q2 || 0;
  const timeHorizonScore = q1 + q2;

  let riskPreferenceScore = 0;
  ['q3', 'q4', 'q5', 'q6', 'q7', 'q8'].forEach((id) => {
    riskPreferenceScore += answers[id] || 0;
  });

  return { timeHorizonScore, riskPreferenceScore };
}

function bucketFromCutoffs(score, cutoffs) {
  for (let i = 0; i < cutoffs.length; i++) {
    if (score <= cutoffs[i]) return i;
  }
  return cutoffs.length;
}

export function bucketTimeHorizon(score, config) {
  return bucketFromCutoffs(score, config.timeHorizonBuckets);
}

export function bucketRiskPreference(score, config) {
  return bucketFromCutoffs(score, config.riskPreferenceBuckets);
}

export function mapToTier(timeHorizonScore, riskPreferenceScore, config) {
  const col = bucketTimeHorizon(timeHorizonScore, config);
  const row = bucketRiskPreference(riskPreferenceScore, config);
  const tier = config.grid[row][col];
  const ambiguous = config.ambiguous[row][col];
  return { tier, row, col, ambiguous };
}

export function granularBreakdown(mandate, split) {
  const { india, intl, debt } = mandate;
  return {
    large: india * split.domesticEquity.large,
    mid: india * split.domesticEquity.mid,
    small: india * split.domesticEquity.small,
    europe: intl * split.intlEquity.europe,
    us: intl * split.intlEquity.us,
    asia: intl * split.intlEquity.asia,
    medium: debt * split.debt.medium,
    long: debt * split.debt.long,
    short: debt * split.debt.short,
  };
}

/**
 * Validates that every question the config defines has a numeric
 * answer, and that the value actually matches one of that question's
 * real option point values — so a caller can't just send back an
 * arbitrary "points" number for a question and have it accepted.
 */
export function validateAnswers(answers, config) {
  for (const q of config.questions) {
    const submitted = answers[q.id];
    if (typeof submitted !== 'number') {
      return `Missing or invalid answer for question "${q.id}".`;
    }
    const isKnownValue = q.options.some((opt) => opt.points === submitted);
    if (!isKnownValue) {
      return `Answer for question "${q.id}" does not match any known option.`;
    }
  }
  return null;
}

/**
 * Computes the full scoring result for a submitted set of answers,
 * including every tier's allocation + granular breakdown (the report UI
 * needs all four tiers, not just the recommended one, for its tabs).
 */
export function scoreSubmission(answers, config) {
  const { timeHorizonScore, riskPreferenceScore } = computeScores(answers);
  const { tier, row, col, ambiguous } = mapToTier(timeHorizonScore, riskPreferenceScore, config);

  const tiers = {};
  for (const t of config.tierOrder) {
    const mandate = config.tiers[t];
    tiers[t] = { ...mandate, granular: granularBreakdown(mandate, config.split) };
  }

  return {
    timeHorizonScore,
    riskPreferenceScore,
    tier,
    row,
    col,
    ambiguous,
    tierOrder: config.tierOrder,
    tiers,
  };
}
