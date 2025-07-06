import express, { Router, Request, Response, NextFunction } from 'express';
import { ContentModerationService, IContentModerationService } from '../services/contentModerationService';

export class ContentModerationController {
    private router: Router;

    constructor(private service: IContentModerationService) {
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/hide/article', this.hideArticle.bind(this));
        this.router.post('/hide/category', this.hideCategory.bind(this));
        this.router.post('/keywords', this.addBlockedKeyword.bind(this));
        this.router.delete('/keywords', this.removeBlockedKeyword.bind(this));
        this.router.get('/keywords', this.getBlockedKeywords.bind(this));
    }

    getRouter() {
        return this.router;
    }

    private async hideArticle(req: Request, res: Response, next: NextFunction) {
        try {
            const { articleId } = req.body;
            await this.service.hideArticle(articleId);
            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    }

    private async hideCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { categoryId } = req.body;
            await this.service.hideCategory(categoryId);
            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    }

    private async addBlockedKeyword(req: Request, res: Response, next: NextFunction) {
        try {
            const { keyword } = req.body;
            await this.service.addBlockedKeyword(keyword);
            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    }

    private async removeBlockedKeyword(req: Request, res: Response, next: NextFunction) {
        try {
            const { keyword } = req.body;
            await this.service.removeBlockedKeyword(keyword);
            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    }

    private async getBlockedKeywords(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.service.getBlockedKeywords();
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }
}
