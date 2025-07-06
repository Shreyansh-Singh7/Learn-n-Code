import { ContentModerationService } from "../services/contentModerationService";
import { AdminModerationView } from "../views/adminModerationView";

export class ContentModerationController {
    private view = new AdminModerationView();
    private service = new ContentModerationService();

    async start() {
        let back = false;

        while (!back) {
            const choice = await this.view.promptModerationMenu();

            switch (choice) {
                case '1':
                    await this.handleHideArticle();
                    break;
                case '2':
                    await this.handleHideCategory();
                    break;
                case '3':
                    await this.handleBlockedKeywords();
                    break;
                case '4':
                    back = true;
                    break;
                default:
                    this.view.showMessage('Invalid choice.');
            }
        }
    }

    private async handleHideArticle() {
        try {
            const articleId = await this.view.promptArticleId();
            await this.service.hideArticle(articleId);
            this.view.showMessage('Article hidden successfully.');
        } catch (err: any) {
            this.view.showMessage(`Error: ${err.message}`);
        }
    }

    private async handleHideCategory() {
        try {
            const categoryId = await this.view.promptCategoryId();
            await this.service.hideCategory(categoryId);
            this.view.showMessage('Category and related articles hidden.');
        } catch (err: any) {
            this.view.showMessage(`Error: ${err.message}`);
        }
    }

    private async handleBlockedKeywords() {
        let back = false;

        while (!back) {
            const choice = await this.view.promptKeywordMenu();

            switch (choice) {
                case '1':
                    const keyword = await this.view.promptKeyword();
                    await this.service.addBlockedKeyword(keyword);
                    this.view.showMessage('Keyword added and related articles hidden.');
                    break;
                case '2':
                    const delKeyword = await this.view.promptKeyword();
                    await this.service.removeBlockedKeyword(delKeyword);
                    this.view.showMessage('Keyword removed.');
                    break;
                case '3':
                    const keywords = await this.service.getBlockedKeywords();
                    this.view.showKeywords(keywords);
                    break;
                case '4':
                    back = true;
                    break;
                default:
                    this.view.showMessage('Invalid choice.');
            }
        }
    }
}
