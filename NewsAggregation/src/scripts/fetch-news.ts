// src/scripts/fetch-news.ts
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set DB path
const dbPath = path.resolve(__dirname, "../../data/news.db");

// API Keys
const NEWS_API_KEY = "ebd4bc989a914cc5970ace38e5cd210d";
const THENEWS_API_KEY = "uMZFRzCrzo3eeGAu3WR2PP3rCqdGQ3tTStcW6d7d";

// Connect to SQLite DB
async function connectDB() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

// Get active APIs from external_servers table
async function getActiveServers(db:any) {
  const rows = await db.all(`SELECT name FROM external_servers WHERE is_active = 1`);
  return rows.map((row:any) => row.name.toLowerCase());
}

// Fetch from NewsAPI
async function fetchFromNewsApi(category: string) {
  const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${NEWS_API_KEY}`;
  const res = await axios.get(url);
  return res.data.articles.map((a:any) => ({
    article_id: uuidv4(),
    title: a.title,
    description: a.description,
    keywords: null,
    url: a.url,
    image_url: a.urlToImage,
    source: a.source?.name || "NewsAPI",
    language: "en",
    published_at: a.publishedAt,
    category,
  }));
}

// Fetch from TheNewsAPI
async function fetchFromTheNewsApi() {
  const url = `https://api.thenewsapi.com/v1/news/top?api_token=${THENEWS_API_KEY}&locale=us&limit=20`;
  const res = await axios.get(url);
  return res.data.data.map((a:any) => ({
    article_id: a.uuid,
    title: a.title,
    description: a.description,
    keywords: a.keywords?.join(", ") || null,
    url: a.url,
    image_url: a.image_url,
    source: a.source || "TheNewsAPI",
    language: a.language || "en",
    published_at: a.published_at,
    category: a.category || "general",
  }));
}

// Insert articles into DB
async function insertArticles(db:any, articles:any) {
  for (const article of articles) {
    const exists = await db.get(`SELECT 1 FROM articles WHERE article_id = ?`, article.article_id);
    if (exists) continue;

    await db.run(
      `INSERT INTO articles 
        (article_id, title, description, keywords, url, image_url, source, language, published_at, category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        article.article_id,
        article.title,
        article.description,
        article.keywords,
        article.url,
        article.image_url,
        article.source,
        article.language,
        article.published_at,
        article.category,
      ]
    );
  }
}

// Main function
async function main() {
  const db = await connectDB();
  const activeSources = await getActiveServers(db);

  let allArticles = [];

  if (activeSources.includes("newsapi")) {
    const categories = ["business", "entertainment", "sports", "technology"];
    for (const category of categories) {
      const news = await fetchFromNewsApi(category);
      allArticles.push(...news);
    }
  }

  if (activeSources.includes("thenewsapi")) {
    const news = await fetchFromTheNewsApi();
    allArticles.push(...news);
  }

  if (allArticles.length > 0) {
    await insertArticles(db, allArticles);
    console.log(`✅ Inserted ${allArticles.length} articles.`);
  } else {
    console.log("⚠️ No articles to insert.");
  }

  await db.close();
}

main().catch((err) => {
  console.error("❌ Error in fetch-news.ts:", err);
});
