import express from 'express';
import { ArticleRepository } from '../repositories/articleRepository';
import { SavedArticleRepository } from '../repositories/savedArticleRepository';
import { ISavedArticleService, SavedArticleService } from '../services/savedArticleService';
import { SavedArticleController } from '../controllers/savedArticleController';
import { IRouteModule } from './IRouteModule';
import { IArticleRepository } from '../interfaces/IArticleRepository';
import { ISavedArticleRepository } from '../interfaces/ISavedArticleRepository';

export class SavedArticleRoutes implements IRouteModule {
    private router = express.Router();

    constructor() {
        const articleRepository:IArticleRepository = new ArticleRepository();
        const savedArticleRepository:ISavedArticleRepository = new SavedArticleRepository();
        const savedArticleService:ISavedArticleService = new SavedArticleService(savedArticleRepository, articleRepository);
        const savedArticleController = new SavedArticleController(savedArticleService);
        this.router.use(savedArticleController.getRouter());
    }

    getRouter() {
        return this.router;
    }
}
