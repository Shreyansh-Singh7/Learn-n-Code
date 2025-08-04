import express from 'express';
import { ContentModerationRepository } from '../repositories/contentModerationRepository';
import { ContentModerationService, IContentModerationService } from '../services/contentModerationService';
import { ContentModerationController } from '../controllers/contentModerationController';
import { IRouteModule } from './IRouteModule';
import { IContentModerationRepository } from '../interfaces/IContentModerationRepository';

export class ContentModerationRoutes implements IRouteModule {
    private router = express.Router();
    
        constructor() {
            const repository : IContentModerationRepository = new ContentModerationRepository();
            const service : IContentModerationService = new ContentModerationService(repository);
            const controller = new ContentModerationController(service);
            this.router.use( controller.getRouter());
        }
    
        getRouter() {
            return this.router;
        }
}
