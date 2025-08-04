import { INotificationSetting } from "../../utils/interfaces";

export interface INotificationRepository {
    getUserSettings(userId: number): Promise<INotificationSetting[]>;
    addOrUpdateSetting(userId: number, categoryId: number, enabled: boolean, keywords: string[]): Promise<void>;
    removeSetting(userId: number, categoryId: number): Promise<void>;

    getNotificationsForUser(userId: number): Promise<Notification[]>;

    saveNotification(userId: number, articleId: number, deliveredVia: 'email' | 'app'): Promise<void>;

    hasNotification(userId: number, articleId: number): Promise<boolean>;
}
