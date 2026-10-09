import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { query } from '../db/pool.js';
import {
  clearSessionCookie, createSession, currentTokenHash, destroySession, setSessionCookie, userFromRequest,
} from './sessions.js';

// Accounts for two separate portals that share one users table:
//   clients  — sign up themselves on /client-login (role 'client')
//   staff    — employees and admins; created only by an admin (see
//              ../admin/routes.js), never by public sign-up
//
//   POST /api/auth/signup  { fullName, email, phone?, password }   (clients)
//   POST /api/auth/login   { identifier, password, portal: 'client'|'staff' }
//   POST /api/auth/logout
//   GET  /api/auth/me
//   POST /api/auth/password  { currentPassword, newPassword }   (any signed-in user)

const router = Router();
export const BCRYPT_COST = 12;
const STAFF_ROLES = ['employee', 'admin'];

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again in a few minutes.' },
});

export const publicUser = (u) => ({
  id: u.id, fullName: u.full_name, employeeId: u.employee_id, email: u.email, role: u.role,
});
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s-]{6,19}$/;

// Same cost as a real check, so "no such user" and "wrong password" take
// equally long and can't be told apart by timing.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', BCRYPT_COST);

router.post('/signup', authLimiter, async (req, res, next) => {
  try {
    const fullName = String(req.body?.fullName || '').trim();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const phone = String(req.body?.phone || '').trim();
    const password = String(req.body?.password || '');

    if (fullName.length < 2 || fullName.length > 120) return res.status(400).json({ error: 'Please enter your full name.' });
    if (!EMAIL_RE.test(email) || email.length > 200) return res.status(400).json({ error: 'Please enter a valid email address.' });
    if (phone && !PHONE_RE.test(phone)) return res.status(400).json({ error: 'Please enter a valid phone number.' });
    if (password.length < 10 || password.length > 128) return res.status(400).json({ error: 'Password must be at least 10 characters.' });

    const hash = await bcrypt.hash(password, BCRYPT_COST);
    try {
      await query(
        "INSERT INTO users (full_name, email, phone, password_hash, role, status) VALUES ($1, $2, $3, $4, 'client', 'active')",
        [fullName, email, phone || null, hash],
      );
    } catch (err) {
      if (err.code === '23505') return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
      throw err;
    }
    return res.status(201).json({ message: 'Account created. You can sign in now.' });
  } catch (err) {
    return next(err);
  }
});

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const portal = req.body?.portal === 'staff' ? 'staff' : 'client';
    const identifier = String(req.body?.identifier || '').trim();
    const password = String(req.body?.password || '');
    if (!identifier || !password) return res.status(400).json({ error: 'Please enter your login details and password.' });

    // Clients sign in by email; staff by email or employee ID. Each portal
    // only admits its own roles; a mismatch looks like a wrong password.
    const { rows } = await query(
      portal === 'staff'
        ? "SELECT * FROM users WHERE role IN ('employee','admin') AND (lower(email) = lower($1) OR upper(employee_id) = upper($1)) LIMIT 1"
        : "SELECT * FROM users WHERE role = 'client' AND lower(email) = lower($1) LIMIT 1",
      [identifier],
    );
    const user = rows[0];
    const ok = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);
    if (!user || !ok) return res.status(401).json({ error: 'Incorrect login details or password.' });
    if (user.status === 'pending') return res.status(403).json({ error: 'Your account is awaiting activation.' });
    if (user.status !== 'active') return res.status(403).json({ error: 'This account is disabled.' });

    const session = await createSession(user.id, req);
    await query('UPDATE users SET last_login_at = now() WHERE id = $1', [user.id]);
    setSessionCookie(res, session);
    return res.json({ user: publicUser(user) });
  } catch (err) {
    return next(err);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    await destroySession(req);
    clearSessionCookie(res);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get('/me', async (req, res, next) => {
  try {
    const user = await userFromRequest(req);
    if (!user) return res.status(401).json({ error: 'Not signed in.' });
    return res.json({ user: publicUser(user) });
  } catch (err) {
    return next(err);
  }
});

// Like /me, but a signed-out visitor gets 200 { user: null } instead of a
// 401, for public pages that adapt when someone is signed in (no console
// error for every anonymous visit).
router.get('/status', async (req, res, next) => {
  try {
    const user = await userFromRequest(req);
    return res.json({ user: user ? publicUser(user) : null });
  } catch (err) {
    return next(err);
  }
});

router.post('/password', authLimiter, async (req, res, next) => {
  try {
    const user = await userFromRequest(req);
    if (!user) return res.status(401).json({ error: 'Not signed in.' });
    const current = String(req.body?.currentPassword || '');
    const next_ = String(req.body?.newPassword || '');
    if (next_.length < 10 || next_.length > 128) return res.status(400).json({ error: 'New password must be at least 10 characters.' });
    const { rows } = await query('SELECT password_hash FROM users WHERE id = $1', [user.id]);
    if (!(await bcrypt.compare(current, rows[0].password_hash))) return res.status(400).json({ error: 'Your current password is incorrect.' });
    await query('UPDATE users SET password_hash = $2, updated_at = now() WHERE id = $1', [user.id, await bcrypt.hash(next_, BCRYPT_COST)]);
    // Sign out every other device; keep this one.
    await query('DELETE FROM sessions WHERE user_id = $1 AND token_hash <> $2', [user.id, currentTokenHash(req)]);
    return res.json({ message: 'Password updated.' });
  } catch (err) {
    return next(err);
  }
});

// Route guards for other routers.
export function requireRole(...roles) {
  return async (req, res, next) => {
    try {
      const user = await userFromRequest(req);
      if (!user) return res.status(401).json({ error: 'Not signed in.' });
      if (!roles.includes(user.role)) return res.status(403).json({ error: 'You do not have access to this.' });
      req.user = user;
      return next();
    } catch (err) {
      return next(err);
    }
  };
}

export { STAFF_ROLES };
export default router;
