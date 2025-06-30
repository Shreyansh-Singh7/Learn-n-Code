// src/server/services/newsService.ts
import axios from "axios";
import { getDb } from "../../database/db.js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const API_KEY = process.env.NEWSAPI_KEY;
const API_URL = "https://newsapi.org/v2/top-headlines";

// Fetch news from API and store in DB
export async function fetchAndStoreNews(
  category: string = "general"
): Promise<number> {
  try {
    const db = await getDb();

    // 🔽 Get active external server
    const server = await db.get(
      `SELECT * FROM external_servers WHERE is_active = 1 LIMIT 1`
    );
    if (!server) throw new Error("No active external server configured");

    const response = await axios.get(server.api_url, {
      params: {
        country: server.country || "us",
        category,
        apiKey: server.api_key,
        pageSize: 10,
      },
    });

    const articles = response.data.articles;
    let storedCount = 0;

    for (const article of articles) {
      try {
        const result = await db.run(
          `INSERT OR IGNORE INTO articles (
            article_id, title, description, url, source, published_at, category
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          article.url || uuidv4(),
          article.title,
          article.description,
          article.url,
          article.source?.name || "",
          article.publishedAt,
          category
        );

        // ✅ Safe check without type assertion
        if (
          result &&
          typeof result.changes === "number" &&
          result.changes > 0
        ) {
          storedCount++;
        }
      } catch (err) {
        console.error(`❌ Failed to insert article: ${article.title}`, err);
      }
    }

    return storedCount;
  } catch (err) {
    console.error(`❌ Failed to fetch news for category "${category}":`, err);
    return 0;
  }
}

// src/server/services/newsService.ts
export async function checkExternalServerStatus(req: any, res: any) {
  const db = await getDb();
  const server = await db.get(
    `SELECT * FROM external_servers WHERE is_active = 1`
  );

  if (!server) {
    return res
      .status(404)
      .json({
        status: "not_configured",
        message: "No active external server found",
      });
  }

  const start = Date.now();
  try {
    const response = await axios.get(server.api_url, {
      params: {
        country: server.country || "us",
        apiKey: server.api_key,
        pageSize: 1,
      },
      timeout: 5000,
    });

    const duration = Date.now() - start;

    if (response.status === 200 && response.data?.status === "ok") {
      return res.json({
        status: "online",
        responseTimeMs: duration,
      });
    } else {
      return res.json({
        status: "degraded",
        message: `Unexpected response: ${response.status}`,
      });
    }
  } catch (err: any) {
    return res.json({
      status: "offline",
      message: err?.message || "No response from server",
    });
  }
}
