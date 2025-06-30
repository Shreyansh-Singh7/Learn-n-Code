// scripts/fetch-news.ts
import { fetchAndStoreNews } from '../server/services/newsService.js';
import { getDb } from '../database/db.js';
import dotenv from 'dotenv';

dotenv.config();

export async function fetchNewsJob() {
  const db = await getDb();
  const categories = await db.all(`SELECT name FROM categories`);

  if (categories.length === 0) {
    console.log('⚠️ No categories found in database. Add some via admin panel first.');
    return;
  }

  for (const { name: category } of categories) {
    try {
      console.log(`\n📥 Fetching ${category} news...`);
      await fetchAndStoreNews(category);
    } catch (err) {
      console.error(`❌ Failed to fetch ${category} news:`, err);
    }
  }

  console.log('\n✅ Finished fetching all categories.');
}

// Optional: run immediately if invoked directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  fetchNewsJob();
}
