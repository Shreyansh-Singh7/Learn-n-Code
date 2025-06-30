import express from "express";
import { requireAdmin } from "../middleware/authMiddleware.ts";
import { addCategory } from "../controllers/newsController.ts";
import { checkExternalServerStatus } from "../services/newsService.ts";
import {
  getExternalServers,
  updateExternalServer,
} from "../controllers/adminControllers.ts";
const router = express.Router();

router.post("/categories", requireAdmin, addCategory);
router.get("/external-server/status", requireAdmin, checkExternalServerStatus);
router.get("/external-server", requireAdmin, getExternalServers);
router.put("/external-server/:id", requireAdmin, updateExternalServer);

export default router;
