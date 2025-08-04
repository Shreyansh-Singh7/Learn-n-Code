import express,{ Router, Request, Response, NextFunction } from 'express';
import { ISavedArticleService, SavedArticleService } from '../services/savedArticleService';
import { IArticle } from '../../utils/interfaces';

export class SavedArticleController {
    private router: Router;
    private savedArticleService: ISavedArticleService;

    constructor(savedArticleService: ISavedArticleService) {
        this.router = express.Router();
        this.savedArticleService = savedArticleService;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/save', this.save.bind(this));
        this.router.delete('/unsave', this.unSave.bind(this));
        this.router.get('/saved/:userId', this.list.bind(this));
    }

    public getRouter(): Router {
        return this.router;
    }

    private async save(req: Request, res: Response, next: NextFunction) {
        const { userId, articleId } = req.body;
        try {
            const id = await this.savedArticleService.saveArticleForUser(userId, articleId);
            res.status(201).json({ success: true, savedArticleId: id });
        } catch (err) {
            next(err);
        }
    }

    private async unSave(req: Request, res: Response, next: NextFunction) {
        const { userId, articleId } = req.body;
        try {
            await this.savedArticleService.removeSavedArticle(userId, articleId);
            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    }

    private async list(req: Request, res: Response, next: NextFunction) {
        const userId = Number(req.params.userId);
        try {
            const articles:IArticle[] = await this.savedArticleService.getSavedArticles(userId);
            res.json({ success: true, data: articles });
        } catch (err) {
            next(err);
        }
    }
}
