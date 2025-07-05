import express, { Express, Request, Response, NextFunction } from "express";
import http from "http";
import { getDb } from "../../database/db";
import { AuthController } from "./authController";
import { NewsController } from "./newsController";
import { NotificationController } from "./notificationController";
import { AdminController } from "./adminControllers";
import { UserNewsController } from "./userNewsControllers";


export default class ServerController {
  private app: Express;
  private port: number;
  private server: http.Server | null = null;

  constructor(port: number) {
    this.app = express();
    this.port = port;
  }

  public async initializeServer(): Promise<void> {
    try {
      // Check DB connection
      const db = await getDb();
      await db.get("SELECT 1");
      console.log("✅ Database connected");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      process.exit(1);
    }

    this.app.use(express.json());

    // Initialize controllers
    const authController = new AuthController();
    const newsController = new NewsController();
    const notificationController = new NotificationController();
    const adminController = new AdminController();
    const userNewsController = new UserNewsController();

    // Define routes
    this.app.get("/api/news/today", newsController.getTodaysNews.bind(newsController));
    this.app.get("/api/news", newsController.getAllNews.bind(newsController));
    this.app.get("/api/news/filter", newsController.filterNews.bind(newsController));

    this.app.post("/api/auth/signup", authController.signup.bind(authController));
    this.app.post("/api/auth/login", authController.login.bind(authController));

    this.app.get("/api/notifications", notificationController.getNotifications.bind(notificationController));
    this.app.get("/api/notifications/config", notificationController.getNotificationConfig.bind(notificationController));
    this.app.post("/api/notifications/category", notificationController.toggleCategory.bind(notificationController));
    this.app.post("/api/notifications/keywords", notificationController.updateKeywords.bind(notificationController));

    this.app.get("/api/servers", adminController.getExternalServers.bind(adminController));
    this.app.put("/api/servers/:id", adminController.updateExternalServer.bind(adminController));

    this.app.post("/api/user/save", userNewsController.saveArticle.bind(userNewsController));
    this.app.delete("/api/user/unsave/:articleId", userNewsController.unsaveArticle.bind(userNewsController));
    this.app.get("/api/user/saved", userNewsController.getSavedArticles.bind(userNewsController));

    this.app.post("/api/admin/categories", adminController.addCategory.bind(adminController));

    // 404 Handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ success: false, error: "Route not found" });
    });

    // Error Handler
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error("Server Error:", err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    });

    // Start server
    this.server = this.app.listen(this.port, () => {
      console.log(`🚀 Server running on http://localhost:${this.port}`);
    });
  }

  public async stopServer(): Promise<void> {
    if (this.server) {
      this.server.close(() => {
        console.log("🛑 Server stopped");
      });
    }
  }
}
