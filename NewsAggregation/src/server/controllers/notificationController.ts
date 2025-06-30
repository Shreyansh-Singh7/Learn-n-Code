import { getDb } from "../../database/db.js";

export class NotificationController {
  async getNotifications(req: any, res: any) {
    const db = await getDb();
    const userId = req.user.userId;

    const rows = await db.all(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY sent_at DESC`,
      [userId]
    );

    res.json(rows);
  }

  async getNotificationConfig(req: any, res: any) {
    const db = await getDb();
    const userId = req.user.userId;

    const categories = await db.all(
      `SELECT category, enabled FROM notification_preferences WHERE user_id = ?`,
      [userId]
    );

    const keywords = await db.all(
      `SELECT keyword FROM keyword_preferences WHERE user_id = ?`,
      [userId]
    );

    res.json({ categories, keywords: keywords.map((k) => k.keyword) });
  }

  async toggleCategory(req: any, res: any) {
    const db = await getDb();
    const userId = req.user.userId;
    const { category, enabled } = req.body;

    const enabledInt = enabled ? 1 : 0;

    await db.run(
      `INSERT INTO notification_preferences (user_id, category, enabled)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id, category) DO UPDATE SET enabled = ?`,
      [userId, category, enabledInt, enabledInt]
    );

    res.json({ message: "Category preference updated" });
  }

  async updateKeywords(req: any, res: any) {
    const db = await getDb();
    const userId = req.user.userId;
    const { keywords } = req.body;

    await db.run(`DELETE FROM keyword_preferences WHERE user_id = ?`, [userId]);

    const insertPromises = keywords.map((k: string) =>
      db.run(
        `INSERT INTO keyword_preferences (user_id, keyword) VALUES (?, ?)`,
        [userId, k]
      )
    );

    await Promise.all(insertPromises);
    res.json({ message: "Keyword preferences updated" });
  }
}
