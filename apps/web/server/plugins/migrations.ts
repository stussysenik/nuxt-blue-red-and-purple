import db from '~/server/db';

// Idempotent schema migrations. Runs once on server startup.
// Tracks applied migrations in schema_migrations table.

export default defineNitroPlugin(() => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      applied_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
  `);

  const migrations: { name: string; sql: string }[] = [
    // ── Core CMS tables ────────────────────────────────────────────────
    {
      name: '001_core',
      sql: `
        CREATE TABLE IF NOT EXISTS content (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at INTEGER NOT NULL DEFAULT (unixepoch())
        );

        CREATE TABLE IF NOT EXISTS admins (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at INTEGER NOT NULL DEFAULT (unixepoch())
        );

        CREATE TABLE IF NOT EXISTS sessions (
          token TEXT PRIMARY KEY,
          admin_id INTEGER NOT NULL,
          created_at INTEGER NOT NULL DEFAULT (unixepoch()),
          expires_at INTEGER NOT NULL,
          FOREIGN KEY (admin_id) REFERENCES admins(id)
        );

        CREATE TABLE IF NOT EXISTS activity_log (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          action TEXT NOT NULL,
          entity_type TEXT NOT NULL,
          entity_id TEXT,
          payload TEXT,
          created_at INTEGER NOT NULL DEFAULT (unixepoch())
        );

        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL DEFAULT '',
          updated_at INTEGER NOT NULL DEFAULT (unixepoch())
        );
      `,
    },
    // ── Visual builder: pages + blocks ─────────────────────────────────
    {
      name: '002_builder',
      sql: `
        CREATE TABLE IF NOT EXISTS pages (
          id TEXT PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          title TEXT NOT NULL,
          description TEXT DEFAULT '',
          is_home INTEGER NOT NULL DEFAULT 0,
          is_published INTEGER NOT NULL DEFAULT 1,
          sort_order INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL DEFAULT (unixepoch()),
          updated_at INTEGER NOT NULL DEFAULT (unixepoch())
        );

        CREATE TABLE IF NOT EXISTS blocks (
          id TEXT PRIMARY KEY,
          page_id TEXT NOT NULL,
          type TEXT NOT NULL,
          content TEXT NOT NULL DEFAULT '{}',
          styles TEXT NOT NULL DEFAULT '{}',
          sort_order INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL DEFAULT (unixepoch()),
          updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
          FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_blocks_page ON blocks(page_id);
        CREATE INDEX IF NOT EXISTS idx_blocks_sort ON blocks(page_id, sort_order);
      `,
    },
    // ── History / versioning system ────────────────────────────────────
    {
      name: '003_history',
      sql: `
        CREATE TABLE IF NOT EXISTS revisions (
          id TEXT PRIMARY KEY,
          page_id TEXT NOT NULL,
          action TEXT NOT NULL,
          snapshot TEXT NOT NULL,
          block_count INTEGER NOT NULL DEFAULT 0,
          created_by INTEGER,
          created_at INTEGER NOT NULL DEFAULT (unixepoch()),
          FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
          FOREIGN KEY (created_by) REFERENCES admins(id)
        );

        CREATE INDEX IF NOT EXISTS idx_revisions_page ON revisions(page_id);
        CREATE INDEX IF NOT EXISTS idx_revisions_created ON revisions(created_at);
      `,
    },
    // ── Media library ──────────────────────────────────────────────────
    {
      name: '004_media',
      sql: `
        CREATE TABLE IF NOT EXISTS media (
          id TEXT PRIMARY KEY,
          filename TEXT NOT NULL,
          original_name TEXT NOT NULL,
          mime_type TEXT NOT NULL,
          size INTEGER NOT NULL DEFAULT 0,
          width INTEGER,
          height INTEGER,
          alt_text TEXT DEFAULT '',
          url TEXT NOT NULL,
          uploaded_by INTEGER,
          created_at INTEGER NOT NULL DEFAULT (unixepoch()),
          FOREIGN KEY (uploaded_by) REFERENCES admins(id)
        );

        CREATE INDEX IF NOT EXISTS idx_media_created ON media(created_at DESC);
      `,
    },
    // ── Works / portfolio ──────────────────────────────────────────────
    {
      name: '005_works',
      sql: `
        CREATE TABLE IF NOT EXISTS works (
          id TEXT PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          title TEXT NOT NULL,
          category TEXT NOT NULL DEFAULT 'music',
          year INTEGER NOT NULL DEFAULT 2024,
          image TEXT DEFAULT '',
          summary TEXT DEFAULT '',
          palette TEXT DEFAULT '[]',
          mechanic TEXT DEFAULT '',
          source TEXT DEFAULT '',
          is_real INTEGER NOT NULL DEFAULT 0,
          is_hidden INTEGER NOT NULL DEFAULT 0,
          sort_order INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL DEFAULT (unixepoch()),
          updated_at INTEGER NOT NULL DEFAULT (unixepoch())
        );

        CREATE INDEX IF NOT EXISTS idx_works_category ON works(category);
        CREATE INDEX IF NOT EXISTS idx_works_sort ON works(sort_order);
      `,
    },
  ];

  const applied = new Set(
    db.prepare('SELECT name FROM schema_migrations').all().map((r: any) => r.name),
  );

  for (const m of migrations) {
    if (applied.has(m.name)) continue;
    try {
      db.exec(m.sql);
      db.prepare('INSERT INTO schema_migrations (name) VALUES (?)').run(m.name);
    } catch (e) {
      console.error(`Migration ${m.name} failed:`, e);
      throw e;
    }
  }

  // ── Seed defaults ───────────────────────────────────────────────────
  const contentCount = (db.prepare('SELECT COUNT(*) as n FROM content').get() as any).n;
  if (contentCount === 0) {
    const insert = db.prepare('INSERT OR IGNORE INTO content (key, value) VALUES (?, ?)');
    insert.run('hero_tagline', 'Too much blue will never amount to any red');
    insert.run('about_body_1', 'We are a multi-disciplinary design communication studio that connects the unconnected by creating coherent and intuitive design.');
    insert.run('about_body_2', 'Our Formula:\n–1 → 0 — Discovering possibilities through curiosity, research, and brainstorming.\n0 → 1 — Bringing ideas to life through thoughtful design and technology.\n1+ — Helping brands grow through continued creativity, refinement, and evolution.');
    insert.run('about_previously_label', 'Previously');
    insert.run('about_previously_value', 'BFA, The Cooper Union for the Advancement of Science and Art.');
    insert.run('about_freegame_label', 'Free game');
    insert.run('about_freegame_value', 'After Virgil Abloh — the method is open-source; take it, pass it on.');
    insert.run('contact_email', 'hi@blueredandpurple.world');
  }

  const pageCount = (db.prepare('SELECT COUNT(*) as n FROM pages').get() as any).n;
  if (pageCount === 0) {
    const homeId = 'page_home';
    db.prepare(`INSERT INTO pages (id, slug, title, is_home, sort_order) VALUES (?, '/', 'Home', 1, 0)`).run(homeId);

    const blocks = [
      { id: 'blk_hero_01', type: 'hero', content: { tagline: 'Too much blue will never amount to any red', layout: 'centered' }, sort: 0 },
      { id: 'blk_text_01', type: 'text', content: { text: 'We are a multi-disciplinary design communication studio.', align: 'left' }, sort: 1 },
      { id: 'blk_works_01', type: 'works-grid', content: { columns: 3, category: 'all' }, sort: 2 },
      { id: 'blk_contact_01', type: 'contact', content: { email: 'hi@blueredandpurple.world' }, sort: 3 },
    ];

    const insertBlock = db.prepare(
      'INSERT INTO blocks (id, page_id, type, content, sort_order) VALUES (?, ?, ?, ?, ?)',
    );
    for (const b of blocks) {
      insertBlock.run(b.id, homeId, b.type, JSON.stringify(b.content), b.sort);
    }
  }
});
