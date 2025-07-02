import { getDb } from "../../database/db.ts";

export class NewsRepository {
  async getNewsByDateRange(startDate: string, endDate: string) {
    const db = await getDb();
    return await db.all(
      `SELECT * FROM articles WHERE published_at BETWEEN ? AND ?`,
      [startDate, endDate]
    );
  }

  async getAllNews() {
    const db = await getDb();
    return await db.all(
      `SELECT * FROM articles ORDER BY published_at DESC`
    );
  }

  async filterNews(category?: string, from?: string, to?: string) {
    const db = await getDb();
    const conditions = [];
    const params = [];

    if (category) {
      conditions.push("category = ?");
      params.push(category);
    }

    if (from) {
      conditions.push("date(published_at) >= date(?)");
      params.push(from);
    }

    if (to) {
      conditions.push("date(published_at) <= date(?)");
      params.push(to);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const query = `SELECT * FROM articles ${whereClause} ORDER BY published_at DESC`;

    return await db.all(query, params);
  }
}
