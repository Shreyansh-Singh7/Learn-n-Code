import axios from "axios";
import { getDb } from "../../database/db";
import { NewsRepository } from "../repositories/newsRepository.ts";

export class NewsService {
  private repository = new NewsRepository();

  async getTodaysNews() {
    const dayStart = new Date();
    dayStart.setUTCDate(dayStart.getUTCDate() - 1);
    dayStart.setUTCHours(0, 0, 0, 0);

    const dayEnd = new Date();
    dayEnd.setUTCDate(dayEnd.getUTCDate() - 1);
    dayEnd.setUTCHours(23, 59, 59, 999);

    return await this.repository.getNewsByDateRange(
      dayStart.toISOString(),
      dayEnd.toISOString()
    );
  }

  async getAllNews() {
    return await this.repository.getAllNews();
  }

  async filterNews(category?: string, from?: string, to?: string) {
    if (category?.toLowerCase() === "all") {
  return await this.repository.getAllNews(); // Ignore from/to dates
}
    return await this.repository.filterNews(category, from, to);
  }
}

/**
 * Fetches articles for a given category from NewsData.io API and stores them into the DB.
 * This function is used by scripts like fetch-news.ts.
 */
export async function fetchAndStoreNews(): Promise<void> {
  const apiKey = process.env.THENEWSAPI_KEY;
  if (!apiKey) {
    console.error("❌ Missing THENEWSAPI_KEY in .env");
    return;
  }

  const url = `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}`;

  try {
    const response = await axios.get(url);
    const articles = response.data.data;

    if (!Array.isArray(articles) || articles.length === 0) {
      console.warn(`⚠️ No articles returned `);
      return;
    }

    const db = await getDb();

    for (const article of articles) {
      const keywordStr = Array.isArray(article.keywords)
        ? article.keywords.join(", ")
        : "";

      await db.run(
        `INSERT OR IGNORE INTO articles (
          article_id, title, description, keywords, url,
          image_url, source, language, published_at, category
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          article.uuid,
          article.title,
          article.description,
          keywordStr,
          article.url,
          article.image_url || "",
          article.source || "unknown",
          article.language || "en",
          article.published_at || new Date().toISOString(),
          article.category
        ]
      );
    }

    console.log(`✅ Stored ${articles.length} articles`);
  } catch (error) {
    console.error(`❌ Failed to fetch/store news`, error);
  }
}


