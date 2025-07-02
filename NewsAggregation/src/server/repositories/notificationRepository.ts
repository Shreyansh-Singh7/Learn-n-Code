import { getDb } from "../../database/db.ts";

export class NotificationRepository {
  async getUserNotifications(userId: number) {
    const db = await getDb();
    return await db.all(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY sent_at DESC`,
      [userId]
    );
  }

  async getCategoryPreferences(userId: number) {
    const db = await getDb();
    return await db.all(
      `SELECT category, enabled FROM notification_preferences WHERE user_id = ?`,
      [userId]
    );
  }

  async getKeywordPreferences(userId: number) {
    const db = await getDb();
    return await db.all(
      `SELECT keyword FROM keyword_preferences WHERE user_id = ?`,
      [userId]
    );
  }

  async upsertCategoryPreference(userId: number, category: string, enabled: boolean) {
    const db = await getDb();
    const enabledInt = enabled ? 1 : 0;

    await db.run(
      `INSERT INTO notification_preferences (user_id, category, enabled)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id, category) DO UPDATE SET enabled = ?`,
      [userId, category, enabledInt, enabledInt]
    );
  }

  async updateKeywords(userId: number, keywords: string[]) {
    const db = await getDb();
    await db.run(`DELETE FROM keyword_preferences WHERE user_id = ?`, [userId]);

    const inserts = keywords.map((keyword) =>
      db.run(
        `INSERT INTO keyword_preferences (user_id, keyword) VALUES (?, ?)`,
        [userId, keyword]
      )
    );

    await Promise.all(inserts);
  }
}
