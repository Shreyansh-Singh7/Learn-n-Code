import { getDb } from "../../database/db.ts";

export class AdminRepository {
  async getExternalServers() {
    const db = await getDb();
    return await db.all(`SELECT * FROM external_servers`);
  }

  async updateExternalServer(id: string, updates: Record<string, any>) {
    const db = await getDb();

    const fieldsToUpdate: string[] = [];
    const values: any[] = [];

    const allowedFields = [
      "name",
      "api_url",
      "api_key",
      "country",
      "category",
      "is_active"
    ];

    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        fieldsToUpdate.push(`${key} = ?`);
        values.push(updates[key]);
      }
    }

    if (fieldsToUpdate.length === 0) {
      throw new Error("No fields provided for update");
    }

    const query = `UPDATE external_servers SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
    values.push(id);
    await db.run(query, values);
  }

  async addCategory(name: string) {
  const db = await getDb();
  await db.run(`INSERT OR IGNORE INTO categories (name) VALUES (?)`, [name]);
}

}
