import { Pool } from 'mysql2/promise';
import { getDbPool } from '../config/database';
import { IContentModerationRepository } from '../interfaces/IContentModerationRepository';
import { IBlockedKeyword } from '../../utils/interfaces';

export class ContentModerationRepository implements IContentModerationRepository {
    private pool: Pool;

    constructor() {
        this.pool = getDbPool();
    }

    async hideArticle(articleId: number): Promise<void> {
        await this.pool.execute(`UPDATE articles SET is_hidden = TRUE WHERE article_id = ?`, [articleId]);
    }

    async hideCategory(categoryId: number): Promise<void> {
        await this.pool.execute(`UPDATE categories SET is_hidden = TRUE WHERE category_id = ?`, [categoryId]);
    }

    async hideArticlesByCategory(categoryId: number): Promise<void> {
        const sql = `
            UPDATE articles
            SET is_hidden = TRUE
            WHERE article_id IN (
                SELECT article_id FROM article_categories WHERE category_id = ?
            )
        `;
        await this.pool.execute(sql, [categoryId]);
    }

    async hideArticlesByKeyword(keyword: string): Promise<void> {
        const sql = `
            UPDATE articles
            SET is_hidden = TRUE
            WHERE article_id IN (
                SELECT article_id FROM article_keywords WHERE keyword = ?
            )
        `;
        await this.pool.execute(sql, [keyword]);
    }    

    async addBlockedKeyword(keyword: string): Promise<void> {
        await this.pool.execute(`INSERT INTO blocked_keywords (keyword) VALUES (?)`, [keyword]);
    }

    async removeBlockedKeyword(keyword: string): Promise<void> {
        await this.pool.execute(`DELETE FROM blocked_keywords WHERE keyword = ?`, [keyword]);
    }

    async getBlockedKeywords(): Promise<IBlockedKeyword[]> {
        const [rows] = await this.pool.query(`SELECT * FROM blocked_keywords ORDER BY created_at DESC`);
        return rows as IBlockedKeyword[];
    }
}
