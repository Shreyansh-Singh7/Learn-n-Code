import { IAdminNotification } from '../../utils/interfaces';
import { IUserReportRepository } from '../interfaces/IUserReportRepository';
import { IContentModerationService } from './contentModerationService';

export interface IUserReportService {
    reportArticle(userId: number, articleId: number, reason: string): Promise<void>;
    listAdminNotifications(): Promise<IAdminNotification[]>;
    markNotificationRead(notificationId: number): Promise<void>;
}

export class UserReportService implements IUserReportService {
    private static readonly REPORT_THRESHOLD = 2;
    constructor(
        private userReportRepository: IUserReportRepository,
        private contentModerationService: IContentModerationService
    ) { }

    async reportArticle(userId: number, articleId: number, reason: string): Promise<void> {
        await this.userReportRepository.reportArticle(userId, articleId, reason);
        const reportCount = await this.userReportRepository.countReportsForArticle(articleId);

        if (reportCount >= UserReportService.REPORT_THRESHOLD) {
            await this.contentModerationService.hideArticle(articleId);
        }

        await this.userReportRepository.addAdminNotification(articleId, reason);
    }

    listAdminNotifications(): Promise<IAdminNotification[]> {
        return this.userReportRepository.getAdminNotifications();
    }

    markNotificationRead(notificationId: number): Promise<void> {
        return this.userReportRepository.markNotificationRead(notificationId);
    }
}
