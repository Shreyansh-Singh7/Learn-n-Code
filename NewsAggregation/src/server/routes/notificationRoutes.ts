import { NotificationController } from "../controllers/notificationController";
import { INotificationRepository } from "../interfaces/INotificationRepository";
import { NotificationRepository } from "../repositories/notificationRepository";
import { INotificationService, NotificationService } from "../services/notificationService";
import { IRouteModule } from "./IRouteModule";
import express from 'express';

export class NotificationRoutes implements IRouteModule {
    private router = express.Router();
    
        constructor() {
            const repository : INotificationRepository = new NotificationRepository();
            const service : INotificationService = new NotificationService(repository);
            const controller = new NotificationController(service);
            this.router.use( controller.getRouter());
        }
    
        getRouter() {
            return this.router;
        }
}