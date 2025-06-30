import express from "express";
import { NotificationController } from "../controllers/notificationController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const controller = new NotificationController();

router.use(authenticateToken);

router.get("/", (req, res) => controller.getNotifications(req, res));
router.get("/config", (req, res) => controller.getNotificationConfig(req, res));
router.post("/category", (req, res) => controller.toggleCategory(req, res));
router.post("/keywords", (req, res) => controller.updateKeywords(req, res));

export default router;
