import { open } from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "../../../data/news.db");

async function getDbConnection() {
  return open({ filename: dbPath, driver: sqlite3.Database });
}

export class ArticleRepository {
  async likeArticle(articleId: string): Promise<void> {
    const db = await getDbConnection();
    await db.run(`UPDATE articles SET likes = likes + 1 WHERE article_id = ?`, articleId);
  }

  async dislikeArticle(articleId: string): Promise<void> {
    const db = await getDbConnection();
    await db.run(`UPDATE articles SET dislikes = dislikes + 1 WHERE article_id = ?`, articleId);
  }

  async updateKeywords(articleId: string, keywords: string): Promise<void> {
    const db = await getDbConnection();
    await db.run(`UPDATE articles SET keywords = ? WHERE article_id = ?`, keywords, articleId);
  }

  async searchArticlesByKeyword(keyword: string): Promise<any[]> {
    const db = await getDbConnection();
    return db.all(`SELECT * FROM articles WHERE keywords LIKE ?`, `%${keyword}%`);
  }

  async getAllArticles(): Promise<any[]> {
    const db = await getDbConnection();
    return db.all(`SELECT * FROM articles`);
  }

  async getArticleById(articleId: string): Promise<any> {
    const db = await getDbConnection();
    return db.get(`SELECT * FROM articles WHERE article_id = ?`, articleId);
  }
}
