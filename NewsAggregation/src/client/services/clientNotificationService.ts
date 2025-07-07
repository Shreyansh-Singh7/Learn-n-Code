import * as dotenv from 'dotenv';
import { INotification } from '../../utils/interfaces';

dotenv.config();

export class ClientNotificationService {
    private readonly baseUrl = process.env.BASE_API_URL;

    async getNotifications(userId: number): Promise<INotification[]> {
        const res = await fetch(`${this.baseUrl}/notifications/${userId}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        return json.data as INotification[];
    }

    async getUserSettings(userId: number): Promise<any> {
        const res = await fetch(`${this.baseUrl}/notificationsettings/${userId}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        if (!json.success) throw new Error(json.error);

    const data = json.data.map((setting: any) => ({ 
        ...setting,
        keywords: Array.isArray(setting.keywords)
            ? setting.keywords
            : setting.keywords
              ? JSON.parse(setting.keywords)
              : [],
    }));
        return data;
    }

    async configureSetting(userId: number, categoryId: number, enabled: boolean, keywords?: string[]): Promise<void> {
        const res = await fetch(`${this.baseUrl}/notificationsettings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, categoryId: 1, enabled })
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
    }

    async removeSetting(userId: number, categoryId: number): Promise<void> {
        const res = await fetch(`${this.baseUrl}/notificationsettings`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, categoryId })
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
    }
}
