import express from 'express';
import { ArticleReactionController } from '../controllers/articleReactionController';
import { ArticleReactionService, IArticleReactionService } from '../services/articleReactionService';
import { ArticleReactionRepository } from '../repositories/articleReactionRepository';
import { IRouteModule } from './IRouteModule';
import { IArticleReactionRepository } from '../interfaces/IArticleReactionRepository';

export class ArticleReactionRoutes implements IRouteModule{
    private router = express.Router();

    constructor() {
        const repository : IArticleReactionRepository = new ArticleReactionRepository();
        const service : IArticleReactionService = new ArticleReactionService(repository);
        const controller = new ArticleReactionController(service);
        this.router.use( controller.getRouter());
    }
        
    getRouter() {
        return this.router;
    }
}