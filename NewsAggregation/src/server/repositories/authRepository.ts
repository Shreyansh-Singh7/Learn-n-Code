import { getDb } from "../../database/db.ts";

export class AuthRepository {
  async findUserByEmail(email: string) {
    const db = await getDb();
    return await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
  }

  async createUser(username: string, email: string, passwordHash: string) {
    const db = await getDb();
    const result = await db.run(
      `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`,
      [username, email, passwordHash, "user"]
    );
    return result.lastID;
  }

  async addDefaultPreferences(userId: number, categories: string[]) {
    const db = await getDb();
    const insertions = categories.map((category) =>
      db.run(
        `INSERT INTO notification_preferences (user_id, category, enabled) VALUES (?, ?, ?)`,
        [userId, category, 1]
      )
    );
    await Promise.all(insertions);
  }
}
