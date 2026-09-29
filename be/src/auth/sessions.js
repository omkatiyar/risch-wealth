import crypto from 'node:crypto';
import { query } from '../db/pool.js';

// Server-side sessions: a random token in an httpOnly cookie; the
// database keeps only its SHA-256 hash.

export const COOKIE_NAME = 'risch_session';
const SESSION_DAYS = 7;

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export async function createSession(userId, req) {
  const token = crypto.randomBytes(32).toString('base64url');
  const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await query(
    'INSERT INTO sessions (token_hash, user_id, expires_at, ip, user_agent) VALUES ($1, $2, $3, $4, $5)',
    [hashToken(token), userId, expires, req.ip, (req.get('user-agent') || '').slice(0, 300)],
  );
  return { token, expires };
}

export function setSessionCookie(res, { token, expires }) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    // Secure in production (served over HTTPS behind nginx).
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires,
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, { path: '/' });
}

function readCookie(req, name) {
  const header = req.get('cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

// Returns the signed-in, active user for this request, or null.
export async function userFromRequest(req) {
  const token = readCookie(req, COOKIE_NAME);
  if (!token) return null;
  const { rows } = await query(
    `SELECT u.id, u.full_name, u.employee_id, u.email, u.role, u.status
       FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = $1 AND s.expires_at > now() AND u.status = 'active'`,
    [hashToken(token)],
  );
  return rows[0] || null;
}

export async function destroySession(req) {
  const token = readCookie(req, COOKIE_NAME);
  if (token) await query('DELETE FROM sessions WHERE token_hash = $1', [hashToken(token)]);
}

export async function purgeExpiredSessions() {
  await query('DELETE FROM sessions WHERE expires_at <= now()');
}
