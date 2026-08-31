import { validateSession } from '~/server/utils/auth';

export default defineEventHandler((event) => {
  const token = getCookie(event, 'brp_session');
  if (!token) return { authenticated: false };

  const session = validateSession(token);
  if (!session) return { authenticated: false };

  return { authenticated: true, email: session.email };
});
