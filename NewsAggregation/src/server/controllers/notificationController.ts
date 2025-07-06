import express, { Request, Response, NextFunction, Router } from 'express';
import { INotificationService, NotificationService } from '../services/notificationService';

export class NotificationController {
    private router: Router;

    constructor(private notificationService: INotificationService) {
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/notifications/:userId', this.list.bind(this));
        this.router.get('/notificationsettings/:userId', this.getSettings.bind(this));
        this.router.post('/notificationsettings', this.addOrUpdate.bind(this));
        this.router.delete('/notificationsettings', this.remove.bind(this));
    }

    public getRouter(): Router {
        return this.router;
    }

    private async list(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.params.userId);
            const data = await this.notificationService.listNotifications(userId);
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    private async getSettings(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.params.userId);
            const data = await this.notificationService.getUserSettings(userId);
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    private async addOrUpdate(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, categoryId, enabled, keywords } = req.body;
            await this.notificationService.configureSetting(userId, categoryId, enabled, keywords);
            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    }

    private async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, categoryId } = req.body;
            await this.notificationService.removeSetting(userId, categoryId);
            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    }
}
