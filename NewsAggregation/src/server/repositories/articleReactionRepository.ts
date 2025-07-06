import { Pool, RowDataPacket } from 'mysql2/promise';
import { getDbPool } from '../config/database';
import { IArticleReactionRepository } from '../interfaces/IArticleReactionRepository';

export class ArticleReactionRepository implements IArticleReactionRepository {
    private pool: Pool;

    constructor() {
        this.pool = getDbPool();
    }

    async getUserReaction(userId: number, articleId: number): Promise<'like' | 'dislike' | null> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            `SELECT reaction FROM article_reactions WHERE user_id = ? AND article_id = ?`,
            [userId, articleId]
        );
        if (rows.length > 0) {
            return rows[0].reaction;
        }
        return null;
    }

    async addOrUpdateReaction(userId: number, articleId: number, reaction: 'like' | 'dislike'): Promise<void> {
        const sql = `
            INSERT INTO article_reactions (user_id, article_id, reaction)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE reaction = VALUES(reaction)
        `;
        await this.pool.execute(sql, [userId, articleId, reaction]);
    }

    async removeReaction(userId: number, articleId: number): Promise<void> {
        await this.pool.execute(
            `DELETE FROM article_reactions WHERE user_id = ? AND article_id = ?`,
            [userId, articleId]
        );
    }

    async updateArticleReactionCount(articleId: number, column: 'likes' | 'dislikes', delta: number): Promise<void> {
        const sql = `UPDATE articles SET ${column} = ${column} + ? WHERE article_id = ?`;
        await this.pool.execute(sql, [delta, articleId]);
    }
}
