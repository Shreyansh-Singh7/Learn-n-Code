import express from "express";
import { NewsController } from "../controllers/newsController.js";

const router = express.Router();
const newsController = new NewsController();

router.get("/", (req, res) => newsController.getAllNews(req, res));
router.get("/today", (req, res) => newsController.getTodaysNews(req, res));
router.get("/filter", (req, res) => newsController.filterNews(req, res));
router.post("/categories", (req, res) => newsController.addCategory(req, res));

export default router;
