import db from '~/server/db';
import { verifyPassword, createSession, setSessionCookie } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password required' });
  }

  // Find admin
  const admin = db.prepare('SELECT id, password_hash FROM admins WHERE email = ?').get(email) as
    | { id: number; password_hash: string }
    | undefined;

  if (!admin || !verifyPassword(password, admin.password_hash)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' });
  }

  const token = createSession(admin.id);
  setSessionCookie(event, token);

  return { success: true, email };
});
