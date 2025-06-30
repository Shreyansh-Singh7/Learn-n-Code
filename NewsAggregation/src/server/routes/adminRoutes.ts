import express from "express";
import { AdminController } from "../controllers/adminControllers.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const controller = new AdminController();

router.use(authenticateToken);

router.get("/servers", (req, res) => controller.getExternalServers(req, res));
router.put("/servers/:id", (req, res) => controller.updateExternalServer(req, res));

export default router;
