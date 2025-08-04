import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { getDbPool } from '../config/database';
import { INotificationRepository } from '../interfaces/INotificationRepository';
import { INotificationSetting } from '../../utils/interfaces';

export class NotificationRepository implements INotificationRepository {
    private pool: Pool;

    constructor() {
        this.pool = getDbPool();
    }

    async getUserSettings(userId: number): Promise<INotificationSetting[]> {
        const [rows] = await this.pool.query<RowDataPacket[]>(
            `SELECT * FROM notification_settings WHERE user_id = ? AND enabled = TRUE`,
            [userId]
        );

        const settings: INotificationSetting[] = [];

        for (const row of rows) {
            const [keywordRows] = await this.pool.query<RowDataPacket[]>(
                `SELECT keyword FROM notification_keywords WHERE setting_id = ?`,
                [row.id]
            );
            settings.push({
                id: row.id,
                user_id: row.user_id,
                category_id: row.category_id,
                enabled: !!row.enabled,
                keywords: keywordRows.map(k => k.keyword)
            });
        }
        return settings;
    }

    async addOrUpdateSetting(userId: number, categoryId: number, enabled: boolean, keywords: string[]): Promise<void> {
        const [result] = await this.pool.execute<ResultSetHeader>(
            `INSERT INTO notification_settings (user_id, category_id, enabled)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE enabled = VALUES(enabled)`,
            [userId, categoryId, enabled]
        );

        const settingId = result.insertId || await this.getSettingId(userId, categoryId);

        await this.pool.execute(`DELETE FROM notification_keywords WHERE setting_id = ?`, [settingId]);

        for (const kw of keywords) {
            await this.pool.execute(
                `INSERT INTO notification_keywords (setting_id, keyword) VALUES (?, ?)`,
                [settingId, kw]
            );
        }
    }

    private async getSettingId(userId: number, categoryId: number): Promise<number> {
        const [rows] = await this.pool.query<RowDataPacket[]>(
            `SELECT id FROM notification_settings WHERE user_id = ? AND category_id = ?`,
            [userId, categoryId]
        );
        return rows[0].id;
    }

    async removeSetting(userId: number, categoryId: number): Promise<void> {
        await this.pool.execute(`DELETE FROM notification_settings WHERE user_id = ? AND category_id = ?`, [userId, categoryId]);
    }

    async getNotificationsForUser(userId: number): Promise<Notification[]> {
        const [rows] = await this.pool.query<RowDataPacket[]>(
            `SELECT * FROM notifications WHERE user_id = ? ORDER BY sent_at DESC`,
            [userId]
        );
        return rows as Notification[];
    }

    async saveNotification(userId: number, articleId: number, deliveredVia: 'email' | 'app'): Promise<void> {
        await this.pool.execute(
            `INSERT IGNORE INTO notifications (user_id, article_id, delivered_via)
             VALUES (?, ?, ?)`,
            [userId, articleId, deliveredVia]
        );
    }

    async hasNotification(userId: number, articleId: number): Promise<boolean> {
        const [rows] = await this.pool.query<RowDataPacket[]>(
            `SELECT 1 FROM notifications WHERE user_id = ? AND article_id = ?`,
            [userId, articleId]
        );
        return rows.length > 0;
    }
}
