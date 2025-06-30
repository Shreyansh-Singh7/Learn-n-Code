import { getDb } from "../../database/db.js";

export class AdminController {
  async getExternalServers(req: any, res: any) {
    const db = await getDb();
    const servers = await db.all(`SELECT * FROM external_servers`);
    return res.json(servers);
  }

  async updateExternalServer(req: any, res: any) {
    const { id } = req.params;
    const allowedFields = [
      "name",
      "api_url",
      "api_key",
      "country",
      "category",
      "is_active",
    ];

    const fieldsToUpdate: string[] = [];
    const values: any[] = [];

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        fieldsToUpdate.push(`${key} = ?`);
        values.push(req.body[key]);
      }
    }

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    try {
      const db = await getDb();
      const query = `UPDATE external_servers SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
      values.push(id);
      await db.run(query, values);

      res.json({ message: "Server updated successfully" });
    } catch (err) {
      console.error("Error updating server:", err);
      res.status(500).json({ error: "Failed to update server" });
    }
  }
}
