import Database from 'better-sqlite3';
import { join } from 'path';
import fs from 'fs';

// Initialize SQLite database
// In production (Vercel), use /tmp; in development, use project root
const dbPath = process.env.NODE_ENV === 'production'
  ? join('/tmp', 'brp.db')
  : join(process.cwd(), '.data', 'brp.db');

// Ensure directory exists in dev
if (process.env.NODE_ENV !== 'production') {
  const dir = join(process.cwd(), '.data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS toolbar_state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    visible INTEGER NOT NULL DEFAULT 1,
    last_hidden_at INTEGER,
    scroll_count INTEGER NOT NULL DEFAULT 0,
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS feature_flags (
    key TEXT PRIMARY KEY,
    value INTEGER NOT NULL DEFAULT 0,
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL,
    visited_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  -- Insert default toolbar state if not exists
  INSERT OR IGNORE INTO toolbar_state (id, visible) VALUES (1, 1);

  -- Insert default feature flags
  INSERT OR IGNORE INTO feature_flags (key, value) VALUES ('show_generative_canvas', 0);
  INSERT OR IGNORE INTO feature_flags (key, value) VALUES ('show_generator_page', 0);
  INSERT OR IGNORE INTO feature_flags (key, value) VALUES ('toolbar_auto_hide', 1);
`);

export default db;
