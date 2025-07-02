import { NotificationService } from "../services/notificationService.ts";

export class NotificationController {
  private service = new NotificationService();

  async getNotifications(req: any, res: any) {
    try {
      const userId = req.user.userId;
      const rows = await this.service.getUserNotifications(userId);
      res.json(rows);
    } catch (err) {
      console.error("[GET /notifications] Error:", err);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  }

  async getNotificationConfig(req: any, res: any) {
    try {
      const userId = req.user.userId;
      const config = await this.service.getNotificationConfig(userId);
      res.json(config);
    } catch (err) {
      console.error("[GET /notifications/config] Error:", err);
      res.status(500).json({ error: "Failed to fetch config" });
    }
  }

  async toggleCategory(req: any, res: any) {
    try {
      const userId = req.user.userId;
      const { category, enabled } = req.body;
      await this.service.toggleCategory(userId, category, enabled);
      res.json({ message: "Category preference updated" });
    } catch (err) {
      console.error("[POST /notifications/category] Error:", err);
      res.status(500).json({ error: "Failed to update category" });
    }
  }

  async updateKeywords(req: any, res: any) {
    try {
      const userId = req.user.userId;
      const { keywords } = req.body;
      await this.service.updateKeywords(userId, keywords);
      res.json({ message: "Keywords updated" });
    } catch (err) {
      console.error("[POST /notifications/keywords] Error:", err);
      res.status(500).json({ error: "Failed to update keywords" });
    }
  }
}
