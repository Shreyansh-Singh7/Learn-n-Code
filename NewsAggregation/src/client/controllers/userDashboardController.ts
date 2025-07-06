import { ask } from "../../utils/helpers";
import { IArticle } from "../../utils/interfaces";
import { IUser } from "../../utils/types";
import { UserService } from "../services/userService";
import { UserDashboardView } from "../views/userDashboardView";
import { UserReactionService } from '../services/userReactionService';
import { UserReportService } from '../services/userReportService';

export class UserDashboardController {
    private view = new UserDashboardView();
    private service = new UserService();
    private reactionService = new UserReactionService();
    private reportService = new UserReportService();

    async start(user: IUser): Promise<void> {
        let exit = false;

        while (!exit) {
            this.view.showWelcome(user);
            const choice = await this.view.promptMainMenu();

            switch (choice) {
                case '1':
                    await this.handleHeadlines(user);
                    break;
                case '2':
                    await this.handleSavedArticles(user);
                    break;
                case '3':
                    await this.handleSearch(user);
                    break;
                case '4':
                    await this.handleNotifications(user);
                    break;
                case '5':
                    this.view.showMessage("Logged out successfully.");
                    exit = true;
                    break;
                default:
                    this.view.showMessage("Invalid option. Try again.");
            }
        }
    }

    private async handleHeadlines(user: IUser) {
        let back = false;

        while (!back) {
            const mainChoice = await this.view.promptHeadlinesMainMenu();

            switch (mainChoice) {
                case '1':
                    await this.showArticles(await this.service.getTodayHeadlines(), user);
                    break;

                case '2':
                    await this.handleDateRangeHeadlines(user);
                    break;

                case '3':
                    back = true;
                    break;

                case '4':
                    this.view.showMessage("Logged out.");
                    process.exit(0);
                    break;

                default:
                    this.view.showMessage("Invalid choice. Try again.");
            }
        }
    }
    
    private async handleDateRangeHeadlines(user: IUser) {
        const { start, end } = await this.view.promptDateRange();

        let back = false;
        while (!back) {
            const categoryChoice = await this.view.promptCategoryMenu();

            switch (categoryChoice) {
                case '1':
                    await this.showArticles(await this.service.getHeadlinesByRange(start, end), user);
                    break;
                case '2':
                    await this.showArticles(await this.service.getHeadlinesByRangeAndCategory(start, end, 'business'), user);
                    break;
                case '3':
                    await this.showArticles(await this.service.getHeadlinesByRangeAndCategory(start, end, 'entertainment'), user);
                    break;
                case '4':
                    await this.showArticles(await this.service.getHeadlinesByRangeAndCategory(start, end, 'sports'), user);
                    break;
                case '5':
                    await this.showArticles(await this.service.getHeadlinesByRangeAndCategory(start, end, 'technology'), user);
                    break;
                case '6':
                    back = true;
                    break;
                case '7':
                    this.view.showMessage("Logged out.");
                    process.exit(0);
                    break;
                default:
                    this.view.showMessage("Invalid choice. Try again.");
            }
        }
    }    

    private async showArticles(articles: IArticle[],user:IUser) {
        this.view.showArticles(articles);

        if (!articles.length) return;

        let back = false;
        while (!back) {
            const choice = await this.view.promptArticleAction();

            switch (choice) {
                case '1':
                    back = true;
                    break;
                case '2':
                    this.view.showMessage("Logged out.");
                    process.exit(0);
                    break;
                case '3': {
                    const articleId = await this.view.promptArticleId();
                    await this.service.saveArticle(articleId, user.userId);
                    this.view.showMessage("Article saved.");
                    break;
                }
                case '4': {
                    const articleId = await this.view.promptArticleId();
                    const reason = await this.view.promptReportReason();
                    const success = await this.reportService.reportArticle(user.userId, articleId, reason);
                    this.view.showMessage(success ? "Article reported." : "Failed to report article.");
                    break;
                }
                case '5': {
                    const articleId = await this.view.promptArticleId();
                    const success = await this.reactionService.reactToArticle(user.userId, articleId, 'like');
                    this.view.showMessage(success ? "Reacted with like." : "Failed to react.");
                    break;
                }
                case '6': {
                    const articleId = await this.view.promptArticleId();
                    const success = await this.reactionService.reactToArticle(user.userId, articleId, 'dislike');
                    this.view.showMessage(success ? "Reacted with dislike." : "Failed to react.");
                    break;
                }
                default:
                    this.view.showMessage("Invalid choice.");
            }
        }

    }

    private async handleSavedArticles(user: IUser) {
        let back = false;

        while (!back) {
            const saved = await this.service.getSavedArticles(user);
            this.view.showSavedArticles(saved);

            const choice = await this.view.promptSavedMenu();

            switch (choice) {
                case '1':
                    back = true;
                    break;
                case '2':
                    this.view.showMessage("Logged out.");
                    process.exit(0);
                case '3':
                    const articleId = await ask('Article ID to delete: ');
                    await this.service.deleteSavedArticle(parseInt(articleId),user.userId);
                    this.view.showMessage("Deleted.");
                    break;
                default:
                    this.view.showMessage("Invalid choice.");
            }
        }
    }

    private async handleSearch(user: IUser) {
        const query = await ask('Enter search query: ');
        const fromDate = await ask('From date (YYYY-MM-DD) or blank: ');
        const toDate = await ask('To date (YYYY-MM-DD) or blank: ');
        const sortBy = await ask('Sort by (likes/dislikes/none): ');

        const articles = await this.service.searchArticles(query, fromDate, toDate, sortBy);
        await this.showArticles(articles,user);
    }

    private async handleNotifications(user: IUser) {
        let back = false;

        while (!back) {
            const choice = await this.view.promptNotificationsMenu();

            switch (choice) {
                case '1':
                    const notifications = await this.service.getNotifications(user);
                    this.view.showNotifications(notifications);
                    break;
                case '2':
                    await this.handleConfigureNotifications(user);
                    break;
                case '3':
                    back = true;
                    break;
                case '4':
                    this.view.showMessage("Logged out.");
                    process.exit(0);
                default:
                    this.view.showMessage("Invalid choice.");
            }
        }
    }

    private async handleConfigureNotifications(user: IUser) {
        let back = false;

        while (!back) {
            const choice = await this.view.promptNotificationConfigMenu();

            switch (choice) {
                case '1':
                    await this.service.enableNotifications(user);
                    this.view.showMessage("Notifications enabled.");
                    break;
                case '2':
                    await this.service.disableNotifications(user);
                    this.view.showMessage("Notifications disabled.");
                    break;
                case '3':
                    const keyword = await ask('Enter keyword to add: ');
                    await this.service.addNotificationKeyword(user, keyword);
                    this.view.showMessage("Keyword added.");
                    break;
                case '4':
                    const removeKeyword = await ask('Enter keyword to remove: ');
                    await this.service.removeNotificationKeyword(user, removeKeyword);
                    this.view.showMessage("Keyword removed.");
                    break;
                case '5':
                    back = true;
                    break;
                default:
                    this.view.showMessage("Invalid choice.");
            }
        }
    }
}
