import express from 'express';
import { ArticleRepository } from '../repositories/articleRepository';
import { ArticleService, IArticleService } from '../services/articleService';
import { ArticleController } from '../controllers/articleController';
import { IRouteModule } from './IRouteModule';
import { IArticleRepository } from '../interfaces/IArticleRepository';
import { PersonalizedArticleRepository } from '../repositories/personalizedArticleRepository';
import { UserPreferenceRepository } from '../repositories/userPreferenceRepository';
import { IUserPreferenceRepository } from '../interfaces/IUserPreferenceRepository';
import { INotificationRepository } from '../interfaces/INotificationRepository';
import { NotificationRepository } from '../repositories/notificationRepository';

export class ArticleRoutes implements IRouteModule {
    private router = express.Router();

    constructor() {
        const userPreferenceRepository: IUserPreferenceRepository = new UserPreferenceRepository();
        const notificationRepository: INotificationRepository = new NotificationRepository();
        const repository :IArticleRepository = new ArticleRepository();
        const service:IArticleService = new ArticleService(repository);
        const controller = new ArticleController(service);
        this.router.use('/news', controller.router);
    }

    getRouter() {
        return this.router;
    }
}
