import { IExternalServer } from '../../utils/interfaces';
import * as dotenv from 'dotenv';
dotenv.config();

export class ClientExternalNewsServerService {
    private readonly baseUrl = process.env.BASE_API_URL;

    async listServers(): Promise<IExternalServer[]> {
        const res = await fetch(`${this.baseUrl}/servers`, {
            headers: { 'Content-Type': 'application/json' },
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        return json.data as IExternalServer[];
    }

    async viewServer(name: string): Promise<IExternalServer> {
        const res = await fetch(`${this.baseUrl}/servers/${encodeURIComponent(name)}`, {
            headers: { 'Content-Type': 'application/json' },
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        return json.data as IExternalServer;
    }

    async updateApiKey(name: string, newKey: string): Promise<void> {
        const res = await fetch(`${this.baseUrl}/servers/${encodeURIComponent(name)}/key`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newKey }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
    }
}
