import express from "express";
import { UserNewsController } from "../controllers/userNewsControllers.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const userNewsController = new UserNewsController();

router.use(authenticateToken); // protect all routes below

router.post("/save", (req, res) => userNewsController.saveArticle(req, res));
router.delete("/unsave/:articleId", (req, res) => userNewsController.unsaveArticle(req, res));
router.get("/saved", (req, res) => userNewsController.getSavedArticles(req, res));

export default router;
