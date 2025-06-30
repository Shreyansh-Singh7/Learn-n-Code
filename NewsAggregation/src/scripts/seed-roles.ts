import { getDb } from '../database/db.js';

async function seedRoles() {
  const db = await getDb();

  await db.run(`INSERT OR IGNORE INTO roles (name) VALUES ('admin')`);
  await db.run(`INSERT OR IGNORE INTO roles (name) VALUES ('user')`);

  console.log('✅ Roles seeded.');
}

seedRoles().catch(console.error);
