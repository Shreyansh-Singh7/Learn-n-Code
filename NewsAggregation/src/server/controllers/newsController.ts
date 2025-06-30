import { getDb } from "../../database/db.js";

export async function getTodaysNews(req: any, res: any) {
  try {
    const db = await getDb();

    const dayStart = new Date();
    dayStart.setUTCDate(dayStart.getUTCDate() - 1);
    dayStart.setUTCHours(0, 0, 0, 0);

    const dayEnd = new Date();
    dayEnd.setUTCDate(dayEnd.getUTCDate() - 1);
    dayEnd.setUTCHours(23, 59, 59, 999);

    console.log(`Start:`, dayStart.toISOString());
    console.log(`End`, dayEnd.toISOString());

    const news = await db.all(
      `
      SELECT * FROM articles
      WHERE published_at BETWEEN ? AND ?
    `,
      [dayStart.toISOString(), dayEnd.toISOString()]
    );

    res.json(news);
  } catch (err) {
    console.error("[GET /news/today] Error:", err);
    res.status(500).json({ error: "Failed to fetch today's news" });
  }
}

export async function getAllNews(req: any, res: any) {
  try {
    const db = await getDb();

    const news = await db.all(
      `SELECT * FROM articles ORDER BY published_at DESC`
    );

    res.json(news);
  } catch (err) {
    console.error("[GET /news] Error:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
}

export async function filterNews(req: any, res: any) {
  try {
    const db = await getDb();
    const { category, from, to } = req.query;

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

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";
    const query = `SELECT * FROM articles ${whereClause} ORDER BY published_at DESC`;

    const articles = await db.all(query, params);
    res.json(articles);
  } catch (err) {
    console.error("[GET /news/filter] Error:", err);
    res.status(500).json({ error: "Failed to filter news" });
  }
}

export async function addCategory(req: any, res: any) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  try {
    const db = await getDb();
    await db.run(`INSERT INTO categories (name) VALUES (?)`, [name]);
    res.status(201).json({ message: `Category '${name}' added successfully.` });
  } catch (err: any) {
    if (err.message.includes('UNIQUE constraint failed')) {
      res.status(409).json({ error: 'Category already exists.' });
    } else {
      console.error('[POST /news/categories] Error:', err);
      res.status(500).json({ error: 'Failed to add category' });
    }
  }
}
