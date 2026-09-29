import { Router } from 'express';
import { query } from '../db/pool.js';
import { requireRole } from '../auth/routes.js';

// Client portal: everything here is scoped to the signed-in client
// (req.user.id); a client can never read another client's rows.
//   GET   /api/client/overview   profile, latest risk profile, requests
//   PATCH /api/client/profile    { fullName?, phone? }
//   GET   /api/client/risk-profiles
//   POST  /api/client/requests   { topic, message }

const router = Router();
router.use(requireRole('client'));

export const REQUEST_TOPICS = [
  'Portfolio review',
  'Request a callback',
  'Rebalancing or change in allocation',
  'New investment',
  'Withdrawal or redemption',
  'Documents or statements',
  'Something else',
];
const PHONE_RE = /^[+\d][\d\s-]{6,19}$/;

const riskRow = (r) => ({
  id: r.id, createdAt: r.created_at, tier: r.tier, tierName: r.tier_name,
  timeHorizonScore: Number(r.time_horizon_score), riskPreferenceScore: Number(r.risk_preference_score),
  allocation: r.allocation, investmentAmount: r.investment_amount === null ? null : Number(r.investment_amount),
});
const requestRow = (r) => ({ id: r.id, topic: r.topic, message: r.message, status: r.status, createdAt: r.created_at, updatedAt: r.updated_at });

router.get('/overview', async (req, res, next) => {
  try {
    const [profile, risk, requests] = await Promise.all([
      query('SELECT full_name, email, phone, created_at FROM users WHERE id = $1', [req.user.id]),
      query('SELECT * FROM risk_profiles WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [req.user.id]),
      query('SELECT * FROM client_requests WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20', [req.user.id]),
    ]);
    const p = profile.rows[0];
    res.json({
      profile: { fullName: p.full_name, email: p.email, phone: p.phone, memberSince: p.created_at },
      latestRiskProfile: risk.rows[0] ? riskRow(risk.rows[0]) : null,
      requests: requests.rows.map(requestRow),
      requestTopics: REQUEST_TOPICS,
    });
  } catch (err) {
    next(err);
  }
});

router.patch('/profile', async (req, res, next) => {
  try {
    const fullName = req.body?.fullName === undefined ? undefined : String(req.body.fullName).trim();
    const phone = req.body?.phone === undefined ? undefined : String(req.body.phone).trim();
    if (fullName !== undefined && (fullName.length < 2 || fullName.length > 120)) return res.status(400).json({ error: 'Please enter your full name.' });
    if (phone && !PHONE_RE.test(phone)) return res.status(400).json({ error: 'Please enter a valid phone number.' });
    const { rows } = await query(
      `UPDATE users SET full_name = COALESCE($2, full_name), phone = CASE WHEN $3::text IS NULL THEN phone ELSE NULLIF($3, '') END,
              updated_at = now() WHERE id = $1 RETURNING full_name, email, phone, created_at`,
      [req.user.id, fullName ?? null, phone ?? null],
    );
    const p = rows[0];
    return res.json({ profile: { fullName: p.full_name, email: p.email, phone: p.phone, memberSince: p.created_at } });
  } catch (err) {
    return next(err);
  }
});

router.get('/risk-profiles', async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM risk_profiles WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50', [req.user.id]);
    res.json({ riskProfiles: rows.map(riskRow) });
  } catch (err) {
    next(err);
  }
});

router.post('/requests', async (req, res, next) => {
  try {
    const topic = String(req.body?.topic || '');
    const message = String(req.body?.message || '').trim();
    if (!REQUEST_TOPICS.includes(topic)) return res.status(400).json({ error: 'Please choose what your request is about.' });
    if (message.length < 1 || message.length > 4000) return res.status(400).json({ error: 'Please add a short message (up to 4,000 characters).' });
    const { rows: open } = await query("SELECT count(*)::int AS n FROM client_requests WHERE user_id = $1 AND status <> 'closed'", [req.user.id]);
    if (open[0].n >= 10) return res.status(429).json({ error: 'You have several open requests already. Our team will be in touch shortly.' });
    const { rows } = await query(
      'INSERT INTO client_requests (user_id, topic, message) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, topic, message],
    );
    return res.status(201).json({ request: requestRow(rows[0]) });
  } catch (err) {
    return next(err);
  }
});

export default router;
