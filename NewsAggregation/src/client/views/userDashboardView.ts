import { ask } from "../../utils/helpers";
import { IArticle, INotification } from "../../utils/interfaces";
import { IUser } from "../../utils/types";

export class UserDashboardView {
    showWelcome(user: IUser) {
        const now = new Date();
        console.log(`\nWelcome to the News Application, ${user.username}!`);
        console.log(`Date: ${now.toDateString()} Time:${now.toLocaleTimeString()}\n`);
    }

    async promptMainMenu(): Promise<string> {
        console.log('\nPlease choose an option:');
        console.log('1. Headlines');
        console.log('2. Saved Articles');
        console.log('3. Search');
        console.log('4. Notifications');
        console.log('5. Logout');
        return ask('Choice: ');
    }

    async promptHeadlinesMainMenu(): Promise<string> {
        console.log('\n=== Headlines Menu ===');
        console.log('1. Today');
        console.log('2. Date range');
        console.log('3. Back');
        console.log('4. Logout');
        return ask('Choice: ');
    }

    async promptDateRange(): Promise<{ start: string, end: string }> {
        const start = await ask('Enter start date (YYYY-MM-DD): ');
        const end = await ask('Enter end date (YYYY-MM-DD): ');
        return { start, end };
    }

    async promptCategoryMenu(): Promise<string> {
        console.log('\n=== Select Category ===');
        console.log('1. All');
        console.log('2. Business');
        console.log('3. Entertainment');
        console.log('4. Sports');
        console.log('5. Technology');
        console.log('6. Back');
        console.log('7. Logout');
        return ask('Choice: ');
    }    

    showArticles(articles: IArticle[]): void {
        console.log('\nH E A D L I N E S');
        if (!articles.length) {
            console.log('No articles found.');
            return;
        }

        articles.forEach(a => {
            console.log(`\nArticle Id: ${a.article_id}`);
            console.log(`${a.title}`);
            console.log(`${a.description}`);
            console.log(`Source: ${a.source}`);
            console.log(`URL: ${a.url}`);
        });
    }

    async promptArticleAction(): Promise<string> {
        console.log('\n1. Back');
        console.log('2. Logout');
        console.log('3. Save Article');
        console.log('4. Report');
        console.log('5. Like');
        console.log('6. Dislike');
        return ask('Choice: ');
    }

    async promptArticleId(): Promise<number> {
        const input = await ask('Enter Article ID: ');
        return parseInt(input, 10);
    }

    async promptReportReason(): Promise<string> {
        return ask('Enter reason for reporting: ');
    }

    showSavedArticles(articles: IArticle[]): void {
        console.log('\nS A V E D');
        if (!articles.length) {
            console.log('No saved articles.');
            return;
        }

        articles.forEach(a => {
            console.log(`\nArticle Id: ${a.article_id}`);
            console.log(`${a.title}`);
            console.log(`${a.description}`);
            console.log(`Source: ${a.source}`);
            console.log(`URL: ${a.url}`);
        });
    }

    async promptSavedMenu(): Promise<string> {
        console.log('\n1. Back');
        console.log('2. Logout');
        console.log('3. Delete Article');
        return ask('Choice: ');
    }

    async promptNotificationsMenu(): Promise<string> {
        console.log('\nN O T I F I C A T I O N S');
        console.log('1. View Notifications');
        console.log('2. Configure Notifications');
        console.log('3. Back');
        console.log('4. Logout');
        return ask('Choice: ');
    }

    showNotifications(notifications: INotification[]): void {
        console.log('\nNotifications:');
        if (!notifications.length) {
            console.log('No notifications.');
            return;
        }

        notifications.forEach(n => {
            console.log(`\n${n.article_id}`);
            console.log(`Date: ${new Date(n.sent_at).toLocaleString()}`);
        });
    }

    async promptNotificationConfigMenu(): Promise<string> {
        console.log('\nConfigure Notifications:');
        console.log('1. Enable Notifications');
        console.log('2. Disable Notifications');
        console.log('3. Add Keyword');
        console.log('4. Remove Keyword');
        console.log('5. Back');
        return ask('Choice: ');
    }

    showMessage(message: string) {
        console.log(`\n${message}`);
    }
}
