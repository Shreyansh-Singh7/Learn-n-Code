import express from 'express';
import { ExternalNewsServerRepository, IExternalServerRepository } from '../repositories/externalNewsServerRepository';
import { ExternalNewsServerService, IExternalNewsServerService } from '../services/externalNewsServerService';
import { ExternalServerController } from '../controllers/externalNewsServerController';
import { IRouteModule } from './IRouteModule';

export class ExternalServerRoutes implements IRouteModule {
    private router = express.Router();

    constructor() {
        const repository:IExternalServerRepository = new ExternalNewsServerRepository();
        const service:IExternalNewsServerService = new ExternalNewsServerService(repository);
        const controller = new ExternalServerController(service);
        this.router.use(controller.getRouter());
    }

    getRouter() {
        return this.router;
    }
}
