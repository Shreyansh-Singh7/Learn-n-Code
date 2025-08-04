import { AdminNotificationView } from '../views/adminNotificationView';
import { AdminNotificationService } from '../services/adminNotificationService';

export class AdminNotificationController {
    private view = new AdminNotificationView();
    private service = new AdminNotificationService();

    async start() {
        let back = false;

        while (!back) {
            const choice = await this.view.promptAdminNotificationMenu();

            switch (choice) {
                case '1':
                    await this.listNotifications();
                    break;
                case '2':
                    await this.markNotificationRead();
                    break;
                case '3':
                    back = true;
                    break;
                default:
                    this.view.showMessage('Invalid choice.');
            }
        }
    }

    private async listNotifications() {
        try {
            const notifications = await this.service.getAdminNotifications();
            this.view.showNotifications(notifications);
        } catch (err: any) {
            this.view.showMessage(`Error: ${err.message}`);
        }
    }

    private async markNotificationRead() {
        try {
            const id = await this.view.promptNotificationId();
            await this.service.markNotificationRead(id);
            this.view.showMessage('Notification marked as read.');
        } catch (err: any) {
            this.view.showMessage(`Error: ${err.message}`);
        }
    }
}
