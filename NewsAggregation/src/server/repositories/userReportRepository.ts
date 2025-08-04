import { Pool, RowDataPacket } from 'mysql2/promise';
import { getDbPool } from '../config/database';
import { IUserReportRepository } from '../interfaces/IUserReportRepository';
import { IAdminNotification } from '../../utils/interfaces';

export class UserReportRepository implements IUserReportRepository {
    private pool: Pool;

    constructor() {
        this.pool = getDbPool();
    }

    async reportArticle(userId: number, articleId: number, reason: string): Promise<void> {
        await this.pool.execute(
            `INSERT IGNORE INTO article_reports (user_id, article_id, reason) VALUES (?, ?, ?)`,
            [userId, articleId, reason]
        );
    }

    async getAdminNotifications(): Promise<IAdminNotification[]> {
        const [rows] = await this.pool.query(`SELECT * FROM admin_notifications WHERE is_read = FALSE ORDER BY created_at DESC`);
        return rows as IAdminNotification[];
    }

    async markNotificationRead(notificationId: number): Promise<void> {
        await this.pool.execute(`UPDATE admin_notifications SET is_read = TRUE WHERE notification_id = ?`, [notificationId]);
    }

    async countReportsForArticle(articleId: number): Promise<number> {
        const [rows] = await this.pool.query<RowDataPacket[]>(
            `SELECT COUNT(*) AS count FROM article_reports WHERE article_id = ?`,
            [articleId]
        );

        const count = (rows[0] as { count: number }).count;
        return count ?? 0;
    }

    async addAdminNotification(articleId: number, reason: string): Promise<void> {
        await this.pool.execute(
            'INSERT INTO admin_notifications (article_id, reason) VALUES (?, ?)',
            [articleId, `Article was reported: ${reason}`]
        );
    }
}
