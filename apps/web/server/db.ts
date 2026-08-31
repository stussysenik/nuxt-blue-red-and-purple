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

  -- CMS content table: key-value store for editable text blocks
  CREATE TABLE IF NOT EXISTS content (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  -- Admin users table
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  -- Auth sessions
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    admin_id INTEGER NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    expires_at INTEGER NOT NULL,
    FOREIGN KEY (admin_id) REFERENCES admins(id)
  );

  -- Activity log for real-time sync
  CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    payload TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  -- Insert default toolbar state if not exists
  INSERT OR IGNORE INTO toolbar_state (id, visible) VALUES (1, 1);

  -- Insert default feature flags
  INSERT OR IGNORE INTO feature_flags (key, value) VALUES ('show_generative_canvas', 0);
  INSERT OR IGNORE INTO feature_flags (key, value) VALUES ('show_generator_page', 0);
  INSERT OR IGNORE INTO feature_flags (key, value) VALUES ('toolbar_auto_hide', 1);

  -- Insert default CMS content (homepage text blocks)
  INSERT OR IGNORE INTO content (key, value) VALUES ('hero_tagline', 'Too much blue will never amount to any red');
  INSERT OR IGNORE INTO content (key, value) VALUES ('about_body_1', 'We are a multi-disciplinary design communication studio that connects the unconnected by creating coherent and intuitive design. Every great idea begins with something fragile. Whether an idea is just at the beginning, taking shape, or ready to scale, we partner with our clients to build thoughtful work that feel intuitive, memorable and true to your vision.');
  INSERT OR IGNORE INTO content (key, value) VALUES ('about_body_2', 'Our Formula:\\n–1 → 0 — Discovering possibilities through curiosity, research, and brainstorming.\\n0 → 1 — Bringing ideas to life through thoughtful design and technology.\\n1+ — Helping brands grow through continued creativity, refinement, and evolution.');
  INSERT OR IGNORE INTO content (key, value) VALUES ('about_previously_label', 'Previously');
  INSERT OR IGNORE INTO content (key, value) VALUES ('about_previously_value', 'BFA, The Cooper Union for the Advancement of Science and Art.');
  INSERT OR IGNORE INTO content (key, value) VALUES ('about_freegame_label', 'Free game');
  INSERT OR IGNORE INTO content (key, value) VALUES ('about_freegame_value', 'After Virgil Abloh — the method is open-source; take it, pass it on.');
  INSERT OR IGNORE INTO content (key, value) VALUES ('contact_email', 'hi@blueredandpurple.world');
`);

export default db;
