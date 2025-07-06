import express, { Router, Request, Response, NextFunction } from 'express';
import { IArticleReactionService } from '../services/articleReactionService';

export class ArticleReactionController {
    private router: Router;

    constructor(private articleReactionService: IArticleReactionService) {
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/react', this.react.bind(this));
    }

    public getRouter(): Router {
        return this.router;
    }

    private async react(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, articleId, reaction } = req.body;
            if (!['like', 'dislike'].includes(reaction)) {
                res.status(400).json({ success: false, message: 'Invalid reaction type.' });
                return
            }
            await this.articleReactionService.reactToArticle(userId, articleId, reaction);
            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    }
}
