import { INotificationRepository } from '../interfaces/INotificationRepository';
import { INotificationSetting } from '../../utils/interfaces';

export interface INotificationService {
    getUserSettings(userId: number): Promise<INotificationSetting[]>;
    configureSetting(
        userId: number,
        categoryId: number,
        enabled: boolean,
        keywords: string[]
    ): Promise<void>;
    removeSetting(userId: number, categoryId: number): Promise<void>;
    listNotifications(userId: number): Promise<Notification[]>;
    sendNotification(
        userId: number,
        articleId: number,
        deliveredVia: 'email' | 'app'
    ): Promise<void>;
    shouldNotifyUserForArticle(
        setting: INotificationSetting,
        articleCategories: number[],
        articleKeywords: string[]
    ): Promise<boolean>
}

export class NotificationService implements INotificationService {
    constructor(private notificationRepository: INotificationRepository) { }

    async getUserSettings(userId: number): Promise<INotificationSetting[]> {
        return this.notificationRepository.getUserSettings(userId);
    }

    async configureSetting(userId: number, categoryId: number, enabled: boolean, keywords: string[]): Promise<void> {
        await this.notificationRepository.addOrUpdateSetting(userId, categoryId, enabled, keywords);
    }

    async removeSetting(userId: number, categoryId: number): Promise<void> {
        await this.notificationRepository.removeSetting(userId, categoryId);
    }

    async listNotifications(userId: number): Promise<Notification[]> {
        return this.notificationRepository.getNotificationsForUser(userId);
    }

    async sendNotification(userId: number, articleId: number, deliveredVia: 'email' | 'app'): Promise<void> {
        const alreadySent = await this.notificationRepository.hasNotification(userId, articleId);
        if (!alreadySent) {
            await this.notificationRepository.saveNotification(userId, articleId, deliveredVia);
        }
    }

    async shouldNotifyUserForArticle(
        setting: INotificationSetting,
        articleCategories: number[],
        articleKeywords: string[]
    ): Promise<boolean> {
        if (!setting.enabled) return false;

        const categoryMatch = articleCategories.includes(setting.category_id);
        if (!categoryMatch) return false;

        if (!setting.keywords || setting.keywords.length === 0) return true;

        const normalizedArticleKeywords = articleKeywords.map(k => k.toLowerCase());
        const hasAnyKeywordMatch = setting.keywords.some(userKeyword =>
            normalizedArticleKeywords.includes(userKeyword.toLowerCase())
        );

        return hasAnyKeywordMatch;
    }
      
}
