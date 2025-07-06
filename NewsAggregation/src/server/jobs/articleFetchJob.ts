import cron from 'node-cron';
import { ArticleFetchController } from '../controllers/articleFetchController';
import { ArticleRepository } from '../repositories/articleRepository';
import { UserRepository } from '../repositories/userRepository';
import { NotificationRepository } from '../repositories/notificationRepository';
import { NotificationService } from '../services/notificationService';
import { EmailService } from '../services/emailService';
import { IArticle } from '../../utils/interfaces';

let lastRunTime: Date;

export const initializeArticleFetchJob = async (): Promise<void> => {
    console.log(`[${new Date().toISOString()}] Initializing scheduled article fetch job`);

    lastRunTime = await getInitialLastRunTime();
    console.log(`[${new Date().toISOString()}] Last known fetch time: ${lastRunTime.toISOString()}`);

    // await runArticleFetchAndNotify();

    cron.schedule('0 */3 * * *', async () => {
        console.log(`[${new Date().toISOString()}] Running scheduled article fetch job`);
        await runArticleFetchAndNotify();
    });
};

async function getInitialLastRunTime(): Promise<Date> {
    const articleRepo = new ArticleRepository();
    const latest = await articleRepo.getLatestArticleCreatedAt();
    return latest || new Date(0);
}

async function runArticleFetchAndNotify(): Promise<void> {
    const articleFetchController = new ArticleFetchController();
    const articleRepo = new ArticleRepository();
    const userRepo = new UserRepository();
    const notificationRepo = new NotificationRepository();
    const notificationService = new NotificationService(notificationRepo);
    const emailService = new EmailService();

    try {
        await articleFetchController.fetchAndSaveFromAllSources();

        const newArticles: IArticle[] = await articleRepo.findArticlesSince(lastRunTime);
        console.log(`[${new Date().toISOString()}] Found ${newArticles.length} new articles since last run`);

        if (!newArticles.length) {
            lastRunTime = new Date();
            return;
        }

        const users = await userRepo.getAllUsers();

        for (const article of newArticles) {
            const articleCategories = await articleRepo.getArticleCategories(article.article_id);
            const articleKeywords = await articleRepo.getArticleKeywords(article.article_id);

            for (const user of users) {
                const settings = await notificationService.getUserSettings(user.getUserId());

                for (const setting of settings) {
                    const shouldNotify = await notificationService.shouldNotifyUserForArticle(
                        setting,
                        articleCategories,
                        articleKeywords
                    );

                    if (shouldNotify) {
                        await notificationService.sendNotification(user.getUserId(), article.article_id, 'email');

                        await emailService.sendArticleNotificationEmail(user.getEmail(), article);
                    }
                }
            }
        }

        lastRunTime = new Date();
        console.log(`[${new Date().toISOString()}] Notifications processing completed`);

    } catch (error) {
        console.error(`[${new Date().toISOString()}] Fetch job failed:`, error);
    }
}
