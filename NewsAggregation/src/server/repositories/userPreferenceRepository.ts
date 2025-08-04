import { Pool, RowDataPacket } from 'mysql2/promise';
import { getDbPool } from '../config/database';
import { IUserPreferenceRepository } from '../interfaces/IUserPreferenceRepository';

export class UserPreferenceRepository implements IUserPreferenceRepository {
    private pool: Pool;

    constructor() {
        this.pool = getDbPool();
    }

    async getUserPrefrenceKeywords(userId: number): Promise<string[]> {
        const [rows] = await this.pool.query<RowDataPacket[]>(
            `SELECT keyword FROM user_preference_keywords WHERE user_id = ?`,
            [userId]
        );

        return rows.map(row => row.keyword);
    }

    async getUserPrefrenceCategories(userId: number): Promise<number[]> {
        const [rows] = await this.pool.query<RowDataPacket[]>(
            `SELECT category_id FROM user_preference_categories WHERE user_id = ?`,
            [userId]
        );

        return rows.map(row => row.category_id);
    }

    async addPreferenceKeywords(userId: number, keywords: string[]): Promise<void> {
        const sql = `
          INSERT IGNORE INTO user_preference_keywords (user_id, keyword)
          VALUES (?, ?)
        `;
        await Promise.all(keywords.map(k => this.pool.execute(sql, [userId, k])));
    }

    async addPreferenceCategories(userId: number, categories: number[]): Promise<void> {
        const sql = `
          INSERT IGNORE INTO user_preference_categories (user_id, category_id)
          VALUES (?, ?)
        `;
        await Promise.all(categories.map(c => this.pool.execute(sql, [userId, c])));
      }
}
