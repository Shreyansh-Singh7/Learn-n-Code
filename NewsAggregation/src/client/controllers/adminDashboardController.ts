import { AdminService } from '../services/adminService';
import { AdminDashboardView } from '../views/adminDashboard';
import { AdminNotificationController } from './adminNotificationController';
import { ContentModerationController } from './contentModerationController';

export class AdminDashboardController {
    private service = new AdminService();
    private view = new AdminDashboardView();

    async start(): Promise<void> {
        let exit = false;

        while (!exit) {
            const choice = await this.view.promptOption();
            switch (choice) {
                case '1':
                    await this.handleListServers();
                    break;
                case '2':
                    await this.handleViewServer();
                    break;
                case '3':
                    await this.handleUpdateServer();
                    break;
                case '4':
                    await this.handleAddCategory();
                    break;
                case '5':
                    await this.handleModeration();
                    break;
                case '6':
                    await this.handleReviewReports();
                    break;
                case '0':
                    this.view.showMessage('Logged out.');
                    exit = true;
                    break;
                default:
                    this.view.showMessage('Invalid choice. Try again.');
            }
        }
    }

    private async handleListServers() {
        try {
            const servers = await this.service.listServers();
            this.view.showServers(servers);
        } catch (err: any) {
            this.view.showMessage(`Error listing servers: ${err.message}`);
        }
    }

    private async handleViewServer() {
        try {
            const name = await this.view.promptServerName();
            const s = await this.service.viewServer(name);
            this.view.showServerDetails(s);
        } catch (err: any) {
            this.view.showMessage(`Error viewing server: ${err.message}`);
        }
    }

    private async handleUpdateServer() {
        try {
            const name = await this.view.promptServerName();
            const newKey = await this.view.promptNewApiKey();
            await this.service.updateServerKey(name, newKey);
            this.view.showMessage('API key updated successfully.');
        } catch (err: any) {
            this.view.showMessage(`Error updating server: ${err.message}`);
        }
    }

    private async handleAddCategory() {
        try {
            const name = await this.view.promptCategoryName();
            const category = await this.service.addCategory(name);
            this.view.showCategoryAdded();
        } catch (err: any) {
            this.view.showMessage(`Error adding category: ${err.message}`);
        }
    }
    
    private async handleModeration() {
        const moderationController = new ContentModerationController();
        await moderationController.start();
    }

    private async handleReviewReports() {
        const controller = new AdminNotificationController();
        await controller.start();
    }
}
