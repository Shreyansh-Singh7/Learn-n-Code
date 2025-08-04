import express,{ Router } from 'express';
import { UserReportRepository } from '../repositories/userReportRepository';
import { IUserReportService, UserReportService } from '../services/userReportService';
import { UserReportController } from '../controllers/userReportController';
import { IRouteModule } from './IRouteModule';
import { IUserReportRepository } from '../interfaces/IUserReportRepository';
import { ContentModerationService, IContentModerationService } from '../services/contentModerationService';
import { IContentModerationRepository } from '../interfaces/IContentModerationRepository';
import { ContentModerationRepository } from '../repositories/contentModerationRepository';

export class UserReportRoutes implements IRouteModule{
    private router = express.Router();

    constructor() {
        const userReportRepository: IUserReportRepository = new UserReportRepository();
        const contentModerationRepository: IContentModerationRepository = new ContentModerationRepository();
        const contentModerationService: IContentModerationService = new ContentModerationService(contentModerationRepository);
        const service: IUserReportService = new UserReportService(userReportRepository,contentModerationService);
        const controller = new UserReportController(service);
        this.router.use( controller.getRouter());
    }
        
    getRouter() {
        return this.router;
    }
}
