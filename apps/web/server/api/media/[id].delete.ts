import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';
import { join } from 'path';
import fs from 'fs';

export default defineEventHandler(async (event) => {
  requireAuth(event);
  const id = event.context.params?.id;

  const media = db.prepare('SELECT * FROM media WHERE id = ?').get(id);
  if (!media) {
    throw createError({ statusCode: 404, statusMessage: 'Media not found' });
  }

  // Delete file from disk
  const filePath = join(process.cwd(), 'public', (media as any).url);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  db.prepare('DELETE FROM media WHERE id = ?').run(id);

  return { success: true, id };
});
