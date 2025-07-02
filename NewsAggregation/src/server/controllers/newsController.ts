import { NewsService } from "../services/newsService.ts";

export class NewsController {
  private service = new NewsService();

  async getTodaysNews(req: any, res: any) {
    try {
      const news = await this.service.getTodaysNews();
      res.json(news);
    } catch (err) {
      console.error("[GET /news/today] Error:", err);
      res.status(500).json({ error: "Failed to fetch today's news" });
    }
  }

  async getAllNews(req: any, res: any) {
    try {
      const news = await this.service.getAllNews();
      res.json(news);
    } catch (err) {
      console.error("[GET /news] Error:", err);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  }

  async filterNews(req: any, res: any) {
    try {
      const { category, from, to } = req.query;
      const news = await this.service.filterNews(category as string, from as string, to as string);
      res.json(news);
    } catch (err) {
      console.error("[GET /news/filter] Error:", err);
      res.status(500).json({ error: "Failed to filter news" });
    }
  }
}
