import express from "express";
import { addCategory, filterNews, getAllNews, getTodaysNews } from "../controllers/newsController.js";
import {
  saveArticle,
  unsaveArticle,
  getSavedArticles,
} from "../controllers/userNewsControllers.js";

const router = express.Router();

router.get("/today", getTodaysNews);
router.get("/all", getAllNews);
router.post("/save", saveArticle);
router.delete("/unsave/:articleId", unsaveArticle);
router.get("/saved", getSavedArticles);
router.get("/filter", filterNews);

export default router;
