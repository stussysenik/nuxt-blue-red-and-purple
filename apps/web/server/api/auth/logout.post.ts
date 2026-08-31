import { clearSessionCookie } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'brp_session');
  if (token) {
    const { destroySession } = await import('~/server/utils/auth');
    destroySession(token);
  }
  clearSessionCookie(event);
  return { success: true };
});
