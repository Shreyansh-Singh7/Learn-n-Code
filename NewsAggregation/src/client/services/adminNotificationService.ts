import * as dotenv from 'dotenv';
import { IAdminNotification } from '../../utils/interfaces';

dotenv.config();

export class AdminNotificationService {
    private readonly baseUrl = process.env.BASE_API_URL;

    async getAdminNotifications(): Promise<IAdminNotification[]> {
        try {
            const res = await fetch(`${this.baseUrl}/admin/notifications`);
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            return json.data as IAdminNotification[];
        } catch {
            throw new Error('Failed to fetch admin notifications.');
        }
    }

    async markNotificationRead(notificationId: number): Promise<void> {
        try {
            await fetch(`${this.baseUrl}/admin/notifications/read`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId })
            });
        } catch {
            throw new Error('Failed to mark notification as read.');
        }
    }
}
