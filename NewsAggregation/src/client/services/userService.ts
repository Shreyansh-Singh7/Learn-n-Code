import * as dotenv from 'dotenv';
import { ClientArticleService } from './clientArticleService';
import { ClientSavedArticleService } from './clientSavedArticleService';
import { ClientNotificationService } from './clientNotificationService';
import { IUser } from '../../utils/types';
import { IArticle, INotification } from '../../utils/interfaces';

dotenv.config();

export class UserService {
    private articleService = new ClientArticleService();
    private savedArticleService = new ClientSavedArticleService();
    private notificationService = new ClientNotificationService();

    async getTodayHeadlines() {
        return this.articleService.getTodayHeadlines();
    }

    async getHeadlinesByRange(start: string, end:string) {
        return this.articleService.getRangeHeadlines(start, end);
    }

    async getHeadlinesByRangeAndCategory(start: string, end: string, category: string) {
        return this.articleService.getCategoryHeadlines(start, category);
    }

    async saveArticle(articleId: number, userId: number): Promise<void> {
        await this.savedArticleService.saveArticleForUser(articleId, userId);
    }

    async getSavedArticles(user: IUser): Promise<IArticle[]> {
        return this.savedArticleService.getSavedArticles(user.userId);
    }

    async deleteSavedArticle(articleId: number, userId: number): Promise<void> {
        await this.savedArticleService.removeSavedArticle(articleId, userId);
    }

    async searchArticles(query: string, fromDate?: string, toDate?: string, sort?: string): Promise<IArticle[]> {
        return this.articleService.searchArticles(query, fromDate, toDate, sort);
    }

    async getNotifications(user: IUser): Promise<INotification[]> {
        return this.notificationService.getNotifications(user.userId);
    }

    async enableNotifications(user: IUser): Promise<void> {
        await this.notificationService.configureSetting(user.userId, 0, true);
    }

    async disableNotifications(user: IUser): Promise<void> {
        await this.notificationService.configureSetting(user.userId, 0, false);
    }

    async addNotificationKeyword(user: IUser, keyword: string): Promise<void> {
        await this.notificationService.configureSetting(user.userId, 0, true, [keyword]);
    }

    async removeNotificationKeyword(user: IUser, keyword: string): Promise<void> {
        await this.notificationService.removeSetting(user.userId, 0);
    }
}
