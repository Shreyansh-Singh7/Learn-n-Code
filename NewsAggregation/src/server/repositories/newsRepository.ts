import { getDb } from "../../database/db.ts";

export class NewsRepository {
  async getNewsByDateRange(startDate: string, endDate: string) {
    const db = await getDb();
    return await db.all(
      `SELECT * FROM articles WHERE published_at BETWEEN ? AND ? ORDER BY datetime(published_at) DESC`,
      [startDate, endDate]
    );
  }

  async getAllNews(limit: number = 15) {
    const db = await getDb();
    return await db.all(
      `SELECT * FROM articles ORDER BY datetime(published_at) DESC LIMIT ?`,
      [limit]
    );
  }

  async filterNews(category?: string, from?: string, to?: string) {
  const db = await getDb();
  const conditions = [];
  const params = [];

  // ⚠️ FIXED: "all" should not filter category at all
  if (category && category.toLowerCase() !== "all") {
    conditions.push("LOWER(category) = ?");
    params.push(category.toLowerCase());
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
  const query = `SELECT * FROM articles ${whereClause} ORDER BY datetime(published_at) DESC LIMIT 15`;

  return await db.all(query, params);
}

}
