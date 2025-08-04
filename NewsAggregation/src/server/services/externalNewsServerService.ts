import { IExternalServerRepository } from '../repositories/externalNewsServerRepository';
import { ExternalServer } from '../models/externalNewsServer';

export interface IExternalNewsServerService {
    listServers(): Promise<ExternalServer[]>;
    getServer(name: string): Promise<ExternalServer>;
    updateApiKey(name: string, newKey: string): Promise<void>;
}

export class ExternalNewsServerService implements IExternalNewsServerService {
    constructor(private externalServerRepository: IExternalServerRepository) { }

    async listServers(): Promise<ExternalServer[]> {
        return this.externalServerRepository.listServers();
    }

    async getServer(name: string): Promise<ExternalServer> {
        const server = await this.externalServerRepository.getByName(name);
        if (!server) throw new Error(`Server '${name}' not found`);
        return server;
    }

    async updateApiKey(name: string, newKey: string): Promise<void> {
        if (!newKey.trim()) throw new Error('API key must not be empty');
        await this.externalServerRepository.updateApiKey(name, newKey);
    }
}
