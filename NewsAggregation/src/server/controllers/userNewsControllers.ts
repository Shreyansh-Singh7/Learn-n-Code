import { UserNewsService } from "../services/userNewsService.ts";

export class UserNewsController {
  private service = new UserNewsService();

  async saveArticle(req: any, res: any) {
    const userId = req.user.userId;
    const { articleId } = req.body;

    try {
      await this.service.saveArticle(userId, articleId);
      res.json({ message: "Article saved successfully" });
    } catch (err: any) {
      console.error("Error saving article:", err);
      res.status(400).json({ error: err.message || "Failed to save article" });
    }
  }

  async unsaveArticle(req: any, res: any) {
    const userId = req.user.userId;
    const { articleId } = req.params;

    try {
      await this.service.unsaveArticle(userId, articleId);
      res.json({ message: "Article removed from saved list" });
    } catch (err: any) {
      console.error("Error deleting saved article:", err);
      res.status(400).json({ error: err.message || "Failed to remove article" });
    }
  }

  async getSavedArticles(req: any, res: any) {
    const userId = req.user.userId;

    try {
      const savedArticles = await this.service.getSavedArticles(userId);
      res.json(savedArticles);
    } catch (err: any) {
      console.error("Error fetching saved articles:", err);
      res.status(500).json({ error: "Failed to retrieve saved articles" });
    }
  }
}
