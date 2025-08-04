import express, { Router, Request, Response, NextFunction } from 'express';
import { IUserReportService, UserReportService } from '../services/userReportService';

export class UserReportController {
    private router: Router;

    constructor(private userReportService: IUserReportService) {
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/report', this.reportArticle.bind(this));
        this.router.get('/admin/notifications', this.listAdminNotifications.bind(this));
        this.router.post('/admin/notifications/read', this.markNotificationRead.bind(this));
    }

    getRouter() {
        return this.router;
    }

    private async reportArticle(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, articleId, reason } = req.body;
            await this.userReportService.reportArticle(userId, articleId, reason);
            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    }

    private async listAdminNotifications(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.userReportService.listAdminNotifications();
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    private async markNotificationRead(req: Request, res: Response, next: NextFunction) {
        try {
            const { notificationId } = req.body;
            await this.userReportService.markNotificationRead(notificationId);
            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    }
}
