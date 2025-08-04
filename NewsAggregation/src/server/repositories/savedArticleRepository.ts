import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { getDbPool } from '../config/database';
import { ISavedArticleRepository } from '../interfaces/ISavedArticleRepository';

export class SavedArticleRepository implements ISavedArticleRepository {
    private pool: Pool = getDbPool();

    async save(userId: number, articleId: number): Promise<number> {
        const sql = `
      INSERT INTO saved_articles (user_id, article_id)
      VALUES (?, ?)
    `;
        const [result] = await this.pool.execute<ResultSetHeader>(sql, [userId, articleId]);
        return result.insertId;
    }

    async delete(userId: number, articleId: number): Promise<void> {
        const sql = `
      DELETE FROM saved_articles
      WHERE user_id = ? AND article_id = ?
    `;
        await this.pool.execute(sql, [userId, articleId]);
    }

    async getSavedArticlesIds(userId: number): Promise<{ article_id: number; saved_at: Date }[]> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            `SELECT article_id, saved_date FROM saved_articles WHERE user_id = ?`,
            [userId]
        );
        return rows.map(r => ({ article_id: r.article_id, saved_at: r.saved_date }));
    }
}
