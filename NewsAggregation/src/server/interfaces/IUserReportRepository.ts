import { IAdminNotification } from "../../utils/interfaces";

export interface IUserReportRepository {
    reportArticle(userId: number, articleId: number, reason: string): Promise<void>;
    getAdminNotifications(): Promise<IAdminNotification[]>;
    markNotificationRead(notificationId: number): Promise<void>;
    countReportsForArticle(articleId: number): Promise<number>;
    addAdminNotification(articleId: number, reason: string): Promise<void>;
}
