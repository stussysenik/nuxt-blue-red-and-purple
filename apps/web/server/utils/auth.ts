import crypto from 'node:crypto';
import db from '~/server/db';

// ── Password hashing (PBKDF2, zero new deps) ──────────────────────────────

const PBKDF2_ITERATIONS = 100_000;
const KEYLEN = 32;
const DIGEST = 'sha256';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEYLEN, DIGEST).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEYLEN, DIGEST).toString('hex');
  // Constant-time comparison
  const a = Buffer.from(candidate, 'hex');
  const b = Buffer.from(hash, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// ── Session tokens ─────────────────────────────────────────────────────────

export function createSession(adminId: number): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  db.prepare(`
    INSERT INTO sessions (token, admin_id, expires_at)
    VALUES (?, ?, ?)
  `).run(token, adminId, Math.floor(expiresAt / 1000));
  return token;
}

export function validateSession(token: string): { adminId: number; email: string } | null {
  const session = db.prepare(`
    SELECT s.admin_id, s.expires_at, a.email
    FROM sessions s
    JOIN admins a ON a.id = s.admin_id
    WHERE s.token = ?
  `).get(token) as { admin_id: number; expires_at: number; email: string } | undefined;

  if (!session) return null;
  if (session.expires_at * 1000 < Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return null;
  }
  return { adminId: session.admin_id, email: session.email };
}

export function destroySession(token: string): void {
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

// ── Cookie helpers ─────────────────────────────────────────────────────────

export const SESSION_COOKIE = 'brp_session';

export function setSessionCookie(event: any, token: string): void {
  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearSessionCookie(event: any): void {
  deleteCookie(event, SESSION_COOKIE, { path: '/' });
}

// ── Require auth helper ────────────────────────────────────────────────────

export function requireAuth(event: any): { adminId: number; email: string } {
  const token = getCookie(event, SESSION_COOKIE);
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
  const session = validateSession(token);
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Session expired' });
  }
  return session;
}
