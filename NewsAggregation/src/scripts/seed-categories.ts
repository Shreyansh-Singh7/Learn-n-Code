import { getDb } from "../../src/database/db.js";

const seed = async () => {
  const db = await getDb();
  const categories = ["sports", "business", "entertainment", "technology"];

  for (const name of categories) {
    await db.run(`INSERT OR IGNORE INTO categories (name) VALUES (?)`, name);
    console.log(`✅ Inserted category: ${name}`);
  }

  console.log("🎉 Done seeding categories.");
};

seed();
