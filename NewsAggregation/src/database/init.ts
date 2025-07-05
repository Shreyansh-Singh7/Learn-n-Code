import sqlite3 from "sqlite3";
import { open } from "sqlite";

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load environment variables from .env file
dotenv.config();

export async function initializeDatabase() {
  const dbPath = path.resolve(__dirname, "../../data/news.db");
  sqlite3.verbose();
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
        article_id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        keywords TEXT,
        url TEXT,
        image_url TEXT,
        source TEXT,
        language TEXT,
        published_at TEXT,
        likes INTEGER DEFAULT 0,
        dislikes INTEGER DEFAULT 0,
        category TEXT
    );

    CREATE TABLE IF NOT EXISTS categories (
      category_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS article_categories (
      article_id TEXT,
      category_id INTEGER,
      PRIMARY KEY(article_id, category_id),
      FOREIGN KEY(article_id) REFERENCES articles(article_id),
      FOREIGN KEY(category_id) REFERENCES categories(category_id)
    );

    CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user'
    );

    CREATE TABLE IF NOT EXISTS saved_articles (
        user TEXT NOT NULL,
        article_id TEXT NOT NULL,
        PRIMARY KEY (user, article_id),
        FOREIGN KEY (article_id) REFERENCES articles(article_id)
    );

    CREATE TABLE IF NOT EXISTS external_servers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      api_url TEXT NOT NULL,
      api_key TEXT NOT NULL,
      country TEXT DEFAULT 'us',
      category TEXT DEFAULT 'general',
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notification_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      category TEXT,
      enabled BOOLEAN DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, category)
    );

    CREATE TABLE IF NOT EXISTS keyword_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      keyword TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      article_id TEXT,
      title TEXT,
      content TEXT,
      sent_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  await db.run(`INSERT OR IGNORE INTO roles (name) VALUES ('admin'), ('user')`);
  console.log("✅ Database initialized.");

  await db.run(
    `INSERT OR IGNORE INTO external_servers (id, name, api_url, api_key) VALUES (?, ?, ?, ?)`,
    [
      "newsapi",
      "NewsAPI",
      "https://newsapi.org/v2/top-headlines",
      process.env.NEWSAPI_KEY,
    ]
  );
}
