import { IExternalServer, ICategory } from '../../utils/interfaces';
import { ClientExternalNewsServerService } from './clientExternalNewsServerService';

export class AdminService {
    private externalNewsServerService = new ClientExternalNewsServerService();

    async listServers(): Promise<IExternalServer[]> {
        return this.externalNewsServerService.listServers();
    }

    async viewServer(name: string): Promise<IExternalServer> {
        return this.externalNewsServerService.viewServer(name);
    }

    async updateServerKey(name: string, newKey: string): Promise<void> {
        return this.externalNewsServerService.updateApiKey(name, newKey);
    }

    async addCategory(categoryName: string): Promise<number> {
        const res = await fetch(`${process.env.BASE_API_URL}/category`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category_name: categoryName }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        return json.data as number;
      }
}
