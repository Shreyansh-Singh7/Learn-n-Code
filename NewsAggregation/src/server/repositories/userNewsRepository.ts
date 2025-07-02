import { getDb } from "../../database/db.ts";

export class UserNewsRepository {
  async saveArticle(userId: number, articleId: string) {
    const db = await getDb();
    await db.run(
      `INSERT OR IGNORE INTO saved_articles (user, article_id) VALUES (?, ?)`,
      [userId, articleId]
    );
  }

  async unsaveArticle(userId: number, articleId: string) {
    const db = await getDb();
    await db.run(
      `DELETE FROM saved_articles WHERE user = ? AND article_id = ?`,
      [userId, articleId]
    );
  }

  async getSavedArticles(userId: number) {
    const db = await getDb();
    return await db.all(
      `SELECT a.* FROM articles a
       JOIN saved_articles s ON a.article_id = s.article_id
       WHERE s.user = ?
       ORDER BY a.published_at DESC`,
      [userId]
    );
  }
}
