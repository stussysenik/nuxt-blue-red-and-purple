import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';
import { generateId } from '~/server/utils/id';
import { join } from 'path';
import fs from 'fs';

export default defineEventHandler(async (event) => {
  const admin = requireAuth(event);

  const formData = await readMultipartFormData(event);
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' });
  }

  const file = formData.find((f) => f.name === 'file');
  if (!file || !file.filename) {
    throw createError({ statusCode: 400, statusMessage: 'file field required' });
  }

  // Validate type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif'];
  if (!allowedTypes.includes(file.type || '')) {
    throw createError({ statusCode: 400, statusMessage: `Unsupported file type: ${file.type}` });
  }

  // Max 5MB
  const maxSize = 5 * 1024 * 1024;
  if (file.data.length > maxSize) {
    throw createError({ statusCode: 400, statusMessage: 'File too large (max 5MB)' });
  }

  // Generate safe filename
  const ext = file.filename.split('.').pop()?.toLowerCase() || 'jpg';
  const id = generateId('media');
  const safeFilename = `${id}.${ext}`;

  // Save to public/uploads
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = join(uploadDir, safeFilename);
  fs.writeFileSync(filePath, file.data);

  const url = `/uploads/${safeFilename}`;

  db.prepare(`
    INSERT INTO media (id, filename, original_name, mime_type, size, alt_text, url, uploaded_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, safeFilename, file.filename, file.type, file.data.length, '', url, admin.adminId);

  return {
    id,
    url,
    filename: safeFilename,
    original_name: file.filename,
    mime_type: file.type,
    size: file.data.length,
  };
});
