import express, { Request, Response, Router } from 'express';
import { IExternalNewsServerService } from '../services/externalNewsServerService';

export class ExternalServerController {
    private router: Router;
    private externalNewsServerService: IExternalNewsServerService;

    constructor(externalNewsServerService: IExternalNewsServerService) {
            this.router = express.Router();
            this.externalNewsServerService = externalNewsServerService;
            this.initializeRoutes();
        }

    private initializeRoutes() {
        this.router.get('/servers', this.handleList.bind(this));
        this.router.get('/servers/:name', this.handleGet.bind(this));
        this.router.put('/servers/:name/key', this.handleUpdateKey.bind(this));
    }

    public getRouter(): Router {
        return this.router;
    }

    private async handleList(request: Request, response: Response): Promise<void> {
        try {
            const servers = await this.externalNewsServerService.listServers();
            response.json({ success: true, data: servers });
        } catch (err: any) {
            response.status(500).json({ success: false, error: err.message });
        }
    }

    private async handleGet(request: Request, response: Response): Promise<void> {
        try {
            const server = await this.externalNewsServerService.getServer(request.params.name);
            response.json({ success: true, data: server });
        } catch (err: any) {
            response.status(404).json({ success: false, error: err.message });
        }
    }

    private async handleUpdateKey(request: Request, response: Response): Promise<void> {
        const { newKey } = request.body as { newKey: string };
        try {
            await this.externalNewsServerService.updateApiKey(request.params.name, newKey);
            response.json({ success: true });
        } catch (error: any) {
            response.status(400).json({ success: false, error: error.message });
        }
    }
}
