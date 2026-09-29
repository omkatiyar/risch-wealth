import { Router } from 'express';
import { getActiveConfig } from './config.js';
import { scoreSubmission, validateAnswers } from './scoring.js';
import { query } from '../db/pool.js';
import { userFromRequest } from '../auth/sessions.js';

const router = Router();

// Public: the frontend fetches this once to render the quiz + report.
// Question point values are included (the frontend needs them to show
// selections instantly) — the part that actually matters, the scoring
// math itself, only ever runs here on the server.
router.get('/config', (req, res) => {
  const config = getActiveConfig();
  res.json({
    version: config.version,
    questions: config.questions,
    tierOrder: config.tierOrder,
    tiers: config.tiers,
  });
});

// Public: submit answers, get back the computed tier + full report data.
// If a client is signed in, the result is also saved to their portal.
router.post('/score', async (req, res, next) => {
  const { answers } = req.body || {};
  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'Request body must include an "answers" object.' });
  }

  const config = getActiveConfig();
  const validationError = validateAnswers(answers, config);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const result = scoreSubmission(answers, config);

  try {
    const user = await userFromRequest(req);
    if (user && user.role === 'client') {
      const t = config.tiers[result.tier];
      const amount = Number(req.body?.amount);
      await query(
        `INSERT INTO risk_profiles (user_id, config_version, answers, time_horizon_score, risk_preference_score, tier, tier_name, allocation, investment_amount)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [user.id, config.version, JSON.stringify(answers), result.timeHorizonScore, result.riskPreferenceScore, result.tier, t.name,
          JSON.stringify({ india: t.india, intl: t.intl, debt: t.debt, cash: t.cash }), Number.isFinite(amount) && amount > 0 ? amount : null],
      );
      return res.json({ ...result, savedToAccount: true });
    }
  } catch (err) {
    return next(err);
  }
  return res.json(result);
});

export default router;
