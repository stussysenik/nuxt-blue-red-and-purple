import { requireAuth } from '~/server/utils/auth';
import { createSSEHandler } from '~/server/utils/sync';

export default defineEventHandler((event) => {
  requireAuth(event);
  createSSEHandler(event);
});
