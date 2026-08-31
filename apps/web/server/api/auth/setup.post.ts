import db from '~/server/db';
import { hashPassword } from '~/server/utils/auth';

// One-time setup: create the first admin account. Only works when no admins exist.
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password required' });
  }

  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be at least 8 characters' });
  }

  // Check if any admin already exists
  const existing = db.prepare('SELECT COUNT(*) as count FROM admins').get() as { count: number };
  if (existing.count > 0) {
    throw createError({ statusCode: 403, statusMessage: 'Admin already configured' });
  }

  const passwordHash = hashPassword(password);
  const result = db.prepare('INSERT INTO admins (email, password_hash) VALUES (?, ?)').run(email, passwordHash);

  return { success: true, email, id: result.lastInsertRowid };
});
