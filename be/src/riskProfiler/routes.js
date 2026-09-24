import { Router } from 'express';
import { getActiveConfig } from './config.js';
import { scoreSubmission, validateAnswers } from './scoring.js';

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
router.post('/score', (req, res) => {
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
  res.json(result);
});

export default router;
